const beneficios = [
    {
        icon: "🎯",
        titulo: "Claridad Total",
        descripcion: "Sabrás exactamente qué quieres y por qué lo quieres.",
    },
    {
        icon: "🚀",
        titulo: "Acción Decidida",
        descripcion: "Dejarás de planear y empezarás a hacer. Sin excusas.",
    },
    {
        icon: "💪",
        titulo: "Confianza Inquebrantable",
        descripcion: "Creerás en ti como nunca antes. Eso lo cambia todo.",
    },
    {
        icon: "🌟",
        titulo: "Resultados Reales",
        descripcion: "No más teoría. Transformaciones que puedes ver y sentir.",
    },
];

export default function PropuestaValor() {
    return (
        <section id="propuesta" className="bg-background px-6 py-24">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                        El Cambio Comienza Aquí
                    </span>
                    <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            Imagina despertar con propósito
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
                        El coaching no es magia. Es un proceso probado que te da las
                        herramientas, el apoyo y la estructura para convertirte en quien
                        necesitas ser.
                    </p>
                </div>

                {/* Beneficios grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {beneficios.map((beneficio, index) => (
                        <div
                            key={index}
                            className="group text-center transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-4xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                                {beneficio.icon}
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                {beneficio.titulo}
                            </h3>
                            <p className="text-muted">{beneficio.descripcion}</p>
                        </div>
                    ))}
                </div>

                {/* Quote */}
                <blockquote className="mt-20 rounded-3xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-10 text-center md:p-14">
                    <p className="text-xl font-medium italic leading-relaxed text-foreground md:text-2xl lg:text-3xl">
                        &ldquo;La mejor inversión que puedes hacer es en ti mismo/a. El
                        retorno es infinito.&rdquo;
                    </p>
                    <footer className="mt-6 flex items-center justify-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/20 text-2xl flex items-center justify-center">
                            ✨
                        </div>
                        <span className="font-semibold text-primary">Alicia Morales</span>
                    </footer>
                </blockquote>
            </div>
        </section>
    );
}
