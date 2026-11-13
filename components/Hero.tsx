"use client";

import { ArrowRight, HeartPulse, ScanLine, Star } from "lucide-react";
import { CLINIC, openChat, whatsappHref } from "@/lib/config";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-accent-soft blur-3xl"
      />
      <div className="container-x relative grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-24">
        <div>
          <p
            className="eyebrow animate-fadeUp"
            style={{ animationDelay: "40ms" }}
          >
            Clínica dental · {CLINIC.city}
          </p>

          <h1
            className="mt-5 animate-fadeUp font-serif text-[2.6rem] leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-[4.4rem]"
            style={{ animationDelay: "120ms" }}
          >
            Una sonrisa
            <br />
            extraordinaria,
            <br />
            <span className="italic text-accent">sin dolor.</span>
          </h1>

          <p
            className="mt-6 max-w-xl animate-fadeUp text-base leading-relaxed text-ink/65 sm:text-lg"
            style={{ animationDelay: "220ms" }}
          >
            Estética dental e implantes con escáner 3D, anestesia de última
            generación y sedación consciente. Un equipo que no tiene prisa y
            un plan claro, con presupuesto cerrado desde la primera visita.
          </p>

          <div
            className="mt-9 flex animate-fadeUp flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "320ms" }}
          >
            <button
              type="button"
              onClick={() => openChat(true)}
              className="btn-primary group"
            >
              Reservar valoración gratuita
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <span className="text-[#1FA855]">
                <WhatsAppIcon size={18} />
              </span>
              Hablar por WhatsApp
            </a>
          </div>

          <div
            className="mt-10 flex animate-fadeUp items-center gap-4"
            style={{ animationDelay: "420ms" }}
          >
            <div className="flex" aria-hidden="true">
              {["M", "J", "C", "A"].map((l, i) => (
                <span
                  key={l}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-paper bg-accent-soft text-xs font-medium text-accent-deep ${
                    i > 0 ? "-ml-2.5" : ""
                  }`}
                >
                  {l}
                </span>
              ))}
            </div>
            <div>
              <div
                className="flex items-center gap-0.5 text-amber-500"
                aria-label={`Valoración ${CLINIC.rating} de 5`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
                <span className="ml-2 text-sm font-medium text-ink">
                  {CLINIC.rating.toString().replace(".", ",")}
                </span>
              </div>
              <p className="text-xs text-ink/55">
                {CLINIC.reviewCount} opiniones de pacientes en Valencia
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-md animate-fadeUp lg:max-w-none"
          style={{ animationDelay: "260ms" }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] border border-line bg-gradient-to-br from-accent-soft via-white to-paper shadow-soft">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(14,90,87,0.14),transparent_62%)]"
            />
            <svg
              viewBox="0 0 32 32"
              className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 animate-float drop-shadow-[0_30px_40px_rgba(9,63,61,0.25)]"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 12c0-2.2 1.7-3.8 3.8-3.8 1 0 1.5.4 2.2.4s1.2-.4 2.2-.4c2.1 0 3.800 1.600 3.800 3.800 0 1.700-.7 2.800-1.100 4.300-.4 1.600-.5 4.600-1.400 6-.4.7-1.400.7-1.800 0-.5-.9-.6-2.500-1.700-2.500s-1.200 1.600-1.700 2.500c-.4.7-1.400.7-1.800 0-.9-1.400-1-4.400-1.400-6-.4-1.500-1.100-2.600-1.100-4.300Z"
                fill="#fff"
                stroke="#0E5A57"
                strokeOpacity="0.22"
                strokeWidth="0.35"
              />
            </svg>
          </div>

          <div className="absolute -left-3 top-12 flex animate-float items-center gap-3 rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-soft backdrop-blur sm:-left-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <HeartPulse size={20} strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-sm font-medium">Sedación consciente</p>
              <p className="text-xs text-ink/55">Tratamientos sin dolor</p>
            </div>
          </div>

          <div
            className="absolute -right-3 bottom-14 flex animate-float items-center gap-3 rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-soft backdrop-blur sm:-right-8"
            style={{ animationDelay: "1.6s" }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <ScanLine size={20} strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-sm font-medium">Escáner 3D incluido</p>
              <p className="text-xs text-ink/55">En su primera visita</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
