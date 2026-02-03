export default function Hero() {
    return (
        <section
            id="hero"
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-20"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent-light/10 to-transparent" />

            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
                {/* Text Content */}
                <div className="text-center lg:text-left">
                    {/* Badge */}
                    <span className="mb-6 inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-primary">
                        ✨ Coach Profesional Certificada ICF
                    </span>

                    {/* Main heading */}
                    <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            organizaciones para el desarrollo del
                        </span>
                        <br />
                        <span className="font-[family-name:var(--font-playfair)] text-primary">
                            talento que impulsa resultados
                        </span>
                    </h1>

                    {/* Tagline */}
                    <p className="mb-4 text-xl font-medium text-foreground/80 md:text-2xl">
                        Deja de postergar lo que mereces
                    </p>

                    {/* Description */}
                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted lg:mx-0">
                        Te acompaño a descubrir tu potencial, superar bloqueos y construir la
                        vida que realmente deseas. Con claridad, acción y resultados
                        concretos.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                        <a
                            href="#contacto"
                            className="group rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-xl"
                        >
                            Agenda tu Sesión Gratuita
                            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </a>
                        <a
                            href="#servicios"
                            className="rounded-full border-2 border-border px-8 py-4 text-lg font-medium text-foreground transition-all duration-300 hover:border-primary hover:text-primary"
                        >
                            Ver Servicios
                        </a>
                    </div>

                    {/* Trust indicator */}
                    <p className="mt-8 text-sm text-muted">
                        🎯 +100 personas ya transformaron su vida
                    </p>
                </div>

                {/* Image Content */}
                <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl lg:aspect-square">
                        {/* Background glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 opacity-60 blur-3xl" />

                        <img
                            src="/images/alicia.png"
                            alt="Alicia Morales - Coach Profesional"
                            className="relative z-10 h-full w-full object-contain object-bottom"
                        />
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <svg
                    className="h-8 w-8 text-muted"
                    style={{ width: '32px', height: '32px', maxWidth: '32px', maxHeight: '32px' }}
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
            </div>
        </section>
    );
}
