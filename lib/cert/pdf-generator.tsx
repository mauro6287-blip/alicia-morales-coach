import path from "node:path";
import { readFileSync } from "node:fs";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import { generarQrDataUrl } from "./qr";

// Fuentes registradas desde los .woff locales de @fontsource (no CDN remoto:
// si Google Fonts cambiara de versión o no estuviera disponible en build/
// runtime, la emisión completa de certificados fallaría).
const FUENTES_DIR = path.join(process.cwd(), "node_modules", "@fontsource");

Font.register({
  family: "Montserrat",
  fonts: [
    { src: path.join(FUENTES_DIR, "montserrat/files/montserrat-latin-500-normal.woff"), fontWeight: 500 },
    { src: path.join(FUENTES_DIR, "montserrat/files/montserrat-latin-600-normal.woff"), fontWeight: 600 },
    { src: path.join(FUENTES_DIR, "montserrat/files/montserrat-latin-800-normal.woff"), fontWeight: 800 },
  ],
});

Font.register({
  family: "Roboto",
  fonts: [
    { src: path.join(FUENTES_DIR, "roboto/files/roboto-latin-400-normal.woff"), fontWeight: 400 },
  ],
});

// Sin esto, react-pdf parte las palabras largas con guion al final de línea
// ("Taller para Interlocutores de Co-/munidades"), que en un título de
// certificado se ve como un error de imprenta. Devolver la palabra intacta
// fuerza el salto de línea entre palabras completas.
Font.registerHyphenationCallback((palabra) => [palabra]);

// Se cargan como Buffer (no como ruta string) porque @react-pdf/image resuelve
// rutas locales con url.parse(), que en Windows interpreta la letra de unidad
// ("C:") como si fuera un protocolo remoto y termina intentando un fetch()
// que falla en silencio. Pasar el Buffer evita esa resolución por completo.
const LOGO_BUFFER = readFileSync(path.join(process.cwd(), "public", "logo.png"));
// La firma vive fuera de public/ a propósito: todo lo que está en public/ se
// sirve por HTTP, y una firma manuscrita descargable facilita falsificaciones.
// Aquí se lee del disco, así que no necesita ser accesible por la web.
const FIRMA_BUFFER = readFileSync(path.join(process.cwd(), "assets", "firma-alicia.png"));

// Respaldo: se imprime solo cuando el curso no tiene una frase de cierre
// propia. La frase por curso se edita desde /admin/certificados y queda
// copiada en cada certificado al emitirlo.
const PARRAFO_CIERRE_DEFECTO =
  "Participar de este proceso es también abrir camino. Hoy cuentas con nuevas herramientas para escuchar, orientar y acompañar a quienes comienzan a construir su propio desarrollo. Tú eres parte de este comienzo.";

// A4 horizontal, en puntos PDF.
const PAGINA_ANCHO = 841.89;

const BLANCO = "#FFFFFF";
const TEXTO = "#323232";
const TEXTO_SUAVE = "#4A4A4A";
const AMARILLO = "#FFDE56";
const GRIS = "#555555";

const styles = StyleSheet.create({
  page: {
    backgroundColor: BLANCO,
    fontFamily: "Roboto",
  },

  // Decoraciones: barras rectas superior e inferior, con un bloque de color
  // contrario en la esquina opuesta de cada una (ver referencia visual).
  barraSuperior: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGINA_ANCHO,
    height: 28,
    backgroundColor: AMARILLO,
  },
  bloqueSupIzq: {
    position: "absolute",
    top: 18,
    left: 0,
    width: 158,
    height: 21,
    backgroundColor: GRIS,
  },
  bloqueInfDer: {
    position: "absolute",
    bottom: 15.6,
    right: 0,
    width: 168,
    height: 21,
    backgroundColor: AMARILLO,
  },
  barraInferior: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: PAGINA_ANCHO,
    height: 21,
    backgroundColor: GRIS,
  },

  contenido: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 34,
    paddingBottom: 26,
    paddingHorizontal: 75,
  },
  logo: {
    width: 46.3,
    height: 48,
    objectFit: "contain",
  },
  subtitulo: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 18,
    color: TEXTO,
    textAlign: "center",
    marginTop: 8,
  },
  nombreCurso: {
    fontFamily: "Montserrat",
    fontWeight: 800,
    fontSize: 40,
    color: TEXTO,
    textAlign: "center",
    lineHeight: 1.12,
    marginTop: 14,
  },
  otorga: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 16,
    color: TEXTO,
    textAlign: "center",
    marginTop: 18,
  },
  nombreAlumno: {
    fontFamily: "Montserrat",
    fontWeight: 600,
    fontSize: 26,
    color: TEXTO,
    textAlign: "center",
    marginTop: 16,
  },
  lineaNombre: {
    borderTopWidth: 1,
    borderTopColor: TEXTO,
    width: 418,
    marginTop: 12,
  },
  parrafoCierre: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 14,
    color: TEXTO,
    textAlign: "center",
    lineHeight: 1.45,
    maxWidth: 630,
    marginTop: 12,
  },
  firmaImagen: {
    width: 104,
    height: 88.5,
    objectFit: "contain",
    marginTop: 8,
  },
  lineaFirma: {
    borderTopWidth: 1,
    borderTopColor: TEXTO,
    // Algo más ancha que la firma, para que sobresalga a ambos lados.
    width: 130,
    // La línea cruza al 52% del alto de la firma, así el cuerpo del trazo
    // queda montado sobre ella. Los trazos descendentes la cruzan, que es
    // justamente el aspecto de una firma puesta sobre su línea.
    marginTop: -42.5,
  },
  firmante: {
    fontFamily: "Montserrat",
    fontWeight: 500,
    fontSize: 13.5,
    color: TEXTO,
    textAlign: "center",
    // Baja hasta pasar el borde inferior de la imagen de la firma. Sin esto
    // los trazos descendentes caen encima del nombre y del resto del pie.
    // Es (1 - 0,52) x 88,5 + 6 de separación.
    marginTop: 48.5,
  },
  cargo: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 12,
    color: TEXTO,
    textAlign: "center",
    marginTop: 4,
  },
  escuela: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 12,
    color: TEXTO,
    textAlign: "center",
  },
  ciudadFecha: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 12,
    color: TEXTO,
    textAlign: "center",
    marginTop: 12,
  },

  qrBloque: {
    position: "absolute",
    bottom: 46,
    right: 34,
    alignItems: "center",
  },
  qrImagen: {
    width: 48,
    height: 48,
  },
  codigoTexto: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 6.5,
    color: TEXTO_SUAVE,
    marginTop: 2,
  },
});

const ESPACIOS_UNICODE_RAROS = /[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/g;
const CARACTERES_ANCHO_CERO = /[\u200B\u200C\u200D\uFEFF]/g;

/**
 * Normaliza texto proveniente de fuentes externas (Excel, Moodle) antes de
 * dibujarlo en el PDF: quita espacios Unicode "invisibles" y caracteres de
 * ancho cero que a veces se cuelan al copiar texto desde Word/PowerPoint y
 * que de otro modo se dibujan como glifos incorrectos o pegan palabras.
 */
function limpiarTextoPdf(texto: string): string {
  return texto
    .normalize("NFC")
    .replace(ESPACIOS_UNICODE_RAROS, " ")
    .replace(CARACTERES_ANCHO_CERO, "")
    .replace(/\s+/g, " ")
    .trim();
}

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/**
 * "Santiago, 27 de Agosto 2026". Se leen los componentes en UTC porque las
 * fechas llegan desde la BD como medianoche UTC; usar los getters locales
 * correría el día hacia atrás en zonas horarias al oeste de Greenwich.
 */
function formatearCiudadFecha(fecha: Date): string {
  const dia = fecha.getUTCDate();
  const mes = MESES[fecha.getUTCMonth()];
  const anio = fecha.getUTCFullYear();
  return `Santiago, ${dia} de ${mes} ${anio}`;
}

export type CertificadoPdfData = {
  nombre: string;
  rut: string;
  cursoNombre: string;
  horasCurso?: number | null;
  parrafoCierre?: string | null;
  fechaEmision: Date;
  fechaAprobacion?: Date | null;
  codigo: string;
  verificarUrl: string;
};

function CertificadoPDF({ data, qrDataUrl }: { data: CertificadoPdfData; qrDataUrl: string }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.barraSuperior} fixed />
        <View style={styles.bloqueSupIzq} fixed />
        <View style={styles.bloqueInfDer} fixed />
        <View style={styles.barraInferior} fixed />

        <View style={styles.contenido}>
          <Image style={styles.logo} src={LOGO_BUFFER} />
          <Text style={styles.subtitulo}>Certificado de participación</Text>
          <Text style={styles.nombreCurso}>{limpiarTextoPdf(data.cursoNombre)}</Text>

          <Text style={styles.otorga}>Se otorga el presente certificado a:</Text>
          <Text style={styles.nombreAlumno}>{limpiarTextoPdf(data.nombre)}</Text>
          <View style={styles.lineaNombre} />

          <Text style={styles.parrafoCierre}>
            {limpiarTextoPdf(data.parrafoCierre?.trim() || PARRAFO_CIERRE_DEFECTO)}
          </Text>

          <Image style={styles.firmaImagen} src={FIRMA_BUFFER} />
          <View style={styles.lineaFirma} />
          <Text style={styles.firmante}>Alicia Morales Bustamante</Text>
          <Text style={styles.cargo}>Coach</Text>
          <Text style={styles.escuela}>Escuela de Competencias Aplicadas</Text>

          <Text style={styles.ciudadFecha}>{formatearCiudadFecha(data.fechaAprobacion ?? data.fechaEmision)}</Text>
        </View>

        <View style={styles.qrBloque}>
          <Image style={styles.qrImagen} src={qrDataUrl} />
          <Text style={styles.codigoTexto}>{data.codigo}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generarCertificadoPdf(data: CertificadoPdfData): Promise<Buffer> {
  const qrDataUrl = await generarQrDataUrl(data.verificarUrl);
  return renderToBuffer(<CertificadoPDF data={data} qrDataUrl={qrDataUrl} />);
}
