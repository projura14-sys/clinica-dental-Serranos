export type IconName =
  | "implant"
  | "ortho"
  | "whitening"
  | "veneers"
  | "hygiene"
  | "checkup";

export interface Treatment {
  id: string;
  name: string;
  description: string;
  detail: string;
  priceFrom: number;
  priceUnit?: string;
  icon: IconName;
  pattern: RegExp;
}

// PRECIOS ORIENTATIVOS DE EJEMPLO: ajustar a la tarifa real de la clínica.
export const TREATMENTS: Treatment[] = [
  {
    id: "implantes",
    name: "Implantes dentales",
    description:
      "Titanio de grado médico, cirugía guiada en 3D y sedación consciente. Recupere su sonrisa sin molestias.",
    detail:
      "Planificamos cada implante en 3D, lo que permite una cirugía mínimamente invasiva, con una recuperación rápida y sin dolor gracias a la anestesia y la sedación consciente.",
    priceFrom: 1150,
    priceUnit: "implante con corona",
    icon: "implant",
    pattern: /implant|poste|muela|diente perdido|falta un diente/,
  },
  {
    id: "ortodoncia",
    name: "Ortodoncia invisible",
    description:
      "Alineadores transparentes y discretos, con seguimiento digital de cada fase de su tratamiento.",
    detail:
      "Alineadores transparentes y removibles, diseñados tras un escaneo digital. Puede ver su resultado final simulado antes de empezar.",
    priceFrom: 2400,
    icon: "ortho",
    pattern: /ortodon|invisal|brackets|alineador|dientes torcidos/,
  },
  {
    id: "blanqueamiento",
    name: "Blanqueamiento",
    description:
      "Hasta 8 tonos más luminosos en una sola sesión, con protocolos que cuidan el esmalte y la encía.",
    detail:
      "Un blanqueamiento profesional supervisado por nuestros dentistas, con protocolos suaves para minimizar la sensibilidad.",
    priceFrom: 290,
    icon: "whitening",
    pattern: /blanque|amarill|manchas|tono/,
  },
  {
    id: "carillas",
    name: "Carillas y estética",
    description:
      "Carillas de porcelana ultrafinas y diseño digital de sonrisa para un resultado natural y armónico.",
    detail:
      "Diseñamos su sonrisa en digital para que la apruebe antes de empezar. Carillas de porcelana ultrafinas con un acabado muy natural.",
    priceFrom: 380,
    priceUnit: "carilla",
    icon: "veneers",
    pattern: /carilla|estetic|diseno de sonrisa|sonrisa/,
  },
  {
    id: "limpieza",
    name: "Limpieza e higiene",
    description:
      "Higiene profunda con ultrasonidos y pulido, la base de una boca sana y de cualquier tratamiento estético.",
    detail:
      "Limpieza profunda con ultrasonidos y pulido, más una revisión completa de encías y dientes.",
    priceFrom: 70,
    icon: "hygiene",
    pattern: /limpiez|higiene|sarro|encia/,
  },
  {
    id: "primera-visita",
    name: "Primera visita y diagnóstico",
    description:
      "Escáner digital 3D, radiografía y un plan de tratamiento claro, con presupuesto cerrado y sin compromiso.",
    detail:
      "Incluye escáner digital 3D, estudio radiológico y un plan de tratamiento con presupuesto cerrado, sin compromiso.",
    priceFrom: 0,
    icon: "checkup",
    pattern: /primera|revision|valoracion|diagnostic/,
  },
];

export interface Testimonial {
  name: string;
  neighbourhood: string;
  treatment: string;
  quote: string;
  rating: number;
}

// TESTIMONIOS DE EJEMPLO PARA EL PROTOTIPO: sustituir por reseñas reales y verificadas.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marta G.",
    neighbourhood: "Ruzafa",
    treatment: "Implantes dentales",
    quote:
      "Llegué con muchísimo miedo y salí sin haber sentido nada. Explican cada paso y jamás me sentí con prisa. Ahora vuelvo a sonreír en las fotos.",
    rating: 5,
  },
  {
    name: "José Luis P.",
    neighbourhood: "Campanar",
    treatment: "Implante y corona",
    quote:
      "El presupuesto fue cerrado desde el primer día, sin sorpresas. La recuperación fue mucho más sencilla de lo que me habían contado.",
    rating: 5,
  },
  {
    name: "Carla M.",
    neighbourhood: "El Carmen",
    treatment: "Ortodoncia invisible",
    quote:
      "Nadie en el trabajo se ha dado cuenta de que llevaba alineadores. Pude ver el resultado en pantalla antes de empezar y es exactamente lo que me prometieron.",
    rating: 5,
  },
  {
    name: "Andrés R.",
    neighbourhood: "Benimaclet",
    treatment: "Blanqueamiento",
    quote:
      "Trato exquisito, instalaciones impecables y un resultado natural, nada artificial. Se nota que cuidan hasta el último detalle.",
    rating: 5,
  },
  {
    name: "Lucía F.",
    neighbourhood: "Cabanyal",
    treatment: "Carillas de porcelana",
    quote:
      "Diseñaron mi sonrisa en digital y me dejaron decidir cada detalle. Es la mejor decisión que he tomado en años.",
    rating: 5,
  },
  {
    name: "Vicente S.",
    neighbourhood: "Patraix",
    treatment: "Revisión y limpieza",
    quote:
      "Puntualidad total y cero esperas. Por fin una clínica donde me explican lo que hacen con calma y sin venderme nada que no necesite.",
    rating: 5,
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "¿De verdad un implante puede ser sin dolor?",
    a: "Sí. Trabajamos con anestesia local de última generación y, si lo desea, sedación consciente. La cirugía se planifica en 3D, lo que la hace más precisa y menos invasiva. La mayoría de pacientes nos cuenta que lo más incómodo fue la espera previa.",
  },
  {
    q: "¿Cuánto cuesta la primera visita?",
    a: "La primera valoración incluye escáner digital 3D, revisión completa y un plan de tratamiento con presupuesto cerrado, sin compromiso.",
  },
  {
    q: "¿Ofrecen financiación?",
    a: "Sí, financiamos tratamientos hasta en 24 meses sin intereses. Le presentamos las opciones durante la valoración para que elija la que mejor le encaje.",
  },
  {
    q: "¿Cuánto dura un tratamiento de ortodoncia invisible?",
    a: "Depende de cada caso, pero habitualmente entre 6 y 18 meses. Tras el escaneo le mostramos una simulación del resultado y la duración estimada.",
  },
  {
    q: "¿Atienden urgencias?",
    a: "Sí. Si tiene dolor intenso, un golpe o una pieza rota, llámenos y le damos cita prioritaria el mismo día siempre que sea posible.",
  },
];
