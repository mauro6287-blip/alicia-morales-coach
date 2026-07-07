import { prisma } from "@/lib/prisma";
import type { Certificado } from "@prisma/client";

export async function buscarCertificado(codigo: string): Promise<Certificado | null> {
  return prisma.certificado.findUnique({ where: { codigo } });
}

export async function registrarVerificacion(
  certificadoId: string,
  ip: string | null,
  userAgent: string | null,
): Promise<void> {
  await prisma.verificacionLog.create({
    data: { certificadoId, ip, userAgent },
  });
}
