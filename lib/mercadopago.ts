import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

let client: MercadoPagoConfig | null = null;

function getClient() {
  if (!client) {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      throw new Error("MP_ACCESS_TOKEN no está configurado");
    }
    client = new MercadoPagoConfig({
      accessToken: token,
      options: { timeout: 10000 },
    });
  }
  return client;
}

export function getPreferenceClient() {
  return new Preference(getClient());
}

export function getPaymentClient() {
  return new Payment(getClient());
}
