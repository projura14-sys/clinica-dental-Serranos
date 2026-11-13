import { CalendarClock, Coins, FileCheck2, ScanLine } from "lucide-react";
import Reveal from "./Reveal";

const ITEMS = [
  {
    icon: ScanLine,
    title: "Escáner 3D incluido",
    text: "Diagnóstico digital en su primera visita.",
  },
  {
    icon: FileCheck2,
    title: "Presupuesto cerrado",
    text: "Sin sorpresas ni letra pequeña.",
  },
  {
    icon: Coins,
    title: "Hasta 24 meses",
    text: "Financiación sin intereses.",
  },
  {
    icon: CalendarClock,
    title: "Urgencias el mismo día",
    text: "Atención prioritaria si tiene dolor.",
  },
];

export default function TrustBar() {
  return (
    <section aria-label="Garantías" className="border-y border-line bg-white">
      <Reveal>
        <div className="container-x grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon size={19} strokeWidth={1.6} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{title}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-ink/55">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
