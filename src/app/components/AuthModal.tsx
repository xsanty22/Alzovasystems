import { useState, useEffect } from "react";
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2, Phone, Building2, Briefcase } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

const businessTypes = [
  { value: "", label: "Selecciona..." },
  { value: "retail", label: "Retail / Tienda" },
  { value: "restaurant", label: "Restaurante / Gastronomía" },
  { value: "supermarket", label: "Supermercado / Minimarket" },
  { value: "pharmacy", label: "Farmacia" },
  { value: "distribution", label: "Distribuidora / Logística" },
  { value: "services", label: "Servicios profesionales" },
  { value: "other", label: "Otro" },
];

export function AuthModal({ open, onClose, initialMode = "login" }: Props) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);

  // Campos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [businessType, setBusinessType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const reset = () => {
    setError(null);
    setSuccess(null);
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) setError(error);
        else onClose();
      } else if (mode === "register") {
        if (password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres");
          setLoading(false);
          return;
        }
        if (phone.replace(/\D/g, "").length < 7) {
          setError("Ingresa un teléfono válido");
          setLoading(false);
          return;
        }
        const { error } = await signUp({
          email,
          password,
          fullName,
          phone,
          company,
          businessType,
        });
        if (error) setError(error);
        else {
          setSuccess("¡Cuenta creada! Revisa tu email para confirmar y luego inicia sesión.");
          setTimeout(() => { reset(); setMode("login"); }, 3000);
        }
      } else if (mode === "forgot") {
        const { error } = await resetPassword(email);
        if (error) setError(error);
        else setSuccess("Te enviamos un email para recuperar tu contraseña.");
      }
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const inputStyle = {
    background: "rgba(255,255,255,0.03)",
    borderColor: "rgba(255,255,255,0.08)",
    color: "#FFFFFF",
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden animate-slide-up max-h-[92vh] overflow-y-auto"
        style={{
          background: "linear-gradient(145deg, #0A1A2F 0%, #0B0F1A 100%)",
          border: "1px solid rgba(0,102,255,0.25)",
          boxShadow: "0 40px 120px -20px rgba(0,102,255,0.4)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors z-10"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center mb-7">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)" }}
            >
              <UserIcon size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {mode === "login" && "Iniciar sesión"}
              {mode === "register" && "Crear cuenta"}
              {mode === "forgot" && "Recuperar contraseña"}
            </h2>
            <p className="text-sm" style={{ color: "#8B94A8" }}>
              {mode === "login" && "Accede a tu portal de cliente"}
              {mode === "register" && "Regístrate para gestionar tus proyectos"}
              {mode === "forgot" && "Te enviaremos un email de recuperación"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                  <input
                    type="text"
                    placeholder="Nombre completo *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:outline-none focus:border-[#0066FF]"
                    style={inputStyle}
                  />
                </div>

                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                  <input
                    type="tel"
                    placeholder="Teléfono / WhatsApp *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:outline-none focus:border-[#0066FF]"
                    style={inputStyle}
                  />
                </div>

                <div className="relative">
                  <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                  <input
                    type="text"
                    placeholder="Empresa (opcional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:outline-none focus:border-[#0066FF]"
                    style={inputStyle}
                  />
                </div>

                <div className="relative">
                  <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" style={{ color: "#8B94A8" }} />
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:outline-none focus:border-[#0066FF] appearance-none"
                    style={inputStyle}
                  >
                    {businessTypes.map((bt) => (
                      <option key={bt.value} value={bt.value} style={{ background: "#0A1A2F" }}>
                        {bt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:outline-none focus:border-[#0066FF]"
                style={inputStyle}
              />
            </div>

            {mode !== "forgot" && (
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B94A8" }} />
                <input
                  type="password"
                  placeholder={mode === "register" ? "Contraseña (mín. 6 caracteres)" : "Contraseña"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:outline-none focus:border-[#0066FF]"
                  style={inputStyle}
                />
              </div>
            )}

            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#86EFAC" }}
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #0066FF 0%, #0052CC 100%)",
                boxShadow: "0 12px 32px rgba(0,102,255,0.35)",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  {mode === "login" && "Iniciar sesión"}
                  {mode === "register" && "Crear cuenta"}
                  {mode === "forgot" && "Enviar email"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            {mode === "login" && (
              <>
                <button
                  onClick={() => { reset(); setMode("forgot"); }}
                  className="transition-colors hover:text-white block w-full"
                  style={{ color: "#8B94A8" }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <div style={{ color: "#8B94A8" }}>
                  ¿No tienes cuenta?{" "}
                  <button
                    onClick={() => { reset(); setMode("register"); }}
                    className="font-semibold transition-colors"
                    style={{ color: "#0066FF" }}
                  >
                    Regístrate aquí
                  </button>
                </div>
              </>
            )}
            {mode === "register" && (
              <div style={{ color: "#8B94A8" }}>
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => { reset(); setMode("login"); }}
                  className="font-semibold transition-colors"
                  style={{ color: "#0066FF" }}
                >
                  Inicia sesión
                </button>
              </div>
            )}
            {mode === "forgot" && (
              <button
                onClick={() => { reset(); setMode("login"); }}
                className="font-semibold transition-colors"
                style={{ color: "#0066FF" }}
              >
                ← Volver a iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}