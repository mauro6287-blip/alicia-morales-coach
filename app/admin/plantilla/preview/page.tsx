import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vista previa de la plantilla",
  robots: { index: false, follow: false },
};

export default function PlantillaPreviewPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-primary">
            Vista previa de la plantilla
          </h1>
          <a
            href="/api/admin/plantilla/preview"
            download="certificado-preview.pdf"
            className="rounded bg-primary px-4 py-2 font-sans text-sm font-semibold text-background hover:bg-primary-dark"
          >
            Descargar PDF
          </a>
        </div>

        <div className="overflow-hidden rounded border border-border bg-surface">
          <iframe
            src="/api/admin/plantilla/preview"
            title="Vista previa del certificado"
            className="h-[80vh] w-full"
          />
        </div>
      </div>
    </div>
  );
}
