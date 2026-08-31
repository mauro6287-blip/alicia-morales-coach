-- AlterTable: un taller presencial no existe en Moodle, así que moodleCourseId
-- pasa a ser opcional. Postgres permite múltiples NULL bajo un índice único,
-- por lo que la unicidad de los cursos que sí vienen de Moodle se mantiene.
ALTER TABLE "Curso" ALTER COLUMN "moodleCourseId" DROP NOT NULL,
ALTER COLUMN "modalidad" SET DEFAULT 'B2B';

-- AlterTable: frase de cierre propia del curso.
ALTER TABLE "Curso" ADD COLUMN "parrafoCierre" TEXT;

-- AlterTable: copia de la frase al momento de emitir, para que editar el curso
-- no altere los certificados ya emitidos.
ALTER TABLE "Certificado" ADD COLUMN "parrafoCierre" TEXT;
