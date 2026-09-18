export type QuoteItem = {
  id: string;
  label: string;
  desc?: string;
  price: number;
};

export const projectTypes: QuoteItem[] = [
  { id: "landing",   label: "Landing page",         desc: "Sitio one-page profesional",       price: 800000   },
  { id: "webapp",    label: "Aplicación web",       desc: "Sistema web completo",             price: 2500000  },
  { id: "ecommerce", label: "E-commerce",           desc: "Tienda online con carrito",        price: 3500000  },
  { id: "saas",      label: "Plataforma SaaS",      desc: "Suscripciones y multi-usuario",    price: 8000000  },
  { id: "mobile",    label: "App móvil",            desc: "iOS + Android",                    price: 6000000  },
  { id: "custom",    label: "Software a la medida", desc: "Sistema para tu operación",        price: 2800000  },
];

export const modules: QuoteItem[] = [
  { id: "auth",       label: "Login / Autenticación",      price: 300000 },
  { id: "payment",    label: "Pasarela de pago",           price: 500000 },
  { id: "admin",      label: "Panel administrador",        price: 600000 },
  { id: "cart",       label: "Carrito de compras",         price: 400000 },
  { id: "blog",       label: "Blog / CMS",                 price: 300000 },
  { id: "multi-lang", label: "Multi-idioma",               price: 250000 },
  { id: "chat",       label: "Chat en vivo",               price: 200000 },
  { id: "reports",    label: "Reportes y analítica",       price: 400000 },
  { id: "email",      label: "Notificaciones por email",   price: 200000 },
  { id: "api",        label: "API / Integraciones",        price: 600000 },
  { id: "inventory",  label: "Inventario",                 price: 500000 },
  { id: "pos",        label: "Punto de venta (POS)",       price: 800000 },
];

export const extras: QuoteItem[] = [
  { id: "uiux",     label: "Diseño UI/UX premium",     price: 600000 },
  { id: "seo",      label: "SEO optimizado",           price: 300000 },
  { id: "support",  label: "Soporte 3 meses",          price: 400000 },
  { id: "hosting",  label: "Setup hosting + dominio",  price: 250000 },
  { id: "training", label: "Capacitación al equipo",   price: 300000 },
];