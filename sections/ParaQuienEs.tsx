const perfilIdeal = [
    "Sientes que es momento de un cambio, pero no sabes por dónde empezar",
    "Tienes metas importantes pero te cuesta mantener el enfoque",
    "Quieres desarrollar mayor confianza y seguridad en ti mismo/a",
    "Buscas equilibrio entre tu vida personal y profesional",
    "Estás atravesando una transición y necesitas claridad",
    "Quieres dejar de postergar y empezar a actuar",
];

const noEsPara = [
    "Buscas soluciones mágicas sin esfuerzo",
    "No estás dispuesto/a a cuestionar tus creencias",
    "Esperas que alguien tome las decisiones por ti",
];

export default function ParaQuienEs() {
    return (
        <section id="para-quien" className="bg-surface-elevated px-6 py-20">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                        ¿Es para ti?
                    </span>
                    <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            El coaching es para ti si...
                        </span>
                    </h2>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Para quién SÍ es */}
                    <div className="rounded-2xl border border-primary/20 bg-surface p-8">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <svg
                                    className="h-6 w-6"
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
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">
                                Esto es para ti si:
                            </h3>
                        </div>

                        <ul className="space-y-4">
                            {perfilIdeal.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="mt-1 text-primary">•</span>
                                    <span className="text-muted">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Para quién NO es */}
                    <div className="rounded-2xl border border-border bg-surface p-8">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">
                                No es para ti si:
                            </h3>
                        </div>

                        <ul className="space-y-4">
                            {noEsPara.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="mt-1 text-muted">•</span>
                                    <span className="text-muted">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="mt-6 text-sm italic text-muted">
                            El coaching requiere compromiso y disposición al cambio. Si estás
                            listo/a para eso, ¡vamos!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
