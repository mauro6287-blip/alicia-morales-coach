"use client";

import ScrollReveal from "@/components/ScrollReveal";

const pasos = [
    {
        numero: "01",
        etiqueta: "SER · CONSCIENCIA",
        titulo: "Diagnóstico de lo que frena el potencial de tu organización",
        descripcion:
            "Antes de intervenir, entendemos. Realizamos un diagnóstico profundo para identificar las brechas de competencias transversales que limitan el rendimiento de tus equipos. No trabajamos con supuestos: mapeamos la realidad organizacional para diseñar una intervención con foco real.",
        resultado:
            "Al terminar esta etapa, sabrás exactamente qué competencias desarrollar y por qué.",
    },
    {
        numero: "02",
        etiqueta: "HACER · ACCIÓN",
        titulo: "Programas diseñados para provocar cambios reales, no solo aprendizajes",
        descripcion:
            "Diseñamos e implementamos el programa a medida de tu organización: talleres, sesiones de coaching grupal, facilitaciones y relatorías que integran la metodología ontológica con herramientas de acción inmediata. Cada sesión está construida para que algo cambie, no solo para que algo se entienda.",
        resultado:
            "Tus equipos no solo aprenden — actúan diferente desde la primera intervención.",
    },
    {
        numero: "03",
        etiqueta: "TENER · RESULTADOS",
        titulo: "Evidencia del cambio, no solo percepción",
        descripcion:
            "Medimos el impacto del proceso en comportamientos observables y resultados organizacionales concretos. Acompañamos a líderes y equipos en la consolidación de nuevas formas de trabajar, relacionarse y tomar decisiones. El resultado no es una certificación — es una transformación verificable.",
        resultado:
            "Tu organización tiene evidencia de lo que cambió y cómo impacta el negocio.",
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
                <ScrollReveal>
                    <div className="mb-16 text-center">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                            Nuestra metodología
                        </span>
                        <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                            <span className="font-[family-name:var(--font-montserrat)]">
                                El Método CARA
                            </span>
                        </h2>
                        <p className="mx-auto max-w-2xl font-[family-name:var(--font-montserrat)] text-lg font-light text-muted">
                            Un proceso estructurado en cuatro etapas que convierte las brechas de
                            competencias en resultados organizacionales concretos y sostenibles.
                        </p>
                        <p className="mx-auto mt-4 max-w-2xl font-[family-name:var(--font-montserrat)] text-lg font-semibold text-primary">
                            Consciencia · Acción · Resultados · Acompañamiento
                        </p>
                    </div>
                </ScrollReveal>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line - hidden on mobile */}
                    <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-border md:left-1/2 md:block" />

                    <div className="space-y-12">
                        {pasos.map((paso, index) => (
                            <ScrollReveal key={index} delay={index * 150}>
                                <div
                                    className={`relative flex flex-col gap-6 md:flex-row ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    {/* Number badge */}
                                    <div className="absolute left-0 top-0 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-gray-900 shadow-lg md:left-1/2 md:-translate-x-1/2">
                                        {paso.numero}
                                    </div>

                                    {/* Content */}
                                    <div
                                        className={`ml-24 rounded-2xl border border-border bg-surface p-6 md:ml-0 md:w-[calc(50%-4rem)] ${index % 2 === 1 ? "md:mr-auto" : "md:ml-auto"
                                            }`}
                                    >
                                        {paso.etiqueta && (
                                            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
                                                {paso.etiqueta}
                                            </span>
                                        )}
                                        <h3 className="mb-3 text-xl font-semibold text-foreground">
                                            {paso.titulo}
                                        </h3>
                                        <p className="text-muted">{paso.descripcion}</p>
                                        {paso.resultado && (
                                            <div className="mt-5 border-l-2 border-primary bg-background/50 px-4 py-3 rounded-r-lg">
                                                <p className="text-sm italic text-muted">
                                                    <span className="mr-2 not-italic">→</span>
                                                    {paso.resultado}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
