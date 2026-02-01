export default function SobreMi() {
    return (
        <section id="sobre-mi" className="bg-surface-elevated px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Image placeholder */}
                    <div className="order-2 lg:order-1">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20">
                            {/* Placeholder for photo */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-primary/20 text-6xl">
                                        👩‍💼
                                    </div>
                                    <p className="text-sm text-muted">Foto de Alicia</p>
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-2xl border-4 border-accent/30" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                            Sobre Mí
                        </span>
                        <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                            <span className="font-[family-name:var(--font-playfair)]">
                                Hola, soy Alicia
                            </span>
                        </h2>

                        <div className="space-y-4 text-muted">
                            <p className="text-lg leading-relaxed">
                                Soy Coach Profesional certificada con más de 5 años de
                                experiencia acompañando a personas en su camino hacia una vida
                                más plena y auténtica.
                            </p>
                            <p className="leading-relaxed">
                                Mi enfoque combina técnicas de coaching ontológico, inteligencia
                                emocional y desarrollo personal. Creo profundamente en el
                                potencial de cada persona para crear la vida que desea.
                            </p>
                            <p className="leading-relaxed">
                                Antes de ser coach, trabajé en el mundo corporativo durante 10
                                años, lo que me da una perspectiva única para entender los
                                desafíos del equilibrio vida-trabajo.
                            </p>
                        </div>

                        {/* Credentials */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            <span className="rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-primary">
                                Coach ICF
                            </span>
                            <span className="rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-primary">
                                Coaching Ontológico
                            </span>
                            <span className="rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-primary">
                                PNL Practitioner
                            </span>
                        </div>

                        <a
                            href="#contacto"
                            className="mt-8 inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-dark"
                        >
                            Conversemos
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
