"use client";

import React from 'react';
import { X, Download, Printer, ShieldCheck, FileCheck, Calendar, Clock, MapPin, Stethoscope } from 'lucide-react';
import { CLINIC_LOGO_URL } from '@/data/mockData';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'appointment_reminder' | 'lab_result' | 'medical_order';
  data: any;
}

export const PdfModal: React.FC<PdfModalProps> = ({ isOpen, onClose, documentType, data }) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `SALUDPORTAL - RECORDATORIO ASISTENCIAL OFICIAL\nFecha: ${new Date().toLocaleDateString()}\nDocumento: ${data.code || data.title}\nPaciente: Carolina Morales (CC 1.028.455.902)\nEPS: EPS Sanitas Plan Premium\nDetalles: ${JSON.stringify(data, null, 2)}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.code || 'documento'}-saludportal.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#dce9ff]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5eeff] bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#0051d5]" />
            <div>
              <h2 className="text-sm font-bold text-[#001428]">
                {documentType === 'appointment_reminder' && 'Comprobante y Recordatorio de Cita Médica'}
                {documentType === 'lab_result' && 'Reporte de Laboratorio Clínico y Diagnóstico'}
                {documentType === 'medical_order' && 'Orden Médica Asistencial Radicada'}
              </h2>
              <p className="text-[11px] text-[#74777e]">Documento Clínico Oficial con Validez Institucional</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-[#43474d] hover:bg-[#eff4ff] hover:text-[#0051d5] rounded-lg transition-colors cursor-pointer"
              title="Imprimir"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#0051d5] text-white text-xs font-semibold rounded-lg hover:bg-[#003ea8] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#74777e] hover:bg-neutral-100 rounded-lg transition-colors ml-2 cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable / Viewable Sheet */}
        <div className="p-8 overflow-y-auto bg-neutral-50 flex justify-center">
          <div className="bg-white border border-[#dce9ff] shadow-sm rounded-xl p-8 w-full max-w-xl text-[#0b1c30] text-xs space-y-6">
            {/* Header Sheet */}
            <div className="flex items-center justify-between border-b pb-4 border-[#e5eeff]">
              <div className="flex items-center gap-3">
                <img src={CLINIC_LOGO_URL} alt="Logo" className="w-10 h-10 object-contain" />
                <div>
                  <h3 className="font-extrabold text-sm text-[#001428] tracking-tight">SaludPortal EPS Sanitas</h3>
                  <p className="text-[10px] text-[#74777e]">Red Nacional de Prestación de Servicios de Salud</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block bg-[#eff4ff] text-[#0051d5] font-mono font-bold px-2 py-0.5 rounded text-[11px] border border-[#dce9ff]">
                  {data.code || 'RAD-84920'}
                </span>
                <p className="text-[10px] text-[#74777e] mt-0.5">Emisión: {data.date || '24 Oct 2024'}</p>
              </div>
            </div>

            {/* Patient Data Strip */}
            <div className="grid grid-cols-2 gap-3 bg-[#f8f9ff] p-3 rounded-lg border border-[#e5eeff]">
              <div>
                <span className="text-[10px] text-[#74777e] uppercase font-bold">Paciente:</span>
                <p className="font-bold text-[#001428]">Carolina Morales</p>
                <p className="text-[11px] text-[#43474d]">CC 1.028.455.902</p>
              </div>
              <div>
                <span className="text-[10px] text-[#74777e] uppercase font-bold">Aseguradora:</span>
                <p className="font-bold text-[#001428]">EPS Sanitas Plan Premium</p>
                <p className="text-[11px] text-[#43474d]">Cotizante Categoría A</p>
              </div>
            </div>

            {/* Content for Appointment Reminder */}
            {documentType === 'appointment_reminder' && (
              <div className="space-y-4">
                <div className="border border-[#e5eeff] rounded-xl p-4 bg-white space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#eff4ff] text-[#0051d5] rounded-xl">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#001428]">{data.doctorName || 'Dr. Alejandro Restrepo'}</p>
                      <p className="text-xs text-[#0051d5] font-semibold">{data.specialty || 'Medicina Interna'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#eff4ff]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#74777e]" />
                      <span>{data.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#74777e]" />
                      <span className="font-bold text-[#001428]">{data.time}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-[#eff4ff]">
                    <MapPin className="w-4 h-4 text-[#74777e] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#001428]">{data.facility}</p>
                      <p className="text-[11px] text-[#74777e]">{data.facilityAddress} • {data.room}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-xs text-[#0051d5] mb-1">Recomendaciones de Asistencia:</p>
                  <p className="text-[11px] text-[#43474d] leading-relaxed">
                    {data.preparationNotes || 'Presentarse con 15 minutos de anticipación. Presentar documento de identidad original físico y el presente comprobante digital en el punto de registro biométrico.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] border-t pt-3">
                  <span className="text-[#74777e]">Copago Reglamentario:</span>
                  <span className="font-extrabold text-[#001428]">{data.copayAmount || '$4.500 COP'}</span>
                </div>
              </div>
            )}

            {/* Content for Lab Result */}
            {documentType === 'lab_result' && (
              <div className="space-y-4">
                <div className="border border-[#e5eeff] rounded-xl p-4 bg-white space-y-3">
                  <p className="text-sm font-bold text-[#001428]">{data.title}</p>
                  <p className="text-[11px] text-[#74777e]">{data.issuedBy}</p>
                  <div className="p-3 bg-neutral-50 rounded-lg border font-mono text-[11px] leading-relaxed">
                    {data.summary}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Resultado validado electrónicamente por el laboratorio de referencia. Firma digital certificada.</span>
                </div>
              </div>
            )}

            {/* Footer Seal */}
            <div className="pt-4 border-t border-[#e5eeff] flex items-center justify-between text-[10px] text-[#74777e]">
              <div>
                <p className="font-semibold text-[#001428]">Certificación MinSalud Colombia</p>
                <p>Hash SHA-256: 8f9b2a14e98c0d12</p>
              </div>
              <div className="text-right">
                <p>Soporte de Pacientes: #936</p>
                <p>www.saludportal.minsalud.gov.co</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
