"use client";

import { Phone } from "lucide-react";
import { CLINIC, openChat, telHref } from "@/lib/config";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="9" className={light ? "fill-white" : "fill-accent"} />
        <path
          d="M10 12.5c0-2 1.6-3.5 3.6-3.5 1 0 1.7.3 2.4.3s1.4-.3 2.4-.3c2 0 3.6 1.5 3.6 3.5 0 1.6-.6 2.7-1 4.2-.4 1.6-.5 4.8-1.4 6.3-.5.8-1.5.8-1.9 0-.5-1-.6-2.6-1.7-2.6s-1.2 1.600-1.700 2.600c-.4.8-1.400.8-1.900 0-.9-1.500-1-4.700-1.400-6.300-.4-1.500-1-2.600-1-4.200Z"
          className={light ? "fill-accent" : "fill-white"}
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-lg tracking-tight ${light ? "text-white" : "text-ink"}`}>
          {CLINIC.shortName}
        </span>
        <span
          className={`mt-1 text-[9px] font-medium uppercase tracking-[0.22em] ${
            light ? "text-white/60" : "text-ink/45"
          }`}
        >
          Clínica dental
        </span>
      </span>
    </span>
  );
}

const NAV = [
  { href: "#tratamientos", label: "Tratamientos" },
  { href: "#metodo", label: "Sin dolor" },
  { href: "#pacientes", label: "Pacientes" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#" aria-label={`${CLINIC.name}, inicio`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-ink/65 transition hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telHref}
            className="hidden items-center gap-2 px-3 text-sm font-medium text-ink/80 transition hover:text-ink md:flex"
          >
            <Phone size={15} strokeWidth={1.75} />
            {CLINIC.phoneDisplay}
          </a>
          <button
            type="button"
            onClick={() => openChat(true)}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-deep active:scale-[0.98]"
          >
            Reservar cita
          </button>
        </div>
      </div>
    </header>
  );
}
