import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificar certificado — Escuela de Competencias Aplicadas",
  robots: { index: false, follow: false },
};

export default function VerificarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
