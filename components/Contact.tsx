"use client";

import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { CLINIC, HOURS, openChat, telHref, whatsappHref } from "@/lib/config";
import Reveal from "./Reveal";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Contact() {
  return (
    <section id="contacto" className="scroll-mt-20 py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <div className="overflow-hidden rounded-[2.25rem] bg-ink text-white">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-8 sm:p-14">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
                  Su primera visita
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                  Empiece hoy con una valoración <span className="italic text-[#8FD0CB]">gratuita.</span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
                  Escáner 3D, plan de tratamiento y presupuesto cerrado. Reserve en menos de un minuto con nuestro asistente.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openChat(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-ink transition hover:bg-accent-soft active:scale-[0.98]"
                  >
                    <MessageCircle size={17} />
                    Reservar con el asistente
                  </button>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.98]"
                  >
                    <WhatsAppIcon size={17} />
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/[0.04] p-8 sm:p-14 lg:border-l lg:border-t-0">
                <ul className="space-y-7">
                  <li className="flex gap-4">
                    <MapPin size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#8FD0CB]" />
                    <div>
                      <p className="text-sm font-medium">{CLINIC.street}</p>
                      <p className="text-sm text-white/60">
                        {CLINIC.postalCode} {CLINIC.city}
                      </p>
                      <a
                        href={CLINIC.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-block text-sm text-[#8FD0CB] underline-offset-4 hover:underline"
                      >
                        Cómo llegar
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Phone size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#8FD0CB]" />
                    <div>
                      <a href={telHref} className="text-sm font-medium hover:underline">
                        {CLINIC.phoneDisplay}
                      </a>
                      <p className="text-sm text-white/60">{CLINIC.email}</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Clock size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#8FD0CB]" />
                    <dl className="space-y-1.5 text-sm">
                      {HOURS.map((h) => (
                        <div key={h.days} className="flex gap-6">
                          <dt className="w-32 text-white/60">{h.days}</dt>
                          <dd className="font-medium">{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
