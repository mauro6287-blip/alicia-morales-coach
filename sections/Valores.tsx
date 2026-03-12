"use client";

import ScrollReveal from "@/components/ScrollReveal";

const valores = [
    {
        titulo: "Profesionalismo",
        // Briefcase
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                <path d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 5h4v2h-4V5z" />
            </svg>
        ),
    },
    {
        titulo: "Integridad",
        // Puzzle piece
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                <path d="M20.5 11H19V7a2 2 0 00-2-2h-4V3.5a2.5 2.5 0 00-5 0V5H4a2 2 0 00-2 2v3.8h1.5a2.5 2.5 0 010 5H2V20a2 2 0 002 2h3.8v-1.5a2.5 2.5 0 015 0V22H17a2 2 0 002-2v-4h1.5a2.5 2.5 0 000-5z" />
            </svg>
        ),
    },
    {
        titulo: "Compromiso",
        // Handshake
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                <path d="M12.22 19.85c-.18.18-.5.18-.67 0l-3.45-3.46c-.18-.18-.18-.5 0-.67l.67-.67c.18-.18.5-.18.67 0l2.34 2.34 2.34-2.34a.48.48 0 01.67 0l.67.67c.18.18.18.5 0 .67l-3.24 3.46zM22 8.5l-3.79 3.8-2.94-2.94-.67.67 3.61 3.61L23.34 8.5H22zM6.73 10.03L2 14.76v.01l5.34 5.34.67-.67-3.61-3.61 3-3-.67-.67v-.13zM17 6h-2.69l-2.5 2.5-.67-.67L14.28 4.7a1 1 0 00-.7-.3H9.42a1 1 0 00-.71.3L4 9.41V11h1.59l3.12-3.12.67.67L6.73 11.2l.67.67L11 8.27l3.59 3.6.67-.67-3.55-3.55L14.34 5H17V6z" />
            </svg>
        ),
    },
    {
        titulo: "Acompañamiento",
        // Open hands / support
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
        ),
    },
    {
        titulo: "Resultados",
        // Star
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
    },
];

export default function Valores() {
    return (
        <section id="valores" className="relative bg-background px-6 py-24">
            {/* Background rectangle */}
            <div className="absolute inset-x-0 bottom-0 top-8 rounded-t-3xl bg-gradient-to-b from-[#242424] to-[#ffffff]" />

            <div className="relative mx-auto max-w-7xl">
                {/* Header */}
                <ScrollReveal>
                    <div className="mb-16 text-center">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                            NUESTROS VALORES
                        </span>
                        <h2 className="mb-12 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                            <span className="font-[family-name:var(--font-montserrat)]">
                                Los pilares que nos mueven
                            </span>
                        </h2>
                    </div>
                </ScrollReveal>

                {/* Grid de valores */}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {valores.map((valor, index) => (
                        <ScrollReveal key={index} delay={index * 80}>
                            <div className="group flex h-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#18181b] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-[#FFDE59] shadow-inner transition-transform duration-300 group-hover:scale-110">
                                    {valor.svg}
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                    {valor.titulo}
                                </h3>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
