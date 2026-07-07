import QRCode from "qrcode";

export async function generarQrDataUrl(texto: string): Promise<string> {
  return QRCode.toDataURL(texto, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 400,
    color: { dark: "#1A1A1A", light: "#FFFFFF" },
  });
}
