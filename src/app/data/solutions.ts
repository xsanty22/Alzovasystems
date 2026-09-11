import {
  Code2, Smartphone, ShoppingCart, Database, Layers,
  Printer, Monitor, HardDrive, Network, Wrench,
} from "lucide-react";

export const solutions = [
  {
    tag: "Software",
    title: "Creación de Software",
    subtitle: "Para empresas · negocios · usuarios",
    desc: "Diseñamos y desarrollamos software a la medida: desde sistemas internos hasta plataformas SaaS, apps móviles y puntos de venta. Nos adaptamos a tu operación, no al revés.",
    bullets: [
      "Software para empresas, negocios y usuarios",
      "Apps web y móviles (iOS · Android)",
      "Sistemas POS, inventarios y facturación",
      "ERP, CRM y automatización de procesos",
      "Integraciones, APIs y migración de datos",
    ],
    cta: "Explorar desarrollo",
    icons: [Code2, Smartphone, ShoppingCart, Database, Layers],
    accent: "#0066FF",
  },
  {
    tag: "Servicio técnico",
    title: "Soporte, Mantenimiento y Reparación",
    subtitle: "Impresoras · computadoras · redes",
    desc: "Servicio técnico especializado para mantener tu operación funcionando. Reparamos, damos mantenimiento y optimizamos tus equipos con atención rápida y garantizada.",
    bullets: [
      "Reparación de impresoras (láser, tinta, térmicas)",
      "Mantenimiento preventivo y correctivo de PCs",
      "Formateo, instalación de software y drivers",
      "Cambio de piezas y upgrades (RAM, SSD, etc.)",
      "Redes, WiFi y configuración de impresoras compartidas",
    ],
    cta: "Solicitar servicio técnico",
    icons: [Printer, Monitor, HardDrive, Network, Wrench],
    accent: "#00C2FF",
  },
];