"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import KeywordMarquee from "@/components/KeywordMarquee";

export default function Hero() {
    return (
        <section
            id="hero"
            className="relative flex min-h-screen flex-col justify-end overflow-hidden"
        >
            {/* Background image */}
            <Image
                src="/images/Hero3 AliciaMorales.png"
                alt="Hero background"
                fill
                priority
                className="object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 mx-auto mb-4 w-full max-w-6xl px-6 pb-4 pt-20 text-center md:mb-8 md:pt-32">
                <ScrollReveal>
                    {/* Main heading */}
                    <h1 className="mb-4 text-3xl font-light tracking-tight text-foreground md:mb-6 md:text-6xl lg:text-7xl">
                        <span className="font-[family-name:var(--font-montserrat)]">
                            Acompañando a organizaciones para el desarrollo
                        </span>
                        <br />
                        <span className="font-[family-name:var(--font-montserrat)]">
                            del{" "}
                        </span>
                        <span className="font-[family-name:var(--font-montserrat)] text-primary">
                            talento que impulsa resultados
                        </span>
                    </h1>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    {/* Description */}
                    <p className="mx-auto mb-6 max-w-3xl font-[family-name:var(--font-montserrat)] text-base font-light leading-relaxed text-gray-200 md:mb-10 md:text-lg">
                        Creamos espacios de transformación donde las organizaciones
                        potencian a profesionales y futuros talentos, a través del coaching
                        y el desarrollo de competencias humanas en el centro de la acción.
                    </p>

                    {/* CTA Buttons with scroll indicator centered */}
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                        <a
                            href="#formulario"
                            className="group rounded-full bg-primary px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-xl"
                        >
                            Contactar
                            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </a>

                        {/* Scroll indicator between buttons */}
                        <div className="animate-bounce">
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

                        <a
                            href="#servicios"
                            className="rounded-full border-2 border-border px-8 py-4 text-lg font-medium text-foreground transition-all duration-300 hover:border-primary hover:text-primary"
                        >
                            Ver Programas
                        </a>
                    </div>
                </ScrollReveal>
            </div>

            {/* Keyword marquee at the bottom */}
            <KeywordMarquee />
        </section>
    );
}
