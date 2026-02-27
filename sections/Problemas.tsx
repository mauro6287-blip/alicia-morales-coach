const soluciones = [
    {
        icon: "🚀",
        titulo: "Habilidades Clave para el Futuro Laboral",
        descripcion:
            "Formación orientada al desarrollo de competencias transversales esenciales como adaptabilidad, flexibilidad y liderazgo.",
        features: [
            "Preparación para desafíos actuales y futuros",
            "Metodología de acción inmediata",
            "Formato: Workshops y talleres",
            "Enfoque en resultados tangibles",
        ],
    },
    {
        icon: "🎓",
        titulo: "Programa de Inserción Laboral",
        descripcion:
            "Programa especializado para CFT e Institutos Profesionales que equipa a estudiantes con herramientas para destacar en el mercado.",
        features: [
            "Formación en Portafolio Digital",
            "Optimización de LinkedIn",
            "Presencia digital profesional",
            "Preparación para el mercado laboral",
        ],
    },
    {
        icon: "🤝",
        titulo: "Outplacement Grupal y Re-inserción",
        descripcion:
            "Diseñado para empresas que buscan un proceso de transición laboral eficiente y digno para sus colaboradores.",
        features: [
            "Búsqueda estratégica de empleo",
            "Networking y habilidades clave",
            "Acompañamiento integral",
            "Perspectiva colectiva y estratégica",
        ],
    },
{
        icon: "🌟",
        titulo: "Mentorías y Charlas Motivacionales",
        descripcion:
            "Sesiones inspiradoras que impulsan la acción profesional y el desarrollo de habilidades clave para el mercado laboral.",
        features: [
            "Relatorías personalizadas",
            "Conferencias sobre competencias",
            "Inspiración para la acción",
            "Bienestar profesional",
        ],
    },
    {
        icon: "🛠️",
        titulo: "Facilitación de Talleres",
        descripcion:
            "Espacios de aprendizaje activo que generan impacto inmediato en los participantes y sus organizaciones.",
        features: [
            "Metodología de acción inmediata",
            "Formatos flexibles y adaptables",
            "Modalidad online y presencial",
            "Enfoque práctico y vivencial",
        ],
    },
];

export default function Problemas() {
    return (
        <section id="soluciones" className="bg-surface-elevated px-6 py-24">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                        NUESTRAS SOLUCIONES
                    </span>
                    <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            Programas de Transformación B2B
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
                        Soluciones personalizadas para organizaciones que buscan potenciar a
                        sus profesionales a través del desarrollo de competencias clave y el
                        coaching ontológico.
                    </p>
                </div>

                {/* Grid de soluciones */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {soluciones.map((solucion, index) => (
                        <div
                            key={index}
                            className="group flex flex-col rounded-2xl border border-white/5 bg-[#18181b] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-transparent text-4xl">
                                {solucion.icon}
                            </div>
                            <h3 className="mb-4 text-xl font-bold text-white">
                                {solucion.titulo}
                            </h3>
                            <p className="mb-6 flex-grow text-sm leading-relaxed text-gray-400">
                                {solucion.descripcion}
                            </p>

                            <ul className="mb-8 space-y-3">
                                {solucion.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                                        <span className="mt-0.5 text-primary">→</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="#contacto"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-light"
                            >
                                Conocer más
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Transition CTA */}
                <div className="mt-16 text-center">
                    <p className="mb-6 text-lg font-medium text-foreground">
                        ¿Y si hoy fuera el día en que todo empieza a cambiar?
                    </p>
                    <a
                        href="#contacto"
                        className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-dark"
                    >
                        Descubre cómo
                        <svg
                            className="h-5 w-5 animate-bounce"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
