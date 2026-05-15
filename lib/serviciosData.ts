export interface SubTab {
  label: string;
  description: string;
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
          "Proceso formativo orientado a estudiantes y egresados que se preparan para ingresar al mercado laboral. Trabaja la marca personal, las herramientas de búsqueda y las competencias transversales que hoy marcan la diferencia.",
        meta: ["Estudiantes y Egresados", "6 sesiones"],
      },
      {
        label: "Programa de Liderazgo",
        description:
          "Proceso formativo centrado en el desarrollo de competencias de liderazgo y gestión, dirigido a estudiantes y egresados que proyectan roles de mayor responsabilidad. Metodología vivencial con foco en la aplicación real.",
        meta: ["Estudiantes y Egresados", "5 sesiones"],
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
