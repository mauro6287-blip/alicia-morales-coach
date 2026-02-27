const soluciones = [
    {
        categoria: "EMPRESAS Y CORPORATIVOS",
        titulo: "Habilidades Clave para el Mercado Laboral",
        descripcion:
            "Formación orientada al desarrollo de competencias transversales esenciales como liderazgo, comunicación efectiva y trabajo colaborativo.",
        features: [
            "Preparación para desafíos actuales y futuros",
            "Metodología de acción inmediata",
            "Formato: Presencial y online (sincrónico)",
            "Enfoque en resultados tangibles y medibles",
        ],
    },
    {
        categoria: "ORGANISMOS EDUCACIONALES",
        titulo: "Programa de Inserción Laboral",
        descripcion:
            "Programa especializado que equipar a estudiantes con herramientas prácticas para construir una presencia profesional sólida y destacar en el mercado.",
        features: [
            "Formación en Portafolio Digital profesional",
            "Optimización estratégica de LinkedIn",
            "Construcción de marca personal",
            "Preparación integral para el mercado laboral competencias Chile Valora",
        ],
    },
    {
        categoria: "EMPRESAS- OMIL- SINDICATOS",
        titulo: "Outplacement Grupal- Re-inserción Laboral",
        descripcion:
            "Diseñado para organizaciones que buscan un proceso de transición laboral eficiente, estratégico y de accesible.",
        features: [
            "Búsqueda estratégica de empleo",
            "Networking y habilidades clave",
            "Acompañamiento integral del proceso",
            "Perspectiva colectiva y estratégica",
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
                        ESCUELA DE COMPETENCIAS APLICADAS
                    </span>
                    <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            Nuestras Soluciones
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
                        Programas diseñados para organizaciones que buscan desarrollar
                        competencias clave, con metodología de acción inmediata y resultados
                        medibles.
                    </p>
                </div>

                {/* Grid de soluciones */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {soluciones.map((solucion, index) => (
                        <div
                            key={index}
                            className="group flex flex-col rounded-2xl border border-white/5 bg-[#18181b] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <span className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
                                {solucion.categoria}
                            </span>
                            <h3 className="mb-4 text-xl font-bold text-white">
                                {solucion.titulo}
                            </h3>
                            <p className="mb-6 flex-grow text-sm leading-relaxed text-gray-400">
                                {solucion.descripcion}
                            </p>

                            <ul className="mb-8 space-y-3">
                                {solucion.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
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
