import {
  Hero,
  Problemas,
  PropuestaValor,
  Servicios,
  ComoTrabajo,
  ParaQuienEs,
  Resultados,
  SobreMi,
  Contacto,
  CTAFinal,
  Valores,
} from "@/sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <Problemas />
      <PropuestaValor />
      <Valores />
      <Servicios />
      <ComoTrabajo />
      <ParaQuienEs />
      <SobreMi />
      <Resultados />
      <Contacto />
      <CTAFinal />
    </main>
  );
}
