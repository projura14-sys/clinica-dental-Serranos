import { Check } from "lucide-react";
import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Diagnóstico digital 3D",
    text: "Escáner y radiografía en una sola visita. Vemos su caso con precisión milimétrica y se lo mostramos en pantalla.",
  },
  {
    n: "02",
    title: "Plan claro y presupuesto cerrado",
    text: "Le explicamos opciones, plazos y costes con calma. Sin presión y sin tratamientos innecesarios.",
  },
  {
    n: "03",
    title: "Intervención sin dolor",
    text: "Cirugía guiada, anestesia de última generación y sedación consciente si lo desea. Usted marca el ritmo.",
  },
  {
    n: "04",
    title: "Seguimiento personal",
    text: "Revisiones programadas y un canal directo con su equipo por WhatsApp para cualquier duda.",
  },
];

const PROMISES = [
  "Anestesia y sedación adaptadas a cada paciente",
  "Cirugía mínimamente invasiva guiada en 3D",
  "Materiales de primeras marcas con garantía",
  "Esterilización y protocolos hospitalarios",
];

export default function Method() {
  return (
    <section id="metodo" className="scroll-mt-20 bg-accent-deep py-24 text-white sm:py-32">
      <div className="container-x grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
            El método Serranos
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Cómo conseguimos que <span className="italic text-[#8FD0CB]">no duela.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
            El miedo al dentista es lo más habitual en nuestra consulta, y
            hemos diseñado cada paso para eliminarlo.
          </p>

          <ul className="mt-9 space-y-3.5">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-white/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Check size={12} strokeWidth={2.5} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <li className="flex gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
                <span className="font-serif text-3xl text-[#8FD0CB]">{s.n}</span>
                <div>
                  <h3 className="text-lg font-medium">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">{s.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
