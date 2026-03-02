import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { nombre, email, telefono, servicio, mensaje } = await request.json();

        // Validación server-side
        if (!nombre || !email || !mensaje) {
            return NextResponse.json(
                { error: "Nombre, email y mensaje son requeridos." },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "El email no es válido." },
                { status: 400 }
            );
        }

        await resend.emails.send({
            from: "Formulario Web <onboarding@resend.dev>",
            to: "coaching@aliciamorales.cl",
            replyTo: email,
            subject: `Nuevo contacto: ${nombre}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #B45309; border-bottom: 2px solid #F59E0B; padding-bottom: 10px;">
                        Nuevo mensaje desde el sitio web
                    </h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 12px; font-weight: bold; color: #555; width: 140px; vertical-align: top;">Nombre:</td>
                            <td style="padding: 12px; color: #333;">${nombre}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 12px; font-weight: bold; color: #555; vertical-align: top;">Email:</td>
                            <td style="padding: 12px; color: #333;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: bold; color: #555; vertical-align: top;">Teléfono:</td>
                            <td style="padding: 12px; color: #333;">${telefono || "No proporcionado"}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 12px; font-weight: bold; color: #555; vertical-align: top;">Servicio:</td>
                            <td style="padding: 12px; color: #333;">${servicio || "No seleccionado"}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: bold; color: #555; vertical-align: top;">Mensaje:</td>
                            <td style="padding: 12px; color: #333; white-space: pre-wrap;">${mensaje}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        Este mensaje fue enviado desde el formulario de contacto de aliciamoralescoach.com
                    </p>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Error al enviar el mensaje. Intenta nuevamente." },
            { status: 500 }
        );
    }
}
