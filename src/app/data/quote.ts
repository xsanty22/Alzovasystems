export type QuoteItem = {
  id: string;
  label: string;
  desc?: string;
  price: number;
};

export const projectTypes: QuoteItem[] = [
  { id: "landing",   label: "Landing page",         desc: "Sitio one-page profesional",       price: 800  },
  { id: "webapp",    label: "Aplicación web",       desc: "Sistema web completo",             price: 2500 },
  { id: "ecommerce", label: "E-commerce",           desc: "Tienda online con carrito",        price: 3500 },
  { id: "saas",      label: "Plataforma SaaS",      desc: "Suscripciones y multi-usuario",    price: 6000 },
  { id: "mobile",    label: "App móvil",            desc: "iOS + Android",                    price: 5000 },
  { id: "custom",    label: "Software a la medida", desc: "Sistema para tu operación",        price: 3000 },
];

export const modules: QuoteItem[] = [
  { id: "auth",       label: "Login / Autenticación",      price: 400  },
  { id: "payment",    label: "Pasarela de pago",           price: 700  },
  { id: "admin",      label: "Panel administrador",        price: 900  },
  { id: "cart",       label: "Carrito de compras",         price: 600  },
  { id: "blog",       label: "Blog / CMS",                 price: 400  },
  { id: "multi-lang", label: "Multi-idioma",               price: 350  },
  { id: "chat",       label: "Chat en vivo",               price: 250  },
  { id: "reports",    label: "Reportes y analítica",       price: 500  },
  { id: "email",      label: "Notificaciones por email",   price: 300  },
  { id: "api",        label: "API / Integraciones",        price: 800  },
  { id: "inventory",  label: "Inventario",                 price: 700  },
  { id: "pos",        label: "Punto de venta (POS)",       price: 1200 },
];

export const extras: QuoteItem[] = [
  { id: "uiux",     label: "Diseño UI/UX premium",     price: 800 },
  { id: "seo",      label: "SEO optimizado",           price: 400 },
  { id: "support",  label: "Soporte 3 meses",          price: 500 },
  { id: "hosting",  label: "Setup hosting + dominio",  price: 300 },
  { id: "training", label: "Capacitación al equipo",   price: 400 },
];