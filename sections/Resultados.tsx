"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const testimonios = [
    {
        nombre: "Andrea Fernandez Sales",
        rol: "Ingeniero Comercial",
        texto:
            "Excelente experiencia. Después de muchos años sin estar en búsqueda activa de trabajo, necesitaba actualizar mi CV y conocer las últimas tendencias en esta materia. Alicia es muy profesional y cercana, siento que estuve en las mejores manos.",
        avatar: "AF",
    },
    {
        nombre: "Verónica Peña Puentes",
        rol: "Ingeniero Comercial",
        texto:
            "La asesoría de Alicia fue fundamental en mi búsqueda de trabajo después de estar 4 años fuera del mercado laboral. La mejora en mi CV y perfil de Linkedin, el apoyo en preparar entrevistas asociadas al cargo, dando mas seguridad y sacando provecho a cada experiencia y formación que a veces cuesta ver por sí solos. Su asesoría es clara, critica, certera, y acorde a los tiempos actuales.",
        avatar: "VP",
    },
    {
        nombre: "Víctor León Marquez",
        rol: "Líder Comercial Estratégico",
        texto:
            "Recomiendo ampliamente a Alicia Morales Bustamante por sus excepcionales habilidades de comunicación, por su capacidad para expresar ideas con claridad y concisión para la ayuda de la generación y modificación de mi cv y perfil de LinkedIn. Gracias Alicia por tu profesionalismo y entrega para la construcción de un nuevo rumbo en esta plataforma lo que implico a volver a insertarme al mercado. Trabajar contigo fue un verdadero placer y gracias por el profesionalismo y la seriedad que le das por las personas que necesitamos de tu ayuda.",
        avatar: "VL",
    },
];

const TRUNCATE_LENGTH = 380;

export default function Resultados() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <section id="resultados" className="bg-white px-6 py-20">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <ScrollReveal>
                    <div className="mb-16 text-center">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                            Testimonios
                        </span>
                        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                            <span className="font-[family-name:var(--font-montserrat)]">
                                Lo que dicen mis clientes
                            </span>
                        </h2>
                        <p className="mx-auto max-w-2xl font-[family-name:var(--font-montserrat)] text-lg font-light text-gray-600">
                            Historias reales de personas que decidieron invertir en su
                            crecimiento.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Testimonials grid */}
                <div className="grid gap-8 md:grid-cols-3">
                    {testimonios.map((testimonio, index) => {
                        const needsTruncation = testimonio.texto.length > TRUNCATE_LENGTH;
                        const isExpanded = expandedIndex === index;
                        const displayText = needsTruncation && !isExpanded
                            ? testimonio.texto.slice(0, TRUNCATE_LENGTH).trimEnd() + "..."
                            : testimonio.texto;

                        return (
                            <ScrollReveal key={index} delay={index * 120}>
                                <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-[#18181b] p-8">
                                    {/* Quote icon */}
                                    <svg
                                        className="mb-4 h-8 w-8 text-accent"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>

                                    <p className="mb-6 leading-relaxed text-gray-400">
                                        {displayText}
                                        {needsTruncation && (
                                            <button
                                                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                                className="ml-1 font-medium text-primary transition-colors hover:text-primary/80"
                                            >
                                                {isExpanded ? "Ver menos" : "Ver más"}
                                            </button>
                                        )}
                                    </p>

                                    {/* Author */}
                                    <div className="mt-auto flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-medium text-gray-900">
                                            {testimonio.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">
                                                {testimonio.nombre}
                                            </p>
                                            <p className="text-sm text-gray-400">{testimonio.rol}</p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
