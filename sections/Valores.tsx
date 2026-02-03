const valores = [
    {
        icon: "🎯",
        titulo: "Profesionalismo",
    },
    {
        icon: "🤝",
        titulo: "Integridad",
    },
    {
        icon: "💪",
        titulo: "Compromiso",
    },
    {
        icon: "👥",
        titulo: "Acompañamiento",
    },
    {
        icon: "📈",
        titulo: "Resultados",
    },
];

export default function Valores() {
    return (
        <section id="valores" className="bg-background px-6 py-24">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                        NUESTROS VALORES
                    </span>
                    <h2 className="mb-12 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            Pilares de Nuestra Filosofía
                        </span>
                    </h2>
                </div>

                {/* Grid de valores */}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {valores.map((valor, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#18181b] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-4xl shadow-inner transition-transform duration-300 group-hover:scale-110">
                                {valor.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                {valor.titulo}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
