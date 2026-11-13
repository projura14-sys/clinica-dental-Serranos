"use client";

import { CalendarCheck, Phone } from "lucide-react";
import { CLINIC, openChat, telHref, whatsappHref } from "@/lib/config";
import WhatsAppIcon from "./WhatsAppIcon";

export default function QuickActions() {
  return (
    <>
      {/* Escritorio: pila flotante a la izquierda */}
      <div className="fixed bottom-6 left-6 z-40 hidden flex-col gap-3 sm:flex">
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp"
          className="group flex h-12 items-center gap-0 overflow-hidden rounded-full bg-[#1FA855] pl-3.5 text-white shadow-soft transition-all duration-300 hover:pr-5"
        >
          <WhatsAppIcon size={21} />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-2.5 group-hover:max-w-[120px] group-hover:opacity-100">
            WhatsApp
          </span>
          <span className="w-3.5" />
        </a>
        <a
          href={telHref}
          aria-label={`Llamar al ${CLINIC.phoneDisplay}`}
          className="group flex h-12 items-center gap-0 overflow-hidden rounded-full bg-ink pl-3.5 text-white shadow-soft transition-all duration-300 hover:pr-5"
        >
          <Phone size={20} strokeWidth={1.75} />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-2.5 group-hover:max-w-[160px] group-hover:opacity-100">
            Llamar ahora
          </span>
          <span className="w-3.5" />
        </a>
      </div>

      {/* Móvil: barra inferior de conversión */}
      <nav
        aria-label="Acciones rápidas"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-line bg-paper/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden"
      >
        <a
          href={telHref}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-line bg-white text-sm font-medium"
        >
          <Phone size={17} strokeWidth={1.75} />
          Llamar
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1FA855] text-sm font-medium text-white"
        >
          <WhatsAppIcon size={17} />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => openChat(true)}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink text-sm font-medium text-white"
        >
          <CalendarCheck size={17} strokeWidth={1.75} />
          Cita
        </button>
      </nav>
    </>
  );
}
