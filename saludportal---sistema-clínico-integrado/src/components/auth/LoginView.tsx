import React, { useState } from 'react';
import { ScreenView } from '../../types/clinical';
import { CLINIC_LOGO_URL } from '../../data/mockData';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Building,
  KeyRound,
  Server,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onNavigate: (view: ScreenView) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onNavigate }) => {
  // Simulator states: 'normal' | 'error' | 'expired' | 'loading'
  const [simulationState, setSimulationState] = useState<'normal' | 'error' | 'expired' | 'loading'>('normal');

  const [documentType, setDocumentType] = useState('CC');
  const [documentNumber, setDocumentNumber] = useState('1028455902');
  const [password, setPassword] = useState('Sanitas2024*!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (simulationState === 'error') {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* 1. Clinical State Simulator Toolbar */}
      <div className="bg-[#001428] text-white p-3 rounded-2xl border border-[#0f2942] flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 text-xs">
          <Activity className="w-4 h-4 text-[#6ffbbe]" />
          <span className="font-bold text-[#eff4ff]">Simulador de Estados Clínicos:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSimulationState('normal')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              simulationState === 'normal'
                ? 'bg-[#0051d5] text-white shadow-xs'
                : 'bg-[#0f2942] text-[#7991af] hover:text-white'
            }`}
          >
            Estado Normal
          </button>
          <button
            onClick={() => setSimulationState('error')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              simulationState === 'error'
                ? 'bg-[#ba1a1a] text-white shadow-xs'
                : 'bg-[#0f2942] text-[#7991af] hover:text-white'
            }`}
          >
            Error Credenciales
          </button>
          <button
            onClick={() => setSimulationState('expired')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              simulationState === 'expired'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-[#0f2942] text-[#7991af] hover:text-white'
            }`}
          >
            Token Expirado
          </button>
          <button
            onClick={() => setSimulationState('loading')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              simulationState === 'loading'
                ? 'bg-[#00a270] text-white shadow-xs'
                : 'bg-[#0f2942] text-[#7991af] hover:text-white'
            }`}
          >
            Autenticando...
          </button>
        </div>
      </div>

      {/* 2. Main Login Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 7 Cols: Login Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#dce9ff] p-8 sm:p-10 shadow-lg flex flex-col justify-between space-y-6">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={CLINIC_LOGO_URL}
                alt="SaludPortal Logo"
                className="w-12 h-12 object-contain rounded-2xl p-1 bg-[#eff4ff] border border-[#dce9ff]"
              />
              <div>
                <h1 className="text-xl font-bold text-[#001428] leading-none">
                  Salud<span className="text-[#0051d5]">Portal</span>
                </h1>
                <p className="text-xs text-[#74777e] mt-1">Portal Oficial del Paciente • EPS Sanitas</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#001428] tracking-tight">
                Iniciar Sesión en su Portal
              </h2>
              <p className="text-xs text-[#74777e] mt-1">
                Acceso seguro a su historial clínico, citas médicas y autorizaciones asistenciales
              </p>
            </div>

            {/* Error simulation banner */}
            {simulationState === 'error' && (
              <div className="mb-5 bg-[#ffdad6] border border-[#ba1a1a]/30 p-4 rounded-xl text-[#93000a] text-xs flex items-start gap-2.5 animate-in shake duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Error de Autenticación (Ref: SEC-401)</p>
                  <p className="mt-0.5 leading-snug">
                    El documento o la contraseña ingresada no coinciden con los registros activos en la BDUA. Intente nuevamente o restablezca su acceso.
                  </p>
                </div>
              </div>
            )}

            {/* Expired token simulation banner */}
            {simulationState === 'expired' && (
              <div className="mb-5 bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                <div>
                  <p className="font-bold">Sesión Caducada por Inactividad</p>
                  <p className="mt-0.5 leading-snug">
                    Por normatividad de seguridad MinSalud, su sesión anterior ha expirado tras 15 minutos sin interacción clínica. Ingrese nuevamente sus credenciales.
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                    Tipo Doc.
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2.5 text-xs font-bold text-[#001428] focus:outline-none focus:border-[#0051d5]"
                  >
                    <option value="CC">C.C. Cédula</option>
                    <option value="TI">T.I. Tarjeta</option>
                    <option value="CE">C.E. Extranjería</option>
                    <option value="PA">Pasaporte</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                    Número de Documento
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      placeholder="Ingrese su número de documento"
                      className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono font-bold text-[#001428] focus:outline-none focus:border-[#0051d5]"
                    />
                    <User className="w-4 h-4 text-[#74777e] absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#74777e] uppercase">
                    Contraseña de Acceso
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('recovery')}
                    className="text-[11px] font-bold text-[#0051d5] hover:underline cursor-pointer"
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[#001428] focus:outline-none focus:border-[#0051d5]"
                  />
                  <Lock className="w-4 h-4 text-[#74777e] absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#74777e] hover:text-[#001428] cursor-pointer"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#43474d]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#0051d5] focus:ring-[#0051d5]"
                  />
                  <span>Recordar mis datos en este equipo seguro</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || simulationState === 'loading'}
                className="w-full py-3 bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting || simulationState === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Autenticando con BDUA / Sanitas...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar a mi Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Footer Links */}
          <div className="pt-4 border-t border-[#eff4ff] space-y-2 text-center text-xs">
            <p className="text-[#74777e]">
              ¿No tiene una cuenta activa?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-[#0051d5] font-bold hover:underline cursor-pointer"
              >
                Crear cuenta de paciente
              </button>
            </p>

            <p className="text-[11px] text-[#74777e]">
              Acceso institucional exclusivo:{' '}
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-[#43474d] hover:text-[#0051d5] underline cursor-pointer"
              >
                Portal para Personal Médico y Asistencial
              </button>
            </p>
          </div>
        </div>

        {/* Right 5 Cols: Clinical Trust & Assurance Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#001428] via-[#0f2942] to-[#001428] rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6ffbbe] bg-[#6ffbbe]/15 px-3 py-1 rounded-full border border-[#6ffbbe]/30">
              Seguridad Asistencial Certificada
            </span>

            <h3 className="text-xl font-bold text-white mt-4">
              Portal Clínico Confiable y Protegido
            </h3>
            <p className="text-xs text-[#d1e4ff] mt-2 leading-relaxed">
              Toda la información médica y de consulta se transmite mediante canales de cifrado homologados por el Ministerio de Salud y Protección Social.
            </p>

            {/* Diagnostic Metrics Matrix */}
            <div className="grid grid-cols-3 gap-2 my-6 text-center">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <p className="text-lg font-black text-[#6ffbbe] font-mono">99.98%</p>
                <p className="text-[10px] text-[#7991af] uppercase">Disponibilidad</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <p className="text-lg font-black text-[#d1e4ff] font-mono">18 Redes</p>
                <p className="text-[10px] text-[#7991af] uppercase">Convenios EPS</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <p className="text-lg font-black text-[#6ffbbe] font-mono">AES-256</p>
                <p className="text-[10px] text-[#7991af] uppercase">Cifrado Clínico</p>
              </div>
            </div>

            {/* Trust Bullet Items */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[#0051d5] rounded-lg text-white shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Ley Estatutaria de Salud y Datos</p>
                  <p className="text-[11px] text-[#7991af]">
                    Cumplimiento integral con la Ley 1581 de 2012 y Reserva del Acto Médico.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[#0051d5] rounded-lg text-white shrink-0 mt-0.5">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Validación Biométrica y OTP</p>
                  <p className="text-[11px] text-[#7991af]">
                    Mecanismo de verificación cruzada con la base de datos oficial ADRES.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[#0051d5] rounded-lg text-white shrink-0 mt-0.5">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Infraestructura de Nube Segura</p>
                  <p className="text-[11px] text-[#7991af]">
                    Certificaciones internacionales ISO 27001, HIPAA e interoperabilidad HL7.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[10px] text-[#7991af] flex items-center justify-between">
            <span>Vigilado Supersalud Colombia</span>
            <span>Línea Gratuita: #936</span>
          </div>
        </div>
      </div>
    </div>
  );
};
