"use client";

import {
  ArrowUpRight,
  Droplets,
  Gem,
  Layers,
  ScanLine,
  Smile,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { TREATMENTS, type IconName } from "@/lib/data";
import { openChat } from "@/lib/config";
import Reveal from "./Reveal";

const ICONS: Record<IconName, LucideIcon> = {
  implant: Gem,
  ortho: Layers,
  whitening: Sparkles,
  veneers: Smile,
  hygiene: Droplets,
  checkup: ScanLine,
};

export default function Treatments() {
  return (
    <section id="tratamientos" className="scroll-mt-20 py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Tratamientos</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Odontología de precisión, <span className="italic text-accent">pensada para usted.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/65 sm:text-lg">
            Cada tratamiento comienza con un diagnóstico digital y un plan
            claro. Usted decide, nosotros le acompañamos.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TREATMENTS.map((t, i) => {
            const Icon = ICONS[t.icon];
            return (
              <Reveal key={t.id} delay={(i % 3) * 90}>
                <article className="group flex h-full flex-col rounded-3xl border border-line bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 font-serif text-2xl tracking-tight">{t.name}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/60">
                    {t.description}
                  </p>
                  <div className="mt-7 flex items-end justify-between border-t border-line pt-5">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-ink/45">
                        {t.priceFrom === 0 ? "Primera visita" : "Desde"}
                      </p>
                      <p className="font-serif text-2xl">
                        {t.priceFrom === 0
                          ? "Gratuita"
                          : `${t.priceFrom.toLocaleString("es-ES")} €`}
                        {t.priceUnit ? (
                          <span className="ml-1 font-sans text-xs text-ink/45">
                            / {t.priceUnit}
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openChat(true)}
                      aria-label={`Reservar cita para ${t.name}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition hover:border-ink hover:bg-ink hover:text-white"
                    >
                      <ArrowUpRight size={17} />
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
