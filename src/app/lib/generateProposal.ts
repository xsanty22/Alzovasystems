import { jsPDF } from "jspdf";

interface ProposalData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany?: string;
  projectType: string;
  projectTypeLabel: string;
  basePrice: number;
  modules: Array<{ label: string; price: number }>;
  modulesPrice: number;
  extras: Array<{ label: string; price: number }>;
  extrasPrice: number;
  total: number;
  proposalNumber: string;
  createdAt: Date;
}

/* ══════════════════════════════════════════════════════════
   COLORES
   ══════════════════════════════════════════════════════════ */
const COLORS = {
  primary: "#0066FF",
  primaryLight: "#00C2FF",
  dark: "#0A1A2F",
  text: "#1A1A1A",
  textLight: "#666666",
  border: "#E5E7EB",
  success: "#22C55E",
  warning: "#F59E0B",
};

/* ══════════════════════════════════════════════════════════
   UTILIDADES
   ══════════════════════════════════════════════════════════ */
const fmtCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: Date) =>
  d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

/* ══════════════════════════════════════════════════════════
   GENERADOR PRINCIPAL
   ══════════════════════════════════════════════════════════ */
export function generateProposal(data: ProposalData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let y = 0;

  /* ══════════════════════════════════════════════════════
     HEADER CON GRADIENTE
     ══════════════════════════════════════════════════════ */
  // Fondo oscuro
  doc.setFillColor(10, 26, 47);
  doc.rect(0, 0, pageWidth, 45, "F");

  // Barra azul superior
  doc.setFillColor(0, 102, 255);
  doc.rect(0, 0, pageWidth, 3, "F");

  // Logo cuadrado
  doc.setFillColor(0, 102, 255);
  doc.roundedRect(margin, 12, 20, 20, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("A", margin + 10, 26, { align: "center" });

  // Texto ALZOVA
  doc.setFontSize(18);
  doc.text("ALZOVA SYSTEMS", margin + 25, 20);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 194, 255);
  doc.text("TECNOLOGIA QUE IMPULSA TU NEGOCIO", margin + 25, 27);

  // Fecha a la derecha
  doc.setFontSize(8);
  doc.setTextColor(139, 148, 168);
  doc.text("PROPUESTA COMERCIAL", pageWidth - margin, 20, { align: "right" });
  doc.setFontSize(7);
  doc.text(data.proposalNumber, pageWidth - margin, 25, { align: "right" });

  y = 55;

  /* ══════════════════════════════════════════════════════
     TÍTULO
     ══════════════════════════════════════════════════════ */
  doc.setTextColor(0, 102, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Propuesta Comercial", margin, y);

  y += 3;
  doc.setDrawColor(0, 102, 255);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 40, y);

  y += 12;

  /* ══════════════════════════════════════════════════════
     INFO DEL CLIENTE Y FECHA
     ══════════════════════════════════════════════════════ */
  // Caja cliente
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth / 2 - 4, 35, 2, 2, "F");

  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE", margin + 5, y + 6);

  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.setFont("helvetica", "bold");
  doc.text(data.clientName, margin + 5, y + 13);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(102, 102, 102);
  let clientY = y + 18;
  if (data.clientEmail) {
    doc.text(data.clientEmail, margin + 5, clientY);
    clientY += 4;
  }
  if (data.clientPhone) {
    doc.text(data.clientPhone, margin + 5, clientY);
    clientY += 4;
  }
  if (data.clientCompany) {
    doc.text(data.clientCompany, margin + 5, clientY);
  }

  // Caja fecha / validez
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin + contentWidth / 2 + 4, y, contentWidth / 2 - 4, 35, 2, 2, "F");

  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLES", margin + contentWidth / 2 + 9, y + 6);

  doc.setFont("helvetica", "normal");
  doc.text("Fecha:", margin + contentWidth / 2 + 9, y + 13);
  doc.setTextColor(26, 26, 26);
  doc.text(fmtDate(data.createdAt), margin + contentWidth / 2 + 9, y + 17);

  doc.setTextColor(102, 102, 102);
  doc.text("Valida hasta:", margin + contentWidth / 2 + 9, y + 24);
  const expiryDate = new Date(data.createdAt);
  expiryDate.setDate(expiryDate.getDate() + 15);
  doc.setTextColor(245, 158, 11);
  doc.setFont("helvetica", "bold");
  doc.text(fmtDate(expiryDate), margin + contentWidth / 2 + 9, y + 28);

  y += 45;

  /* ══════════════════════════════════════════════════════
     PROYECTO
     ══════════════════════════════════════════════════════ */
  doc.setTextColor(0, 102, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PROYECTO SOLICITADO", margin, y);

  y += 5;

  doc.setFillColor(240, 245, 255);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");
  doc.setDrawColor(0, 102, 255);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "S");

  doc.setTextColor(26, 26, 26);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(data.projectTypeLabel, margin + 5, y + 8);

  y += 20;

  /* ══════════════════════════════════════════════════════
     DESGLOSE DE PRECIOS
     ══════════════════════════════════════════════════════ */
  doc.setTextColor(0, 102, 255);
  doc.setFontSize(9);
  doc.text("DESGLOSE", margin, y);

  y += 5;

  // Tabla header
  doc.setFillColor(10, 26, 47);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("CONCEPTO", margin + 5, y + 5.5);
  doc.text("VALOR", margin + contentWidth - 5, y + 5.5, { align: "right" });

  y += 8;

  const addRow = (label: string, value: number, isAlternate = false) => {
    if (isAlternate) {
      doc.setFillColor(250, 250, 252);
      doc.rect(margin, y, contentWidth, 8, "F");
    }
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(label, margin + 5, y + 5.5);

    doc.setTextColor(0, 102, 255);
    doc.setFont("helvetica", "bold");
    doc.text(fmtCOP(value), margin + contentWidth - 5, y + 5.5, { align: "right" });

    y += 8;
  };

  // Base
  addRow(data.projectTypeLabel, data.basePrice, false);

  // Módulos
  data.modules.forEach((m, i) => {
    addRow(`  ${m.label}`, m.price, i % 2 === 0);
  });

  // Extras
  data.extras.forEach((e, i) => {
    addRow(`  ${e.label}`, e.price, i % 2 === 0);
  });

  y += 2;

  // Separador
  doc.setDrawColor(0, 102, 255);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  /* ══════════════════════════════════════════════════════
     TOTALES
     ══════════════════════════════════════════════════════ */
  const subtotal = data.total;
  const iva = Math.round(subtotal * 0.19);
  const totalConIva = subtotal + iva;

  doc.setFontSize(9);
  doc.setTextColor(102, 102, 102);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal (sin IVA)", margin, y);
  doc.setTextColor(26, 26, 26);
  doc.setFont("helvetica", "bold");
  doc.text(fmtCOP(subtotal), margin + contentWidth, y, { align: "right" });

  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(102, 102, 102);
  doc.setFont("helvetica", "normal");
  doc.text("IVA (19%)", margin, y);
  doc.setTextColor(26, 26, 26);
  doc.setFont("helvetica", "bold");
  doc.text(fmtCOP(iva), margin + contentWidth, y, { align: "right" });

  y += 6;

  // Caja total
  doc.setFillColor(0, 102, 255);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL A PAGAR", margin + 5, y + 10);

  doc.setFontSize(18);
  doc.text(fmtCOP(totalConIva), margin + contentWidth - 5, y + 11, { align: "right" });

  y += 24;

  /* ══════════════════════════════════════════════════════
     CONDICIONES
     ══════════════════════════════════════════════════════ */
  doc.setTextColor(0, 102, 255);
  doc.setFontSize(9);
  doc.text("CONDICIONES", margin, y);

  y += 6;

  const conditions = [
    "Forma de pago: 50% al inicio del proyecto, 50% contra entrega.",
    "Tiempo estimado de desarrollo: 4 a 6 semanas.",
    "Incluye 30 dias de soporte tecnico post-entrega.",
    "Cualquier funcionalidad adicional se cotiza por separado.",
    "Precios sujetos a cambio sin previo aviso despues de la fecha de validez.",
  ];

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  conditions.forEach((c) => {
    doc.setTextColor(34, 197, 94);
    doc.setFont("helvetica", "bold");
    doc.text("OK", margin, y);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    doc.text(c, margin + 7, y);
    y += 5.5;
  });

  y += 10;

  /* ══════════════════════════════════════════════════════
     FIRMA
     ══════════════════════════════════════════════════════ */
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 60, y);
  doc.line(margin + contentWidth - 60, y, margin + contentWidth, y);

  y += 4;
  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  doc.text("Firma del cliente", margin + 30, y, { align: "center" });
  doc.text("ALZOVA SYSTEMS", margin + contentWidth - 30, y, { align: "center" });

  /* ══════════════════════════════════════════════════════
     FOOTER
     ══════════════════════════════════════════════════════ */
  const footerY = pageHeight - 15;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFontSize(7.5);
  doc.setTextColor(102, 102, 102);
  doc.setFont("helvetica", "normal");
  doc.text("ALZOVA SYSTEMS", margin, footerY);
  doc.text("contacto@alzova.systems  ·  alzovasystem.netlify.app", margin, footerY + 3.5);

  doc.text(`Pagina 1 de 1  ·  ${data.proposalNumber}`, pageWidth - margin, footerY, { align: "right" });
  doc.text(fmtDate(data.createdAt), pageWidth - margin, footerY + 3.5, { align: "right" });

  /* ══════════════════════════════════════════════════════
     GUARDAR
     ══════════════════════════════════════════════════════ */
  const fileName = `Propuesta-${data.proposalNumber}-${data.clientName.replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
}

/* ══════════════════════════════════════════════════════════
   HELPER: Generar número de propuesta
   ══════════════════════════════════════════════════════════ */
export function generateProposalNumber(leadId: string): string {
  const year = new Date().getFullYear();
  const shortId = leadId.slice(0, 6).toUpperCase();
  return `PROP-${year}-${shortId}`;
}


/* ══════════════════════════════════════════════════════════
   GENERAR BASE64 (para enviar por email)
   ══════════════════════════════════════════════════════════ */
export function generateProposalBase64(data: ProposalData): {
  base64: string;
  fileName: string;
} {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // ⚠️ Reutilizamos la misma lógica pero sin guardar
  // En vez de llamar a doc.save(), devolvemos el base64

  // ══════════════════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════════════════
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  doc.setFillColor(10, 26, 47);
  doc.rect(0, 0, pageWidth, 45, "F");
  doc.setFillColor(0, 102, 255);
  doc.rect(0, 0, pageWidth, 3, "F");

  doc.setFillColor(0, 102, 255);
  doc.roundedRect(margin, 12, 20, 20, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("A", margin + 10, 26, { align: "center" });

  doc.setFontSize(18);
  doc.text("ALZOVA SYSTEMS", margin + 25, 20);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 194, 255);
  doc.text("TECNOLOGIA QUE IMPULSA TU NEGOCIO", margin + 25, 27);

  doc.setFontSize(8);
  doc.setTextColor(139, 148, 168);
  doc.text("PROPUESTA COMERCIAL", pageWidth - margin, 20, { align: "right" });
  doc.setFontSize(7);
  doc.text(data.proposalNumber, pageWidth - margin, 25, { align: "right" });

  y = 55;

  doc.setTextColor(0, 102, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Propuesta Comercial", margin, y);
  y += 3;
  doc.setDrawColor(0, 102, 255);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 40, y);
  y += 12;

  // Info cliente
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth / 2 - 4, 35, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE", margin + 5, y + 6);
  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.text(data.clientName, margin + 5, y + 13);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(102, 102, 102);
  let clientY = y + 18;
  if (data.clientEmail) { doc.text(data.clientEmail, margin + 5, clientY); clientY += 4; }
  if (data.clientPhone) { doc.text(data.clientPhone, margin + 5, clientY); clientY += 4; }
  if (data.clientCompany) { doc.text(data.clientCompany, margin + 5, clientY); }

  // Fecha
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin + contentWidth / 2 + 4, y, contentWidth / 2 - 4, 35, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLES", margin + contentWidth / 2 + 9, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text("Fecha:", margin + contentWidth / 2 + 9, y + 13);
  doc.setTextColor(26, 26, 26);
  doc.text(fmtDate(data.createdAt), margin + contentWidth / 2 + 9, y + 17);
  doc.setTextColor(102, 102, 102);
  doc.text("Valida hasta:", margin + contentWidth / 2 + 9, y + 24);
  const expiryDate = new Date(data.createdAt);
  expiryDate.setDate(expiryDate.getDate() + 15);
  doc.setTextColor(245, 158, 11);
  doc.setFont("helvetica", "bold");
  doc.text(fmtDate(expiryDate), margin + contentWidth / 2 + 9, y + 28);

  y += 45;

  // Proyecto
  doc.setTextColor(0, 102, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PROYECTO SOLICITADO", margin, y);
  y += 5;

  doc.setFillColor(240, 245, 255);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");
  doc.setDrawColor(0, 102, 255);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "S");
  doc.setTextColor(26, 26, 26);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(data.projectTypeLabel, margin + 5, y + 8);
  y += 20;

  // Desglose
  doc.setTextColor(0, 102, 255);
  doc.setFontSize(9);
  doc.text("DESGLOSE", margin, y);
  y += 5;

  doc.setFillColor(10, 26, 47);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("CONCEPTO", margin + 5, y + 5.5);
  doc.text("VALOR", margin + contentWidth - 5, y + 5.5, { align: "right" });
  y += 8;

  const addRow = (label: string, value: number, isAlternate = false) => {
    if (isAlternate) {
      doc.setFillColor(250, 250, 252);
      doc.rect(margin, y, contentWidth, 8, "F");
    }
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(label, margin + 5, y + 5.5);
    doc.setTextColor(0, 102, 255);
    doc.setFont("helvetica", "bold");
    doc.text(fmtCOP(value), margin + contentWidth - 5, y + 5.5, { align: "right" });
    y += 8;
  };

  addRow(data.projectTypeLabel, data.basePrice, false);
  data.modules.forEach((m, i) => addRow(`  ${m.label}`, m.price, i % 2 === 0));
  data.extras.forEach((e, i) => addRow(`  ${e.label}`, e.price, i % 2 === 0));

  y += 2;
  doc.setDrawColor(0, 102, 255);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  // Totales
  const subtotal = data.total;
  const iva = Math.round(subtotal * 0.19);
  const totalConIva = subtotal + iva;

  doc.setFontSize(9);
  doc.setTextColor(102, 102, 102);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal (sin IVA)", margin, y);
  doc.setTextColor(26, 26, 26);
  doc.setFont("helvetica", "bold");
  doc.text(fmtCOP(subtotal), margin + contentWidth, y, { align: "right" });
  y += 6;

  doc.setTextColor(102, 102, 102);
  doc.setFont("helvetica", "normal");
  doc.text("IVA (19%)", margin, y);
  doc.setTextColor(26, 26, 26);
  doc.setFont("helvetica", "bold");
  doc.text(fmtCOP(iva), margin + contentWidth, y, { align: "right" });
  y += 6;

  doc.setFillColor(0, 102, 255);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL A PAGAR", margin + 5, y + 10);
  doc.setFontSize(18);
  doc.text(fmtCOP(totalConIva), margin + contentWidth - 5, y + 11, { align: "right" });
  y += 24;

  // Condiciones
  doc.setTextColor(0, 102, 255);
  doc.setFontSize(9);
  doc.text("CONDICIONES", margin, y);
  y += 6;

  const conditions = [
    "Forma de pago: 50% al inicio, 50% contra entrega.",
    "Tiempo estimado: 4 a 6 semanas.",
    "Incluye 30 dias de soporte post-entrega.",
    "Funcionalidades adicionales se cotizan aparte.",
    "Precios sujetos a cambio despues de la fecha de validez.",
  ];

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  conditions.forEach((c) => {
    doc.setTextColor(34, 197, 94);
    doc.setFont("helvetica", "bold");
    doc.text("OK", margin, y);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    doc.text(c, margin + 7, y);
    y += 5.5;
  });

  y += 10;

  // Firma
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 60, y);
  doc.line(margin + contentWidth - 60, y, margin + contentWidth, y);
  y += 4;
  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  doc.text("Firma del cliente", margin + 30, y, { align: "center" });
  doc.text("ALZOVA SYSTEMS", margin + contentWidth - 30, y, { align: "center" });

  // Footer
  const footerY = pageHeight - 15;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);
  doc.setFontSize(7.5);
  doc.setTextColor(102, 102, 102);
  doc.setFont("helvetica", "normal");
  doc.text("ALZOVA SYSTEMS", margin, footerY);
  doc.text("contacto@alzova.systems  ·  alzovasystem.netlify.app", margin, footerY + 3.5);
  doc.text(`Pagina 1 de 1  ·  ${data.proposalNumber}`, pageWidth - margin, footerY, { align: "right" });
  doc.text(fmtDate(data.createdAt), pageWidth - margin, footerY + 3.5, { align: "right" });

  // ══════════════════════════════════════════════════════
  // DEVOLVER BASE64 en vez de guardar
  // ══════════════════════════════════════════════════════
  const pdfDataUri = doc.output("datauristring");
  const base64 = pdfDataUri.split(",")[1];

  const fileName = `Propuesta-${data.proposalNumber}-${data.clientName.replace(/\s+/g, "-")}.pdf`;

  return { base64, fileName };
}