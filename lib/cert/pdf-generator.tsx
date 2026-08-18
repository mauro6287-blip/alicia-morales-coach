import path from "node:path";
import { readFileSync } from "node:fs";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import { generarQrDataUrl } from "./qr";
import { formatearRut } from "./rut";

// Fuentes registradas desde los .woff locales de @fontsource (no CDN remoto:
// si Google Fonts cambiara de versión o no estuviera disponible en build/
// runtime, la emisión completa de certificados fallaría).
const FUENTES_DIR = path.join(process.cwd(), "node_modules", "@fontsource");

Font.register({
  family: "Playfair Display",
  fonts: [
    { src: path.join(FUENTES_DIR, "playfair-display/files/playfair-display-latin-700-normal.woff"), fontWeight: 700 },
    { src: path.join(FUENTES_DIR, "playfair-display/files/playfair-display-latin-700-italic.woff"), fontWeight: 700, fontStyle: "italic" },
    { src: path.join(FUENTES_DIR, "playfair-display/files/playfair-display-latin-400-italic.woff"), fontWeight: 400, fontStyle: "italic" },
  ],
});

Font.register({
  family: "Montserrat",
  fonts: [
    { src: path.join(FUENTES_DIR, "montserrat/files/montserrat-latin-700-normal.woff"), fontWeight: 700 },
  ],
});

Font.register({
  family: "Roboto",
  fonts: [
    { src: path.join(FUENTES_DIR, "roboto/files/roboto-latin-400-normal.woff"), fontWeight: 400 },
  ],
});

// Se carga como Buffer (no como ruta string) porque @react-pdf/image resuelve
// rutas locales con url.parse(), que en Windows interpreta la letra de unidad
// ("C:") como si fuera un protocolo remoto y termina intentando un fetch()
// que falla en silencio. Pasar el Buffer evita esa resolución por completo.
const LOGO_BUFFER = readFileSync(path.join(process.cwd(), "public", "logo.png"));

const GOLD = "#F7B52A";
const DARK = "#1A1A1A";
const BG = "#F2F2F2";
const CARBON_DARK = "#3D3D3B";
const CARBON_LIGHT = "#5A5A56";
const RUT_GRIS = "#555555";

const styles = StyleSheet.create({
  page: {
    backgroundColor: BG,
    fontFamily: "Roboto",
  },
  contenido: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 34,
    paddingHorizontal: 90,
  },
  logo: {
    width: 70,
    height: 70,
    objectFit: "contain",
  },
  escuela: {
    fontFamily: "Montserrat",
    fontWeight: 700,
    fontSize: 14,
    color: DARK,
    textAlign: "center",
    marginTop: 10,
    letterSpacing: 0.5,
  },
  titulo: {
    fontFamily: "Playfair Display",
    fontWeight: 700,
    fontSize: 58,
    color: DARK,
    textAlign: "center",
    marginTop: 6,
  },
  subtitulo: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 15,
    color: DARK,
    textAlign: "center",
    marginTop: 4,
  },
  nombreAlumno: {
    fontFamily: "Playfair Display",
    fontWeight: 700,
    fontSize: 42,
    color: DARK,
    textAlign: "center",
    marginTop: 10,
  },
  rut: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 10,
    color: RUT_GRIS,
    textAlign: "center",
    marginTop: 6,
  },
  lineaLarga: {
    borderTopWidth: 1,
    borderTopColor: DARK,
    borderTopStyle: "dashed",
    width: "88%",
    marginTop: 16,
  },
  parrafo: {
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 14,
    color: DARK,
    textAlign: "center",
    marginTop: 16,
  },
  nombreCurso: {
    fontFamily: "Montserrat",
    fontWeight: 700,
    fontSize: 19,
    color: DARK,
    textAlign: "center",
    marginTop: 6,
  },
  espacioFlexible: {
    flexGrow: 1,
  },
  lineaCorta: {
    borderTopWidth: 1,
    borderTopColor: DARK,
    borderTopStyle: "dashed",
    width: 180,
    alignSelf: "center",
    marginBottom: 8,
  },
  firma: {
    fontFamily: "Playfair Display",
    fontWeight: 700,
    fontStyle: "italic",
    fontSize: 15,
    color: DARK,
    textAlign: "center",
  },
  qrBloque: {
    position: "absolute",
    bottom: 18,
    right: 26,
    alignItems: "center",
  },
  qrImagen: {
    width: 55,
    height: 55,
  },
  codigoTexto: {
    fontFamily: "Roboto",
    fontSize: 7,
    color: DARK,
    marginTop: 3,
    letterSpacing: 0.5,
  },
  piePagina: {
    fontFamily: "Roboto",
    fontSize: 6,
    color: RUT_GRIS,
    marginTop: 2,
  },
  esquinaSupIzq: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  esquinaInfDer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    transform: "rotate(180deg)",
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

export type CertificadoPdfData = {
  nombre: string;
  rut: string;
  cursoNombre: string;
  horasCurso?: number | null;
  fechaEmision: Date;
  fechaAprobacion?: Date | null;
  codigo: string;
  verificarUrl: string;
};

/**
 * Composición decorativa de esquina (gris carbón + acento dorado), diagonal.
 * Se dibuja una vez para la esquina superior izquierda y se reutiliza
 * rotada 180° para la esquina inferior derecha (ver estilo esquinaInfDer).
 */
function EsquinaDecorativa() {
  return (
    <Svg width={330} height={230} viewBox="0 0 430 300">
      <Defs>
        <LinearGradient id="carbonGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={CARBON_LIGHT} />
          <Stop offset="1" stopColor={CARBON_DARK} />
        </LinearGradient>
      </Defs>
      <Polygon points="0,0 430,0 120,300 0,210" fill="url(#carbonGrad)" />
      <Polygon points="0,0 300,0 150,150 30,70" fill={CARBON_LIGHT} />
      <Polygon points="0,150 355,0 400,0 40,300 0,300" fill={GOLD} />
    </Svg>
  );
}

function CertificadoPDF({ data, qrDataUrl }: { data: CertificadoPdfData; qrDataUrl: string }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.esquinaSupIzq} fixed>
          <EsquinaDecorativa />
        </View>
        <View style={styles.esquinaInfDer} fixed>
          <EsquinaDecorativa />
        </View>

        <View style={styles.contenido}>
          <Image style={styles.logo} src={LOGO_BUFFER} />
          <Text style={styles.escuela}>Escuela de Competencias Aplicadas</Text>
          <Text style={styles.titulo}>CERTIFICADO</Text>
          <Text style={styles.subtitulo}>de reconocimiento otorgado a:</Text>
          <Text style={styles.nombreAlumno}>{limpiarTextoPdf(data.nombre)}</Text>
          <Text style={styles.rut}>RUT {formatearRut(data.rut)}</Text>

          <View style={styles.lineaLarga} />

          <Text style={styles.parrafo}>Por su participación en el taller</Text>
          <Text style={styles.nombreCurso}>{limpiarTextoPdf(data.cursoNombre)}</Text>

          <View style={styles.espacioFlexible} />

          <View style={styles.lineaCorta} />
          <Text style={styles.firma}>Coach Alicia Morales Bustamante</Text>
        </View>

        <View style={styles.qrBloque} fixed>
          <Image style={styles.qrImagen} src={qrDataUrl} />
          <Text style={styles.codigoTexto}>{data.codigo}</Text>
          <Text style={styles.piePagina}>Verifique en aliciamoralescoach.com/verificar</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generarCertificadoPdf(data: CertificadoPdfData): Promise<Buffer> {
  const qrDataUrl = await generarQrDataUrl(data.verificarUrl);
  return renderToBuffer(<CertificadoPDF data={data} qrDataUrl={qrDataUrl} />);
}
