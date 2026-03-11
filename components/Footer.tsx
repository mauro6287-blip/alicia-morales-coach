import Image from "next/image";

const footerNavLinks = [
    { label: "Inicio", href: "#hero" },
    { label: "Soluciones", href: "#servicios" },
    { label: "Método", href: "#como-trabajo" },
    { label: "Quiénes Somos", href: "#sobre-mi" },
    { label: "Contacto", href: "#formulario" },
];

const contactInfo = {
    email: "coaching@aliciamorales.cl",
    phone: "+56 9 7709 6530",
    whatsappUrl: "https://wa.me/56977096530",
    linkedinUrl:
        "https://www.linkedin.com/in/alicia-morales-formacion-consultoria-coaching-habilidades-transversales-empleabilidad/",
    linkedinLabel: "Alicia Morales Coach",
    location: "Santiago, Chile",
};

const socialLinks = [
    {
        name: "LinkedIn",
        href: contactInfo.linkedinUrl,
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
        ),
    },
    {
        name: "Instagram",
        href: "https://instagram.com", // TODO: Replace with real Instagram URL
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
    },
];

const legalLinks = [
    { label: "Política de Privacidad", href: "#" },
    { label: "Términos de Servicio", href: "#" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface">
            {/* Gradient accent strip */}
            <div className="h-1 bg-gradient-to-r from-primary-dark via-primary to-accent" />

            {/* Main content */}
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-12 md:grid-cols-3">
                    {/* Column 1: Brand */}
                    <div className="space-y-6 text-center md:text-left">
                        <a
                            href="#hero"
                            className="inline-flex items-center gap-3 transition-colors hover:text-primary"
                        >
                            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-primary/20">
                                <Image
                                    src="/logo.png"
                                    alt="Escuela de Competencias Aplicadas"
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-[family-name:var(--font-montserrat)] text-lg font-light text-foreground">
                                Escuela de Competencias Aplicadas
                            </span>
                        </a>

                        <p className="mx-auto max-w-sm leading-relaxed text-muted md:mx-0">
                            Acompañamos a organizaciones en el desarrollo de habilidades
                            transversales para entornos de alta complejidad.
                        </p>

                        <a
                            href="#formulario"
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-gray-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg"
                        >
                            Conversemos
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </a>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="text-center md:text-left">
                        <h4 className="mb-6 font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-wider text-foreground">
                            Navegación
                        </h4>
                        <ul className="space-y-3">
                            {footerNavLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-muted transition-colors duration-200 hover:text-primary"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact + Social */}
                    <div className="text-center md:text-left">
                        <h4 className="mb-6 font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-wider text-foreground">
                            Contacto
                        </h4>
                        <ul className="space-y-4">
                            {/* Email */}
                            <li>
                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    className="inline-flex items-center gap-3 text-muted transition-colors duration-200 hover:text-primary"
                                >
                                    <svg
                                        className="h-5 w-5 flex-shrink-0 text-accent"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                        />
                                    </svg>
                                    <span>{contactInfo.email}</span>
                                </a>
                            </li>

                            {/* Phone / WhatsApp */}
                            <li>
                                <a
                                    href={contactInfo.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 text-muted transition-colors duration-200 hover:text-primary"
                                >
                                    <svg
                                        className="h-5 w-5 flex-shrink-0 text-accent"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                        />
                                    </svg>
                                    <span>{contactInfo.phone}</span>
                                </a>
                            </li>

                            {/* LinkedIn */}
                            <li>
                                <a
                                    href={contactInfo.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 text-muted transition-colors duration-200 hover:text-primary"
                                >
                                    <svg
                                        className="h-5 w-5 flex-shrink-0 text-accent"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                                        />
                                    </svg>
                                    <span>{contactInfo.linkedinLabel}</span>
                                </a>
                            </li>

                            {/* Location */}
                            <li className="inline-flex items-center gap-3 text-muted/60">
                                <svg
                                    className="h-5 w-5 flex-shrink-0 text-accent/50"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                    />
                                </svg>
                                <span>{contactInfo.location}</span>
                            </li>
                        </ul>

                        {/* Social Media Icons */}
                        <div className="mt-8 flex justify-center gap-3 md:justify-start">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
                    <p className="text-sm text-muted/60">
                        &copy; {currentYear} Escuela de Competencias Aplicadas. Todos los
                        derechos reservados.
                    </p>
                    <div className="flex gap-6 text-sm">
                        {legalLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-muted/60 transition-colors duration-200 hover:text-foreground"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
