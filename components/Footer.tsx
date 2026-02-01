const footerLinks = {
    navegacion: [
        { label: "Inicio", href: "#hero" },
        { label: "Servicios", href: "#servicios" },
        { label: "Proceso", href: "#como-trabajo" },
        { label: "Sobre Mí", href: "#sobre-mi" },
    ],
    legal: [
        { label: "Política de Privacidad", href: "#" },
        { label: "Términos de Servicio", href: "#" },
    ],
};

const socialLinks = [
    {
        name: "Instagram",
        href: "https://instagram.com",
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com",
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
        ),
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-foreground text-white/80">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-12 md:grid-cols-4">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h3 className="mb-4 text-xl font-bold text-white">
                            <span className="font-[family-name:var(--font-playfair)]">
                                Alicia Morales
                            </span>
                        </h3>
                        <p className="mb-6 max-w-sm leading-relaxed">
                            Coach Profesional certificada. Te acompaño en tu camino hacia una
                            vida con propósito, claridad y bienestar.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="mb-4 font-semibold text-white">Navegación</h4>
                        <ul className="space-y-3">
                            {footerLinks.navegacion.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="transition-colors hover:text-accent"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="mb-4 font-semibold text-white">Contacto</h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="mailto:hola@aliciamorales.com"
                                    className="transition-colors hover:text-accent"
                                >
                                    hola@aliciamorales.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/56912345678"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-colors hover:text-accent"
                                >
                                    +56 9 1234 5678
                                </a>
                            </li>
                            <li className="text-white/50">Santiago, Chile</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
                    <p className="text-sm text-white/50">
                        © {currentYear} Alicia Morales. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6 text-sm">
                        {footerLinks.legal.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-white/50 transition-colors hover:text-white"
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
