export type ProductDetail = {
  tagline: string;
  painPoints: string[];
  solution: string;
  features: { icon: string; title: string; desc: string }[];
  benefits: { metric: string; label: string }[];
  idealFor: string[];
  testimonial?: { text: string; author: string; role: string };
  priceFrom: string;
  priceNote: string;
};

export const productDetails: Record<string, ProductDetail> = {
  "ALZOVA POS": {
    tagline: "Vende más rápido, sin errores, incluso sin internet.",
    painPoints: [
      "Tienes que cerrar caja 30 minutos al final del día",
      "Cuando se cae el internet, no puedes cobrar",
      "Los descuadres de inventario te comen el margen",
      "Los clientes se van porque la fila es lenta",
    ],
    solution:
      "ALZOVA POS funciona offline-first. Aunque se caiga el internet, sigues vendiendo. Cuando vuelve la conexión, todo se sincroniza automáticamente. Cada venta descuenta del inventario en tiempo real.",
    features: [
      { icon: "⚡", title: "Modo offline", desc: "Sigue vendiendo sin internet. Sincroniza cuando vuelve." },
      { icon: "📱", title: "Multi-sucursal", desc: "Controla varias tiendas desde un solo panel." },
      { icon: "🖨️", title: "Facturación integrada", desc: "Imprime recibos y facturas sin software aparte." },
      { icon: "💳", title: "Múltiples pagos", desc: "Efectivo, tarjeta, transferencia, QR." },
      { icon: "👥", title: "Clientes y fidelización", desc: "Programa de puntos y descuentos automáticos." },
      { icon: "📊", title: "Reportes en vivo", desc: "Ventas, márgenes y stock actualizados al segundo." },
    ],
    benefits: [
      { metric: "+30%", label: "Más ventas" },
      { metric: "-80%", label: "Tiempo en caja" },
      { metric: "0", label: "Descuadres" },
    ],
    idealFor: [
      "Tiendas de ropa",
      "Minimarkets",
      "Papelerías",
      "Ferreterías",
      "Farmacias",
    ],
    testimonial: {
      text: "Antes cerrábamos caja en 45 min. Ahora en 5. Y no hemos vuelto a tener descuadres.",
      author: "María González",
      role: "Dueña · Minimarket La Esquina",
    },
    priceFrom: "$800.000",
    priceNote: "Instalación, capacitación y 3 meses de soporte incluidos",
  },

  "ALZOVA Inventory": {
    tagline: "Nunca más te quedes sin stock de lo que más vendes.",
    painPoints: [
      "Descubres que no tienes un producto cuando el cliente lo pide",
      "Compras de más y se te vence la mercancía",
      "No sabes qué producto te está dejando dinero y cuál no",
      "Los pedidos a proveedores los haces adivinando",
    ],
    solution:
      "ALZOVA Inventory aprende de tus ventas y te avisa antes de que se te acabe el stock. Genera órdenes de compra automáticas, controla caducidades y te dice exactamente cuánto ganancias por cada producto.",
    features: [
      { icon: "🔔", title: "Alertas inteligentes", desc: "Te avisa antes de que se agote el stock mínimo." },
      { icon: "🔄", title: "Auto-reposición", desc: "Órdenes de compra automáticas según tu historial." },
      { icon: "📅", title: "Control de caducidades", desc: "Alertas de productos próximos a vencer." },
      { icon: "📈", title: "Análisis ABC", desc: "Identifica qué productos son tus estrellas y cuáles no." },
      { icon: "🏷️", title: "Multi-bodega", desc: "Controla stock en varias ubicaciones." },
      { icon: "📱", title: "Lectura de códigos", desc: "Escanea con el celular, sin equipos costosos." },
    ],
    benefits: [
      { metric: "-40%", label: "Menos mermas" },
      { metric: "+25%", label: "Rotación de stock" },
      { metric: "2h", label: "Ahorro semanal" },
    ],
    idealFor: [
      "Supermercados",
      "Distribuidoras",
      "Ferreterías",
      "Tiendas de conveniencia",
    ],
    testimonial: {
      text: "Antes teníamos $8M en mercancía vencida. Ahora no llegamos ni a $500K.",
      author: "Carlos Ramírez",
      role: "Dueño · Distribuidora CR",
    },
    priceFrom: "$700.000",
    priceNote: "Incluye migración de datos y capacitación",
  },

  "ALZOVA Restaurant": {
    tagline: "Tu cocina vuela. Tus clientes vuelven. Tus cuentas cuadran.",
    painPoints: [
      "Las comandas se pierden entre el mesero y la cocina",
      "Los clientes esperan 40 minutos por su pedido",
      "No sabes cuánto ganas por plato ni por mesa",
      "El delivery te quita margen porque no lo controlas",
    ],
    solution:
      "ALZOVA Restaurant digitaliza la comanda del mesero directo a cocina (KDS), controla tiempos de cada plato, integra delivery de todas las apps y calcula el costo real de cada receta.",
    features: [
      { icon: "🍽️", title: "Comandas digitales", desc: "El mesero toma el pedido, llega a cocina al instante." },
      { icon: "👨‍🍳", title: "KDS cocina", desc: "Pantalla en cocina con tiempos y prioridades." },
      { icon: "🛵", title: "Delivery integrado", desc: "Recibe pedidos de Rappi, iFood y WhatsApp." },
      { icon: "📅", title: "Reservas online", desc: "Tus clientes reservan mesa sin llamar." },
      { icon: "💵", title: "Control de caja", desc: "Arqueos, propinas y cierre automático." },
      { icon: "📊", title: "Costos por plato", desc: "Sepa cuánto gana realmente en cada venta." },
    ],
    benefits: [
      { metric: "-60%", label: "Errores en pedidos" },
      { metric: "+35%", label: "Rotación de mesas" },
      { metric: "+22%", label: "Ticket promedio" },
    ],
    idealFor: [
      "Restaurantes",
      "Cafeterías",
      "Bares",
      "Food trucks",
      "Panaderías",
    ],
    testimonial: {
      text: "Bajamos de 35 a 12 minutos el tiempo de entrega. Los clientes lo notan.",
      author: "Andrés Molina",
      role: "Gerente · La Trattoria",
    },
    priceFrom: "$1.200.000",
    priceNote: "Incluye KDS, capacitación y soporte 24/7",
  },

  "ALZOVA Fashion": {
    tagline: "Vende por talla, color y colección sin perder el control.",
    painPoints: [
      "Vendes una talla M y en el sistema aparece como disponible",
      "No sabes qué colores se venden más en cada temporada",
      "Las devoluciones te matan porque no controlas variantes",
      "El e-commerce y el local físico no se hablan",
    ],
    solution:
      "ALZOVA Fashion entiende variantes: talla, color, material. Controla stock por cada combinación, sincroniza tu tienda física con la online y te dice qué tendencias están pegando.",
    features: [
      { icon: "👕", title: "Variantes completas", desc: "Talla + color + material, todo controlado." },
      { icon: "🛍️", title: "E-commerce sincronizado", desc: "Lo que vendes online descuenta del local." },
      { icon: "📈", title: "Análisis de tendencias", desc: "Qué colores y tallas se venden más." },
      { icon: "🏷️", title: "Etiquetas de precio", desc: "Imprime etiquetas con código de barras." },
      { icon: "🎁", title: "Promociones", desc: "Combos, descuentos y liquidaciones." },
      { icon: "👥", title: "Fidelización", desc: "Programa de puntos y cumpleaños." },
    ],
    benefits: [
      { metric: "+28%", label: "Ventas online" },
      { metric: "-45%", label: "Devoluciones" },
      { metric: "+18%", label: "Ticket promedio" },
    ],
    idealFor: [
      "Boutiques",
      "Tiendas de ropa",
      "Zapaterías",
      "Accesorios",
      "Marcas propias",
    ],
    priceFrom: "$900.000",
    priceNote: "Incluye catálogo online + capacitación",
  },

  "ALZOVA Market": {
    tagline: "Supermercado sin filas, sin pérdidas y sin sorpresas.",
    painPoints: [
      "Las cajeras se equivocan con los precios por peso",
      "La mercancía se vence sin que te des cuenta",
      "Los ladrones te comen el margen",
      "Las promociones se complican de manejar",
    ],
    solution:
      "ALZOVA Market integra balanzas, controla caducidades por lote, detecta patrones de robo y maneja promociones complejas (2x1, 3x2, descuento por volumen) sin esfuerzo.",
    features: [
      { icon: "⚖️", title: "Balanzas integradas", desc: "Pesa, etiqueta y cobra sin errores." },
      { icon: "📅", title: "Caducidades por lote", desc: "Alertas 30/15/7 días antes de vencer." },
      { icon: "🛡️", title: "Anti-robo", desc: "Detección de patrones anómalos en caja." },
      { icon: "🎁", title: "Promociones avanzadas", desc: "2x1, 3x2, descuentos por volumen." },
      { icon: "🏷️", title: "Precios dinámicos", desc: "Cambia precios en todas las cajas al instante." },
      { icon: "📊", title: "Reportes por categoría", desc: "Qué se vende, qué no y por qué." },
    ],
    benefits: [
      { metric: "-35%", label: "Mermas" },
      { metric: "+40%", label: "Velocidad en caja" },
      { metric: "+15%", label: "Margen" },
    ],
    idealFor: [
      "Supermercados",
      "Minimarkets",
      "Tiendas de barrio",
      "Autoservicios",
    ],
    testimonial: {
      text: "Automatizamos caducidades y promociones. Redujimos mermas un 32% el primer trimestre.",
      author: "Daniela Cruz",
      role: "COO · Mercado Vecino",
    },
    priceFrom: "$1.500.000",
    priceNote: "Incluye integración con balanzas",
  },

  "ALZOVA Custom": {
    tagline: "Si tu operación no cabe en un software genérico, esto es para ti.",
    painPoints: [
      "Los softwares del mercado no se adaptan a tu negocio",
      "Terminas usando Excel + WhatsApp + papel",
      "Pagarías por un software a la medida pero no sabes cuánto cuesta",
      "Tienes miedo de que te dejen colgado después de pagar",
    ],
    solution:
      "ALZOVA Custom diseña el software EXACTO que tu operación necesita. Empezamos con un diagnóstico, construimos en sprints y te entregamos por partes funcionales. Nunca pagas todo por adelantado.",
    features: [
      { icon: "🔍", title: "Diagnóstico gratis", desc: "Analizamos tu operación y te decimos qué necesita." },
      { icon: "🎯", title: "Diseño a medida", desc: "Módulos exactos para tu negocio, sin extras inútiles." },
      { icon: "⚙️", title: "Desarrollo ágil", desc: "Entregas cada 2 semanas para ver avances." },
      { icon: "🔗", title: "Integraciones", desc: "Conecta con tus sistemas actuales (Excel, ERP, API)." },
      { icon: "📚", title: "Capacitación incluida", desc: "Entrenamos a tu equipo hasta que lo dominen." },
      { icon: "🛡️", title: "Soporte continuo", desc: "Acompañamiento post-lanzamiento por 6 meses." },
    ],
    benefits: [
      { metric: "0", label: "Módulos de más" },
      { metric: "+70%", label: "Eficiencia" },
      { metric: "∞", label: "Escalabilidad" },
    ],
    idealFor: [
      "Operaciones complejas",
      "Procesos únicos",
      "Multi-industria",
      "Empresas en crecimiento",
    ],
    priceFrom: "$2.800.000",
    priceNote: "Diagnóstico gratis. Precio final según alcance.",
  },
};

// Utilidad para obtener detalle por nombre
export function getProductDetail(name: string): ProductDetail | undefined {
  return productDetails[name];
}