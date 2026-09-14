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

function adminEmailHtml(data: QuoteBody): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const modulesHtml = data.modules
    .map(
      (m) => `
      <tr>
        <td style="padding: 8px 0; color: #B8C0D0; font-size: 14px;">${m.label}</td>
        <td style="padding: 8px 0; color: #00C2FF; font-family: monospace; text-align: right; font-size: 14px;">+${fmt(m.price)}</td>
      </tr>`
    )
    .join("");

  const extrasHtml = data.extras
    .map(
      (e) => `
      <tr>
        <td style="padding: 8px 0; color: #B8C0D0; font-size: 14px;">${e.label}</td>
        <td style="padding: 8px 0; color: #00C2FF; font-family: monospace; text-align: right; font-size: 14px;">+${fmt(e.price)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#0B0B0B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width:600px; margin:0 auto; background:#0A1A2F;">
    <div style="background: linear-gradient(135deg, #0066FF 0%, #00C2FF 100%); padding: 32px 24px; text-align: center;">
      <div style="color:#FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: 2px;">ALZOVA SYSTEMS</div>
      <div style="color:rgba(255,255,255,0.85); font-size: 12px; letter-spacing: 3px; margin-top: 4px;">NUEVA COTIZACION</div>
    </div>
    <div style="padding: 24px 24px 0; text-align: center;">
      <div style="display:inline-block; padding: 8px 16px; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); border-radius: 999px; color: #22C55E; font-size: 12px; font-weight: 700;">LEAD NUEVO</div>
    </div>
    <div style="padding: 24px;">
      <div style="color:#00C2FF; font-size: 11px; letter-spacing: 3px; margin-bottom: 12px; font-family: monospace;">// DATOS DE CONTACTO</div>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #8B94A8; font-size: 13px; width: 120px;">Nombre</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px; font-weight: 600;">${data.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #8B94A8; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #0066FF; text-decoration: none; font-size: 14px;">${data.email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #8B94A8; font-size: 13px;">Telefono</td><td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #0066FF; text-decoration: none; font-size: 14px;">${data.phone}</a></td></tr>
        ${data.company ? `<tr><td style="padding: 8px 0; color: #8B94A8; font-size: 13px;">Empresa</td><td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${data.company}</td></tr>` : ""}
      </table>
    </div>
    <div style="padding: 0 24px 24px;">
      <div style="color:#00C2FF; font-size: 11px; letter-spacing: 3px; margin-bottom: 12px; font-family: monospace;">// PROYECTO</div>
      <div style="background: rgba(0,102,255,0.08); border: 1px solid rgba(0,102,255,0.25); border-radius: 12px; padding: 16px;">
        <div style="color:#FFFFFF; font-size: 16px; font-weight: 700; margin-bottom: 4px;">${data.projectTypeLabel}</div>
        <div style="color:#00C2FF; font-family: monospace; font-size: 14px;">${fmt(data.basePrice)}</div>
      </div>
    </div>
    ${data.modules.length > 0 ? `
    <div style="padding: 0 24px 24px;">
      <div style="color:#00C2FF; font-size: 11px; letter-spacing: 3px; margin-bottom: 12px; font-family: monospace;">// MODULOS (${data.modules.length})</div>
      <table style="width:100%; border-collapse: collapse;">${modulesHtml}</table>
    </div>` : ""}
    ${data.extras.length > 0 ? `
    <div style="padding: 0 24px 24px;">
      <div style="color:#00C2FF; font-size: 11px; letter-spacing: 3px; margin-bottom: 12px; font-family: monospace;">// EXTRAS (${data.extras.length})</div>
      <table style="width:100%; border-collapse: collapse;">${extrasHtml}</table>
    </div>` : ""}
    <div style="padding: 0 24px 32px;">
      <div style="background: linear-gradient(135deg, rgba(0,102,255,0.15) 0%, rgba(0,194,255,0.08) 100%); border: 1px solid rgba(0,102,255,0.4); border-radius: 12px; padding: 20px; text-align: center;">
        <div style="color: #8B94A8; font-size: 11px; letter-spacing: 3px; font-family: monospace; margin-bottom: 8px;">// TOTAL</div>
        <div style="color: #FFFFFF; font-size: 32px; font-weight: 800;">${fmt(data.total)}</div>
      </div>
    </div>
    <div style="background: rgba(0,0,0,0.3); padding: 20px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
      <div style="color: #8B94A8; font-size: 11px;">ALZOVA SYSTEMS · Nueva cotizacion recibida</div>
    </div>
  </div>
</body></html>`;
}

function clientEmailHtml(data: QuoteBody): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#0B0B0B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width:600px; margin:0 auto; background:#0A1A2F;">
    <div style="background: linear-gradient(135deg, #0066FF 0%, #00C2FF 100%); padding: 40px 24px; text-align: center;">
      <div style="color:#FFFFFF; font-size: 28px; font-weight: 800; letter-spacing: 2px;">ALZOVA SYSTEMS</div>
      <div style="color:rgba(255,255,255,0.9); font-size: 14px; margin-top: 6px;">Tecnologia que impulsa tu negocio</div>
    </div>
    <div style="padding: 40px 24px 24px; text-align: center;">
      <div style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin-bottom: 12px;">Recibimos tu cotizacion</div>
      <div style="color: #B8C0D0; font-size: 16px; line-height: 1.6; max-width: 460px; margin: 0 auto;">
        Hola <strong style="color: #FFFFFF;">${data.name.split(" ")[0]}</strong>, gracias por confiar en nosotros. Un asesor te contactara en menos de 24 horas.
      </div>
    </div>
    <div style="padding: 24px;">
      <div style="background: rgba(0,102,255,0.08); border: 1px solid rgba(0,102,255,0.25); border-radius: 12px; padding: 20px;">
        <div style="color:#00C2FF; font-size: 11px; letter-spacing: 3px; margin-bottom: 12px; font-family: monospace;">// RESUMEN</div>
        <div style="color:#FFFFFF; font-size: 16px; font-weight: 700; margin-bottom: 8px;">${data.projectTypeLabel}</div>
        <div style="color: #8B94A8; font-size: 14px; margin-bottom: 8px;">
          ${data.modules.length > 0 ? `+ ${data.modules.length} modulos` : ""}
          ${data.extras.length > 0 ? `${data.modules.length > 0 ? " · " : ""}+ ${data.extras.length} extras` : ""}
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.08); margin-top: 16px; padding-top: 16px;">
          <div style="color:#8B94A8; font-size: 11px; letter-spacing: 2px; font-family: monospace; margin-bottom: 4px;">TOTAL ESTIMADO</div>
          <div style="color:#00C2FF; font-size: 24px; font-weight: 800;">${fmt(data.total)}</div>
        </div>
      </div>
    </div>
    <div style="padding: 0 24px 32px; text-align: center;">
      <div style="color: #8B94A8; font-size: 13px; margin-bottom: 16px;">Necesitas hablar antes?</div>
      <a href="https://wa.me/573000000000" style="display:inline-block; padding: 14px 28px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #FFFFFF; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px;">Hablar por WhatsApp</a>
    </div>
    <div style="background: rgba(0,0,0,0.3); padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
      <div style="color: #8B94A8; font-size: 11px; line-height: 1.6;">
        © ${new Date().getFullYear()} ALZOVA SYSTEMS<br>
        <a href="mailto:contacto@alzova.systems" style="color: #0066FF; text-decoration: none;">contacto@alzova.systems</a>
      </div>
    </div>
  </div>
</body></html>`;
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
    const data: QuoteBody = JSON.parse(event.body || "{}");

    if (!data.name || !data.email || !data.phone || !data.total) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    const [adminResult, clientResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `Nueva cotizacion - ${data.name} (${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.total)})`,
        html: adminEmailHtml(data),
        replyTo: data.email,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [data.email],
        subject: "Recibimos tu cotizacion - ALZOVA SYSTEMS",
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