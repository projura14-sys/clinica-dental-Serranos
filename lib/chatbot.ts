import { CLINIC, HOURS_TEXT, telHref, whatsappHref } from "./config";
import { TREATMENTS } from "./data";

export type Step =
  | "idle"
  | "service"
  | "day"
  | "time"
  | "name"
  | "phone"
  | "confirm";

export interface Draft {
  service?: string;
  dayISO?: string;
  dayLabel?: string;
  time?: string;
  name?: string;
  phone?: string;
}

export interface ChatState {
  step: Step;
  draft: Draft;
}

export interface BotLink {
  label: string;
  href: string;
}

export interface BotReply {
  text: string;
  chips?: string[];
  links?: BotLink[];
}

export interface RespondResult {
  replies: BotReply[];
  state: ChatState;
  completed?: Draft;
}

export const INITIAL_STATE: ChatState = { step: "idle", draft: {} };

export const GREETING: BotReply[] = [
  {
    text: `Hola, soy el asistente virtual de ${CLINIC.name}. Estoy aquí para resolver sus dudas y reservarle cita en menos de un minuto.`,
  },
  {
    text: "¿En qué puedo ayudarle?",
    chips: [
      "Reservar una cita",
      "Precios y financiación",
      "Implantes sin dolor",
      "Horarios y ubicación",
    ],
  },
];

const MAIN_CHIPS = [
  "Reservar una cita",
  "Precios y financiación",
  "Implantes sin dolor",
  "Horarios y ubicación",
];

const norm = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const euro = (n: number): string =>
  n === 0
    ? "incluida"
    : `${new Intl.NumberFormat("es-ES", { useGrouping: "always" }).format(n)} €`;

const capitalize = (s: string): string =>
  s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;

/* ------------------------------ Disponibilidad ---------------------------- */

export interface DayOption {
  iso: string;
  label: string;
  dow: number;
}

const toISO = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const dayFormatter = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "short",
});

export const availableDays = (now: Date, count = 5): DayOption[] => {
  const out: DayOption[] = [];
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStillOpen = now.getHours() < 17;
  let first = true;
  while (out.length < count) {
    const dow = cursor.getDay();
    const isToday = first;
    first = false;
    if (dow !== 0 && (!isToday || todayStillOpen)) {
      out.push({
        iso: toISO(cursor),
        dow,
        label: capitalize(
          dayFormatter.format(cursor).replace(",", "").replace(".", "")
        ),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
};

const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

export const slotsFor = (iso: string, dow: number): string[] => {
  const base =
    dow === 6
      ? ["10:00", "11:00", "12:00", "13:00"]
      : ["09:30", "11:00", "12:30", "16:00", "17:30", "19:00"];
  const h = hash(iso);
  const filtered = base.filter((_, i) => (h + i) % 4 !== 0);
  return filtered.length >= 3 ? filtered : base.slice(0, 3);
};

/* -------------------------------- Parsers --------------------------------- */

const SERVICE_NAMES = TREATMENTS.map((t) => t.name);

const parseService = (n: string): string | undefined => {
  for (const t of TREATMENTS) {
    if (t.pattern.test(n)) return t.name;
  }
  if (/otro|general|no se|no estoy seguro|dolor|revision/.test(n)) {
    return "Primera visita y diagnóstico";
  }
  return undefined;
};

const parseDay = (n: string, days: DayOption[]): DayOption | undefined => {
  const exact = days.find((d) => norm(d.label) === n);
  if (exact) return exact;
  const weekdays = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];
  for (const d of days) {
    if (n.includes(weekdays[d.dow])) return d;
  }
  if (/\bhoy\b/.test(n)) {
    const today = toISO(new Date());
    return days.find((d) => d.iso === today);
  }
  if (/manana/.test(n)) {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return days.find((d) => d.iso === toISO(t));
  }
  const num = n.match(/\b(\d{1,2})\b/);
  if (num) {
    const dayNum = Number(num[1]);
    return days.find((d) => Number(d.iso.slice(8, 10)) === dayNum);
  }
  return undefined;
};

const parseTime = (n: string, slots: string[]): string | undefined => {
  const direct = slots.find((s) => n.includes(s) || n.includes(s.replace(":", "h")));
  if (direct) return direct;
  const m = n.match(/\b(\d{1,2})(?:[:h.](\d{2}))?\b/);
  if (!m) return undefined;
  const hh = m[1].padStart(2, "0");
  const mm = m[2] ?? "00";
  const wanted = `${hh}:${mm}`;
  const exact = slots.find((s) => s === wanted);
  if (exact) return exact;
  return slots.find((s) => s.startsWith(`${hh}:`));
};

const parsePhone = (raw: string): string | undefined => {
  const digits = raw.replace(/[\s.\-()]/g, "");
  const m = digits.match(/^(?:\+34|0034)?([6-9]\d{8})$/);
  return m ? m[1] : undefined;
};

const formatPhone = (p: string): string =>
  `${p.slice(0, 3)} ${p.slice(3, 6)} ${p.slice(6)}`;

const parseName = (raw: string): string | undefined => {
  const cleaned = raw
    .replace(/^(me llamo|soy|mi nombre es)\s+/i, "")
    .replace(/[^\p{L}\s'’-]/gu, "")
    .trim();
  if (cleaned.length < 2 || cleaned.length > 60) return undefined;
  return cleaned
    .split(" ")
    .map(capitalize)
    .join(" ");
};

/* ------------------------------- Respuestas -------------------------------- */

const priceOverview = (): BotReply => ({
  text:
    "Estos son nuestros precios orientativos (el presupuesto definitivo se cierra tras su valoración, sin compromiso):\n\n" +
    TREATMENTS.filter((t) => t.priceFrom > 0)
      .map(
        (t) =>
          `• ${t.name}: desde ${euro(t.priceFrom)}${
            t.priceUnit ? ` (${t.priceUnit})` : ""
          }`
      )
      .join("\n") +
    "\n\nLa primera visita con escáner 3D y plan de tratamiento es gratuita. Además, financiamos hasta 24 meses sin intereses.",
  chips: ["Reservar valoración gratuita", "Implantes sin dolor", "Horarios y ubicación"],
});

const priceFor = (name: string): BotReply | undefined => {
  const t = TREATMENTS.find((x) => x.name === name);
  if (!t) return undefined;
  const price =
    t.priceFrom === 0
      ? "La primera visita, con escáner 3D y plan de tratamiento, es gratuita."
      : `${t.name}: desde ${euro(t.priceFrom)}${
          t.priceUnit ? ` por ${t.priceUnit}` : ""
        }. El importe final depende de cada caso y se cierra tras la valoración, sin compromiso. Financiamos hasta 24 meses sin intereses.`;
  return {
    text: price,
    chips: ["Reservar valoración gratuita", "Ver otros precios"],
  };
};

const infoReply = (key: string): BotReply | undefined => {
  switch (key) {
    case "hours":
      return {
        text: `Nuestro horario es: ${HOURS_TEXT}`,
        chips: ["Reservar una cita", "¿Dónde están?"],
      };
    case "location":
      return {
        text: `Estamos en ${CLINIC.street}, ${CLINIC.postalCode} ${CLINIC.city}, en pleno centro y muy cerca de las Torres de Serranos, con transporte público y parkings a pocos minutos.`,
        links: [{ label: "Abrir en Google Maps", href: CLINIC.mapsUrl }],
        chips: ["Reservar una cita", "Horarios"],
      };
    case "pain":
      return {
        text: "Entendemos ese miedo y es muy habitual. Por eso trabajamos con anestesia de última generación, técnicas mínimamente invasivas y sedación consciente para quien la desea. Usted marca el ritmo y puede parar cuando quiera. La inmensa mayoría de pacientes nos dice que no sintió nada.",
        chips: ["Reservar valoración gratuita", "Precios y financiación"],
      };
    case "implants": {
      const t = TREATMENTS.find((x) => x.id === "implantes");
      return {
        text: `${t?.detail ?? ""}\n\nPrecio orientativo: desde ${euro(
          t?.priceFrom ?? 0
        )} (implante con corona). Financiación hasta 24 meses sin intereses.`,
        chips: ["Reservar valoración gratuita", "Precios y financiación", "¿Duele?"],
      };
    }
    case "urgency":
      return {
        text: "Si tiene dolor intenso, hinchazón, sangrado o un golpe, le atendemos con prioridad. Lo más rápido es llamarnos ahora mismo.",
        links: [
          { label: `Llamar al ${CLINIC.phoneDisplay}`, href: telHref },
          { label: "Escribir por WhatsApp", href: whatsappHref("Hola, tengo una urgencia dental.") },
        ],
      };
    case "human":
      return {
        text: "Por supuesto, nuestro equipo le atiende encantado en horario de apertura.",
        links: [
          { label: `Llamar al ${CLINIC.phoneDisplay}`, href: telHref },
          { label: "Abrir WhatsApp", href: whatsappHref() },
        ],
      };
    default:
      return undefined;
  }
};

const detectInfoIntent = (n: string): string | undefined => {
  if (/urgenc|mucho dolor|dolor fuerte|se me ha roto|roto|golpe|sangr|hinchad|infeccion/.test(n))
    return "urgency";
  if (/horario|abiert|abren|cierr|atienden|trabajan|a que hora/.test(n)) return "hours";
  if (/donde|direccion|ubicacion|llegar|parking|aparcar|metro|como ir|mapa/.test(n))
    return "location";
  if (/duele|dolor|miedo|ansiedad|sedacion|anestesia|nervios|fobia/.test(n)) return "pain";
  if (/persona|humano|llamar|telefono|whatsapp|hablar con|recepcion/.test(n)) return "human";
  return undefined;
};

const isPriceIntent = (n: string): boolean =>
  /precio|cuesta|coste|cuanto|tarifa|presupuesto|financia|pagar|plazos|importe/.test(n);

const isBookingIntent = (n: string): boolean =>
  /\bcita\b|reserv|agendar|apunt|quiero ir|pedir hora|pedir cita|valoracion gratuita|consulta/.test(n);

const isCancel = (n: string): boolean =>
  /^(cancelar|cancela|salir|no gracias|olvidalo|dejalo)$/.test(n) ||
  /cancelar (la )?(reserva|cita)/.test(n);

/* ------------------------------ Flujo de cita ------------------------------ */

const askService = (): BotReply => ({
  text: "Con mucho gusto. ¿Para qué tratamiento desea reservar?",
  chips: [...SERVICE_NAMES],
});

const askDay = (now: Date): BotReply => ({
  text: "Perfecto. ¿Qué día le viene mejor?",
  chips: availableDays(now).map((d) => d.label),
});

const askTime = (day: DayOption): BotReply => ({
  text: `Estos son los huecos libres el ${day.label.toLowerCase()}:`,
  chips: slotsFor(day.iso, day.dow),
});

const askName = (): BotReply => ({
  text: "Excelente. ¿Me indica su nombre y apellido?",
});

const askPhone = (name: string): BotReply => ({
  text: `Gracias, ${name.split(" ")[0]}. ¿A qué número de móvil le confirmamos la cita?`,
});

const summary = (d: Draft): BotReply => ({
  text:
    "Revise los datos de su cita:\n\n" +
    `• Tratamiento: ${d.service}\n` +
    `• Día: ${d.dayLabel}\n` +
    `• Hora: ${d.time}\n` +
    `• Paciente: ${d.name}\n` +
    `• Teléfono: ${d.phone ? formatPhone(d.phone) : ""}\n\n` +
    "¿Confirmo la reserva?",
  chips: ["Confirmar cita", "Cambiar horario", "Cancelar"],
});

const reprompt = (state: ChatState, now: Date): BotReply | undefined => {
  switch (state.step) {
    case "service":
      return askService();
    case "day":
      return askDay(now);
    case "time": {
      const days = availableDays(now);
      const day = days.find((d) => d.iso === state.draft.dayISO);
      return day ? askTime(day) : askDay(now);
    }
    case "name":
      return askName();
    case "phone":
      return { text: "Para continuar con la reserva, ¿a qué móvil le confirmamos la cita?" };
    case "confirm":
      return summary(state.draft);
    default:
      return undefined;
  }
};

const handleBooking = (
  input: string,
  n: string,
  state: ChatState,
  now: Date
): RespondResult => {
  const { step, draft } = state;

  if (isCancel(n)) {
    return {
      replies: [
        {
          text: "Sin problema, no he guardado ninguna reserva. Cuando quiera retomarla, estaré aquí.",
          chips: MAIN_CHIPS,
        },
      ],
      state: INITIAL_STATE,
    };
  }

  switch (step) {
    case "service": {
      const service = parseService(n);
      if (service) {
        const next: ChatState = { step: "day", draft: { ...draft, service } };
        return { replies: [askDay(now)], state: next };
      }
      break;
    }
    case "day": {
      const days = availableDays(now);
      const day = parseDay(n, days);
      if (day) {
        const next: ChatState = {
          step: "time",
          draft: { ...draft, dayISO: day.iso, dayLabel: day.label },
        };
        return { replies: [askTime(day)], state: next };
      }
      break;
    }
    case "time": {
      const days = availableDays(now);
      const day = days.find((d) => d.iso === draft.dayISO);
      if (!day) return { replies: [askDay(now)], state: { step: "day", draft } };
      const time = parseTime(n, slotsFor(day.iso, day.dow));
      if (time) {
        return {
          replies: [askName()],
          state: { step: "name", draft: { ...draft, time } },
        };
      }
      break;
    }
    case "name": {
      const name = parseName(input);
      if (name) {
        return {
          replies: [askPhone(name)],
          state: { step: "phone", draft: { ...draft, name } },
        };
      }
      break;
    }
    case "phone": {
      const phone = parsePhone(input);
      if (phone) {
        const nextDraft = { ...draft, phone };
        return {
          replies: [summary(nextDraft)],
          state: { step: "confirm", draft: nextDraft },
        };
      }
      return {
        replies: [
          {
            text: "Ese número no parece válido. Necesito un móvil español de 9 cifras, por ejemplo 612 345 678.",
          },
        ],
        state,
      };
    }
    case "confirm": {
      if (/confirm|^si$|^vale$|^ok$|adelante|correcto|perfecto|de acuerdo/.test(n)) {
        const firstName = draft.name?.split(" ")[0] ?? "";
        return {
          replies: [
            {
              text: `Su cita queda reservada, ${firstName}. ✅\n\n${draft.service}\n${draft.dayLabel} a las ${draft.time}\n${CLINIC.street}, ${CLINIC.city}`,
            },
            {
              text: `Recibirá un mensaje de confirmación al ${
                draft.phone ? formatPhone(draft.phone) : "móvil indicado"
              } y un recordatorio 24 horas antes. Si necesita cambiar algo, escríbanos por WhatsApp.`,
              links: [
                { label: "Añadir indicaciones por WhatsApp", href: whatsappHref(`Hola, soy ${draft.name}. Mi cita es el ${draft.dayLabel} a las ${draft.time}.`) },
                { label: "Cómo llegar", href: CLINIC.mapsUrl },
              ],
              chips: ["Precios y financiación", "Gracias"],
            },
          ],
          state: INITIAL_STATE,
          completed: draft,
        };
      }
      if (/cambiar|otro|horario|dia|hora|modificar|no/.test(n)) {
        return {
          replies: [askDay(now)],
          state: {
            step: "day",
            draft: { ...draft, dayISO: undefined, dayLabel: undefined, time: undefined },
          },
        };
      }
      break;
    }
    default:
      break;
  }

  // Preguntas a mitad de la reserva: se responden y se retoma el paso.
  const info = detectInfoIntent(n);
  const pending = reprompt(state, now);
  if (info && info !== "urgency") {
    const reply = infoReply(info);
    if (reply && pending) {
      return {
        replies: [{ text: reply.text, links: reply.links }, pending],
        state,
      };
    }
  }
  if (info === "urgency") {
    const reply = infoReply("urgency");
    if (reply) return { replies: [reply], state };
  }
  if (isPriceIntent(n)) {
    const svc = parseService(n) ?? draft.service;
    const reply = (svc && priceFor(svc)) || priceOverview();
    return {
      replies: [{ text: reply.text }, ...(pending ? [pending] : [])],
      state,
    };
  }

  const retry: BotReply = pending
    ? {
        ...pending,
        text: pending.chips
          ? "Disculpe, no lo he entendido bien. Elija una de las opciones o escríbalo de otra forma."
          : "Disculpe, no lo he entendido bien. ¿Podría escribirlo de otra forma?",
      }
    : { text: "¿Podría repetirlo, por favor?" };
  return { replies: [retry], state };
};

/* ---------------------------------- Motor ---------------------------------- */

export const respond = (
  input: string,
  state: ChatState,
  now: Date = new Date()
): RespondResult => {
  const n = norm(input);

  if (state.step !== "idle") {
    return handleBooking(input, n, state, now);
  }

  const startBooking = (): RespondResult => ({
    replies: [askService()],
    state: { step: "service", draft: {} },
  });

  if (n === "ver otros precios") return { replies: [priceOverview()], state };

  const info = detectInfoIntent(n);
  if (info === "urgency" || info === "human") {
    const reply = infoReply(info);
    if (reply) return { replies: [reply], state };
  }

  if (isBookingIntent(n)) {
    const service = parseService(n);
    if (service && !/^consulta$/.test(n)) {
      const draft: Draft = { service };
      return { replies: [askDay(now)], state: { step: "day", draft } };
    }
    return startBooking();
  }

  if (isPriceIntent(n)) {
    const svc = parseService(n);
    const reply = (svc && priceFor(svc)) || priceOverview();
    return { replies: [reply], state };
  }

  if (/implant/.test(n)) {
    const reply = infoReply("implants");
    if (reply) return { replies: [reply], state };
  }

  if (info) {
    const reply = infoReply(info);
    if (reply) return { replies: [reply], state };
  }

  for (const t of TREATMENTS) {
    if (t.pattern.test(n)) {
      return {
        replies: [
          {
            text: `${t.detail}${
              t.priceFrom > 0
                ? `\n\nPrecio orientativo: desde ${euro(t.priceFrom)}${
                    t.priceUnit ? ` por ${t.priceUnit}` : ""
                  }.`
                : ""
            }`,
            chips: ["Reservar valoración gratuita", "Precios y financiación"],
          },
        ],
        state,
      };
    }
  }

  if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|hi)\b/.test(n)) {
    return {
      replies: [{ text: "¡Hola! ¿En qué puedo ayudarle hoy?", chips: MAIN_CHIPS }],
      state,
    };
  }

  if (/gracias|perfecto|genial|estupendo|vale gracias/.test(n)) {
    return {
      replies: [
        {
          text: "A usted, ha sido un placer. Si necesita algo más, aquí estaré.",
          chips: ["Reservar una cita", "Horarios y ubicación"],
        },
      ],
      state,
    };
  }

  if (/adios|hasta luego|chao|nos vemos/.test(n)) {
    return {
      replies: [{ text: "Hasta pronto. Que tenga un excelente día. 😊" }],
      state,
    };
  }

  return {
    replies: [
      {
        text: "Puedo ayudarle con precios, tratamientos, horarios o reservarle cita. Si prefiere hablar con una persona, nuestro equipo le atiende por teléfono o WhatsApp.",
        chips: MAIN_CHIPS,
        links: [{ label: "Hablar por WhatsApp", href: whatsappHref() }],
      },
    ],
    state,
  };
};
