"use client";

import React, { useState } from 'react';
import { Doctor, ScreenView } from '@/types/clinical';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Download,
  ArrowLeft,
  QrCode,
} from 'lucide-react';

interface AuthorizationBookingViewProps {
  selectedBooking: {
    doctor: Doctor;
    date: string;
    slot: string;
    type: 'general' | 'especializada' | 'telemedicina';
  } | null;
  onNavigate: (view: ScreenView) => void;
  onAppointmentCreated: (newApt: any) => void;
  onOpenPdf: (docType: 'appointment_reminder' | 'lab_result' | 'medical_order', data: any) => void;
}

export const AuthorizationBookingView: React.FC<AuthorizationBookingViewProps> = ({
  selectedBooking,
  onNavigate,
  onAppointmentCreated,
  onOpenPdf,
}) => {
  // Booking data fallback
  const doctor = selectedBooking?.doctor || {
    id: 'doc-silva',
    name: 'Dra. Marcela Silva',
    specialty: 'Dermatología Clínica',
    subspecialty: 'Dermatología Integral & Fototerapia',
    rmc: '84920',
    university: 'Pontificia Universidad Javeriana',
    rating: 4.9,
    reviewsCount: 128,
    room: 'Consultorio 305',
    facility: 'Sede Central - Torre Médica (Piso 3)',
    facilityAddress: 'Calle 127 # 20-18, Bogotá',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAamPdUtfhqVG77FsXU1f3jvH66yd56OzQKnMb98IFhAB6j-Svm33oGHFzivdGbVN2spSFgul5k29zy_fwOvWvhEYXYwoWveGwV5sq6A5TtYlgBPpqqCdrBV-mDpzpK3hqWVvTj-iSarSXko4cD1wew8EkSA6Gf2iMMloBIvrr6Kpq5pNKJAmkw_ImxmCOHUmnvpXwF3brNwRTPejOtp6xW-n42N0SLn1kVpILYfBjUSHqq52saEH9uWg',
    availableDays: [],
    slots: {},
  };

  const bookingDate = selectedBooking?.date || 'Miércoles, 23 Oct 2024';
  const bookingSlot = selectedBooking?.slot || '09:20 AM';
  const bookingType = selectedBooking?.type || 'especializada';

  // Form states
  const [procedureType, setProcedureType] = useState<'general' | 'especializada'>(
    bookingType === 'general' ? 'general' : 'especializada'
  );
  const [authNumber, setAuthNumber] = useState('AUT-2024-SAN-99420');
  const [symptoms, setSymptoms] = useState(
    'Control semestral por cuadro de dermatitis atópica en antebrazo. Presento picazón y resequedad recurrente durante las últimas dos semanas.'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    'Orden_Medica_Dermatologia_2024.pdf'
  );
  const [remindSms, setRemindSms] = useState(true);
  const [remindEmail, setRemindEmail] = useState(true);
  const [remindWhatsApp, setRemindWhatsApp] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [radicationCode, setRadicationCode] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;

    const radCode = `RAD-2024-${Math.floor(10000 + Math.random() * 90000)}`;
    setRadicationCode(radCode);

    const newAppointment = {
      id: `apt-${Date.now()}`,
      code: radCode,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      subspecialty: doctor.subspecialty,
      doctorAvatar: doctor.avatarUrl,
      room: doctor.room,
      facility: doctor.facility,
      facilityAddress: doctor.facilityAddress,
      date: bookingDate,
      time: bookingSlot,
      duration: '40 min',
      copayAmount: bookingType === 'telemedicina' ? '$0 COP' : '$4.500 COP',
      copayStatus: 'Liquidado en línea',
      status: 'confirmada',
      statusLabel: 'Confirmada',
      preparationNotes: 'Presentar documento original físico y el comprobante digital en ventanilla.',
      authorizationNumber: authNumber,
      type: bookingType,
    };

    onAppointmentCreated(newAppointment);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl border-2 border-[#6ffbbe] p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00a270] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Cita Radicada Exitosamente
            </span>
            <h1 className="text-2xl font-black text-[#001428] mt-2">
              ¡Su cita ha sido confirmada en el sistema!
            </h1>
            <p className="text-xs text-[#74777e] mt-1">
              Hemos enviado el comprobante oficial a su correo registrado y vía SMS.
            </p>
          </div>

          {/* Voucher Details Card */}
          <div className="bg-[#f8f9ff] border border-[#dce9ff] rounded-2xl p-6 text-left space-y-4 max-w-xl mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-[#eff4ff]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#74777e]">Código de Radicación</span>
                <p className="font-mono text-base font-extrabold text-[#0051d5]">{radicationCode}</p>
              </div>
              <div className="w-16 h-16 bg-white p-1 rounded-lg border border-[#dce9ff] flex items-center justify-center">
                <QrCode className="w-12 h-12 text-[#001428]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#74777e]">Especialista:</span>
                <p className="font-bold text-[#001428]">{doctor.name}</p>
                <p className="text-[11px] text-[#0051d5]">{doctor.specialty}</p>
              </div>
              <div>
                <span className="text-[#74777e]">Fecha y Hora:</span>
                <p className="font-bold text-[#001428]">{bookingDate}</p>
                <p className="text-[11px] text-[#0051d5] font-mono">{bookingSlot}</p>
              </div>
              <div>
                <span className="text-[#74777e]">Sede y Consultorio:</span>
                <p className="font-bold text-[#001428]">{doctor.facility}</p>
                <p className="text-[11px] text-[#74777e]">{doctor.room}</p>
              </div>
              <div>
                <span className="text-[#74777e]">Copago Reglamentario:</span>
                <p className="font-bold text-[#001428]">{bookingType === 'telemedicina' ? '$0 COP' : '$4.500 COP'}</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Autorización: {authNumber}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() =>
                onOpenPdf('appointment_reminder', {
                  code: radicationCode,
                  doctorName: doctor.name,
                  specialty: doctor.specialty,
                  date: bookingDate,
                  time: bookingSlot,
                  facility: doctor.facility,
                  facilityAddress: doctor.facilityAddress,
                  room: doctor.room,
                  copayAmount: '$4.500 COP',
                  preparationNotes: 'Presentarse con 15 minutos de antelación.',
                })
              }
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0051d5] text-white text-xs font-bold rounded-xl hover:bg-[#003ea8] transition-colors cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Ficha y Voucher PDF</span>
            </button>

            <button
              onClick={() => onNavigate('my-appointments')}
              className="px-5 py-2.5 bg-[#eff4ff] text-[#0051d5] text-xs font-bold rounded-xl hover:bg-[#dce9ff] border border-[#dce9ff] transition-colors cursor-pointer"
            >
              Ir a Mis Citas Médicas
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 bg-neutral-100 text-[#43474d] text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('search-booking')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#0051d5] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Regresar a Selección de Horario</span>
        </button>
      </div>

      {/* Stepper Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dce9ff] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eff4ff] pb-5">
          <div>
            <span className="text-xs font-bold text-[#0051d5] uppercase tracking-wider">
              Paso 3 de 4 • Validación Asistencial
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#001428] mt-0.5">
              Confirmación, Datos y Autorización EPS
            </h1>
            <p className="text-xs text-[#74777e] mt-1">
              Verificación de derechos en BDUA / ADRES y registro de soporte médico
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1. Médico</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>2. Horario</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0051d5] text-white">
              <span>3</span>
              <span>Datos EPS</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#74777e]">
              <span>4</span>
              <span>Radicación</span>
            </div>
          </div>
        </div>

        {/* Audit Notice Alert */}
        <div className="mt-4 bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-4 flex items-start gap-3 text-xs text-[#0b1c30]">
          <AlertCircle className="w-5 h-5 text-[#0051d5] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#0051d5]">Aviso de Auditoría Asistencial Obligatoria:</p>
            <p className="text-[#43474d] mt-0.5 leading-relaxed">
              Para consultas de segunda especialidad (Dermatología, Cardiología) el Ministerio de Salud exige orden médica emitida con una vigencia no superior a noventa (90) días naturales o número de radicado MIPRES.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Summary Right */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Nivel de Trámite */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-[#001428] uppercase tracking-wider">
              1. Nivel y Tipo de Trámite Clínico
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  procedureType === 'general'
                    ? 'border-[#0051d5] bg-[#eff4ff] ring-1 ring-[#0051d5]'
                    : 'border-[#dce9ff] bg-white hover:bg-[#f8f9ff]'
                }`}
              >
                <input
                  type="radio"
                  name="procedureType"
                  value="general"
                  checked={procedureType === 'general'}
                  onChange={() => setProcedureType('general')}
                  className="text-[#0051d5] focus:ring-[#0051d5]"
                />
                <div>
                  <p className="text-xs font-bold text-[#001428]">Cita Médica General</p>
                  <p className="text-[11px] text-[#74777e]">Procedimiento directo sin auditoría</p>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  procedureType === 'especializada'
                    ? 'border-[#0051d5] bg-[#eff4ff] ring-1 ring-[#0051d5]'
                    : 'border-[#dce9ff] bg-white hover:bg-[#f8f9ff]'
                }`}
              >
                <input
                  type="radio"
                  name="procedureType"
                  value="especializada"
                  checked={procedureType === 'especializada'}
                  onChange={() => setProcedureType('especializada')}
                  className="text-[#0051d5] focus:ring-[#0051d5]"
                />
                <div>
                  <p className="text-xs font-bold text-[#001428]">Cita Especializada</p>
                  <p className="text-[11px] text-[#74777e]">Auditoría asistencial reglamentaria</p>
                </div>
              </label>
            </div>

            {/* Número de Autorización */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                Número de Autorización EPS o Código MIPRES
              </label>
              <input
                type="text"
                required
                value={authNumber}
                onChange={(e) => setAuthNumber(e.target.value)}
                placeholder="Ej: AUT-2024-SAN-884920 / MIPRES-9102"
                className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#001428] focus:outline-none focus:border-[#0051d5]"
              />
              <p className="text-[10px] text-[#74777e] mt-1">
                Puede encontrar este código en su volante de autorización digital de EPS Sanitas o en el portal Mi Seguridad Social.
              </p>
            </div>
          </div>

          {/* Adjuntar Orden Médica */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#001428] uppercase tracking-wider">
                2. Adjuntar Soporte u Orden Médica (Opcional pero Recomendado)
              </h2>
              <span className="text-[10px] text-[#74777e]">Formatos: PDF, JPG, PNG (Hasta 10MB)</span>
            </div>

            {uploadedFileName ? (
              <div className="flex items-center justify-between p-3.5 bg-[#eff4ff] border border-[#dce9ff] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white text-[#0051d5] rounded-lg border border-[#dce9ff]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#001428]">{uploadedFileName}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Documento validado para auditoría (1.4 MB)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUploadedFileName(null)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar archivo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#dce9ff] hover:border-[#0051d5] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#f8f9ff] hover:bg-[#eff4ff] transition-all">
                <Upload className="w-8 h-8 text-[#0051d5]" />
                <p className="text-xs font-bold text-[#001428]">
                  Haga clic para seleccionar o arrastre su archivo aquí
                </p>
                <p className="text-[11px] text-[#74777e]">
                  Escaneo nítido de la fórmula u orden asistencial
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Motivo de Consulta y Síntomas */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#001428] uppercase tracking-wider">
                3. Motivo de Consulta y Síntomas Principales
              </h2>
              <span className="text-[11px] text-[#74777e] font-mono">{symptoms.length}/500 caracteres</span>
            </div>

            <textarea
              rows={3}
              maxLength={500}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describa brevemente la molestia o antecedente relevante para el especialista..."
              className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl p-3 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
            ></textarea>
          </div>

          {/* Canales de Recordatorio */}
          <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-[#001428] uppercase tracking-wider">
              4. Canales de Recordatorio de Cita
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#eff4ff] bg-[#f8f9ff] cursor-pointer">
                <input
                  type="checkbox"
                  checked={remindSms}
                  onChange={(e) => setRemindSms(e.target.checked)}
                  className="rounded text-[#0051d5] focus:ring-[#0051d5]"
                />
                <div>
                  <p className="font-bold text-[#001428]">SMS Celular</p>
                  <p className="text-[10px] text-[#74777e]">+57 312 849 4920</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#eff4ff] bg-[#f8f9ff] cursor-pointer">
                <input
                  type="checkbox"
                  checked={remindEmail}
                  onChange={(e) => setRemindEmail(e.target.checked)}
                  className="rounded text-[#0051d5] focus:ring-[#0051d5]"
                />
                <div>
                  <p className="font-bold text-[#001428]">Correo Electrónico</p>
                  <p className="text-[10px] text-[#74777e]">c.morales@email.com</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#eff4ff] bg-[#f8f9ff] cursor-pointer">
                <input
                  type="checkbox"
                  checked={remindWhatsApp}
                  onChange={(e) => setRemindWhatsApp(e.target.checked)}
                  className="rounded text-[#0051d5] focus:ring-[#0051d5]"
                />
                <div>
                  <p className="font-bold text-[#001428]">WhatsApp Clínico</p>
                  <p className="text-[10px] text-emerald-700 font-medium">Recordatorio interactivo</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Ficha de Cita Médica */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#0051d5] p-5 shadow-lg sticky top-[90px] space-y-4">
            <div className="border-b border-[#eff4ff] pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0051d5] bg-[#eff4ff] px-2 py-0.5 rounded">
                Ficha de Cita Médica
              </span>
              <h3 className="text-base font-bold text-[#001428] mt-1">
                {doctor.specialty}
              </h3>
              <p className="text-xs text-[#74777e]">{doctor.subspecialty}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#dce9ff]"
                />
                <div>
                  <p className="font-bold text-sm text-[#001428]">{doctor.name}</p>
                  <p className="text-[11px] text-[#74777e]">RMC {doctor.rmc}</p>
                </div>
              </div>

              <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#eff4ff] space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#0051d5]" />
                  <span className="font-semibold text-[#001428]">{bookingDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#0051d5]" />
                  <span className="font-bold text-[#001428] font-mono">{bookingSlot} (40 min)</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-[#e5eeff]">
                  <MapPin className="w-3.5 h-3.5 text-[#0051d5] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#001428]">{doctor.facility}</p>
                    <p className="text-[10px] text-[#74777e]">{doctor.room}</p>
                  </div>
                </div>
              </div>

              {/* Copay summary */}
              <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#dce9ff] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#74777e]">Copago Reglamentario:</span>
                  <p className="text-xs font-bold text-[#001428]">Plan Premium Sanitas</p>
                </div>
                <span className="font-black text-sm text-[#001428] font-mono">
                  {bookingType === 'telemedicina' ? '$0 COP' : '$4.500 COP'}
                </span>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 pt-2 cursor-pointer text-[11px] text-[#43474d] leading-snug">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#0051d5] focus:ring-[#0051d5]"
                />
                <span>
                  He verificado mis datos y acepto las políticas de asignación, cancelación y protección de datos (Ley 1581 de 2012 y Res. 1552).
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={!termsAccepted}
              className={`w-full py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                termsAccepted
                  ? 'bg-[#0051d5] hover:bg-[#003ea8] text-white shadow-[#0051d5]/30'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Confirmar y Enviar a Validación</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
