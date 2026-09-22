"use client";

import React, { useState } from 'react';
import { PatientProfile, Appointment, LabResult, ScreenView } from '@/types/clinical';
import {
  CalendarPlus,
  Stethoscope,
  CalendarClock,
  UserCheck,
  AlertCircle,
  Clock,
  Calendar,
  MapPin,
  Download,
  ChevronRight,
  FileText,
  Activity,
  CheckCircle2,
  HelpCircle,
  Navigation,
  Info,
} from 'lucide-react';

interface DashboardViewProps {
  patient: PatientProfile;
  appointments: Appointment[];
  labResults: LabResult[];
  onNavigate: (view: ScreenView) => void;
  onOpenPdf: (docType: 'appointment_reminder' | 'lab_result' | 'medical_order', data: any) => void;
  onOpenSupport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patient,
  appointments,
  labResults,
  onNavigate,
  onOpenPdf,
  onOpenSupport,
}) => {
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const nextAppointment = appointments[0] || null;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Patient Welcome Banner */}
      <div className="bg-gradient-to-r from-[#001428] via-[#0b1c30] to-[#0f2942] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#0051d5]/15 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-[#6ffbbe]/10 blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#6ffbbe]/20 text-[#6ffbbe] border border-[#6ffbbe]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] animate-pulse"></span>
                Afiliada Activa • Régimen Contributivo
              </span>
              <span className="text-xs text-[#7991af]">|</span>
              <span className="text-xs text-[#7991af] font-mono">HC: {patient.historyNumber}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Buenos días, {patient.name}
            </h1>

            <p className="text-sm text-[#d1e4ff] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{patient.eps}</span>
              <span>•</span>
              <span className="text-[#6ffbbe]">{patient.plan}</span>
              <span>•</span>
              <span>{patient.affiliateType}</span>
            </p>
          </div>

          {/* Quick copay summary badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-center gap-4 shrink-0">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#7991af] font-semibold">Copago Estándar</p>
              <p className="text-2xl font-black tracking-tight text-white font-mono">{patient.copayStandard}</p>
              <p className="text-[10px] text-[#6ffbbe]">Exento 100% en Teleconsulta</p>
            </div>
            <button
              onClick={() => onNavigate('search-booking')}
              className="px-4 py-2.5 bg-[#0051d5] hover:bg-[#316bf3] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#0051d5]/30 cursor-pointer"
            >
              Agendar Cita
            </button>
          </div>
        </div>
      </div>

      {/* 2. Official Audit Notification Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5 sm:mt-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Validación de Orden Médica en Trámite
              </h2>
              <span className="font-mono text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                #ORD-8492
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              Su orden para <strong className="font-semibold">Cardiología Adultos</strong> se encuentra en auditoría asistencial previa. Tiempo estimado: 24h hábiles.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('booking-auth')}
          className="self-end sm:self-center shrink-0 px-3 py-1.5 bg-amber-700 text-white hover:bg-amber-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Consultar Radicación
        </button>
      </div>

      {/* 3. Acciones Rápidas Prioritarias */}
      <div>
        <h2 className="text-sm font-bold text-[#001428] uppercase tracking-wider mb-3 px-1">
          Acciones Rápidas Prioritarias
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('search-booking')}
            className="text-left bg-white p-5 rounded-2xl border border-[#dce9ff] hover:border-[#0051d5] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0051d5] group-hover:bg-[#0051d5] group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#001428] group-hover:text-[#0051d5] transition-colors">
              Agendar Cita General
            </h3>
            <p className="text-xs text-[#74777e] mt-1">Inmediato • Sin orden médica previa requerida</p>
          </button>

          <button
            onClick={() => onNavigate('booking-auth')}
            className="text-left bg-white p-5 rounded-2xl border border-[#dce9ff] hover:border-[#0051d5] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0051d5] group-hover:bg-[#0051d5] group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#001428] group-hover:text-[#0051d5] transition-colors">
              Cita de Especialidad
            </h3>
            <p className="text-xs text-[#74777e] mt-1">Requiere autorización o remisión médica</p>
          </button>

          <button
            onClick={() => onNavigate('my-appointments')}
            className="text-left bg-white p-5 rounded-2xl border border-[#dce9ff] hover:border-[#0051d5] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0051d5] group-hover:bg-[#0051d5] group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <CalendarClock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#001428] group-hover:text-[#0051d5] transition-colors">
              Reprogramar o Cancelar
            </h3>
            <p className="text-xs text-[#74777e] mt-1">3 citas actualmente programadas</p>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="text-left bg-white p-5 rounded-2xl border border-[#dce9ff] hover:border-[#0051d5] hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0051d5] group-hover:bg-[#0051d5] group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#001428] group-hover:text-[#0051d5] transition-colors">
              Datos y Afiliación
            </h3>
            <p className="text-xs text-[#74777e] mt-1">Certificados, grupo familiar y sedes</p>
          </button>
        </div>
      </div>

      {/* 4. Two Columns: Next Appointment (Featured) + Active Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Master Card Next Appointment */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#001428] uppercase tracking-wider">
              Próxima Cita Confirmada
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Estado: Confirmada en Agenda
            </span>
          </div>

          {nextAppointment && (
            <div className="bg-white rounded-2xl border-2 border-[#0051d5]/30 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#0051d5] text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-bl-xl">
                Cita Principal
              </div>

              {/* Doctor Row */}
              <div className="flex items-start gap-4 pb-5 border-b border-[#e5eeff]">
                <img
                  src={nextAppointment.doctorAvatar}
                  alt={nextAppointment.doctorName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#0051d5]/20 shadow-xs shrink-0"
                />
                <div className="flex-1">
                  <span className="inline-block text-[11px] font-bold text-[#0051d5] bg-[#eff4ff] px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                    {nextAppointment.specialty}
                  </span>
                  <h3 className="text-lg font-black text-[#001428]">{nextAppointment.doctorName}</h3>
                  <p className="text-xs text-[#74777e]">{nextAppointment.subspecialty}</p>
                </div>
              </div>

              {/* Details Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
                <div className="flex items-center gap-3 bg-[#f8f9ff] p-3 rounded-xl border border-[#eff4ff]">
                  <div className="p-2 bg-[#e5eeff] text-[#0051d5] rounded-lg">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#74777e] uppercase font-semibold">Fecha Asignada</span>
                    <p className="font-bold text-[#001428]">{nextAppointment.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#f8f9ff] p-3 rounded-xl border border-[#eff4ff]">
                  <div className="p-2 bg-[#e5eeff] text-[#0051d5] rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#74777e] uppercase font-semibold">Horario de Consulta</span>
                    <p className="font-bold text-[#001428]">{nextAppointment.time} ({nextAppointment.duration})</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#f8f9ff] p-3 rounded-xl border border-[#eff4ff] sm:col-span-2">
                  <div className="p-2 bg-[#e5eeff] text-[#0051d5] rounded-lg shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#74777e] uppercase font-semibold">Ubicación y Consultorio</span>
                      <span className="font-mono text-[10px] text-[#0051d5] font-bold">{nextAppointment.room}</span>
                    </div>
                    <p className="font-bold text-[#001428]">{nextAppointment.facility}</p>
                    <p className="text-[11px] text-[#74777e]">{nextAppointment.facilityAddress}</p>
                  </div>
                </div>
              </div>

              {/* Protocol info */}
              <div className="bg-[#eff4ff] rounded-xl p-3 border border-[#dce9ff] flex items-start gap-2.5 text-xs text-[#0b1c30] mb-5">
                <Info className="w-4 h-4 text-[#0051d5] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <p className="font-bold text-[#0051d5]">Protocolo de Asistencia:</p>
                  <p className="text-[11px] text-[#43474d] mt-0.5">{nextAppointment.preparationNotes}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenPdf('appointment_reminder', nextAppointment)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#0051d5] text-[#0051d5] hover:bg-[#eff4ff] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Recordatorio PDF</span>
                  </button>

                  <button
                    onClick={() => setShowArrivalModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#dce9ff] text-[#43474d] hover:bg-[#f8f9ff] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#0051d5]" />
                    <span>Cómo Llegar</span>
                  </button>
                </div>

                <button
                  onClick={() => onNavigate('my-appointments')}
                  className="flex items-center gap-1 px-4 py-2 bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <span>Gestionar Cita</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Mis Citas en Curso Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#001428] uppercase tracking-wider">
              Mis Citas en Curso
            </h2>
            <button
              onClick={() => onNavigate('my-appointments')}
              className="text-xs font-bold text-[#0051d5] hover:underline cursor-pointer"
            >
              Ver todas ({appointments.length})
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#dce9ff] divide-y divide-[#eff4ff] shadow-xs overflow-hidden">
            {appointments.map((apt) => {
              const statusBadges = {
                confirmada: { text: 'Confirmada', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                en_revision: { text: 'En Revisión', style: 'bg-amber-50 text-amber-800 border-amber-200' },
                reprogramacion: { text: 'Reprogramada', style: 'bg-blue-50 text-blue-700 border-blue-200' },
                cancelada: { text: 'Cancelada', style: 'bg-red-50 text-red-700 border-red-200' },
              };

              const badge = statusBadges[apt.status];

              return (
                <div
                  key={apt.id}
                  onClick={() => onNavigate('my-appointments')}
                  className="p-4 hover:bg-[#f8f9ff] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.style}`}>
                        {badge.text}
                      </span>
                      <h4 className="text-xs font-bold text-[#001428] mt-1.5 group-hover:text-[#0051d5] transition-colors">
                        {apt.specialty}
                      </h4>
                      <p className="text-[11px] text-[#74777e]">{apt.doctorName}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-[#001428] font-mono">{apt.time}</p>
                      <p className="text-[10px] text-[#74777e]">{apt.date.split(',')[1] || apt.date}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#74777e] pt-2 border-t border-[#eff4ff]">
                    <span>Sede: {apt.facility.split('-')[0]}</span>
                    <span className="font-semibold text-[#0051d5] group-hover:translate-x-0.5 transition-transform flex items-center">
                      Detalles <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0051d5]">
              <HelpCircle className="w-4 h-4" />
              <span>¿Necesitas orientación?</span>
            </div>
            <p className="text-xs text-[#43474d] mt-1 leading-snug">
              Comunícate con nuestro canal de atención asistencial o agenda con antelación tus exámenes médicos.
            </p>
            <button
              onClick={onOpenSupport}
              className="mt-3 w-full py-2 bg-white hover:bg-[#dce9ff] text-[#0051d5] text-xs font-bold rounded-xl border border-[#dce9ff] transition-colors cursor-pointer"
            >
              Chatear con Asesor Virtual
            </button>
          </div>
        </div>
      </div>

      {/* 5. Exámenes y Laboratorio Recientes */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#eff4ff] text-[#0051d5] rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#001428]">Exámenes y Laboratorio Recientes</h2>
              <p className="text-xs text-[#74777e]">Resultados validados con firma médica digital</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('records')}
            className="text-xs font-bold text-[#0051d5] hover:underline cursor-pointer"
          >
            Ver Historial Completo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {labResults.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-[#e5eeff] hover:border-[#0051d5] transition-all bg-[#f8f9ff] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#74777e]">
                    {item.date}
                  </span>
                  {item.isNew && (
                    <span className="text-[10px] font-bold bg-[#6ffbbe]/20 text-[#005236] px-2 py-0.5 rounded-full border border-[#6ffbbe]/40">
                      Nuevo
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-[#001428] leading-snug">{item.title}</h4>
                <p className="text-[11px] text-[#74777e] mt-1 line-clamp-2">{item.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#e5eeff] flex items-center justify-between">
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {item.status}
                </span>
                <button
                  onClick={() => onOpenPdf('lab_result', item)}
                  className="flex items-center gap-1 text-xs font-bold text-[#0051d5] hover:text-[#003ea8] cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Arrival / Maps */}
      {showArrivalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#dce9ff] shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-[#eff4ff]">
              <h3 className="font-bold text-sm text-[#001428]">Ubicación y Cómo Llegar</h3>
              <button
                onClick={() => setShowArrivalModal(false)}
                className="text-[#74777e] hover:text-black text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div>
              <p className="text-xs font-bold text-[#001428]">{nextAppointment?.facility}</p>
              <p className="text-xs text-[#74777e]">{nextAppointment?.facilityAddress}</p>
              <div className="mt-4 p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-xs text-[#0b1c30]">
                <p className="font-bold text-[#0051d5]">Puntos de referencia:</p>
                <p className="text-[11px] text-[#43474d] mt-1">
                  Estación TransMilenio Pepe Sierra (Costado Oriental). Contamos con parqueadero privado vigilado para pacientes en el sótano 1.
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextAppointment?.facilityAddress || 'Bogotá')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 text-center bg-[#0051d5] text-white text-xs font-bold rounded-xl hover:bg-[#003ea8]"
              >
                Abrir en Google Maps
              </a>
              <a
                href={`https://waze.com/ul?q=${encodeURIComponent(nextAppointment?.facilityAddress || 'Bogotá')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 text-center bg-[#eff4ff] text-[#0051d5] text-xs font-bold rounded-xl hover:bg-[#dce9ff]"
              >
                Abrir en Waze
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
