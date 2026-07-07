import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.CERT_ADMIN_EMAIL;
  const password = process.env.CERT_ADMIN_PASSWORD;
  const nombre = process.env.CERT_ADMIN_NOMBRE || "Alicia Morales";

  if (!email || !password) {
    throw new Error(
      "Faltan variables de entorno: CERT_ADMIN_EMAIL y CERT_ADMIN_PASSWORD son obligatorias.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, nombre, activo: true },
    create: { email, passwordHash, nombre },
  });

  console.log(`Usuario admin creado/actualizado: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
