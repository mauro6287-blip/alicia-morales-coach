const programas = [
    {
        numero: "01",
        badge: "EMPRESAS",
        badgeIcon: "🏢",
        titulo: "Programa de Liderazgo y Competencias Esenciales",
        descripcion:
            "Programa modular que acompaña la transición del experto técnico al líder de equipos, desarrollando las competencias de gestión que toda organización necesita.",
        features: [
            "4 bloques progresivos, desde autogestión hasta sostenibilidad del cambio",
            "Metodología vivencial con herramientas de aplicación inmediata",
            "Adaptable a cualquier sector e industria",
            "Incluye diagnóstico previo y seguimiento post-programa",
        ],
        modalidad: "Presencial · Online · Modalidad mixta",
    },
    {
        numero: "02",
        badge: "ORGANISMOS DE EDUCACIÓN SUPERIOR",
        badgeIcon: "🎓",
        titulo: "Programa de Inserción Laboral para Educación Superior",
        descripcion:
            "Preparamos a los estudiantes para el mundo laboral real, combinando marca personal digital con el desarrollo de competencias transversales validadas por Chile Valora.",
        features: [
            "Portafolio digital profesional y optimización de LinkedIn",
            "Competencias transversales alineadas a marcos nacionales",
            "Herramientas de búsqueda activa y networking estratégico",
            "Integración de IA aplicada a la empleabilidad",
        ],
        modalidad: "Presencial · Online",
    },
    {
        numero: "03",
        badge: "EMPRESAS · OMIL · SINDICATOS",
        badgeIcon: "🤝",
        titulo: "Programa de Coaching y Transición Laboral",
        descripcion:
            "Acompañamos procesos de transición y reinserción laboral con una hoja de ruta estratégica que devuelve confianza, dirección y herramientas concretas a los profesionales.",
        features: [
            "CV de alto impacto y perfil LinkedIn optimizado",
            "Coaching ejecutivo individual y grupal",
            "Técnicas de networking y búsqueda estratégica de empleo",
            "Uso de Inteligencia Artificial para potenciar la búsqueda",
        ],
        modalidad: "Presencial · Online",
    },
];

export default function Servicios() {
    return (
        <section id="servicios" className="bg-white px-6 py-24">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary">
                        <span className="h-px w-8 bg-primary" />
                        PROGRAMAS DESTACADOS
                        <span className="h-px w-8 bg-primary" />
                    </span>
                    <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            Programas diseñados para la acción
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
                        Cada programa se adapta a la realidad de tu organización. Aquí, tres
                        de nuestras intervenciones más solicitadas.
                    </p>
                </div>

                {/* Programs grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {programas.map((programa, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#18181b] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                        >
                            {/* Number & Badge */}
                            <div className="mb-6 flex items-start justify-between">
                                <span className="text-4xl font-bold text-white/10">
                                    {programa.numero}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                                    <span>{programa.badgeIcon}</span>
                                    {programa.badge}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="mb-4 text-xl font-bold text-white">
                                {programa.titulo}
                            </h3>

                            {/* Description */}
                            <p className="mb-6 flex-grow text-sm leading-relaxed text-gray-400">
                                {programa.descripcion}
                            </p>

                            {/* Features */}
                            <ul className="mb-6 space-y-3">
                                {programa.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Modalidad */}
                            <p className="mb-6 flex items-center gap-2 text-xs text-gray-500">
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                {programa.modalidad}
                            </p>

                            {/* CTA */}
                            <a
                                href="#contacto"
                                className="block rounded-full border border-primary py-3 text-center text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                            >
                                Solicitar información →
                            </a>
                        </div>
                    ))}
                </div>

                {/* Nota destacada */}
                <div className="mt-12 rounded-2xl border border-primary/30 bg-[#18181b] px-8 py-6 text-center">
                    <p className="text-base leading-relaxed text-muted">
                        Todos nuestros programas incluyen{" "}
                        <strong className="text-primary">diagnóstico previo</strong>,{" "}
                        <strong className="text-primary">adaptación a la realidad de su organización</strong>{" "}
                        y <strong className="text-primary">seguimiento post-intervención</strong>.
                        Conversemos sobre lo que su equipo necesita.
                    </p>
                </div>
            </div>
        </section>
    );
}
