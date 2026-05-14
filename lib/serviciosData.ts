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
      "Hemos desarrollado más de 20 temáticas en torno a empleabilidad, comunicación efectiva, liderazgo y trabajo colaborativo. Son instancias vivenciales y participativas, pensadas para que cada grupo se lleve herramientas aplicables desde el primer día. El formato se ajusta a la realidad y los objetivos de cada organización o institución.",
  },
  {
    id: "seminarios",
    tabLabel: "Seminarios",
    title: "Seminarios",
    image: "/programa-de-insercion-laboral/seminarios.jpg",
    imageAlt: "Seminario sobre competencias y futuro del trabajo",
    intro:
      "Encuentros estratégicos que reúnen a empleadores, estudiantes, egresados y egresadas en torno a las competencias transversales y el futuro del trabajo. Espacios de reflexión y conversación que conectan distintas miradas y abren oportunidades de vinculación entre los actores del mundo laboral y formativo.",
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
