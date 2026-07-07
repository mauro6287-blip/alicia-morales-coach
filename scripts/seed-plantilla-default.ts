import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plantilla = await prisma.plantillaCertificado.upsert({
    where: { nombre: "AMC Estándar" },
    update: { descripcion: "Plantilla oficial de certificación", activa: true },
    create: {
      nombre: "AMC Estándar",
      descripcion: "Plantilla oficial de certificación",
      version: 1,
      activa: true,
    },
  });

  console.log(`Plantilla creada/actualizada: ${plantilla.nombre}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
