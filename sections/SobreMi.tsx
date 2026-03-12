"use client";

import ScrollReveal from "@/components/ScrollReveal";

export default function SobreMi() {
    return (
        <section id="sobre-mi" className="bg-surface-elevated px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Image placeholder */}
                    <ScrollReveal className="order-2 lg:order-1">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20">
                            <img
                                src="/images/alicia.png"
                                alt="Alicia Morales - Coach"
                                className="h-full w-full object-cover"
                            />

                            {/* Decorative element */}
                            <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-2xl border-4 border-accent/30" />
                        </div>
                    </ScrollReveal>

                    {/* Content */}
                    <ScrollReveal className="order-1 lg:order-2" delay={150}>
                        <div>
                            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                                <span className="font-[family-name:var(--font-montserrat)] italic">
                                    Escuela de Competencias Aplicadas
                                </span>
                            </h2>
                            <span className="mb-6 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                                Fundadora & Directora · Alicia Morales Bustamante
                            </span>

                            <div className="space-y-4 text-muted">
                                <p className="text-lg leading-relaxed">
                                    La Escuela de Competencias Aplicadas es una entidad
                                    de consultoría y formación creada con el propósito de acompañar a
                                    las organizaciones en el desarrollo de Habilidades Transversales
                                    necesarias para los entornos de alta complejidad actuales y futuros
                                    en Chile.
                                </p>
                                <p className="leading-relaxed">
                                    Nuestra estructura está liderada por su fundadora, Alicia Morales
                                    Bustamante, quien aporta una visión técnica y estratégica tras 23
                                    años de trayectoria en el sector financiero y 14 años en la
                                    dirección de equipos de alto desempeño.
                                </p>
                                <p className="leading-relaxed">
                                    Nuestra ventaja competitiva reside en nuestra metodología aplicada.
                                    Combinamos la experiencia en primera persona de nuestra Directora,
                                    en el sector banca, con distinciones de coaching y técnicas teatrales
                                    para generar espacios de aprendizaje experiencial.
                                </p>
                            </div>

                            {/* Credentials */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                <span className="rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-primary">
                                    Competencias transversales
                                </span>
                                <span className="rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-primary">
                                    Empleabilidad
                                </span>
                                <span className="rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-primary">
                                    Coaching
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
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
