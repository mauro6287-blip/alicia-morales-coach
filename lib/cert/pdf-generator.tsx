import { Document, Page, Text, View, StyleSheet, Image, renderToBuffer } from "@react-pdf/renderer";
import { generarQrDataUrl } from "./qr";
import { formatearRut } from "./rut";

// NOTA: se usan las fuentes base del PDF (Helvetica) en vez de registrar
// Montserrat/Roboto vía Font.register con URLs remotas de Google Fonts, para
// no depender de un CDN externo al momento de generar el certificado (si la
// URL cambia de versión o no está disponible, la emisión completa fallaría).
// TODO: si se necesita fidelidad tipográfica total con la marca, registrar
// los .ttf de Montserrat/Roboto como assets locales del proyecto.

const GOLD = "#FFDE59";
const DARK = "#1A1A1A";
const WHITE = "#FFFFFF";

const styles = StyleSheet.create({
  page: {
    backgroundColor: DARK,
    padding: 24,
    fontFamily: "Helvetica",
  },
  marco: {
    flex: 1,
    borderWidth: 3,
    borderColor: GOLD,
    borderRadius: 8,
    padding: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  titulo: {
    fontFamily: "Helvetica-Bold",
    fontSize: 42,
    color: GOLD,
    textAlign: "center",
    letterSpacing: 2,
  },
  subtitulo: {
    fontFamily: "Helvetica",
    fontSize: 18,
    color: WHITE,
    textAlign: "center",
    marginTop: 4,
  },
  cuerpo: {
    marginTop: 28,
    textAlign: "center",
  },
  textoBlanco: {
    fontFamily: "Helvetica",
    fontSize: 13,
    color: WHITE,
    lineHeight: 1.6,
  },
  nombreAlumno: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    color: GOLD,
    marginTop: 10,
    marginBottom: 10,
  },
  nombreCurso: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    color: WHITE,
    marginTop: 10,
    marginBottom: 10,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 24,
  },
  firmaBloque: {
    textAlign: "center",
  },
  lineaFirma: {
    borderTopWidth: 1,
    borderTopColor: WHITE,
    width: 160,
    marginBottom: 6,
  },
  firmaTexto: {
    fontFamily: "Helvetica",
    fontSize: 11,
    color: WHITE,
  },
  qrBloque: {
    textAlign: "center",
  },
  qrImagen: {
    width: 90,
    height: 90,
  },
  codigoTexto: {
    fontFamily: "Courier",
    fontSize: 8,
    color: WHITE,
    marginTop: 4,
    letterSpacing: 1,
  },
  piePagina: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: WHITE,
    textAlign: "center",
    marginTop: 16,
  },
});

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function numeroEnPalabras(n: number): string {
  if (n === 0) return "cero";

  const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
  const especiales10a29 = [
    "diez", "once", "doce", "trece", "catorce", "quince",
    "dieciséis", "diecisiete", "dieciocho", "diecinueve",
    "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro",
    "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
  ];
  const decenas = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
  const centenas = [
    "", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos",
    "seiscientos", "setecientos", "ochocientos", "novecientos",
  ];

  function under100(v: number): string {
    if (v < 10) return unidades[v];
    if (v < 30) return especiales10a29[v - 10];
    const d = Math.floor(v / 10);
    const u = v % 10;
    return u === 0 ? decenas[d] : `${decenas[d]} y ${unidades[u]}`;
  }

  function under1000(v: number): string {
    if (v < 100) return under100(v);
    if (v === 100) return "cien";
    const c = Math.floor(v / 100);
    const resto = v % 100;
    return resto === 0 ? centenas[c] : `${centenas[c]} ${under100(resto)}`;
  }

  if (n < 1000) return under1000(n);

  const miles = Math.floor(n / 1000);
  const resto = n % 1000;
  const milesTexto = miles === 1 ? "mil" : `${under1000(miles)} mil`;
  return resto === 0 ? milesTexto : `${milesTexto} ${under1000(resto)}`;
}

export function fechaEnPalabras(fecha: Date): string {
  const dia = fecha.getUTCDate();
  const mes = MESES[fecha.getUTCMonth()];
  const anio = fecha.getUTCFullYear();
  return `${numeroEnPalabras(dia)} de ${mes} de ${numeroEnPalabras(anio)}`;
}

export type CertificadoPdfData = {
  nombre: string;
  rut: string;
  cursoNombre: string;
  horasCurso: number;
  fechaEmision: Date;
  fechaAprobacion: Date;
  codigo: string;
  verificarUrl: string;
};

function CertificadoPDF({ data, qrDataUrl }: { data: CertificadoPdfData; qrDataUrl: string }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.marco}>
          <View>
            <Text style={styles.titulo}>CERTIFICADO</Text>
            <Text style={styles.subtitulo}>de aprobación</Text>

            <View style={styles.cuerpo}>
              <Text style={styles.textoBlanco}>
                La Escuela de Competencias Aplicadas — Alicia Morales Coach SPA otorga el
                presente certificado a
              </Text>
              <Text style={styles.nombreAlumno}>{data.nombre}</Text>
              <Text style={styles.textoBlanco}>
                RUT: {formatearRut(data.rut)} por haber aprobado satisfactoriamente el curso
              </Text>
              <Text style={styles.nombreCurso}>{data.cursoNombre}</Text>
              <Text style={styles.textoBlanco}>
                con una duración de {data.horasCurso} horas, finalizado el{" "}
                {fechaEnPalabras(data.fechaAprobacion)}.
              </Text>
            </View>
          </View>

          <View>
            <View style={styles.footer}>
              <View style={styles.firmaBloque}>
                <View style={styles.lineaFirma} />
                <Text style={styles.firmaTexto}>Alicia Morales</Text>
                <Text style={styles.firmaTexto}>Directora</Text>
              </View>

              <View style={styles.qrBloque}>
                <Image style={styles.qrImagen} src={qrDataUrl} />
                <Text style={styles.codigoTexto}>{data.codigo}</Text>
              </View>
            </View>
            <Text style={styles.piePagina}>
              Verifique este certificado en aliciamoralescoach.com/verificar
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function generarCertificadoPdf(data: CertificadoPdfData): Promise<Buffer> {
  const qrDataUrl = await generarQrDataUrl(data.verificarUrl);
  return renderToBuffer(<CertificadoPDF data={data} qrDataUrl={qrDataUrl} />);
}
