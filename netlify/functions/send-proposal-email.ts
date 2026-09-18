import type { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "santixd06@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "ALZOVA SYSTEMS <onboarding@resend.dev>";

interface Body {
  to: string;
  clientName: string;
  projectLabel: string;
  total: number;
  pdfBase64: string;
  fileName: string;
  proposalNumber: string;
}

function clientEmailHtml(data: Omit<Body, "pdfBase64" | "fileName">): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);

  const firstName = data.clientName.split(" ")[0] || data.clientName;

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>Propuesta Comercial</title>
  <style>
    :root { color-scheme: light only; supported-color-schemes: light only; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    body { margin: 0; padding: 0; background-color: #0B0B0B; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0B0B0B; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <div style="display:none; font-size:1px; color:#0B0B0B; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
    Hola ${firstName}, aquí está tu propuesta comercial adjunta.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0B0B0B;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:600px; background-color:#0A1A2F; border-radius:16px; overflow:hidden; box-shadow: 0 20px 60px rgba(0,102,255,0.15);">

          <!-- HEADER -->
          <tr>
            <td align="center" bgcolor="#0066FF" style="background: linear-gradient(135deg, #0066FF 0%, #00C2FF 100%); padding: 40px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                      <tr>
                        <td width="56" height="56" align="center" valign="middle" style="background-color:#FFFFFF; border-radius:14px;">
                          <span style="font-family:'Segoe UI', Arial, sans-serif; font-size:32px; font-weight:900; color:#0066FF; line-height:56px; display:block;">A</span>
                        </td>
                      </tr>
                    </table>
                    <div style="color:#FFFFFF; font-size:22px; font-weight:800; letter-spacing:3px; line-height:1.2;">ALZOVA SYSTEMS</div>
                    <div style="color:rgba(255,255,255,0.9); font-size:12px; letter-spacing:2px; margin-top:6px;">TECNOLOGÍA QUE IMPULSA TU NEGOCIO</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MENSAJE -->
          <tr>
            <td align="center" style="padding: 40px 32px 24px;">
              <div style="color:#FFFFFF; font-size:26px; font-weight:800; line-height:1.3; margin-bottom:12px; font-family:'Segoe UI', Roboto, sans-serif;">
                Tu propuesta está lista 📄
              </div>
              <div style="color:#B8C0D0; font-size:16px; line-height:1.6; max-width:460px; font-family:'Segoe UI', Roboto, sans-serif;">
                Hola <strong style="color:#FFFFFF;">${firstName}</strong>, adjuntamos la propuesta comercial para tu proyecto. Revísala cuando puedas.
              </div>
            </td>
          </tr>

          <!-- RESUMEN -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0F2440; border:1px solid rgba(0,102,255,0.3); border-radius:14px;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="color:#00C2FF; font-size:10px; letter-spacing:3px; font-family:'Courier New', monospace; margin-bottom:14px; font-weight:700;">// RESUMEN</div>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 6px 0; color:#8B94A8; font-size:13px; width:140px; font-family:'Segoe UI', Roboto, sans-serif;">Propuesta</td>
                        <td style="padding: 6px 0; color:#FFFFFF; font-size:14px; font-weight:700; font-family:'Courier New', monospace;">${data.proposalNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color:#8B94A8; font-size:13px; font-family:'Segoe UI', Roboto, sans-serif;">Proyecto</td>
                        <td style="padding: 6px 0; color:#FFFFFF; font-size:14px; font-weight:600; font-family:'Segoe UI', Roboto, sans-serif;">${data.projectLabel}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color:#8B94A8; font-size:13px; font-family:'Segoe UI', Roboto, sans-serif;">Total estimado</td>
                        <td style="padding: 6px 0; color:#00C2FF; font-size:18px; font-weight:800; font-family:'Segoe UI', Roboto, sans-serif;">${fmt(data.total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- QUÉ SIGUE -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0F1C30; border-radius:12px; border-left:3px solid #0066FF;">
                <tr>
                  <td style="padding: 20px 22px;">
                    <div style="color:#FFFFFF; font-size:14px; font-weight:700; margin-bottom:12px; font-family:'Segoe UI', Roboto, sans-serif;">¿Qué sigue?</div>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr><td style="padding: 4px 0; color:#B8C0D0; font-size:14px; line-height:1.5; font-family:'Segoe UI', Roboto, sans-serif;">1. Revisa la propuesta adjunta</td></tr>
                      <tr><td style="padding: 4px 0; color:#B8C0D0; font-size:14px; line-height:1.5; font-family:'Segoe UI', Roboto, sans-serif;">2. Agenda una llamada si tienes dudas</td></tr>
                      <tr><td style="padding: 4px 0; color:#B8C0D0; font-size:14px; line-height:1.5; font-family:'Segoe UI', Roboto, sans-serif;">3. Coordinamos el inicio del proyecto</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 0 32px 40px;">
              <div style="color:#8B94A8; font-size:13px; margin-bottom:16px; font-family:'Segoe UI', Roboto, sans-serif;">¿Quieres hablar antes?</div>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="#25D366" style="background-color:#25D366; border-radius:12px;">
                    <a href="https://wa.me/573000000000" target="_blank" style="display:inline-block; padding:16px 32px; color:#FFFFFF; text-decoration:none; font-weight:700; font-size:14px; font-family:'Segoe UI', Roboto, sans-serif;">
                      💬 Responder por WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" bgcolor="#080D1A" style="padding: 28px 32px; background-color:#080D1A; border-top: 1px solid rgba(255,255,255,0.06);">
              <div style="color:#8B94A8; font-size:12px; line-height:1.6; text-align:center;">
                <div style="margin-bottom:12px;">
                  <a href="mailto:contacto@alzova.systems" style="color:#00C2FF; text-decoration:none;">contacto@alzova.systems</a>
                  <span style="color:#4A5568;"> · </span>
                  <a href="https://alzovasystem.netlify.app" style="color:#00C2FF; text-decoration:none;">alzovasystem.netlify.app</a>
                </div>
                <div style="color:#4A5568; font-size:10px;">
                  © ${new Date().getFullYear()} ALZOVA SYSTEMS
                </div>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body: Body = JSON.parse(event.body || "{}");

    if (!body.to || !body.pdfBase64 || !body.fileName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    // Enviar al cliente con el PDF adjunto
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [body.to],
      subject: `📄 Tu propuesta comercial — ${body.projectLabel}`,
      html: clientEmailHtml({
        to: body.to,
        clientName: body.clientName,
        projectLabel: body.projectLabel,
        total: body.total,
        proposalNumber: body.proposalNumber,
      }),
      attachments: [
        {
          filename: body.fileName,
          content: body.pdfBase64,
        },
      ],
      replyTo: ADMIN_EMAIL,
    });

    if (result.error) {
      console.error("Error sending proposal:", result.error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: result.error.message }),
      };
    }

    // Notificar al admin también
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `📤 Propuesta enviada a ${body.clientName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0A1A2F; color: #FFFFFF;">
          <h2 style="color: #00C2FF;">Propuesta enviada</h2>
          <p>Enviaste una propuesta a:</p>
          <ul style="line-height: 1.8;">
            <li><strong>Cliente:</strong> ${body.clientName}</li>
            <li><strong>Email:</strong> ${body.to}</li>
            <li><strong>Proyecto:</strong> ${body.projectLabel}</li>
            <li><strong>Total:</strong> $${body.total.toLocaleString("es-CO")} COP</li>
            <li><strong>Propuesta:</strong> ${body.proposalNumber}</li>
          </ul>
          <p style="color: #8B94A8; font-size: 12px; margin-top: 20px;">
            ${new Date().toLocaleString("es-CO")}
          </p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("Handler error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
    };
  }
};