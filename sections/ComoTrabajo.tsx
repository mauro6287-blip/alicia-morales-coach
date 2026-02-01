const pasos = [
    {
        numero: "01",
        titulo: "Sesión de Descubrimiento",
        descripcion:
            "Conversamos sobre tu situación actual, tus desafíos y lo que deseas lograr. Esta sesión es gratuita y sin compromiso.",
    },
    {
        numero: "02",
        titulo: "Plan Personalizado",
        descripcion:
            "Diseñamos juntos un plan de acción adaptado a tus objetivos, ritmo y circunstancias únicas.",
    },
    {
        numero: "03",
        titulo: "Sesiones de Coaching",
        descripcion:
            "Trabajamos en sesiones regulares donde exploramos, reflexionamos y creamos estrategias para tu avance.",
    },
    {
        numero: "04",
        titulo: "Seguimiento y Ajustes",
        descripcion:
            "Evaluamos tu progreso, celebramos los logros y ajustamos el plan según sea necesario.",
    },
];

export default function ComoTrabajo() {
    return (
        <section id="como-trabajo" className="bg-background px-6 py-20">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                        El Proceso
                    </span>
                    <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            ¿Cómo funciona el coaching?
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted">
                        Un proceso claro y estructurado que te guía paso a paso hacia tus
                        objetivos.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line - hidden on mobile */}
                    <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-border md:left-1/2 md:block" />

                    <div className="space-y-12">
                        {pasos.map((paso, index) => (
                            <div
                                key={index}
                                className={`relative flex flex-col gap-6 md:flex-row ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Number badge */}
                                <div className="absolute left-0 top-0 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg md:left-1/2 md:-translate-x-1/2">
                                    {paso.numero}
                                </div>

                                {/* Content */}
                                <div
                                    className={`ml-24 rounded-2xl border border-border bg-surface p-6 md:ml-0 md:w-[calc(50%-4rem)] ${index % 2 === 1 ? "md:mr-auto" : "md:ml-auto"
                                        }`}
                                >
                                    <h3 className="mb-3 text-xl font-semibold text-foreground">
                                        {paso.titulo}
                                    </h3>
                                    <p className="text-muted">{paso.descripcion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
