const servicios = [
    {
        nombre: "Sesión de Claridad",
        precio: "Gratis",
        descripcion:
            "30 minutos para conocernos, entender tu situación y ver si somos el match perfecto. Sin compromiso.",
        caracteristicas: [
            "Diagnóstico inicial",
            "Plan de acción sugerido",
            "Sin presión, solo conversación",
        ],
        destacado: false,
        cta: "Reservar Ahora",
    },
    {
        nombre: "Coaching Individual",
        precio: "Desde $80.000/sesión",
        descripcion:
            "Sesiones 1:1 diseñadas 100% para ti. Profundidad, intimidad y resultados medibles.",
        caracteristicas: [
            "Sesiones de 60-90 min",
            "Plan personalizado",
            "Soporte entre sesiones",
        ],
        destacado: true,
        cta: "Empezar Ahora",
    },
    {
        nombre: "Programa 3 Meses",
        precio: "Desde $600.000",
        descripcion:
            "Transformación profunda. 12 sesiones + recursos exclusivos para un cambio que permanece.",
        caracteristicas: [
            "12 sesiones estructuradas",
            "Ejercicios y herramientas",
            "Acceso prioritario",
        ],
        destacado: false,
        cta: "Consultar",
    },
];

export default function Servicios() {
    return (
        <section id="servicios" className="bg-surface-elevated px-6 py-24">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                        Servicios
                    </span>
                    <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            Elige tu camino
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
                        Cada persona es única. Por eso ofrezco opciones flexibles que se
                        adaptan a tu ritmo, presupuesto y objetivos.
                    </p>
                </div>

                {/* Services grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {servicios.map((servicio, index) => (
                        <div
                            key={index}
                            className={`relative rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-2 ${servicio.destacado
                                    ? "border-primary bg-surface shadow-2xl"
                                    : "border-border bg-surface hover:border-primary/30 hover:shadow-xl"
                                }`}
                        >
                            {servicio.destacado && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-6 py-2 text-sm font-semibold text-white shadow-lg">
                                    ⭐ Más Popular
                                </span>
                            )}

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-foreground">
                                    {servicio.nombre}
                                </h3>
                                <p className="mt-2 text-2xl font-bold text-primary">
                                    {servicio.precio}
                                </p>
                            </div>

                            <p className="mb-6 text-muted">{servicio.descripcion}</p>

                            <ul className="mb-8 space-y-3">
                                {servicio.caracteristicas.map((caracteristica, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <svg
                                            className="h-5 w-5 flex-shrink-0 text-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-foreground">{caracteristica}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="#contacto"
                                className={`block rounded-full py-4 text-center font-semibold transition-all duration-300 ${servicio.destacado
                                        ? "bg-primary text-white shadow-lg hover:-translate-y-1 hover:bg-primary-dark hover:shadow-xl"
                                        : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                                    }`}
                            >
                                {servicio.cta}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Guarantee */}
                <p className="mt-12 text-center text-muted">
                    💯 <strong className="text-foreground">Garantía de satisfacción:</strong>{" "}
                    Si después de la primera sesión no sientes que esto es para ti, te
                    devuelvo tu dinero. Sin preguntas.
                </p>
            </div>
        </section>
    );
}
