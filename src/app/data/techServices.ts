export type TechService = {
  label: string;
  desc?: string;
  price: number;
  from?: boolean;
};

export type TechServiceCategory = {
  id: string;
  title: string;
  icon: string;
  services: TechService[];
};

export const techServiceCategories: TechServiceCategory[] = [
  {
    id: "preventivo",
    title: "Mantenimiento preventivo",
    icon: "🧰",
    services: [
      { label: "Limpieza interna de PC / laptop", desc: "Polvo, ventiladores, disipadores", price: 35 },
      { label: "Mantenimiento preventivo completo (PC)", desc: "Limpieza + software + optimización", price: 60 },
      { label: "Mantenimiento preventivo completo (laptop)", desc: "Incluye desarme completo", price: 70 },
      { label: "Cambio de pasta térmica", desc: "Mejora temperaturas y rendimiento", price: 25 },
      { label: "Limpieza de impresora", desc: "Cabezales, rodillos y sensores", price: 40 },
    ],
  },
  {
    id: "reparacion",
    title: "Reparación",
    icon: "🔧",
    services: [
      { label: "Diagnóstico y presupuesto", desc: "Sin compromiso", price: 0 },
      { label: "Reparación de laptop", desc: "Hardware, pantalla, teclado, etc.", price: 80, from: true },
      { label: "Reparación de PC de escritorio", desc: "Fuente, motherboard, GPU, etc.", price: 70, from: true },
      { label: "Reparación de impresora láser", desc: "Fusor, drum, cartuchos", price: 90, from: true },
      { label: "Reparación de impresora de tinta", desc: "Cabezales, cartuchos, sistema", price: 70, from: true },
      { label: "Reparación de impresora térmica", desc: "POS, tickets, recibos", price: 100, from: true },
    ],
  },
  {
    id: "reacondicionamiento",
    title: "Reacondicionamiento",
    icon: "⚡",
    services: [
      { label: "Reacondicionamiento de PC completo", desc: "Hardware + software + optimización", price: 180 },
      { label: "Reacondicionamiento de laptop", desc: "Incluye limpieza profunda y upgrades", price: 200 },
      { label: "Upgrade a SSD + clonado", desc: "Migra tu sistema sin reinstalar", price: 90 },
      { label: "Ampliación de RAM", desc: "Diagnóstico + instalación", price: 60 },
      { label: "Cambio de batería de laptop", desc: "Repuesto original o compatible", price: 85, from: true },
    ],
  },
  {
    id: "software",
    title: "Software y seguridad",
    icon: "💾",
    services: [
      { label: "Formateo e instalación de Windows", desc: "Windows 10 / 11 + drivers", price: 60 },
      { label: "Instalación de programas", desc: "Office, Adobe, utilitarios", price: 30 },
      { label: "Eliminación de virus y malware", desc: "Limpieza profunda + protección", price: 45 },
      { label: "Recuperación de datos", desc: "Discos dañados o formateados", price: 120, from: true },
      { label: "Backup y configuración en la nube", desc: "Google Drive / OneDrive", price: 50 },
    ],
  },
  {
    id: "redes",
    title: "Redes y conectividad",
    icon: "🌐",
    services: [
      { label: "Configuración de red WiFi", desc: "Router + seguridad + cobertura", price: 80 },
      { label: "Instalación de router", desc: "Incluye configuración completa", price: 50 },
      { label: "Configuración de impresoras en red", desc: "Impresoras compartidas", price: 40 },
      { label: "Cableado de red estructurado", desc: "Por punto", price: 100, from: true },
      { label: "VPN empresarial", desc: "Acceso remoto seguro", price: 150, from: true },
    ],
  },
  {
    id: "soporte",
    title: "Soporte y planes empresariales",
    icon: "🏢",
    services: [
      { label: "Soporte remoto (30 min)", desc: "Atención inmediata por chat/llamada", price: 25 },
      { label: "Visita técnica a domicilio", desc: "Radio urbano", price: 60, from: true },
      { label: "Plan Pyme mensual (hasta 5 equipos)", desc: "Mantenimiento + soporte ilimitado", price: 200, from: true },
      { label: "Plan Empresa mensual (hasta 15 equipos)", desc: "SLA + visita semanal", price: 500, from: true },
      { label: "Contrato SLA a medida", desc: "Adaptado a tu operación", price: 0, from: true },
    ],
  },
];