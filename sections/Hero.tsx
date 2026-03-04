"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function Hero() {
    return (
        <section
            id="hero"
            className="relative flex min-h-screen items-end justify-center overflow-hidden px-6 pb-12 pt-32"
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
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
                <ScrollReveal>
                    {/* Main heading */}
                    <h1 className="mb-6 text-3xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
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
                    <p className="mx-auto mb-10 max-w-3xl font-[family-name:var(--font-montserrat)] text-lg font-light leading-relaxed text-gray-200">
                        Creamos espacios de transformación donde las organizaciones
                        potencian a sus equipos a través del coaching ontológico y el
                        desarrollo de competencias clave, con las personas en el centro de la acción.
                    </p>

                    {/* CTA Buttons with scroll indicator centered */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
        </section>
    );
}
