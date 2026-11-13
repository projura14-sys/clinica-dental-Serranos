import { Star } from "lucide-react";
import { CLINIC } from "@/lib/config";
import { TESTIMONIALS } from "@/lib/data";
import Reveal from "./Reveal";

const initials = (name: string): string =>
  name
    .split(" ")
    .map((p) => p.charAt(0))
    .join("")
    .replace(".", "")
    .slice(0, 2)
    .toUpperCase();

export default function Testimonials() {
  return (
    <section id="pacientes" className="scroll-mt-20 py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Pacientes de Valencia</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Sonrisas que <span className="italic text-accent">hablan por nosotros.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-line bg-white px-6 py-4 shadow-soft">
            <span className="font-serif text-4xl">
              {CLINIC.rating.toString().replace(".", ",")}
            </span>
            <div>
              <div className="flex gap-0.5 text-amber-500" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-1 text-xs text-ink/55">
                {CLINIC.reviewCount} opiniones verificadas
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 90}>
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-white p-7 transition hover:shadow-soft">
                <div
                  className="flex gap-0.5 text-amber-500"
                  role="img"
                  aria-label={`${t.rating} estrellas de 5`}
                >
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 font-serif text-[1.15rem] leading-relaxed text-ink/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3.5 border-t border-line pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-sm font-medium text-accent-deep">
                    {initials(t.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{t.name}</span>
                    <span className="block text-xs text-ink/55">
                      {t.neighbourhood}, Valencia · {t.treatment}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-ink/40">
          Testimonios de ejemplo del prototipo. Sustituir por reseñas reales y verificadas antes de publicar.
        </p>
      </div>
    </section>
  );
}
