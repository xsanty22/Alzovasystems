import {
  Rocket, Code2, Layers,
  Cloud, Lock, BarChart3,
  Shield, Settings,
} from "lucide-react";

export type ServiceItem = {
  icon: any;
  title: string;
  desc: string;
  tag: string;
  metric: string;
};

export type ServicePillar = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  accent: string;
  accentRgb: string;
  status: string;
  services: ServiceItem[];
};

export const servicePillars: ServicePillar[] = [
  {
    id: "build",
    number: "01",
    title: "Desarrollo & Diseño",
    subtitle: "Producto digital de punta a punta",
    accent: "#0066FF",
    accentRgb: "0,102,255",
    status: "DESIGN_MODE",
    services: [
      {
        icon: Rocket,
        title: "Consultoría tecnológica",
        desc: "Diagnóstico, arquitectura y hoja de ruta estratégica.",
        tag: "1-2 semanas",
        metric: "STRATEGY",
      },
      {
        icon: Code2,
        title: "Desarrollo web y móvil",
        desc: "Apps escalables con stack moderno y código limpio.",
        tag: "Desde 4 semanas",
        metric: "BUILD",
      },
      {
        icon: Layers,
        title: "Diseño UX/UI",
        desc: "Interfaces claras, medibles y centradas en el usuario.",
        tag: "Prototipo en 1 sem",
        metric: "DESIGN",
      },
    ],
  },
  {
    id: "infra",
    number: "02",
    title: "Infraestructura & Datos",
    subtitle: "Escala segura y observabilidad",
    accent: "#00C2FF",
    accentRgb: "0,194,255",
    status: "OPS_MODE",
    services: [
      {
        icon: Cloud,
        title: "Infraestructura y nube",
        desc: "AWS, GCP, Azure. Deploy, CI/CD y monitoreo continuo.",
        tag: "24/7",
        metric: "CLOUD",
      },
      {
        icon: Lock,
        title: "Ciberseguridad",
        desc: "Hardening, pentesting y cumplimiento normativo.",
        tag: "Auditoría gratis",
        metric: "SECURE",
      },
      {
        icon: BarChart3,
        title: "Analítica y BI",
        desc: "Dashboards que deciden por ti, con datos en tiempo real.",
        tag: "Tiempo real",
        metric: "INSIGHT",
      },
    ],
  },
  {
    id: "support",
    number: "03",
    title: "Soporte & Calidad",
    subtitle: "Tu operación nunca se detiene",
    accent: "#7C3AED",
    accentRgb: "124,58,237",
    status: "SUPPORT_MODE",
    services: [
      {
        icon: Shield,
        title: "QA y testing",
        desc: "Calidad automatizada y manual continua en cada release.",
        tag: "Automatizado",
        metric: "QUALITY",
      },
      {
        icon: Settings,
        title: "Mantenimiento y soporte",
        desc: "SLA, monitoreo proactivo y evolución continua.",
        tag: "SLA 99.9%",
        metric: "UPTIME",
      },
      {
        icon: Rocket,
        title: "Escalado y optimización",
        desc: "Mejora continua de rendimiento, costos y experiencia.",
        tag: "Continuo",
        metric: "SCALE",
      },
    ],
  },
];