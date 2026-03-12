"use client";

import ScrollReveal from "@/components/ScrollReveal";

const perfilIdeal = [
    "Inviertes en capacitación pero no ves cambios reales en el desempeño de tus equipos",
    "Necesitas fortalecer competencias transversales como liderazgo, comunicación efectiva y trabajo colaborativo",
    "Enfrentas alta rotación, desmotivación o brechas de habilidades que impactan los resultados del negocio",
    "Buscas programas que se conecten con la realidad operacional y generen resultados medibles",
    "Necesitas preparar a tus estudiantes o profesionales para los desafíos del mercado laboral actual y futuro",
    "Requieres acompañar procesos de transición laboral con un enfoque estratégico, digno y profesional",
];

export default function ParaQuienEs() {
    return (
        <section id="para-quien" className="bg-white px-6 py-20">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <ScrollReveal>
                    <div className="mb-16 text-center">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                            ¿ES PARA TU ORGANIZACIÓN?
                        </span>
                        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                            <span className="font-[family-name:var(--font-montserrat)]">
                                Nuestras soluciones son para ti si tu organización enfrenta estos desafíos:
                            </span>
                        </h2>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                    <div className="rounded-2xl border border-white/5 bg-[#18181b] p-8">
                        <ul className="space-y-4">
                            {perfilIdeal.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="mt-1 text-primary">•</span>
                                    <span className="text-gray-400">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <hr className="my-6 border-gray-700" />

                        <p className="text-sm italic text-primary">
                            Si tu organización se identifica con al menos uno de estos puntos, conversemos.
                            Diseñamos soluciones a la medida de cada realidad.
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
