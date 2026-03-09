"use client";

const keywords = [
    "Coaching Ontológico",
    "Liderazgo",
    "Competencias Transversales",
    "Empleabilidad",
    "Comunicación Efectiva",
    "Trabajo Colaborativo",
    "Método CARA",
    "Inserción Laboral",
    "Marca Personal",
    "Desarrollo Profesional",
    "Transformación Sostenible",
    "Metodología Vivencial",
];

export default function KeywordMarquee() {
    return (
        <div className="relative w-screen overflow-hidden bg-gradient-to-b from-black/60 to-[#1A1A1A] py-4">
            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#1A1A1A] to-transparent" />

            <div className="marquee-track flex w-max gap-8">
                {/* Duplicate the list for seamless loop */}
                {[...keywords, ...keywords].map((word, i) => (
                    <span
                        key={i}
                        className="flex shrink-0 items-center gap-3 whitespace-nowrap font-[family-name:var(--font-montserrat)] text-sm font-medium tracking-wide text-gray-300"
                    >
                        <span className="text-primary/80">&#x2022;</span>
                        {word}
                    </span>
                ))}
            </div>
        </div>
    );
}
