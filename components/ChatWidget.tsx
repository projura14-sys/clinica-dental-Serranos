"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ArrowUpRight, MessageCircle, Send, ShieldCheck, X } from "lucide-react";
import { CLINIC, OPEN_CHAT_EVENT } from "@/lib/config";
import {
  GREETING,
  INITIAL_STATE,
  respond,
  type BotReply,
  type ChatState,
  type Draft,
} from "@/lib/chatbot";

interface Message extends BotReply {
  id: number;
  role: "bot" | "user";
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  const chatState = useRef<ChatState>(INITIAL_STATE);
  const started = useRef(false);
  const everOpened = useRef(false);
  const alive = useRef(true);
  const counter = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextId = () => {
    counter.current += 1;
    return counter.current;
  };

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const pushBot = useCallback(async (replies: BotReply[]) => {
    for (const reply of replies) {
      if (!alive.current) return;
      setTyping(true);
      await wait(450 + Math.min(reply.text.length * 8, 750));
      if (!alive.current) return;
      setMessages((prev) => [...prev, { ...reply, id: nextId(), role: "bot" }]);
      setTyping(false);
    }
  }, []);

  const submitAppointment = useCallback((draft: Draft) => {
    fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    }).catch(() => undefined);
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
      const result = respond(text, chatState.current, new Date());
      chatState.current = result.state;
      await pushBot(result.replies);
      if (result.completed) submitAppointment(result.completed);
    },
    [pushBot, submitAppointment]
  );

  const openChat = useCallback(
    (booking: boolean) => {
      setOpen(true);
      setTeaser(false);
      everOpened.current = true;
      if (!started.current) {
        started.current = true;
        void (async () => {
          await pushBot(GREETING);
          if (booking) await send("Quiero reservar una cita");
        })();
      } else if (booking && chatState.current.step === "idle") {
        void send("Quiero reservar una cita");
      }
    },
    [pushBot, send]
  );

  // Apertura desde cualquier botón de la web.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ booking?: boolean }>).detail;
      openChat(Boolean(detail?.booking));
    };
    window.addEventListener(OPEN_CHAT_EVENT, handler);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handler);
  }, [openChat]);

  // Burbuja de invitación tras unos segundos.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!everOpened.current) setTeaser(true);
    }, 7000);
    return () => clearTimeout(t);
  }, []);

  // Cerrar con Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Scroll automático.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open && !typing) inputRef.current?.focus({ preventScroll: true });
  }, [open, typing]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typing) return;
    const value = input;
    setInput("");
    void send(value);
  };

  const lastBotId = [...messages].reverse().find((m) => m.role === "bot")?.id;
  const lastMessage = messages[messages.length - 1];

  return (
    <>
      {!open && (
        <div className="fixed bottom-24 right-4 z-50 sm:bottom-6 sm:right-6">
          {teaser && (
            <div className="absolute bottom-full right-0 mb-4 w-64 animate-pop rounded-2xl border border-line bg-white p-4 pr-9 shadow-soft">
              <button
                type="button"
                onClick={() => setTeaser(false)}
                aria-label="Cerrar invitación"
                className="absolute right-2.5 top-2.5 text-ink/35 transition hover:text-ink"
              >
                <X size={15} />
              </button>
              <p className="text-sm font-medium">¿Reserva su valoración gratuita?</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/55">
                Respondo al instante y le consigo hueco esta semana.
              </p>
              <button
                type="button"
                onClick={() => openChat(true)}
                className="mt-3 text-xs font-medium text-accent hover:underline"
              >
                Reservar ahora →
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => openChat(false)}
            aria-label="Abrir asistente virtual"
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-float transition hover:scale-105 hover:bg-accent-deep active:scale-95"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-ping2 rounded-full bg-accent"
            />
            <MessageCircle size={26} strokeWidth={1.6} className="relative" />
            <span className="absolute right-1 top-1 h-3.5 w-3.5 rounded-full border-2 border-paper bg-emerald-400" />
          </button>
        </div>
      )}

      {open && (
        <section
          role="dialog"
          aria-label="Asistente virtual de Clínica Dental Serranos"
          className="fixed inset-x-3 bottom-3 z-50 flex h-[min(680px,calc(100dvh-1.5rem))] animate-pop flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-float sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
        >
          <header className="flex items-center gap-3 bg-accent-deep px-5 py-4 text-white">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 font-serif text-lg">
              S
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-accent-deep bg-emerald-400" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">Asistente Serranos</p>
              <p className="text-xs text-white/65">En línea · responde al instante</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </header>

          <div
            ref={scroller}
            className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-5"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div key={m.id} className="animate-pop">
                <div
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[86%] whitespace-pre-line rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-tr-md bg-ink text-white"
                        : "rounded-tl-md border border-line bg-white text-ink"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>

                {m.role === "bot" && m.links && m.links.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target={l.href.startsWith("tel:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white transition hover:bg-accent-deep"
                      >
                        {l.label}
                        <ArrowUpRight size={13} />
                      </a>
                    ))}
                  </div>
                )}

                {m.role === "bot" &&
                  m.id === lastBotId &&
                  lastMessage?.id === m.id &&
                  !typing &&
                  m.chips &&
                  m.chips.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {m.chips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => void send(chip)}
                          className="rounded-full border border-accent/30 bg-accent-soft px-3.5 py-2 text-[13px] font-medium text-accent-deep transition hover:border-accent hover:bg-accent hover:text-white active:scale-95"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-line bg-white px-4 py-3.5"
                  aria-label="El asistente está escribiendo"
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-dot rounded-full bg-ink/60"
                      style={{ animationDelay: `${i * 160}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="border-t border-line bg-white px-3 pb-2 pt-3"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escriba su mensaje…"
                aria-label="Escriba su mensaje"
                autoComplete="off"
                maxLength={300}
                className="h-11 flex-1 rounded-full border border-line bg-paper px-4 text-sm outline-none transition placeholder:text-ink/35 focus:border-accent"
              />
              <button
                type="submit"
                disabled={typing || input.trim().length === 0}
                aria-label="Enviar mensaje"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} />
              </button>
            </div>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-ink/40">
              <ShieldCheck size={12} />
              Asistente virtual de {CLINIC.shortName} · No sustituye una valoración clínica
            </p>
          </form>
        </section>
      )}
    </>
  );
}
