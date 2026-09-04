import type { ReactNode } from "react";
import NavAdmin from "./NavAdmin";

// Menú común a todas las pantallas del panel. NavAdmin se oculta solo en el
// login, así que este layout puede envolver la sección completa.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavAdmin />
      {children}
    </>
  );
}
