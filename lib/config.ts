export const CLINIC = {
  name: "Clínica Dental Serranos",
  shortName: "Serranos",
  tagline: "Estética dental e implantes sin dolor",
  // PLACEHOLDERS: sustituir por los datos reales de la clínica antes de publicar.
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "+34 960 000 000",
  phoneHref: process.env.NEXT_PUBLIC_PHONE_HREF ?? "+34960000000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP ?? "34600000000",
  email: "hola@clinicadentalserranos.es",
  street: "Calle de Serranos, 12",
  postalCode: "46003",
  city: "Valencia",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Dental+Serranos+Valencia",
  rating: 4.9,
  reviewCount: 312,
} as const;

export const WHATSAPP_MESSAGE =
  "Hola, me gustaría solicitar información y una cita en Clínica Dental Serranos.";

export const whatsappHref = (message: string = WHATSAPP_MESSAGE) =>
  `https://wa.me/${CLINIC.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const telHref = `tel:${CLINIC.phoneHref}`;

export const HOURS = [
  { days: "Lunes a viernes", time: "9:00 – 20:00" },
  { days: "Sábados", time: "10:00 – 14:00" },
  { days: "Domingos", time: "Cerrado" },
] as const;

export const HOURS_TEXT =
  "Lunes a viernes de 9:00 a 20:00 y sábados de 10:00 a 14:00. Los domingos permanecemos cerrados.";

export const OPEN_CHAT_EVENT = "serranos:open-chat";

export const openChat = (booking = false) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(OPEN_CHAT_EVENT, { detail: { booking } })
  );
};
