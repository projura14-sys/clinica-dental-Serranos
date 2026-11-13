import { CLINIC } from "@/lib/config";
import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer className="bg-accent-deep text-white">
      <div className="container-x flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
        <Logo light />
        <p className="max-w-md text-xs leading-relaxed text-white/55">
          {CLINIC.name} · {CLINIC.street}, {CLINIC.postalCode} {CLINIC.city}.
          Los precios son orientativos y se confirman tras la valoración.
        </p>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {CLINIC.name}. Todos los derechos reservados.</span>
          <span>Aviso legal · Privacidad · Cookies</span>
        </div>
      </div>
    </footer>
  );
}
