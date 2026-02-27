const pilares = [
    {
        numero: "01",
        titulo: "Experiencia Real",
        descripcion:
            "14 años liderando equipos de alto rendimiento en entornos corporativos exigentes.",
    },
    {
        numero: "02",
        titulo: "Coaching Ontológico",
        descripcion:
            "Profundidad del coaching ontológico para transformar el Ser antes que el Hacer.",
    },
    {
        numero: "03",
        titulo: "Acción Inmediata",
        descripcion:
            "Capacidad única para provocar la acción profesional desde la primera sesión.",
    },
    {
        numero: "04",
        titulo: "Entornos Saludables",
        descripcion:
            "Impulsando entornos de trabajo saludables y altamente efectivos.",
    },
];

export default function PropuestaValor() {
    return (
        <section id="metodologia" className="bg-background px-6 py-24">
            <div className="mx-auto max-w-7xl">
                {/* Main Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                        MI METODOLOGÍA
                    </span>
                    <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            Los 4 pilares que nos distinguen
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
                        Mi enfoque integra experiencia real, profundidad ontológica y capacidad
                        única para provocar la acción profesional inmediata.
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-5 lg:gap-8">
                    {/* Left Column - Propuesta de Valor */}
                    <div className="flex flex-col justify-center lg:col-span-2">
                        <h3 className="mb-8 text-3xl font-bold text-primary">
                            <span className="font-[family-name:var(--font-playfair)]">
                                Propuesta de valor
                            </span>
                        </h3>
                        <div className="space-y-6 text-lg leading-relaxed text-gray-300">
                            <p>
                                Somos una empresa especializada en el desarrollo de competencias
                                transversales para organizaciones. Acompañamos a empresas, instituciones
                                educativas y organismos públicos a fortalecer el capital humano de sus
                                equipos a través de metodologías vivenciales que integran consciencia,
                                acción y resultados.
                            </p>
                            <p>
                                Nuestro enfoque nace de una convicción: la acción profesional efectiva no
                                se entrena solo desde lo técnico. Cuando las personas desarrollan
                                consciencia sobre su identidad profesional, activan competencias que
                                generan impacto real y sostenible en la organización.
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Grid of Cards */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:col-span-3">
                        {pilares.map((pilar, index) => (
                            <div
                                key={index}
                                className="group rounded-xl border border-white/5 bg-[#18181b] p-8 transition-colors hover:border-primary/30"
                            >
                                <span className="mb-4 block font-[family-name:var(--font-playfair)] text-4xl text-primary/80">
                                    {pilar.numero}
                                </span>
                                <h4 className="mb-3 text-lg font-bold text-white">
                                    {pilar.titulo}
                                </h4>
                                <p className="text-sm leading-relaxed text-gray-400">
                                    {pilar.descripcion}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
