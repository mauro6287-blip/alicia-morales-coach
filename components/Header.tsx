"use client";

import { useState, useEffect } from "react";

const navLinks = [
    { label: "Inicio", href: "#hero" },
    { label: "Servicios", href: "#servicios" },
    { label: "Proceso", href: "#como-trabajo" },
    { label: "Sobre Mí", href: "#sobre-mi" },
    { label: "Contacto", href: "#contacto" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-surface/95 shadow-md backdrop-blur-md"
                : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <a
                    href="#hero"
                    className="flex items-center gap-3 text-xl font-bold text-foreground transition-colors hover:text-primary"
                >
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/20">
                        <img
                            src="/logo.png"
                            alt="Alicia Morales Logo"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <span className="font-[family-name:var(--font-playfair)]">
                        Alicia Morales
                    </span>
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-muted transition-colors hover:text-primary"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#contacto"
                        className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                    >
                        Agendar Sesión
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-elevated md:hidden"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`overflow-hidden transition-all duration-300 md:hidden ${isMobileMenuOpen ? "max-h-96" : "max-h-0"
                    }`}
            >
                <nav className="flex flex-col gap-2 bg-surface/95 px-6 pb-6 backdrop-blur-md">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="rounded-lg py-3 text-center font-medium text-muted transition-colors hover:bg-surface-elevated hover:text-primary"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#contacto"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="mt-2 rounded-full bg-primary py-3 text-center font-medium text-white transition-colors hover:bg-primary-dark"
                    >
                        Agendar Sesión
                    </a>
                </nav>
            </div>
        </header>
    );
}
