-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('B2B', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "OrigenEnrolamiento" AS ENUM ('B2B', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "EstadoEnrolamiento" AS ENUM ('PENDIENTE', 'ENROLADO', 'ERROR');

-- CreateTable
CREATE TABLE "Curso" (
    "id" TEXT NOT NULL,
    "moodleCourseId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteB2B" (
    "id" TEXT NOT NULL,
    "nombreEmpresa" TEXT NOT NULL,
    "rut" TEXT,
    "contactoEmail" TEXT NOT NULL,
    "contactoNombre" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClienteB2B_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrolamiento" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "clienteB2BId" TEXT,
    "alumnoEmail" TEXT NOT NULL,
    "alumnoNombre" TEXT NOT NULL,
    "moodleUserId" INTEGER,
    "origen" "OrigenEnrolamiento" NOT NULL,
    "estado" "EstadoEnrolamiento" NOT NULL DEFAULT 'PENDIENTE',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrolamiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Curso_moodleCourseId_key" ON "Curso"("moodleCourseId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrolamiento_cursoId_alumnoEmail_key" ON "Enrolamiento"("cursoId", "alumnoEmail");

-- AddForeignKey
ALTER TABLE "Enrolamiento" ADD CONSTRAINT "Enrolamiento_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrolamiento" ADD CONSTRAINT "Enrolamiento_clienteB2BId_fkey" FOREIGN KEY ("clienteB2BId") REFERENCES "ClienteB2B"("id") ON DELETE SET NULL ON UPDATE CASCADE;
