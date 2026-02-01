const testimonios = [
    {
        nombre: "María García",
        rol: "Ejecutiva de Marketing",
        texto:
            "Trabajar con Alicia fue transformador. En 3 meses logré la claridad que buscaba hace años y finalmente di el salto profesional que tanto postergaba.",
        avatar: "MG",
    },
    {
        nombre: "Carlos Rodríguez",
        rol: "Emprendedor",
        texto:
            "El coaching me ayudó a superar el síndrome del impostor y lanzar mi negocio con confianza. Alicia tiene un don para hacer las preguntas correctas.",
        avatar: "CR",
    },
    {
        nombre: "Ana Martínez",
        rol: "Profesora Universitaria",
        texto:
            "Llegué agotada y sin dirección. Hoy tengo límites saludables, más energía y un plan claro para mi desarrollo. Eternamente agradecida.",
        avatar: "AM",
    },
];

export default function Resultados() {
    return (
        <section id="resultados" className="bg-background px-6 py-20">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
                        Testimonios
                    </span>
                    <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                        <span className="font-[family-name:var(--font-playfair)]">
                            Lo que dicen mis clientes
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted">
                        Historias reales de personas que decidieron invertir en su
                        crecimiento.
                    </p>
                </div>

                {/* Testimonials grid */}
                <div className="grid gap-8 md:grid-cols-3">
                    {testimonios.map((testimonio, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-border bg-surface p-8"
                        >
                            {/* Quote icon */}
                            <svg
                                className="mb-4 h-8 w-8 text-accent"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>

                            <p className="mb-6 leading-relaxed text-muted">
                                {testimonio.texto}
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                                    {testimonio.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">
                                        {testimonio.nombre}
                                    </p>
                                    <p className="text-sm text-muted">{testimonio.rol}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 gap-8 rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-8 text-white md:grid-cols-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold md:text-4xl">+100</p>
                        <p className="text-sm opacity-80">Clientes satisfechos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold md:text-4xl">5+</p>
                        <p className="text-sm opacity-80">Años de experiencia</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold md:text-4xl">98%</p>
                        <p className="text-sm opacity-80">Tasa de satisfacción</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold md:text-4xl">+500</p>
                        <p className="text-sm opacity-80">Sesiones realizadas</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
