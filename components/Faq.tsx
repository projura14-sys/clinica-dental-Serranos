import { Plus } from "lucide-react";
import { FAQS } from "@/lib/data";
import Reveal from "./Reveal";

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-white py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Lo que todos nos <span className="italic text-accent">preguntan.</span>
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink/65">
            ¿Tiene otra duda? Nuestro asistente responde al instante, y el equipo le atiende por teléfono o WhatsApp.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="divide-y divide-line border-y border-line">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left [&::-webkit-details-marker]:hidden">
                  <span className="font-serif text-xl tracking-tight">{f.q}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition group-open:rotate-45 group-open:border-accent group-open:text-accent">
                    <Plus size={16} />
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
