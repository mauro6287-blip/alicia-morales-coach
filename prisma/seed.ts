import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "sesion-individual-60",
    title: "Sesión de coaching individual",
    description:
      "Sesión 1-a-1 de 60 minutos bajo el método CARA (Consciencia, Acción, Resultados, Acompañamiento). Espacio seguro para clarificar tu foco, identificar bloqueos y definir los próximos pasos concretos hacia tu objetivo.",
    priceClp: 55000,
    durationMin: 60,
    sortOrder: 1,
    active: true,
  },
  {
    slug: "sesion-extendida-90",
    title: "Sesión de coaching extendida",
    description:
      "Sesión profunda de 90 minutos para procesos que requieren más desarrollo: transiciones de carrera, decisiones estratégicas o trabajo sobre creencias limitantes. Incluye plan de acción personalizado.",
    priceClp: 78000,
    durationMin: 90,
    sortOrder: 2,
    active: true,
  },
  {
    slug: "pack-4-sesiones",
    title: "Pack 4 sesiones",
    description:
      "Proceso de coaching estructurado en 4 sesiones de 60 minutos. La continuidad permite avanzar con el método CARA desde la toma de consciencia hasta la consolidación de resultados medibles. Acompañamiento entre sesiones por email.",
    priceClp: 198000,
    durationMin: 60,
    sortOrder: 3,
    active: true,
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`✓ Seeded: ${p.slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
