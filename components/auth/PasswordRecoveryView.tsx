"use client";

import React, { useState, useEffect } from 'react';
import { ScreenView } from '@/types/clinical';
import { CLINIC_LOGO_URL } from '@/data/mockData';
import {
  KeyRound,
  Mail,
  User,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

interface PasswordRecoveryViewProps {
  onNavigate: (view: ScreenView) => void;
  initialSubStep?: 'request' | 'reset' | 'expired';
}

export const PasswordRecoveryView: React.FC<PasswordRecoveryViewProps> = ({
  onNavigate,
  initialSubStep = 'request',
}) => {
  const [subStep, setSubStep] = useState<'request' | 'sent' | 'reset' | 'expired'>(initialSubStep);

  // Request form state
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('1028455902');
  const [email, setEmail] = useState('c.morales@email.com');
  const [resendTimer, setResendTimer] = useState(58);

  // Reset form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdownRedirect, setCountdownRedirect] = useState(3);

  // Countdown timer for email resend
  useEffect(() => {
    let interval: any = null;
    if (subStep === 'sent' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [subStep, resendTimer]);

  // Success redirect countdown
  useEffect(() => {
    let interval: any = null;
    if (showSuccessModal && countdownRedirect > 0) {
      interval = setInterval(() => {
        setCountdownRedirect((c) => c - 1);
      }, 1000);
    } else if (showSuccessModal && countdownRedirect === 0) {
      onNavigate('login');
    }
    return () => clearInterval(interval);
  }, [showSuccessModal, countdownRedirect, onNavigate]);

  // Live password validation
  const hasMinLen = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasSpecial = /[@#$%^&*!_]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = hasMinLen && hasNumber && hasUpper && hasSpecial && passwordsMatch;

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubStep('sent');
    setResendTimer(58);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setShowSuccessModal(true);
    setCountdownRedirect(3);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
      {/* Sub-step Switcher for easy testing / evaluation */}
      <div className="bg-[#001428] text-white p-2.5 rounded-xl border border-[#0f2942] flex items-center justify-between text-xs">
        <span className="text-[#7991af] font-semibold text-[11px]">Vistas de Recuperación:</span>
        <div className="flex gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => setSubStep('request')}
            className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
              subStep === 'request' || subStep === 'sent' ? 'bg-[#0051d5] text-white' : 'text-[#eff4ff] hover:bg-[#0f2942]'
            }`}
          >
            1. Solicitud
          </button>
          <button
            type="button"
            onClick={() => setSubStep('reset')}
            className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
              subStep === 'reset' ? 'bg-[#0051d5] text-white' : 'text-[#eff4ff] hover:bg-[#0f2942]'
            }`}
          >
            2. Definir Clave
          </button>
          <button
            type="button"
            onClick={() => setSubStep('expired')}
            className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
              subStep === 'expired' ? 'bg-amber-600 text-white' : 'text-[#eff4ff] hover:bg-[#0f2942]'
            }`}
          >
            3. Token Caducado
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#dce9ff] p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[#eff4ff] pb-5">
          <div className="flex items-center gap-3">
            <img
              src={CLINIC_LOGO_URL}
              alt="Logo"
              className="w-10 h-10 object-contain rounded-xl p-1 bg-[#eff4ff] border border-[#dce9ff]"
            />
            <div>
              <span className="text-[10px] font-bold text-[#0051d5] uppercase tracking-wider">
                Seguridad Asistencial
              </span>
              <h1 className="text-lg font-black text-[#001428]">
                {subStep === 'reset'
                  ? 'Definir Nueva Contraseña Segura'
                  : subStep === 'expired'
                  ? 'Token de Seguridad Caducado'
                  : 'Recuperar Contraseña de Acceso'}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-xs font-bold text-[#74777e] hover:text-[#0051d5] flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver</span>
          </button>
        </div>

        {/* STEP 1: Request Recovery Link */}
        {subStep === 'request' && (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <p className="text-xs text-[#74777e] leading-relaxed">
              Ingrese su documento de identidad y el correo electrónico registrado en su afiliación de EPS Sanitas para emitir un enlace criptográfico temporal.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                  Tipo Doc.
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#0051d5]"
                >
                  <option value="CC">C.C. Cédula</option>
                  <option value="TI">T.I. Tarjeta</option>
                  <option value="CE">C.E. Extranjería</option>
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
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#0051d5]"
                  />
                  <User className="w-4 h-4 text-[#74777e] absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                Correo Electrónico Afiliado
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-[#0051d5]"
                />
                <Mail className="w-4 h-4 text-[#74777e] absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer pt-2"
            >
              <span>Enviar Enlace de Recuperación Seguro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Link Sent Confirmation */}
        {subStep === 'sent' && (
          <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-blue-50 text-[#0051d5] rounded-2xl flex items-center justify-center mx-auto border border-[#dce9ff]">
              <Mail className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#001428]">
                Enlace de Recuperación Emitido
              </h2>
              <p className="text-xs text-[#74777e] mt-1 max-w-sm mx-auto">
                Hemos enviado las instrucciones a <strong className="text-[#001428]">{email}</strong>. El enlace tiene una vigencia reglamentaria de 15 minutos.
              </p>
            </div>

            <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-3 text-xs text-[#0051d5] flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {resendTimer > 0
                  ? `Reenviar nuevo enlace en ${resendTimer}s`
                  : 'Ya puede solicitar un nuevo enlace si no lo ha recibido'}
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSubStep('reset')}
                className="w-full py-2.5 bg-[#0051d5] text-white text-xs font-bold rounded-xl hover:bg-[#003ea8] transition-colors cursor-pointer shadow-sm"
              >
                Simular Clic en Enlace Recibido (Paso 2)
              </button>

              <button
                type="button"
                onClick={() => setSubStep('request')}
                className="text-xs font-semibold text-[#74777e] hover:text-[#001428] cursor-pointer"
              >
                Cambiar dirección de correo
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Define New Password */}
        {subStep === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-3 text-xs text-[#0b1c30] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0051d5] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-snug">
                Token criptográfico verificado con éxito para <strong className="font-semibold">Carolina Morales</strong> (CC 1.028.455.902). Establezca una nueva clave.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingrese nueva clave"
                  className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[#001428] focus:outline-none focus:border-[#0051d5]"
                />
                <KeyRound className="w-4 h-4 text-[#74777e] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#74777e] hover:text-[#001428] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita nueva clave"
                  className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[#001428] focus:outline-none focus:border-[#0051d5]"
                />
                <KeyRound className="w-4 h-4 text-[#74777e] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-[#74777e] hover:text-[#001428] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="p-3 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl space-y-1.5 text-[11px]">
              <p className="font-bold text-[#001428]">Requisitos de Seguridad en Vivo:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className={`flex items-center gap-1.5 ${hasMinLen ? 'text-emerald-700 font-semibold' : 'text-[#74777e]'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasMinLen ? 'text-emerald-600' : 'text-neutral-300'}`} />
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-700 font-semibold' : 'text-[#74777e]'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasUpper ? 'text-emerald-600' : 'text-neutral-300'}`} />
                  <span>Al menos 1 mayúscula</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-[#74777e]'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-600' : 'text-neutral-300'}`} />
                  <span>Al menos 1 número</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700 font-semibold' : 'text-[#74777e]'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasSpecial ? 'text-emerald-600' : 'text-neutral-300'}`} />
                  <span>1 símbolo (@#$*!)</span>
                </div>
                <div className={`flex items-center gap-1.5 col-span-2 ${passwordsMatch ? 'text-emerald-700 font-semibold' : 'text-[#74777e]'}`}>
                  <Check className={`w-3.5 h-3.5 ${passwordsMatch ? 'text-emerald-600' : 'text-neutral-300'}`} />
                  <span>Las contraseñas coinciden exactamente</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isFormValid
                  ? 'bg-[#0051d5] hover:bg-[#003ea8] text-white shadow-[#0051d5]/30'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <span>Actualizar Contraseña y Acceder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 4: Expired Token View */}
        {subStep === 'expired' && (
          <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-block font-mono text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase">
                Ref: SEC-EXP401
              </div>
              <h2 className="text-base font-bold text-[#001428] mt-1">
                El Enlace de Seguridad Ha Expirado
              </h2>
              <p className="text-xs text-[#74777e] mt-1 max-w-sm mx-auto leading-relaxed">
                Por política de protección de datos personales de EPS Sanitas, los tokens de restablecimiento caducan tras 15 minutos para prevenir accesos no autorizados.
              </p>
            </div>

            {/* Expired Timeline Diagram SVG */}
            <div className="bg-[#f8f9ff] border border-[#dce9ff] rounded-2xl p-4 text-left">
              <div className="flex items-center justify-between text-[11px] text-[#74777e] mb-2 font-mono">
                <span>00:00 Generado</span>
                <span className="text-amber-600 font-bold">+15:00 Caducado</span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-full"></div>
              </div>
              <p className="text-[10px] text-[#74777e] mt-2 text-center">
                El ciclo de vida del certificado criptográfico ha terminado.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSubStep('request')}
              className="w-full py-3 bg-[#0051d5] text-white text-xs font-bold rounded-xl hover:bg-[#003ea8] transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Solicitar Nuevo Enlace de Seguridad</span>
            </button>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center space-y-4 shadow-2xl border border-emerald-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#001428]">
                ¡Contraseña Actualizada!
              </h3>
              <p className="text-xs text-[#74777e] mt-1 leading-snug">
                Sus credenciales han sido reencriptadas bajo el estándar SHA-256 en los servidores centrales de EPS Sanitas.
              </p>
            </div>

            <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#dce9ff] text-xs text-[#0051d5] font-semibold">
              Redirigiendo a Iniciar Sesión en {countdownRedirect}s...
            </div>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full py-2.5 bg-[#0051d5] text-white text-xs font-bold rounded-xl hover:bg-[#003ea8] transition-colors cursor-pointer"
            >
              Iniciar Sesión Ahora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
