import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface AppointmentPayload {
  service?: unknown;
  dayISO?: unknown;
  dayLabel?: unknown;
  time?: unknown;
  name?: unknown;
  phone?: unknown;
}

const isText = (v: unknown, max = 120): v is string =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max;

export async function POST(req: Request) {
  let body: AppointmentPayload;
  try {
    body = (await req.json()) as AppointmentPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const { service, dayISO, dayLabel, time, name, phone } = body;

  if (
    !isText(service) ||
    !isText(dayISO, 10) ||
    !isText(dayLabel) ||
    !isText(time, 5) ||
    !isText(name, 60) ||
    !isText(phone, 15) ||
    !/^[6-9]\d{8}$/.test(phone)
  ) {
    return NextResponse.json({ ok: false, error: "Datos incompletos o inválidos" }, { status: 422 });
  }

  const id = `SRN-${Date.now().toString(36).toUpperCase()}`;

  // TODO (producción): enviar a la agenda de la clínica (Google Calendar, Doctoralia,
  // Gesden, etc.), a un CRM o por email/WhatsApp Business API. Por ahora se registra en logs.
  console.info("[appointment]", { id, service, dayISO, time, name, phone });

  return NextResponse.json({ ok: true, id });
}
