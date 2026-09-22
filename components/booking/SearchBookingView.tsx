"use client";

import React, { useState } from 'react';
import { Doctor, ScreenView } from '@/types/clinical';
import { AVAILABLE_DOCTORS } from '@/data/mockData';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Video,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  CalendarCheck2,
} from 'lucide-react';

interface SearchBookingViewProps {
  onNavigate: (view: ScreenView) => void;
  onSelectAppointment: (selected: {
    doctor: Doctor;
    date: string;
    slot: string;
    type: 'general' | 'especializada' | 'telemedicina';
  }) => void;
}

export const SearchBookingView: React.FC<SearchBookingViewProps> = ({
  onNavigate,
  onSelectAppointment,
}) => {
  const [selectedType, setSelectedType] = useState<'general' | 'especializada' | 'telemedicina'>('especializada');
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Dermatología Clínica');
  const [selectedShift, setSelectedShift] = useState<'all' | 'morning' | 'afternoon'>('all');

  // Selected calendar day
  const [selectedDate, setSelectedDate] = useState('2024-10-23');

  // Selected doctor & slot
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-silva');
  const [selectedSlot, setSelectedSlot] = useState<string>('09:20 AM');

  const daysOfWeek = [
    { key: '2024-10-21', day: 'Lun', num: '21 Oct', count: 0, available: false },
    { key: '2024-10-22', day: 'Mar', num: '22 Oct', count: 0, available: false },
    { key: '2024-10-23', day: 'Mié', num: '23 Oct', count: 5, available: true },
    { key: '2024-10-24', day: 'Jue', num: '24 Oct', count: 3, available: true },
    { key: '2024-10-25', day: 'Vie', num: '25 Oct', count: 4, available: true },
    { key: '2024-10-26', day: 'Sáb', num: '26 Oct', count: 2, available: true },
  ];

  const filteredDoctors = AVAILABLE_DOCTORS.filter((doc) => {
    if (selectedSpecialty && doc.specialty !== selectedSpecialty && selectedSpecialty !== 'all') {
      return false;
    }
    if (selectedFacility !== 'all' && !doc.facility.includes(selectedFacility)) {
      return false;
    }
    return true;
  });

  const selectedDoctor = AVAILABLE_DOCTORS.find((d) => d.id === selectedDoctorId) || AVAILABLE_DOCTORS[0];

  const handleProceed = () => {
    onSelectAppointment({
      doctor: selectedDoctor,
      date: selectedDate === '2024-10-23' ? 'Miércoles, 23 Oct 2024' : selectedDate === '2024-10-24' ? 'Jueves, 24 Oct 2024' : 'Viernes, 25 Oct 2024',
      slot: selectedSlot,
      type: selectedType,
    });
    onNavigate('booking-auth');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-[#dce9ff] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eff4ff] pb-5">
          <div>
            <span className="text-xs font-bold text-[#0051d5] uppercase tracking-wider">
              Módulo Oficial de Agendamiento
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#001428] mt-0.5">
              Buscar y Agendar Citas Médicas
            </h1>
            <p className="text-xs text-[#74777e] mt-1">
              Disponibilidad en tiempo real para la red EPS Sanitas y centros médicos aliados
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0051d5] text-white">
              <span>1</span>
              <span>Disponibilidad</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#74777e]" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#74777e]">
              <span>2</span>
              <span className="hidden sm:inline">Autorización EPS</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#74777e]" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#74777e]">
              <span>3</span>
              <span className="hidden sm:inline">Confirmación</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="pt-5 space-y-4">
          {/* Consultation Type Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedType('general')}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedType === 'general'
                  ? 'border-[#0051d5] bg-[#eff4ff] text-[#001428] ring-1 ring-[#0051d5]'
                  : 'border-[#dce9ff] bg-white text-[#43474d] hover:bg-[#f8f9ff]'
              }`}
            >
              <div className={`p-2 rounded-lg ${selectedType === 'general' ? 'bg-[#0051d5] text-white' : 'bg-[#eff4ff] text-[#0051d5]'}`}>
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Cita Médica General</p>
                <p className="text-[11px] text-[#74777e]">Sin orden previa • Inmediato</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('especializada')}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedType === 'especializada'
                  ? 'border-[#0051d5] bg-[#eff4ff] text-[#001428] ring-1 ring-[#0051d5]'
                  : 'border-[#dce9ff] bg-white text-[#43474d] hover:bg-[#f8f9ff]'
              }`}
            >
              <div className={`p-2 rounded-lg ${selectedType === 'especializada' ? 'bg-[#0051d5] text-white' : 'bg-[#eff4ff] text-[#0051d5]'}`}>
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Cita Especializada</p>
                <p className="text-[11px] text-[#74777e]">Requiere orden o remisión</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('telemedicina')}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedType === 'telemedicina'
                  ? 'border-[#0051d5] bg-[#eff4ff] text-[#001428] ring-1 ring-[#0051d5]'
                  : 'border-[#dce9ff] bg-white text-[#43474d] hover:bg-[#f8f9ff]'
              }`}
            >
              <div className={`p-2 rounded-lg ${selectedType === 'telemedicina' ? 'bg-[#0051d5] text-white' : 'bg-[#eff4ff] text-[#0051d5]'}`}>
                <Video className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Telemedicina / Virtual</p>
                <p className="text-[11px] text-[#00a270] font-semibold">Exento 100% de copago</p>
              </div>
            </button>
          </div>

          {/* Secondary Filters row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                Especialidad Médica
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#001428] focus:outline-none focus:border-[#0051d5]"
              >
                <option value="Dermatología Clínica">Dermatología Clínica</option>
                <option value="Cardiología Adultos">Cardiología Adultos</option>
                <option value="Medicina Interna">Medicina Interna</option>
                <option value="all">Todas las especialidades</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                Sede de Atención
              </label>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#001428] focus:outline-none focus:border-[#0051d5]"
              >
                <option value="all">Todas las sedes asignadas</option>
                <option value="Central">Sede Central - Torre Médica</option>
                <option value="Norte">Sede Norte - Reina Sofía</option>
                <option value="Teusaquillo">Sede Teusaquillo</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#74777e] uppercase mb-1">
                Jornada Horaria
              </label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value as any)}
                className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs font-semibold text-[#001428] focus:outline-none focus:border-[#0051d5]"
              >
                <option value="all">Cualquier horario disponible</option>
                <option value="morning">Mañana (07:00 AM - 12:00 PM)</option>
                <option value="afternoon">Tarde (01:00 PM - 06:00 PM)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Date Carousel */}
      <div className="bg-white p-4 rounded-2xl border border-[#dce9ff] shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0051d5]" />
            <h2 className="text-xs font-bold text-[#001428] uppercase tracking-wider">
              Semana del 21 al 26 de Octubre 2024
            </h2>
          </div>
          <span className="text-[11px] text-[#74777e]">Seleccione un día para desplegar turnos</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {daysOfWeek.map((d) => {
            const isSelected = selectedDate === d.key;
            return (
              <button
                key={d.key}
                disabled={!d.available}
                onClick={() => setSelectedDate(d.key)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  !d.available
                    ? 'bg-neutral-100/60 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'bg-[#0051d5] text-white border-[#0051d5] shadow-sm ring-2 ring-[#0051d5]/20'
                    : 'bg-[#f8f9ff] text-[#0b1c30] border-[#dce9ff] hover:border-[#0051d5]'
                }`}
              >
                <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">{d.day}</p>
                <p className={`text-base font-black mt-0.5 ${isSelected ? 'text-white' : 'text-[#001428]'}`}>
                  {d.num.split(' ')[0]}
                </p>
                <p className={`text-[10px] mt-1 font-semibold ${
                  !d.available
                    ? 'text-neutral-400'
                    : isSelected
                    ? 'text-[#6ffbbe]'
                    : 'text-[#0051d5]'
                }`}>
                  {d.available ? `${d.count} cupos` : 'Sin cupos'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Available Doctors List + Sticky Appointment Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Doctors & Time Slots */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#001428] uppercase tracking-wider">
              Especialistas con Disponibilidad ({filteredDoctors.length})
            </h2>
            <span className="text-xs text-[#74777e]">Ordenado por proximidad de agenda</span>
          </div>

          {filteredDoctors.map((doc) => {
            const isDocSelected = selectedDoctorId === doc.id;
            const slotsForDay = doc.slots[selectedDate] || ['09:00 AM', '11:00 AM', '03:00 PM'];

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-2xl border p-5 transition-all ${
                  isDocSelected ? 'border-[#0051d5] ring-1 ring-[#0051d5] shadow-md' : 'border-[#dce9ff] shadow-xs'
                }`}
              >
                {/* Doctor Bio Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eff4ff]">
                  <div className="flex items-start gap-3">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#0051d5]/20 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#001428]">{doc.name}</h3>
                        <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {doc.rating}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#0051d5]">{doc.subspecialty || doc.specialty}</p>
                      <p className="text-[11px] text-[#74777e]">
                        RMC: {doc.rmc} • {doc.university}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs">
                    <div className="flex sm:justify-end items-center gap-1 text-[#74777e]">
                      <MapPin className="w-3.5 h-3.5 text-[#0051d5]" />
                      <span>{doc.facility}</span>
                    </div>
                    <span className="text-[10px] text-[#74777e] font-mono">{doc.room}</span>
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#001428] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0051d5]" />
                      Turnos disponibles para el día seleccionado:
                    </span>
                    <span className="text-[10px] text-[#00a270] font-semibold">Confirmación inmediata</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {slotsForDay.map((slot) => {
                      const isSlotActive = isDocSelected && selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => {
                            setSelectedDoctorId(doc.id);
                            setSelectedSlot(slot);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                            isSlotActive
                              ? 'bg-[#0051d5] text-white shadow-sm ring-2 ring-[#0051d5]/30'
                              : 'bg-[#eff4ff] text-[#0051d5] hover:bg-[#dce9ff] border border-[#dce9ff]'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Sticky Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#dce9ff] p-5 shadow-md sticky top-[90px] space-y-4">
            <div className="border-b border-[#eff4ff] pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0051d5] bg-[#eff4ff] px-2 py-0.5 rounded">
                Resumen de Cita
              </span>
              <h3 className="text-base font-bold text-[#001428] mt-1.5">
                {selectedSpecialty}
              </h3>
              <p className="text-xs text-[#74777e]">Paso previo a confirmación de datos EPS</p>
            </div>

            {/* Selected Specialist Info */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <img
                  src={selectedDoctor.avatarUrl}
                  alt={selectedDoctor.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#dce9ff] shrink-0"
                />
                <div>
                  <p className="font-bold text-[#001428]">{selectedDoctor.name}</p>
                  <p className="text-[11px] text-[#0051d5]">{selectedDoctor.specialty}</p>
                  <p className="text-[10px] text-[#74777e]">{selectedDoctor.room}</p>
                </div>
              </div>

              <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#eff4ff] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#74777e]">Fecha:</span>
                  <span className="font-bold text-[#001428]">
                    {selectedDate === '2024-10-23' ? 'Miércoles, 23 Oct 2024' : selectedDate === '2024-10-24' ? 'Jueves, 24 Oct 2024' : 'Viernes, 25 Oct 2024'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#74777e]">Hora:</span>
                  <span className="font-bold text-[#0051d5] font-mono">{selectedSlot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#74777e]">Modalidad:</span>
                  <span className="font-semibold text-[#001428] capitalize">{selectedType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#74777e]">Sede:</span>
                  <span className="font-medium text-[#001428] text-right truncate max-w-[150px]">
                    {selectedDoctor.facility}
                  </span>
                </div>
              </div>

              {/* Financial Liquidation Box */}
              <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dce9ff] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#43474d]">Valor Consulta Particular:</span>
                  <span className="text-[#74777e] line-through font-mono">$120.000 COP</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#0051d5] font-semibold">Subsidio Plan Premium:</span>
                  <span className="text-[#0051d5] font-semibold">-100%</span>
                </div>
                <div className="border-t border-[#dce9ff] pt-2 flex items-center justify-between">
                  <span className="font-bold text-xs text-[#001428]">Copago Estimado:</span>
                  <span className="font-black text-sm text-[#001428] font-mono">
                    {selectedType === 'telemedicina' ? '$0 COP' : '$4.500 COP'}
                  </span>
                </div>
              </div>

              {/* Compliance note */}
              <div className="flex items-start gap-1.5 text-[10px] text-[#74777e]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00a270] shrink-0 mt-0.5" />
                <span>
                  Regulado por el Ministerio de Salud. La cita se reservará por 15 minutos mientras completa la autorización.
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleProceed}
              className="w-full py-3 bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceder a Confirmar Cita</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
