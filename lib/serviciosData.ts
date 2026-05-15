export interface SubTabItem {
  bold: string;
  text: string;
}

export interface SubTab {
  label: string;
  title?: string;
  description: string;
  items?: SubTabItem[];
  meta?: string[];
}

export interface Servicio {
  id: string;
  tabLabel: string;
  title: string;
  image: string;
  imageAlt: string;
  intro?: string;
  bullets?: string[];
  subTabs?: SubTab[];
}

export const servicios: Servicio[] = [
  {
    id: "coaching-laboral",
    tabLabel: "Coaching Laboral",
    title: "Coaching Laboral",
    image: "/programa-de-insercion-laboral/coaching-laboral.jpg",
    imageAlt: "Sesión de coaching laboral",
    subTabs: [
      {
        label: "Individual",
        description:
          "Acompañamiento uno a uno, en formato online y presencial, para fortalecer las competencias transversales que intervienen en los procesos de empleabilidad y transición profesional. Cada sesión se diseña según el punto de partida de la persona, con foco en la acción concreta.",
      },
      {
        label: "Grupal",
        description:
          "Jornadas en formato online y presencial dirigidas a grupos de estudiantes, egresados y egresadas. Espacios de trabajo colectivo donde se activan las competencias transversales necesarias para enfrentar el mercado laboral con mayor claridad y recursos.",
      },
    ],
  },
  {
    id: "talleres-charlas",
    tabLabel: "Talleres y Charlas",
    title: "Talleres, Charlas y Conversatorios Interactivos",
    image: "/programa-de-insercion-laboral/talleres-charlas.jpg",
    imageAlt: "Taller participativo de competencias",
    intro:
      "Preparamos a estudiantes de educación superior para enfrentar con éxito la búsqueda de práctica y el primer empleo, integrando habilidades técnicas y estratégicas: autoconocimiento, marca personal y visibilidad, el perfil de LinkedIn como herramienta estratégica, entrevistas laborales, comunicación efectiva, iniciativa y adaptabilidad. No se trata solo de aprender a postular, sino de instalar capacidades que el estudiante seguirá usando a lo largo de toda su trayectoria.",
  },
  {
    id: "seminarios",
    tabLabel: "Seminarios",
    title: "Seminarios",
    image: "/programa-de-insercion-laboral/seminarios.jpg",
    imageAlt: "Seminario sobre competencias y futuro del trabajo",
    intro:
      "Encuentros estratégicos que reúnen a empleadores, estudiantes, egresados y egresadas en torno a las competencias transversales y el futuro del trabajo. Son espacios de reflexión, conversación y networking que crean y expanden oportunidades en el mercado laboral, conectando distintas miradas y vinculando a los actores del mundo formativo y productivo.",
  },
  {
    id: "programas-educativos",
    tabLabel: "Programas Educativos",
    title: "Programas Educativos online y/o presencial",
    image: "/programa-de-insercion-laboral/programas-educativos.jpg",
    imageAlt: "Programa educativo online",
    subTabs: [
      {
        label: "Programa de Empleabilidad",
        description:
          "Dos programas formativos diseñados para fortalecer la empleabilidad de estudiantes de últimos años y egresados de la educación superior:",
        items: [
          {
            bold: "Ready to Work",
            text: " entrega una formación integral 360°, articulando marca profesional, búsqueda estratégica de empleo y competencias transversales en un solo itinerario.",
          },
          {
            bold: "LinkedInLab",
            text: " se enfoca exclusivamente en estrategias de visibilidad y posicionamiento profesional en LinkedIn. Ambos están alineados con las tendencias actuales del mercado laboral y miden resultados de forma cuantificable, validando el impacto real sobre el perfil de egreso institucional.",
          },
        ],
      },
      {
        label: "Programa de Liderazgo",
        title: "Escuela de Liderazgo Futuro Profesional",
        description:
          "La principal brecha que hoy declaran los empleadores en Chile no está en el conocimiento técnico, sino en las competencias humanas que definen el desempeño profesional. Esta escuela responde directamente a esa brecha: forma estudiantes capaces de liderar su propio desarrollo desde la etapa universitaria, integrando liderazgo personal y profesional alineado a Chile Valora —autoconocimiento, autogestión, iniciativa, comunicación efectiva, trabajo colaborativo, adaptabilidad y mejora continua.",
      },
    ],
  },
  {
    id: "empleabilidad-docentes",
    tabLabel: "Empleabilidad para Docentes",
    title: "Empleabilidad para Docentes",
    image: "/programa-de-insercion-laboral/empleabilidad-docentes.jpg",
    imageAlt: "Taller de empleabilidad para docentes",
    intro:
      "Acompañamos a docentes en el desarrollo de competencias para guiar a sus estudiantes y egresados en su trayectoria profesional.",
    bullets: [
      "Talleres formativos para instalar y desarrollar las competencias del siglo XXI dentro del aula.",
      "Programa educativo asincrónico y autoinstruccional: “El docente universitario como guía y referente de sus estudiantes y egresados en el desarrollo de carrera y empleabilidad”.",
    ],
  },
];
