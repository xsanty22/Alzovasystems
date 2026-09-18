import { ShoppingCart, Boxes, Utensils, Store, Code2, TrendingUp } from "lucide-react";

export type Product = {
  name: string;
  icon: any;
  desc: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
  accent: string;
  accentRgb: string;
};

export const products: Product[] = [
  {
    name: "ALZOVA POS",
    icon: ShoppingCart,
    desc: "Punto de venta rápido, offline-first y multi-sucursal.",
    features: ["⚡ Offline-first", "📱 Multi-sucursal", "🖨️ Facturación integrada"],
    badge: "Más vendido",
    badgeColor: "#F59E0B",
    accent: "#0066FF",
    accentRgb: "0,102,255",
  },
  {
    name: "ALZOVA Inventory",
    icon: Boxes,
    desc: "Inventario inteligente con alertas y reposición automática.",
    features: ["🔔 Alertas en vivo", "📊 Reportes", "🔄 Auto-reposición"],
    badge: "Nuevo",
    badgeColor: "#22C55E",
    accent: "#00C2FF",
    accentRgb: "0,194,255",
  },
  {
    name: "ALZOVA Restaurant",
    icon: Utensils,
    desc: "Gestión completa para cocina, mesas y delivery.",
    features: ["🍽️ Comandas KDS", "🛵 Delivery", "📅 Reservas"],
    badge: "Popular",
    badgeColor: "#F59E0B",
    accent: "#7C3AED",
    accentRgb: "124,58,237",
  },
  {
    name: "ALZOVA Fashion",
    icon: Store,
    desc: "Variantes, colecciones y analítica de tendencias.",
    features: ["👕 Talles y colores", "📈 Tendencias", "🛍️ E-commerce"],
    accent: "#0066FF",
    accentRgb: "0,102,255",
  },
  {
    name: "ALZOVA Market",
    icon: ShoppingCart,
    desc: "Supermercados, caducidades y balanzas integradas.",
    features: ["🏷️ Balanzas", "📅 Caducidades", "🎁 Promociones"],
    accent: "#00C2FF",
    accentRgb: "0,194,255",
  },
  {
    name: "ALZOVA Custom",
    icon: Code2,
    desc: "Software a la medida para tu operación específica.",
    features: ["🎯 A tu medida", "🔗 Integraciones", "🚀 Escalable"],
    badge: "A medida",
    badgeColor: "#7C3AED",
    accent: "#7C3AED",
    accentRgb: "124,58,237",
  },
];

// Datos para el header
export const productsStats = {
  count: products.length,
  clients: "45+",
  uptime: "99.9%",
};