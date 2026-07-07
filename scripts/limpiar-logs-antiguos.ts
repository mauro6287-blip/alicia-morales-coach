import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DOCE_MESES_MS = 12 * 30 * 24 * 60 * 60 * 1000;

async function main() {
  const limite = new Date(Date.now() - DOCE_MESES_MS);

  const { count } = await prisma.verificacionLog.deleteMany({
    where: { verificadoEn: { lt: limite } },
  });

  console.log(`Eliminados ${count} registros`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
