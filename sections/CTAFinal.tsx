export default function CTAFinal() {
    return (
        <section
            id="contacto"
            className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary px-6 py-24 text-white"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 opacity-10">
                <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white" />
                <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white" />
            </div>

            <div className="mx-auto max-w-4xl text-center">
                {/* Urgency badge */}
                <span className="mb-6 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                    🔥 Solo 3 espacios disponibles este mes
                </span>

                <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
                    <span className="font-[family-name:var(--font-playfair)]">
                        Tu nueva vida está a una
                        <br />
                        conversación de distancia
                    </span>
                </h2>

                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed opacity-90">
                    Agenda una sesión de claridad <strong>100% gratuita</strong>. En 30
                    minutos tendrás más claridad que en meses de dar vueltas solo/a.
                </p>

                {/* Main CTA */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <a
                        href="mailto:hola@aliciamorales.com?subject=Quiero%20agendar%20mi%20sesión%20gratuita"
                        className="group rounded-full bg-white px-10 py-5 text-lg font-bold text-primary shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-accent-light hover:shadow-3xl"
                    >
                        Sí, Quiero Mi Sesión Gratuita
                        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </a>
                    <a
                        href="https://wa.me/56912345678?text=Hola%20Alicia,%20quiero%20agendar%20mi%20sesión%20gratuita"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-5 text-lg font-semibold transition-all duration-300 hover:border-white hover:bg-white/10"
                    >
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp Directo
                    </a>
                </div>

                {/* Trust elements */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm opacity-80">
                    <span>✓ Sin compromiso</span>
                    <span>✓ 100% confidencial</span>
                    <span>✓ Respuesta en 24h</span>
                </div>

                {/* Micro-copy */}
                <p className="mt-8 text-sm opacity-70">
                    ¿Prefieres email? Escríbeme a{" "}
                    <a
                        href="mailto:hola@aliciamorales.com"
                        className="underline hover:no-underline"
                    >
                        hola@aliciamorales.com
                    </a>
                </p>
            </div>
        </section>
    );
}
