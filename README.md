# Clínica Dental Serranos · Prototipo web

Next.js 14 (App Router) · Tailwind CSS · Lucide React · TypeScript.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # ajuste teléfono y WhatsApp
npm run dev                  # http://localhost:3000
npm run build && npm run start
```

## Estructura

```
app/
  layout.tsx                  Fuentes (Inter + Fraunces), SEO y JSON-LD "Dentist"
  page.tsx                    Composición de la página
  globals.css                 Capas de Tailwind y utilidades
  api/appointments/route.ts   Endpoint que recibe las citas del chatbot
components/
  Header / Hero / TrustBar / Treatments / Method / Testimonials / Faq / Contact / Footer
  ChatWidget.tsx              Chatbot flotante (esquina inferior derecha)
  QuickActions.tsx            WhatsApp + llamada (pila en escritorio, barra en móvil)
  Reveal.tsx · WhatsAppIcon.tsx
lib/
  config.ts                   Datos de la clínica, horarios, enlaces
  data.ts                     Tratamientos, precios, testimonios, FAQ
  chatbot.ts                  Motor conversacional (precios, horarios, citas)
```

## Antes de publicar (datos de ejemplo)

Todo lo siguiente es **contenido ficticio** para el prototipo y debe sustituirse por datos reales:

- `lib/config.ts`: dirección, teléfono, email, horarios, valoración y número de reseñas.
- `lib/data.ts`: precios orientativos, condiciones de financiación y los **testimonios** (deben ser reseñas reales y verificadas, con permiso de los pacientes).
- `components/Testimonials.tsx`: retire el aviso de prototipo cuando haya reseñas reales.
- Añada fotografías reales del equipo y de la clínica, y las páginas legales (aviso legal, privacidad, cookies, RGPD para los datos del chat).

## Chatbot

`lib/chatbot.ts` es un motor determinista por reglas: no necesita API ni claves, es instantáneo y no inventa precios. Cubre precios, horarios, ubicación, miedo al dolor, implantes, urgencias y un flujo de reserva (tratamiento → día → hora → nombre → móvil → confirmación).

Al confirmar, el widget envía la cita a `POST /api/appointments`, que de momento la registra en consola. Para producción, conéctelo a la agenda de la clínica, a un CRM o a un email/WhatsApp Business API.

Para pasar a un LLM, sustituya la llamada a `respond()` en `ChatWidget.tsx` por una ruta `app/api/chat` y conserve el flujo de reserva como herramienta. Los huecos horarios son simulados; en producción deben venir de la agenda real.

## Despliegue

Vercel: importe el repositorio y defina las variables de `.env.example`.
