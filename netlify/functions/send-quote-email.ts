import type { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "santixd06@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "ALZOVA SYSTEMS <onboarding@resend.dev>";

interface QuoteBody {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectTypeLabel: string;
  basePrice: number;
  modules: Array<{ label: string; price: number }>;
  modulesPrice: number;
  extras: Array<{ label: string; price: number }>;
  extrasPrice: number;
  total: number;
}

/* ══════════════════════════════════════════════════════════
   HELPERS DE DISEÑO
   ══════════════════════════════════════════════════════════ */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function emailShell(preheader: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>ALZOVA SYSTEMS</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root { color-scheme: light only; supported-color-schemes: light only; }
    [data-ogsc] .dark-fix { color: inherit !important; }
    [data-ogsb] .dark-fix { color: inherit !important; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #0A1A2F; }
    a { color: #0066FF; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .px-32 { padding-left: 20px !important; padding-right: 20px !important; }
      .text-xl { font-size: 20px !important; }
      .text-3xl { font-size: 26px !important; }
      .stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0B0B0B; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Preheader (texto invisible que se ve en la vista previa) -->
  <div style="display:none; font-size:1px; color:#0B0B0B; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
    ${preheader}
  </div>

  <!-- Wrapper de fondo -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0A1A2F; min-height:100vh;">
    <tr>
      <td align="center" style="padding: 24px 12px;">

        <!-- Contenedor principal (600px) -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px; max-width:600px; background-color:#0A1A2F; border-radius:16px; overflow:hidden; border:1px solid rgba(0,194,255,0.25); box-shadow: 0 20px 60px rgba(0,102,255,0.25);">

          <!-- ══════════ HEADER ══════════ -->
          <tr>
            <td align="center" bgcolor="#0066FF" style="background: linear-gradient(135deg, #0066FF 0%, #00C2FF 100%); padding: 40px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <!-- Logo "A" -->
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

          ${content}

          <!-- ══════════ FOOTER ══════════ -->
          <tr>
            <td align="center" bgcolor="#080D1A" style="padding: 28px 32px; background-color:#080D1A; border-top: 1px solid rgba(255,255,255,0.06);">
              <div style="color:#8B94A8; font-size:12px; line-height:1.6; text-align:center;">
                <div style="margin-bottom:8px; font-weight:700; color:#FFFFFF; letter-spacing:2px; font-size:11px;">ALZOVA SYSTEMS</div>
                <div style="margin-bottom:12px;">Software a la medida · Soporte técnico · Automatización</div>
                <div>
                  <a href="mailto:contacto@alzova.systems" style="color:#00C2FF; text-decoration:none; margin: 0 10px;">contacto@alzova.systems</a>
                  <span style="color:#4A5568;">·</span>
                  <a href="https://alzovasystem.netlify.app" style="color:#00C2FF; text-decoration:none; margin: 0 10px;">alzovasystem.netlify.app</a>
                </div>
                <div style="margin-top:16px; color:#4A5568; font-size:10px;">
                  © ${new Date().getFullYear()} ALZOVA SYSTEMS · Todos los derechos reservados
                </div>
              </div>
            </td>
          </tr>

        </table>
        <!-- /Contenedor -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ══════════════════════════════════════════════════════════
   EMAIL AL CLIENTE (confirmación)
   ══════════════════════════════════════════════════════════ */
function clientEmailHtml(data: QuoteBody): string {
  const firstName = data.name.split(" ")[0] || data.name;
  const modulesCount = data.modules.length;
  const extrasCount = data.extras.length;

  const itemsSummary = [
    modulesCount > 0 ? `${modulesCount} módulo${modulesCount !== 1 ? "s" : ""}` : "",
    extrasCount > 0 ? `${extrasCount} extra${extrasCount !== 1 ? "s" : ""}` : "",
  ].filter(Boolean).join(" · ");

  const content = `
    <!-- ══════════ MENSAJE PRINCIPAL ══════════ -->
    <tr>
      <td align="center" class="px-32" style="padding: 48px 32px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="72" height="72" align="center" valign="middle" bgcolor="#0F2E1F" style="background-color:#0F2E1F; border-radius:50%;">
                    <span style="font-size:36px; line-height:72px; display:block;">✅</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center">
              <div style="color:#FFFFFF; font-size:28px; font-weight:800; line-height:1.25; letter-spacing:-0.5px; font-family:'Segoe UI', Roboto, sans-serif;" class="text-3xl">
                ¡Recibimos tu cotización!
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:16px;">
              <div style="color:#B8C0D0; font-size:16px; line-height:1.6; max-width:460px; font-family:'Segoe UI', Roboto, sans-serif;">
                Hola <strong style="color:#FFFFFF;">${firstName}</strong>, gracias por confiar en nosotros.
                Un asesor de ALZOVA SYSTEMS te contactará en <strong style="color:#00C2FF;">menos de 24 horas</strong>.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ══════════ RESUMEN ══════════ -->
    <tr>
      <td class="px-32" style="padding: 8px 32px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0F2440; border:1px solid rgba(0,102,255,0.3); border-radius:14px;">
          <tr>
            <td style="padding: 24px 24px 20px;">
              <div style="color:#00C2FF; font-size:10px; letter-spacing:3px; font-family:'Courier New', monospace; margin-bottom:14px; font-weight:700;">// RESUMEN DE TU SOLICITUD</div>
              <div style="color:#FFFFFF; font-size:18px; font-weight:700; margin-bottom:6px; font-family:'Segoe UI', Roboto, sans-serif;">${data.projectTypeLabel}</div>
              ${itemsSummary ? `<div style="color:#8B94A8; font-size:14px; margin-bottom:20px; font-family:'Segoe UI', Roboto, sans-serif;">${itemsSummary}</div>` : `<div style="margin-bottom:20px;"></div>`}
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td style="padding-top:20px;">
                    <div style="color:#8B94A8; font-size:10px; letter-spacing:2px; font-family:'Courier New', monospace; margin-bottom:6px; font-weight:700;">TOTAL ESTIMADO</div>
                    <div style="color:#00C2FF; font-size:32px; font-weight:800; line-height:1; font-family:'Segoe UI', Roboto, sans-serif;">${fmt(data.total)}</div>
                    <div style="color:#4A5568; font-size:11px; margin-top:8px; font-family:'Segoe UI', Roboto, sans-serif;">Precio orientativo sujeto a validación técnica</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ══════════ QUÉ SIGUE ══════════ -->
    <tr>
      <td class="px-32" style="padding: 0 32px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0F1C30; border-radius:12px; border-left:3px solid #0066FF;">
          <tr>
            <td style="padding: 20px 22px;">
              <div style="color:#FFFFFF; font-size:14px; font-weight:700; margin-bottom:12px; font-family:'Segoe UI', Roboto, sans-serif;">¿Qué sigue?</div>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr><td style="padding: 4px 0; color:#B8C0D0; font-size:14px; line-height:1.5; font-family:'Segoe UI', Roboto, sans-serif;">1. Revisaremos tu solicitud en detalle</td></tr>
                <tr><td style="padding: 4px 0; color:#B8C0D0; font-size:14px; line-height:1.5; font-family:'Segoe UI', Roboto, sans-serif;">2. Te contactamos por WhatsApp o email</td></tr>
                <tr><td style="padding: 4px 0; color:#B8C0D0; font-size:14px; line-height:1.5; font-family:'Segoe UI', Roboto, sans-serif;">3. Agendamos una reunión de descubrimiento</td></tr>
                <tr><td style="padding: 4px 0; color:#B8C0D0; font-size:14px; line-height:1.5; font-family:'Segoe UI', Roboto, sans-serif;">4. Recibirás una propuesta formal</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ══════════ CTA WHATSAPP ══════════ -->
    <tr>
      <td align="center" class="px-32" style="padding: 0 32px 40px;">
        <div style="color:#8B94A8; font-size:13px; margin-bottom:16px; font-family:'Segoe UI', Roboto, sans-serif;">¿Necesitas hablar antes?</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" bgcolor="#25D366" style="background-color:#25D366; border-radius:12px; box-shadow: 0 10px 30px rgba(37,211,102,0.35);">
              <a href="https://wa.me/573000000000" target="_blank" style="display:inline-block; padding:16px 32px; color:#FFFFFF; text-decoration:none; font-weight:700; font-size:14px; letter-spacing:0.5px; font-family:'Segoe UI', Roboto, sans-serif;">
                💬 Hablar por WhatsApp
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return emailShell(
    `Hola ${firstName}, recibimos tu cotización. Un asesor te contactará pronto.`,
    content
  );
}

/* ══════════════════════════════════════════════════════════
   EMAIL AL ADMIN (notificación)
   ══════════════════════════════════════════════════════════ */
function adminEmailHtml(data: QuoteBody): string {
  const modulesRows = data.modules
    .map(
      (m) => `<tr>
        <td style="padding: 10px 0; color:#B8C0D0; font-size:14px; font-family:'Segoe UI', Roboto, sans-serif; border-bottom:1px solid rgba(255,255,255,0.05);">${m.label}</td>
        <td style="padding: 10px 0; color:#00C2FF; font-family:'Courier New', monospace; text-align:right; font-size:14px; border-bottom:1px solid rgba(255,255,255,0.05);">+${fmt(m.price)}</td>
      </tr>`
    )
    .join("");

  const extrasRows = data.extras
    .map(
      (e) => `<tr>
        <td style="padding: 10px 0; color:#B8C0D0; font-size:14px; font-family:'Segoe UI', Roboto, sans-serif; border-bottom:1px solid rgba(255,255,255,0.05);">${e.label}</td>
        <td style="padding: 10px 0; color:#00C2FF; font-family:'Courier New', monospace; text-align:right; font-size:14px; border-bottom:1px solid rgba(255,255,255,0.05);">+${fmt(e.price)}</td>
      </tr>`
    )
    .join("");

  const contactRows = [
    { label: "Nombre", value: data.name, link: null },
    { label: "Email", value: data.email, link: `mailto:${data.email}` },
    { label: "Teléfono", value: data.phone, link: `tel:${data.phone}` },
    ...(data.company ? [{ label: "Empresa", value: data.company, link: null }] : []),
  ]
    .map(
      (r) => `<tr>
        <td style="padding: 10px 0; color:#8B94A8; font-size:13px; width:100px; font-family:'Segoe UI', Roboto, sans-serif;">${r.label}</td>
        <td style="padding: 10px 0; font-family:'Segoe UI', Roboto, sans-serif;">
          ${r.link ? `<a href="${r.link}" style="color:#0066FF; text-decoration:none; font-size:14px;">${r.value}</a>` : `<span style="color:#FFFFFF; font-size:14px; font-weight:600;">${r.value}</span>`}
        </td>
      </tr>`
    )
    .join("");

  const content = `
    <!-- Badge -->
    <tr>
      <td align="center" class="px-32" style="padding: 32px 32px 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" bgcolor="#0F2E1F" style="background-color:#0F2E1F; border:1px solid #22C55E; border-radius:999px; padding: 8px 18px;">
              <span style="color:#22C55E; font-size:11px; font-weight:800; letter-spacing:2px; font-family:'Courier New', monospace;">🔔 LEAD NUEVO</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Contacto -->
    <tr>
      <td class="px-32" style="padding: 24px 32px 0;">
        <div style="color:#00C2FF; font-size:10px; letter-spacing:3px; font-family:'Courier New', monospace; margin-bottom:14px; font-weight:700;">// DATOS DE CONTACTO</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${contactRows}
        </table>
      </td>
    </tr>

    <!-- Proyecto -->
    <tr>
      <td class="px-32" style="padding: 28px 32px 0;">
        <div style="color:#00C2FF; font-size:10px; letter-spacing:3px; font-family:'Courier New', monospace; margin-bottom:14px; font-weight:700;">// PROYECTO SOLICITADO</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0F2440; border:1px solid rgba(0,102,255,0.3); border-radius:12px;">
          <tr>
            <td style="padding: 18px 20px;">
              <div style="color:#FFFFFF; font-size:16px; font-weight:700; margin-bottom:6px; font-family:'Segoe UI', Roboto, sans-serif;">${data.projectTypeLabel}</div>
              <div style="color:#00C2FF; font-family:'Courier New', monospace; font-size:14px;">${fmt(data.basePrice)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${data.modules.length > 0 ? `
    <tr>
      <td class="px-32" style="padding: 24px 32px 0;">
        <div style="color:#00C2FF; font-size:10px; letter-spacing:3px; font-family:'Courier New', monospace; margin-bottom:10px; font-weight:700;">// MÓDULOS (${data.modules.length})</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${modulesRows}</table>
      </td>
    </tr>` : ""}

    ${data.extras.length > 0 ? `
    <tr>
      <td class="px-32" style="padding: 24px 32px 0;">
        <div style="color:#00C2FF; font-size:10px; letter-spacing:3px; font-family:'Courier New', monospace; margin-bottom:10px; font-weight:700;">// EXTRAS (${data.extras.length})</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${extrasRows}</table>
      </td>
    </tr>` : ""}

    <!-- Total -->
    <tr>
      <td class="px-32" style="padding: 28px 32px 40px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0F2440; border:1px solid rgba(0,194,255,0.4); border-radius:12px;">
          <tr>
            <td align="center" style="padding: 24px;">
              <div style="color:#8B94A8; font-size:10px; letter-spacing:3px; font-family:'Courier New', monospace; margin-bottom:8px; font-weight:700;">// TOTAL ESTIMADO</div>
              <div style="color:#FFFFFF; font-size:36px; font-weight:800; line-height:1; font-family:'Segoe UI', Roboto, sans-serif;">${fmt(data.total)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return emailShell(
    `Nuevo lead: ${data.name} — ${fmt(data.total)}`,
    content
  );
}

/* ══════════════════════════════════════════════════════════
   HANDLER
   ══════════════════════════════════════════════════════════ */
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
    const data: QuoteBody = JSON.parse(event.body || "{}");

    if (!data.name || !data.email || !data.phone || !data.total) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    const [adminResult, clientResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `🔔 Nueva cotización — ${data.name} (${fmt(data.total)})`,
        html: adminEmailHtml(data),
        replyTo: data.email,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [data.email],
        subject: "✅ Recibimos tu cotización — ALZOVA SYSTEMS",
        html: clientEmailHtml(data),
      }),
    ]);

    const adminOk = adminResult.status === "fulfilled" && !adminResult.value.error;
    const clientOk = clientResult.status === "fulfilled" && !clientResult.value.error;

    if (!adminOk) console.error("Error admin email:", adminResult);
    if (!clientOk) console.error("Error client email:", clientResult);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, admin: adminOk, client: clientOk }),
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