import type { Metadata } from "next";
import Link from "next/link";
import ServiciosTabs from "@/components/servicios/ServiciosTabs";

export const metadata: Metadata = {
  title: "Programa de Inserción Laboral",
  description:
    "Programa de Inserción Laboral para organismos educacionales: coaching laboral, talleres, seminarios, programas educativos y empleabilidad para docentes, orientado al desarrollo de competencias transversales en estudiantes y egresados.",
};

export default function ProgramaInsercionLaboralPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <nav className="mb-6 text-sm text-[#A1A1AA]">
          <Link href="/" className="hover:text-[#FFDE59]">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#A1A1AA]">Soluciones</span>
          <span className="mx-2">/</span>
          <span className="text-white">Programa de Inserción Laboral</span>
        </nav>

        <header className="mb-12 max-w-3xl">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
            ORGANISMOS EDUCACIONALES
          </span>
          <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold text-white md:text-5xl">
            Programa de <span className="text-[#FFDE59]">Inserción Laboral</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#A1A1AA]">
            Un conjunto de servicios diseñados para acompañar a estudiantes,
            egresados e instituciones en el desarrollo de las competencias
            transversales que el mundo laboral exige hoy. Explora cada modalidad
            y conversemos sobre la que mejor se ajuste a tu realidad.
          </p>
        </header>

        <ServiciosTabs />

        <div className="rounded-2xl border border-primary/30 bg-[#18181b] px-8 py-8 text-center">
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-gray-300">
            ¿No estás seguro de qué modalidad necesita tu organización o
            institución? Cuéntanos tu caso y diseñamos una propuesta a tu medida.
          </p>
          <a
            href="/#formulario"
            className="inline-block rounded-full bg-[#FFDE59] px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#F7B52A]"
          >
            Solicitar información
          </a>
        </div>
      </div>
    </div>
  );
}
