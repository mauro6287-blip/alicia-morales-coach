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
                            Acompañando a organizaciones para el desarrollo
                        </span>
                        <br />
                        <span className="font-[family-name:var(--font-playfair)]">
                            del{" "}
                        </span>
                        <span className="font-[family-name:var(--font-playfair)] text-primary">
                            talento que impulsa resultados
                        </span>
                    </h1>



                    {/* Description */}
                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted lg:mx-0">
                        Creamos espacios de transformación donde las organizaciones
                        potencian a sus equipos a través del coaching ontológico y el
                        desarrollo de competencias clave, con las personas en el centro de la acción.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                        <a
                            href="#contacto"
                            className="group rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-xl"
                        >
                            Agendar Consultoría
                            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </a>
                        <a
                            href="#servicios"
                            className="rounded-full border-2 border-border px-8 py-4 text-lg font-medium text-foreground transition-all duration-300 hover:border-primary hover:text-primary"
                        >
                            Ver Programas
                        </a>
                    </div>

                    {/* Trust indicator */}
                    {/* Stats Grid */}
                    <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                        <div>
                            <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-primary md:text-4xl">
                                23+
                            </h3>
                            <p className="mt-1 text-sm text-muted">Años de Experiencia</p>
                        </div>
                        <div>
                            <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-primary md:text-4xl">
                                14+
                            </h3>
                            <p className="mt-1 text-sm text-muted">Años Liderando Equipos</p>
                        </div>
                        <div>
                            <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-primary md:text-4xl">
                                B2B
                            </h3>
                            <p className="mt-1 text-sm text-muted">Enfoque Corporativo</p>
                        </div>
                    </div>
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
