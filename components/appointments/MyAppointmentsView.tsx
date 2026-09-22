"use client";

import React, { useState } from 'react';
import { Appointment, ScreenView } from '@/types/clinical';
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
} from 'lucide-react';

interface MyAppointmentsViewProps {
  appointments: Appointment[];
  onNavigate: (view: ScreenView) => void;
  onOpenPdf: (docType: 'appointment_reminder' | 'lab_result' | 'medical_order', data: any) => void;
  onUpdateAppointment: (updated: Appointment) => void;
  onCancelAppointment: (id: string, reason: string) => void;
}

export const MyAppointmentsView: React.FC<MyAppointmentsViewProps> = ({
  appointments,
  onNavigate,
  onOpenPdf,
  onUpdateAppointment,
  onCancelAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'cancelled'>('active');

  // Reschedule panel state
  const [reschedulingAptId, setReschedulingAptId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2024-10-29');
  const [newTime, setNewTime] = useState('02:30 PM');
  const [rescheduleReason, setRescheduleReason] = useState('Cruce con horario laboral imprevisto');

  // Cancel modal state
  const [cancellingAptId, setCancellingAptId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Cruce de horario laboral');

  // Success alert
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeAppointments = appointments.filter((a) => a.status !== 'cancelada');
  const cancelledAppointments = appointments.filter((a) => a.status === 'cancelada');

  const historyAppointments = [
    {
      id: 'hist-1',
      code: 'CP-71209',
      doctorName: 'Dr. Alejandro Restrepo',
      specialty: 'Medicina Interna',
      subspecialty: 'Control Rutinario Anual',
      doctorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2RvCO8HGCm0zTM4gL7jil80hiSjfzpGwh2zhp6E4avpqUyx6UzD07dzLimVQZ0xZxyYqb1C5pS2TxMeN6iNATI_XqqzoXBfFfuHL4ZEE2GLacuQmSqcHbzKphXKfzAgsFFKd5NyF79X7Uo_OluTxHdQDSIW3KAO_mO46bY2MJkccnoJGlMbM2tKgGLTuDWhvySeJquqbfpbIN5ll-RYi4b3BUtz53EOJkd52EdpJBxcDizOAc59Sdkg',
      room: 'Consultorio 402',
      facility: 'Sede Norte',
      facilityAddress: 'Autopista Norte # 122-45',
      date: '10 Mayo 2024',
      time: '10:00 AM',
      duration: '40 min',
      copayAmount: '$4.500 COP',
      copayStatus: 'Pagado',
      status: 'confirmada' as const,
      statusLabel: 'Atendida - Historia Registrada',
      type: 'general' as const,
    },
    {
      id: 'hist-2',
      code: 'CP-69102',
      doctorName: 'Dra. Marcela Silva',
      specialty: 'Dermatología Clínica',
      subspecialty: 'Dermatoscopia Preventiva',
      doctorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAamPdUtfhqVG77FsXU1f3jvH66yd56OzQKnMb98IFhAB6j-Svm33oGHFzivdGbVN2spSFgul5k29zy_fwOvWvhEYXYwoWveGwV5sq6A5TtYlgBPpqqCdrBV-mDpzpK3hqWVvTj-iSarSXko4cD1wew8EkSA6Gf2iMMloBIvrr6Kpq5pNKJAmkw_ImxmCOHUmnvpXwF3brNwRTPejOtp6xW-n42N0SLn1kVpILYfBjUSHqq52saEH9uWg',
      room: 'Consultorio 305',
      facility: 'Sede Central',
      facilityAddress: 'Calle 127 # 20-18',
      date: '14 Febrero 2024',
      time: '03:30 PM',
      duration: '30 min',
      copayAmount: '$4.500 COP',
      copayStatus: 'Pagado',
      status: 'confirmada' as const,
      statusLabel: 'Atendida - Fórmula Emitida',
      type: 'especializada' as const,
    },
  ];

  const handleConfirmReschedule = (apt: Appointment) => {
    const updated: Appointment = {
      ...apt,
      date: newDate === '2024-10-29' ? 'Martes, 29 Oct 2024' : 'Jueves, 31 Oct 2024',
      time: newTime,
      status: 'reprogramacion',
      statusLabel: 'Reprogramada por el Paciente',
      preparationNotes: `${apt.preparationNotes || ''} (Cita reasignada para el ${newDate} a las ${newTime}).`,
    };

    onUpdateAppointment(updated);
    setReschedulingAptId(null);
    setActionNotice(`Cita de ${apt.specialty} reprogramada exitosamente.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleConfirmCancellation = () => {
    if (!cancellingAptId) return;
    onCancelAppointment(cancellingAptId, cancelReason);
    setCancellingAptId(null);
    setActionNotice('Cita cancelada correctamente. El cupo ha sido liberado.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Top Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#dce9ff] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#0051d5] uppercase tracking-wider">
            Gestión Asistencial
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#001428] mt-0.5">
            Mis Citas Médicas
          </h1>
          <p className="text-xs text-[#74777e] mt-1">
            Administre, descargue comprobantes, reprograme o libere cupos asignados
          </p>
        </div>

        <button
          onClick={() => onNavigate('search-booking')}
          className="px-4 py-2.5 bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0"
        >
          + Solicitar Nueva Cita
        </button>
      </div>

      {/* Temporary Notice */}
      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#e5eeff] gap-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'active'
              ? 'border-[#0051d5] text-[#0051d5]'
              : 'border-transparent text-[#74777e] hover:text-[#001428]'
          }`}
        >
          Próximas y en Proceso ({activeAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'history'
              ? 'border-[#0051d5] text-[#0051d5]'
              : 'border-transparent text-[#74777e] hover:text-[#001428]'
          }`}
        >
          Historial y Realizadas ({historyAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'cancelled'
              ? 'border-[#0051d5] text-[#0051d5]'
              : 'border-transparent text-[#74777e] hover:text-[#001428]'
          }`}
        >
          Canceladas ({cancelledAppointments.length})
        </button>
      </div>

      {/* Tab: Active Appointments */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {activeAppointments.map((apt, index) => {
            const isFeatured = index === 0; // Expanded master card
            const isRescheduling = reschedulingAptId === apt.id;

            return (
              <div
                key={apt.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isFeatured
                    ? 'border-2 border-[#0051d5]/40 shadow-md p-6'
                    : 'border-[#dce9ff] shadow-xs p-5'
                }`}
              >
                {/* Header row with status badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eff4ff]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-[#eff4ff] text-[#0051d5] px-2.5 py-1 rounded-md border border-[#dce9ff]">
                      {apt.code}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        apt.status === 'confirmada'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : apt.status === 'en_revision'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {apt.statusLabel}
                    </span>
                  </div>

                  <div className="text-left sm:text-right text-xs text-[#74777e]">
                    <span>Liquidación EPS: </span>
                    <strong className="text-[#001428] font-bold">{apt.copayAmount}</strong>
                    <span className="text-[10px] ml-1">({apt.copayStatus})</span>
                  </div>
                </div>

                {/* Doctor info & schedule */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-4">
                  {/* Doctor avatar & names */}
                  <div className="flex items-start gap-3 md:col-span-1">
                    <img
                      src={apt.doctorAvatar}
                      alt={apt.doctorName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#0051d5]/20 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0051d5]">
                        {apt.specialty}
                      </span>
                      <h3 className="text-sm font-bold text-[#001428] mt-0.5">{apt.doctorName}</h3>
                      <p className="text-xs text-[#74777e]">{apt.subspecialty}</p>
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="space-y-2 text-xs md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#f8f9ff] p-3 rounded-xl border border-[#eff4ff]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#0051d5]" />
                        <div>
                          <p className="text-[10px] text-[#74777e] uppercase font-semibold">Fecha y Hora</p>
                          <p className="font-bold text-[#001428]">{apt.date} • {apt.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#0051d5]" />
                        <div>
                          <p className="text-[10px] text-[#74777e] uppercase font-semibold">Ubicación</p>
                          <p className="font-bold text-[#001428]">{apt.facility} • {apt.room}</p>
                        </div>
                      </div>
                    </div>

                    {/* Preparation Notes */}
                    {apt.preparationNotes && (
                      <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#dce9ff] flex items-start gap-2 text-xs">
                        <Info className="w-4 h-4 text-[#0051d5] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#43474d]">
                          <strong className="text-[#0051d5] font-semibold">Indicaciones Clínicas: </strong>
                          {apt.preparationNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reschedule Interactive Panel (Collapsible) */}
                {isRescheduling && (
                  <div className="mt-4 p-5 bg-[#eff4ff] border border-[#0051d5]/30 rounded-2xl space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-[#dce9ff] pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#0051d5]">
                        <RotateCcw className="w-4 h-4" />
                        <span>Panel de Reprogramación Inmediata de Cita</span>
                      </div>
                      <button
                        onClick={() => setReschedulingAptId(null)}
                        className="text-xs text-[#74777e] hover:text-[#001428] cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#74777e] mb-1">
                          Nuevo Día Disponible
                        </label>
                        <select
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="w-full bg-white border border-[#dce9ff] rounded-xl p-2 text-xs font-semibold"
                        >
                          <option value="2024-10-29">Martes, 29 Octubre 2024 (3 turnos)</option>
                          <option value="2024-10-31">Jueves, 31 Octubre 2024 (5 turnos)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#74777e] mb-1">
                          Horario Seleccionado
                        </label>
                        <select
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="w-full bg-white border border-[#dce9ff] rounded-xl p-2 text-xs font-semibold font-mono"
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="11:15 AM">11:15 AM</option>
                          <option value="02:30 PM">02:30 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#74777e] mb-1">
                        Motivo Reglamentario de Cambio
                      </label>
                      <input
                        type="text"
                        value={rescheduleReason}
                        onChange={(e) => setRescheduleReason(e.target.value)}
                        className="w-full bg-white border border-[#dce9ff] rounded-xl p-2 text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setReschedulingAptId(null)}
                        className="px-3 py-1.5 text-xs text-[#74777e] hover:bg-white rounded-lg transition-colors cursor-pointer"
                      >
                        Descartar
                      </button>
                      <button
                        onClick={() => handleConfirmReschedule(apt)}
                        className="px-4 py-2 bg-[#0051d5] text-white text-xs font-bold rounded-xl hover:bg-[#003ea8] shadow-sm cursor-pointer"
                      >
                        Confirmar Reasignación de Cupo
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Action Buttons */}
                {!isRescheduling && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#eff4ff]">
                    <button
                      onClick={() => onOpenPdf('appointment_reminder', apt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#dce9ff] text-[#0051d5] hover:bg-[#eff4ff] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Recordatorio PDF</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReschedulingAptId(apt.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] text-[#0051d5] hover:bg-[#dce9ff] text-xs font-bold rounded-xl transition-colors cursor-pointer border border-[#dce9ff]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Solicitar Reprogramación</span>
                      </button>

                      <button
                        onClick={() => setCancellingAptId(apt.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-red-200"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancelar Cita</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {historyAppointments.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={item.doctorAvatar}
                  alt={item.doctorName}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-neutral-200 shrink-0 grayscale"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#74777e]">{item.code}</span>
                    <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.2 rounded">
                      {item.statusLabel}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#001428] mt-0.5">{item.doctorName}</h3>
                  <p className="text-xs text-[#74777e]">{item.specialty} • {item.facility}</p>
                  <p className="text-[11px] text-[#74777e] mt-0.5">Fecha: {item.date} a las {item.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenPdf('appointment_reminder', item)}
                  className="px-3 py-1.5 bg-[#eff4ff] text-[#0051d5] text-xs font-bold rounded-xl hover:bg-[#dce9ff] transition-colors cursor-pointer"
                >
                  Ver Resumen de Consulta
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Cancelled */}
      {activeTab === 'cancelled' && (
        <div className="space-y-4">
          {cancelledAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#dce9ff] p-8 text-center text-xs text-[#74777e]">
              No tiene citas canceladas en este periodo.
            </div>
          ) : (
            cancelledAppointments.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-red-200 p-5 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    Cancelada por el Paciente
                  </span>
                  <h3 className="text-sm font-bold text-[#001428] mt-1">{item.doctorName}</h3>
                  <p className="text-xs text-[#74777e]">{item.specialty} • {item.date}</p>
                </div>
                <span className="text-xs text-[#74777e] font-mono">{item.copayAmount} Reembolsado</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingAptId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#dce9ff] shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-red-100 text-red-700 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#001428]">
                  ¿Confirmar cancelación de cita médica?
                </h3>
                <p className="text-xs text-[#74777e] mt-0.5">
                  Conforme a la Resolución 1552 del MinSalud, la cancelación debe realizarse con mínimo 2 horas de antelación.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#74777e] uppercase">
                Motivo de la Cancelación
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl p-2.5 text-xs text-[#001428]"
              >
                <option value="Cruce de horario laboral">Cruce de horario laboral</option>
                <option value="Motivo de salud sobreviniente">Motivo de salud sobreviniente</option>
                <option value="Dificultad de transporte / movilidad">Dificultad de transporte / movilidad</option>
                <option value="Atención en servicio de urgencias">Atención previa en servicio de urgencias</option>
                <option value="Otro motivo">Otro motivo justificado</option>
              </select>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 leading-snug">
              Al liberar este cupo, quedará disponible inmediatamente para otro paciente en lista de espera prioritaria.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancellingAptId(null)}
                className="flex-1 py-2 text-xs font-semibold text-[#43474d] hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
              >
                Mantener mi Cita
              </button>
              <button
                onClick={handleConfirmCancellation}
                className="flex-1 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Confirmar y Liberar Cupo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
