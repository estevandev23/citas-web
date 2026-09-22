"use client";

import React, { useState } from 'react';
import { ScreenView } from '@/types/clinical';
import { CLINIC_LOGO_URL } from '@/data/mockData';
import { ApiError, register } from '@/lib/api';
import {
  CheckCircle2,
  ShieldCheck,
  User,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
  Check,
  FileCheck2,
  AlertCircle,
} from 'lucide-react';

interface RegisterViewProps {
  onRegisterSuccess: () => void;
  onNavigate: (view: ScreenView) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onRegisterSuccess, onNavigate }) => {
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('1028455902');
  const [firstName, setFirstName] = useState('Carolina');
  const [lastName, setLastName] = useState('Morales');
  const [phone, setPhone] = useState('3128494920');
  const [email, setEmail] = useState('c.morales@email.com');
  const [emailConfirm, setEmailConfirm] = useState('c.morales@email.com');
  const [password, setPassword] = useState('Sanitas2024*!');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [sgsssAccepted, setSgsssAccepted] = useState(true);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live password requirements
  const hasMinLen = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[@#$%^&*!_]/.test(password);
  const isPasswordValid = hasMinLen && hasNumber && hasUpper && hasSpecial;
  const emailsMatch = email.trim().toLowerCase() === emailConfirm.trim().toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || !termsAccepted || !sgsssAccepted) return;

    if (!emailsMatch) {
      setErrorMessage('Los correos electrónicos ingresados no coinciden.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        documentType: docType.trim(),
        documentNumber: docNumber.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });

      setIsSuccess(true);
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrorMessage('Ya existe una cuenta registrada con ese correo electrónico o número de documento.');
      } else if (err instanceof ApiError && err.payload?.message) {
        setErrorMessage(err.payload.message);
      } else {
        setErrorMessage('No fue posible conectar con el servidor asistencial. Por favor verifique que citas-api esté en ejecución.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-[#dce9ff] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eff4ff] pb-5">
          <div className="flex items-center gap-3">
            <img
              src={CLINIC_LOGO_URL}
              alt="Logo"
              className="w-10 h-10 object-contain rounded-xl p-1 bg-[#eff4ff] border border-[#dce9ff]"
            />
            <div>
              <span className="text-xs font-bold text-[#0051d5] uppercase tracking-wider">
                Afiliación Asistencial Oficial
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#001428] mt-0.5">
                Registro de Nuevo Paciente
              </h1>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1. Triage</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0051d5] text-white">
              <span>2</span>
              <span>Datos & Seguridad</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#74777e]">
              <span>3</span>
              <span>Activación</span>
            </div>
          </div>
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-white rounded-3xl border-2 border-[#6ffbbe] p-12 text-center max-w-lg mx-auto shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-[#001428]">¡Cuenta Creada Exitosamente!</h2>
          <p className="text-xs text-[#74777e]">
            Su afiliación ha sido verificada en la BDUA de EPS Sanitas. Redirigiendo a su portal de paciente...
          </p>
          <div className="pt-4">
            <span className="inline-block w-6 h-6 border-2 border-[#0051d5] border-t-transparent rounded-full animate-spin"></span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Left 8 cols */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
            {/* Error Message Banner */}
            {errorMessage && (
              <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 p-4 rounded-xl text-[#93000a] text-xs flex items-start gap-2.5 animate-in shake duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Error en Registro</p>
                  <p className="mt-0.5 leading-snug">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Section 1: Identificación Oficial */}
            <div className="bg-white rounded-2xl border border-[#dce9ff] p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-[#001428] uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#0051d5]" />
                <span>1. Identificación Oficial del Paciente</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                    Tipo de Doc.
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#0051d5]"
                  >
                    <option value="CC">C.C. Cédula</option>
                    <option value="TI">T.I. Tarjeta</option>
                    <option value="CE">C.E. Extranjería</option>
                    <option value="PA">Pasaporte</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#0051d5]"
                  />
                </div>
              </div>

              {/* BDUA verification indicator */}
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Documento cotejado con éxito en la Base Única de Afiliados (BDUA / EPS Sanitas).</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                    Nombres
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0051d5]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0051d5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                  Teléfono Celular / WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 000 0000"
                    disabled={isSubmitting}
                    className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-[#0051d5]"
                  />
                  <Phone className="w-4 h-4 text-[#74777e] absolute left-3 top-2.5" />
                </div>
                <p className="text-[10px] text-[#74777e] mt-1">
                  Utilizaremos esta línea para el envío de recordatorios y confirmación biométrica por WhatsApp.
                </p>
              </div>
            </div>

            {/* Section 2: Acceso y Seguridad */}
            <div className="bg-white rounded-2xl border border-[#dce9ff] p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-[#001428] uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0051d5]" />
                <span>2. Acceso y Credenciales Seguras</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0051d5]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                    Confirmar Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={emailConfirm}
                    onChange={(e) => setEmailConfirm(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0051d5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                  Contraseña de Acceso
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0051d5]"
                />

                {/* Password Strength Checklist */}
                <div className="mt-3 p-3 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl space-y-1.5 text-[11px]">
                  <p className="font-bold text-[#001428]">Requisitos de Seguridad de Contraseña:</p>
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
                      <span>1 caracter especial (@#$*!)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Términos y Consentimiento */}
            <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3 text-xs text-[#43474d]">
              <label className="flex items-start gap-2 cursor-pointer leading-snug">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#0051d5] focus:ring-[#0051d5]"
                />
                <span>
                  Autorizo el tratamiento de mis datos personales sensibles conforme a la Ley 1581 de 2012 y el uso de canales electrónicos para notificación de citas y auditorías asistenciales.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer leading-snug">
                <input
                  type="checkbox"
                  required
                  checked={sgsssAccepted}
                  onChange={(e) => setSgsssAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#0051d5] focus:ring-[#0051d5]"
                />
                <span>
                  Declaro que los datos suministrados corresponden a mi condición real de afiliación en el Sistema General de Seguridad Social en Salud (SGSSS).
                </span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!isPasswordValid || !termsAccepted || !sgsssAccepted || isSubmitting}
              className={`w-full py-3.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isPasswordValid && termsAccepted && sgsssAccepted && !isSubmitting
                  ? 'bg-[#0051d5] hover:bg-[#003ea8] text-white shadow-[#0051d5]/30'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Registrando datos en BDUA / Sanitas...</span>
                </>
              ) : (
                <>
                  <span>Completar Registro y Crear Cuenta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Right 4 cols: Benefits Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gradient-to-br from-[#001428] to-[#0f2942] rounded-3xl p-6 text-white space-y-5 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6ffbbe] bg-[#6ffbbe]/15 px-3 py-1 rounded-full border border-[#6ffbbe]/30">
                Beneficios Asistenciales
              </span>

              <h3 className="text-lg font-bold">Ventajas de su Cuenta SaludPortal</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[#0051d5] rounded-lg text-white shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-[#6ffbbe]" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Citas Médicas 24/7</p>
                    <p className="text-[11px] text-[#7991af]">
                      Agende, reprograme o cancele turnos en tiempo real sin filas ni llamadas telefónicas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[#0051d5] rounded-lg text-white shrink-0 mt-0.5">
                    <FileCheck2 className="w-4 h-4 text-[#6ffbbe]" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Laboratorio y Exámenes</p>
                    <p className="text-[11px] text-[#7991af]">
                      Descargue resultados con firma digital médica tan pronto sean emitidos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[#0051d5] rounded-lg text-white shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-[#6ffbbe]" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Radicación MIPRES</p>
                    <p className="text-[11px] text-[#7991af]">
                      Adjunte órdenes médicas para auditoría inmediata con seguimiento paso a paso.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-[#7991af]">
                  ¿Ya tiene una cuenta creada?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="text-[#6ffbbe] font-bold hover:underline cursor-pointer"
                  >
                    Iniciar Sesión
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
