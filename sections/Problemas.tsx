const problemas = [
    {
        icon: "😔",
        titulo: "Sientes que la vida te pasa",
        descripcion:
            "Los días se repiten, las metas se postergan. Hay algo más, pero no sabes cómo alcanzarlo.",
    },
    {
        icon: "🔄",
        titulo: "Atrapado/a en el mismo ciclo",
        descripcion:
            "Intentas cambiar, empiezas con fuerza, pero siempre vuelves al punto de partida. Es frustrante.",
    },
    {
        icon: "🎭",
        titulo: "Desconectado/a de ti mismo/a",
        descripcion:
            "Cumples con todos menos contigo. Tu voz interior se perdió entre las expectativas de otros.",
    },
    {
        icon: "⏰",
        titulo: "El tiempo se escapa",
        descripcion:
            "Cada año que pasa sientes que la vida que sueñas está más lejos. La urgencia crece.",
    },
];

export default function Problemas() {
    return (
        <section id="problemas" className="bg-surface-elevated px-6 py-24">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                        ¿Te suena familiar?
                    </span>
                    <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            Esto no tiene que seguir así
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
                        Si alguno de estos puntos resuena contigo, no estás solo/a. Y lo más
                        importante: <strong className="text-foreground">tiene solución</strong>.
                    </p>
                </div>

                {/* Grid de problemas */}
                <div className="grid gap-6 md:grid-cols-2">
                    {problemas.map((problema, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                        >
                            <div className="mb-4 text-4xl">{problema.icon}</div>
                            <h3 className="mb-3 text-xl font-semibold text-foreground">
                                {problema.titulo}
                            </h3>
                            <p className="leading-relaxed text-muted">
                                {problema.descripcion}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Transition CTA */}
                <div className="mt-12 text-center">
                    <p className="mb-6 text-lg font-medium text-primary">
                        ¿Y si hoy fuera el día en que todo empieza a cambiar?
                    </p>
                    <a
                        href="#propuesta"
                        className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
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
