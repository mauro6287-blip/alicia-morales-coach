"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CartButton from "./cart/CartButton";

type NavLeaf = { label: string; href: string };
type NavBranch = { label: string; children: NavLeaf[] };
type NavChild = NavLeaf | NavBranch;
type NavGroup = { label: string; children: NavChild[] };
type NavLink = NavLeaf | NavGroup;

const navLinks: NavLink[] = [
    { label: "Inicio", href: "/#hero" },
    {
        label: "Soluciones",
        children: [
            { label: "Empresas y Corporativos", href: "/#soluciones" },
            {
                label: "Organismos Educacionales",
                children: [
                    { label: "Programa de Inserción Laboral", href: "/programa-de-insercion-laboral" },
                ],
            },
            {
                label: "Organismos Públicos, Empresas y Sindicatos",
                href: "/#soluciones",
            },
        ],
    },
    { label: "Método", href: "/#como-trabajo" },
    { label: "Tienda", href: "/tienda" },
    { label: "Quiénes Somos", href: "/#sobre-mi" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
    const [expandedMobileSub, setExpandedMobileSub] = useState<string | null>(null);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setExpandedMobile(null);
        setExpandedMobileSub(null);
    };

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
                ? "bg-[#18181B]/95 shadow-md backdrop-blur-md"
                : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
                {/* Logo */}
                <a
                    href="#hero"
                    className="flex flex-shrink-0 items-center gap-2 text-lg font-light text-white transition-colors hover:text-[#FFDE59] md:gap-3 md:text-xl"
                >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#FFDE59]/20 md:h-10 md:w-10">
                        <Image
                            src="/logo.png"
                            alt="Alicia Morales Logo"
                            fill
                            sizes="40px"
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="hidden flex-col font-[family-name:var(--font-montserrat)] md:flex">
                        <span>Escuela de Competencias Aplicadas</span>
                        <span className="text-sm font-light italic text-white/60">Alicia Morales Coach.</span>
                    </div>
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) =>
                        "children" in link ? (
                            <div key={link.label} className="group relative">
                                <button
                                    type="button"
                                    className="flex items-center gap-1 text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#FFDE59]"
                                    aria-haspopup="true"
                                >
                                    {link.label}
                                    <svg
                                        className="h-3 w-3 transition-transform group-hover:rotate-180"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                                    <div className="min-w-[260px] rounded-xl border border-white/5 bg-[#18181B] py-2 shadow-xl shadow-black/40">
                                        {link.children.map((child) =>
                                            "children" in child ? (
                                                <div
                                                    key={child.label}
                                                    className="group/sub relative"
                                                >
                                                    <div className="flex cursor-default items-center justify-between gap-2 px-4 py-2.5 text-sm text-[#A1A1AA] transition-colors hover:bg-[#27272A] hover:text-[#FFDE59]">
                                                        <span>{child.label}</span>
                                                        <svg
                                                            className="h-3 w-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="invisible absolute left-full top-0 z-20 -mt-2 pl-2 opacity-0 transition-all duration-150 group-hover/sub:visible group-hover/sub:opacity-100">
                                                        <div className="min-w-[260px] rounded-xl border border-white/5 bg-[#18181B] py-2 shadow-xl shadow-black/40">
                                                            {child.children.map((leaf) => (
                                                                <Link
                                                                    key={leaf.label}
                                                                    href={leaf.href}
                                                                    className="block px-4 py-2.5 text-sm text-[#A1A1AA] transition-colors hover:bg-[#27272A] hover:text-[#FFDE59]"
                                                                >
                                                                    {leaf.label}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Link
                                                    key={child.label}
                                                    href={child.href}
                                                    className="block px-4 py-2.5 text-sm text-[#A1A1AA] transition-colors hover:bg-[#27272A] hover:text-[#FFDE59]"
                                                >
                                                    {child.label}
                                                </Link>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#FFDE59]"
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                    <a
                        href="/#formulario"
                        className="rounded-full bg-[#FFDE59] px-5 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-[#F7B52A]"
                    >
                        Contacto
                    </a>
                    <CartButton />
                </nav>

                {/* Mobile Cart + Menu */}
                <div className="flex items-center gap-2 md:hidden">
                <CartButton />
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-[#27272A]"
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
            </div>

            {/* Mobile Navigation */}
            <div
                className={`overflow-hidden transition-all duration-300 md:hidden ${isMobileMenuOpen ? "max-h-[720px]" : "max-h-0"
                    }`}
            >
                <nav className="flex flex-col items-start gap-2 bg-[#18181B]/95 px-6 pb-6 backdrop-blur-md">
                    {navLinks.map((link) =>
                        "children" in link ? (
                            <div key={link.label} className="w-full">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpandedMobile(
                                            expandedMobile === link.label ? null : link.label
                                        )
                                    }
                                    className="flex w-full items-center justify-between rounded-lg py-3 text-left font-medium text-[#A1A1AA] transition-colors hover:bg-[#27272A] hover:text-[#FFDE59]"
                                    aria-expanded={expandedMobile === link.label}
                                >
                                    <span>{link.label}</span>
                                    <svg
                                        className={`h-4 w-4 transition-transform ${expandedMobile === link.label ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                {expandedMobile === link.label && (
                                    <div className="flex flex-col pl-3">
                                        {link.children.map((child) =>
                                            "children" in child ? (
                                                <div key={child.label} className="w-full">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setExpandedMobileSub(
                                                                expandedMobileSub === child.label
                                                                    ? null
                                                                    : child.label
                                                            )
                                                        }
                                                        className="flex w-full items-center justify-between rounded-lg py-2.5 text-left text-sm text-[#A1A1AA] transition-colors hover:text-[#FFDE59]"
                                                        aria-expanded={expandedMobileSub === child.label}
                                                    >
                                                        <span>{child.label}</span>
                                                        <svg
                                                            className={`h-4 w-4 transition-transform ${expandedMobileSub === child.label ? "rotate-180" : ""}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </button>
                                                    {expandedMobileSub === child.label && (
                                                        <div className="flex flex-col pl-3">
                                                            {child.children.map((leaf) => (
                                                                <Link
                                                                    key={leaf.label}
                                                                    href={leaf.href}
                                                                    onClick={closeMobileMenu}
                                                                    className="w-full rounded-lg py-2 text-left text-sm text-[#A1A1AA] transition-colors hover:text-[#FFDE59]"
                                                                >
                                                                    {leaf.label}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Link
                                                    key={child.label}
                                                    href={child.href}
                                                    onClick={closeMobileMenu}
                                                    className="w-full rounded-lg py-2.5 text-left text-sm text-[#A1A1AA] transition-colors hover:text-[#FFDE59]"
                                                >
                                                    {child.label}
                                                </Link>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMobileMenu}
                                className="w-full rounded-lg py-3 text-left font-medium text-[#A1A1AA] transition-colors hover:bg-[#27272A] hover:text-[#FFDE59]"
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                    <a
                        href="/#formulario"
                        onClick={closeMobileMenu}
                        className="mt-2 w-full rounded-full bg-[#FFDE59] py-3 text-center font-medium text-gray-900 transition-colors hover:bg-[#F7B52A]"
                    >
                        Contacto
                    </a>
                </nav>
            </div>
        </header>
    );
}
