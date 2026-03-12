"use client";

import { useState, FormEvent } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const servicios = [
    { value: "", label: "Selecciona un servicio" },
    { value: "habilidades-mercado-laboral", label: "Habilidades Clave para el Mercado Laboral" },
    { value: "insercion-laboral", label: "Programa de Inserción Laboral" },
    { value: "outplacement-reinsercion", label: "Outplacement Grupal- Re-inserción Laboral" },
    { value: "mentorias-charlas", label: "Mentorías y Charlas Corporativas" },
    { value: "facilitacion-talleres", label: "Facilitación de Talleres" },
    { value: "otros-servicios", label: "Otros servicios" },
];

interface FormData {
    nombre: string;
    email: string;
    telefono: string;
    servicio: string;
    mensaje: string;
}

interface FormErrors {
    nombre?: string;
    email?: string;
    mensaje?: string;
}

export default function Contacto() {
    const [formData, setFormData] = useState<FormData>({
        nombre: "",
        email: "",
        telefono: "",
        servicio: "",
        mensaje: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre es requerido";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El email es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Ingresa un email válido";
        }

        if (!formData.mensaje.trim()) {
            newErrors.mensaje = "El mensaje es requerido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setStatus("sending");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono,
                    servicio: servicios.find(s => s.value === formData.servicio)?.label || "",
                    mensaje: formData.mensaje,
                }),
            });

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    if (status === "success") {
        return (
            <section id="formulario" className="bg-background px-6 py-24">
                <div className="mx-auto max-w-2xl text-center">
                    <ScrollReveal>
                        <div className="mb-6 text-6xl">✉️</div>
                        <h2 className="mb-4 text-3xl font-bold text-foreground">
                            <span className="font-[family-name:var(--font-montserrat)]">
                                ¡Mensaje enviado!
                            </span>
                        </h2>
                        <p className="mb-8 text-lg text-muted">
                            Tu mensaje fue enviado correctamente. Me pondré en contacto
                            contigo en menos de 24 horas.
                        </p>
                        <button
                            onClick={() => {
                                setStatus("idle");
                                setFormData({
                                    nombre: "",
                                    email: "",
                                    telefono: "",
                                    servicio: "",
                                    mensaje: "",
                                });
                            }}
                            className="rounded-full bg-primary px-8 py-4 font-semibold text-gray-900 transition-all hover:bg-primary-dark"
                        >
                            Enviar otro mensaje
                        </button>
                    </ScrollReveal>
                </div>
            </section>
        );
    }

    return (
        <section id="formulario" className="bg-background px-6 py-24">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Info */}
                    <ScrollReveal>
                        <div>
                            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                                Contacto
                            </span>
                            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                                <span className="font-[family-name:var(--font-montserrat)]">
                                    Escribenos directamente
                                </span>
                            </h2>
                            <p className="mb-8 font-[family-name:var(--font-montserrat)] text-lg font-light leading-relaxed text-muted">
                                ¿Tienes preguntas? ¿No estás seguro/a de qué servicio es el
                                adecuado? Cuéntanos tu situación y te responderemos personalmente.
                            </p>

                            {/* Contact info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl">
                                        📧
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Email</p>
                                        <a
                                            href="mailto:coaching@aliciamorales.cl"
                                            className="text-muted hover:text-primary"
                                        >
                                            coaching@aliciamorales.cl
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl">
                                        📱
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Teléfono</p>
                                        <a
                                            href="https://wa.me/56977096530"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted hover:text-primary"
                                        >
                                            +56 9 7709 6530
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl">
                                        💼
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">LinkedIn</p>
                                        <a
                                            href="https://www.linkedin.com/in/alicia-morales-formacion-consultoria-coaching-habilidades-transversales-empleabilidad/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted hover:text-primary"
                                        >
                                            Alicia Morales Coach
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Form */}
                    <ScrollReveal delay={200}>
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl border border-border bg-surface p-8 shadow-lg"
                        >
                            <div className="space-y-6">
                                {/* Nombre */}
                                <div>
                                    <label
                                        htmlFor="nombre"
                                        className="mb-2 block text-sm font-medium text-foreground"
                                    >
                                        Nombre completo *
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.nombre ? "border-red-500" : "border-border"
                                            }`}
                                        placeholder="Tu nombre"
                                    />
                                    {errors.nombre && (
                                        <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-foreground"
                                    >
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full rounded-xl border bg-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.email ? "border-red-500" : "border-border"
                                            }`}
                                        placeholder="tu@email.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label
                                        htmlFor="telefono"
                                        className="mb-2 block text-sm font-medium text-foreground"
                                    >
                                        Teléfono (opcional)
                                    </label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="+56 9 1234 5678"
                                    />
                                </div>

                                {/* Servicio */}
                                <div>
                                    <label
                                        htmlFor="servicio"
                                        className="mb-2 block text-sm font-medium text-foreground"
                                    >
                                        ¿Qué servicio te interesa?
                                    </label>
                                    <select
                                        id="servicio"
                                        name="servicio"
                                        value={formData.servicio}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        {servicios.map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Mensaje */}
                                <div>
                                    <label
                                        htmlFor="mensaje"
                                        className="mb-2 block text-sm font-medium text-foreground"
                                    >
                                        Tu mensaje *
                                    </label>
                                    <textarea
                                        id="mensaje"
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        rows={4}
                                        className={`w-full resize-none rounded-xl border bg-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.mensaje ? "border-red-500" : "border-border"
                                            }`}
                                        placeholder="Cuéntanos brevemente qué te trae por aquí..."
                                    />
                                    {errors.mensaje && (
                                        <p className="mt-1 text-sm text-red-500">{errors.mensaje}</p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={status === "sending"}
                                    className="w-full rounded-full bg-primary py-4 font-semibold text-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {status === "sending" ? "Enviando..." : "Enviar Mensaje"}
                                </button>

                                {status === "error" && (
                                    <p className="text-center text-sm text-red-500">
                                        Hubo un error al enviar el mensaje. Intenta nuevamente.
                                    </p>
                                )}

                                <p className="text-center text-sm text-muted">
                                    * Campos requeridos. Respondo en menos de 24 horas.
                                </p>
                            </div>
                        </form>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
