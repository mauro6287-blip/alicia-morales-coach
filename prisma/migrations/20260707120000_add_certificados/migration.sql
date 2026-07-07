-- CreateEnum
CREATE TYPE "EstadoCertificado" AS ENUM ('VALIDO', 'ANULADO');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoLoginEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantillaCertificado" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantillaCertificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emision" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "plantillaId" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "cantidadTotal" INTEGER NOT NULL,
    "nombreArchivo" TEXT,
    "notas" TEXT,
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Emision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificado" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "emisionId" TEXT NOT NULL,
    "plantillaId" TEXT NOT NULL,
    "alumnoNombre" TEXT NOT NULL,
    "alumnoRut" TEXT NOT NULL,
    "alumnoEmail" TEXT NOT NULL,
    "cursoNombre" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,
    "fechaAprobacion" TIMESTAMP(3) NOT NULL,
    "horasCurso" INTEGER NOT NULL,
    "hashIntegridad" TEXT NOT NULL,
    "estado" "EstadoCertificado" NOT NULL DEFAULT 'VALIDO',
    "motivoAnulacion" TEXT,
    "anuladoEn" TIMESTAMP(3),
    "anuladoPorId" TEXT,
    "emailEnviadoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificacionLog" (
    "id" TEXT NOT NULL,
    "certificadoId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "verificadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificacionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PlantillaCertificado_nombre_key" ON "PlantillaCertificado"("nombre");

-- CreateIndex
CREATE INDEX "Emision_cursoId_idx" ON "Emision"("cursoId");

-- CreateIndex
CREATE INDEX "Emision_creadaEn_idx" ON "Emision"("creadaEn");

-- CreateIndex
CREATE UNIQUE INDEX "Certificado_codigo_key" ON "Certificado"("codigo");

-- CreateIndex
CREATE INDEX "Certificado_alumnoRut_idx" ON "Certificado"("alumnoRut");

-- CreateIndex
CREATE INDEX "Certificado_alumnoEmail_idx" ON "Certificado"("alumnoEmail");

-- CreateIndex
CREATE INDEX "Certificado_estado_idx" ON "Certificado"("estado");

-- CreateIndex
CREATE INDEX "Certificado_emisionId_idx" ON "Certificado"("emisionId");

-- CreateIndex
CREATE INDEX "VerificacionLog_certificadoId_idx" ON "VerificacionLog"("certificadoId");

-- CreateIndex
CREATE INDEX "VerificacionLog_verificadoEn_idx" ON "VerificacionLog"("verificadoEn");

-- AddForeignKey
ALTER TABLE "Emision" ADD CONSTRAINT "Emision_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emision" ADD CONSTRAINT "Emision_plantillaId_fkey" FOREIGN KEY ("plantillaId") REFERENCES "PlantillaCertificado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emision" ADD CONSTRAINT "Emision_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_emisionId_fkey" FOREIGN KEY ("emisionId") REFERENCES "Emision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_plantillaId_fkey" FOREIGN KEY ("plantillaId") REFERENCES "PlantillaCertificado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificacionLog" ADD CONSTRAINT "VerificacionLog_certificadoId_fkey" FOREIGN KEY ("certificadoId") REFERENCES "Certificado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
