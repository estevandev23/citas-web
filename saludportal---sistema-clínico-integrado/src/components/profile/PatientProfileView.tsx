import React from 'react';
import { PatientProfile, ScreenView } from '../../types/clinical';
import {
  UserCheck,
  Building2,
  ShieldCheck,
  Mail,
  Phone,
  CreditCard,
  Download,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { CLINIC_LOGO_URL } from '../../data/mockData';

interface PatientProfileViewProps {
  patient: PatientProfile;
  onNavigate: (view: ScreenView) => void;
  onOpenPdf: (docType: 'appointment_reminder' | 'lab_result' | 'medical_order', data: any) => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  patient,
  onNavigate,
  onOpenPdf,
}) => {
  const handleDownloadCertificate = () => {
    onOpenPdf('medical_order', {
      code: 'CERT-EPS-2024-991',
      title: 'Certificado Oficial de Afiliación EPS Sanitas',
      date: new Date().toLocaleDateString(),
      issuedBy: 'Subdirección de Aseguramiento EPS Sanitas',
      summary: `Por medio de la presente se certifica que la ciudadana CAROLINA MORALES, identificada con CC 1.028.455.902, se encuentra en estado ACTIVO en el Plan Premium Complementario bajo la categoría de Cotizante Principal desde el 14 de Enero de 2021.`,
    });
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dce9ff] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={patient.avatarUrl}
            alt={patient.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#0051d5]/20 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#001428]">{patient.name}</h1>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Activa
              </span>
            </div>
            <p className="text-xs text-[#74777e] mt-0.5">
              {patient.documentType} {patient.documentNumber} • HC: {patient.historyNumber}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadCertificate}
          className="flex items-center gap-2 px-4 py-2 bg-[#0051d5] text-white text-xs font-bold rounded-xl hover:bg-[#003ea8] transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Certificado de Afiliación PDF</span>
        </button>
      </div>

      {/* Grid of Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Affiliation Info */}
        <div className="bg-white rounded-2xl border border-[#dce9ff] p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-[#001428] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0051d5]" />
            <span>Condición de Afiliación EPS</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#eff4ff]">
              <span className="text-[#74777e]">Entidad Promotora:</span>
              <span className="font-bold text-[#001428]">{patient.eps}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#eff4ff]">
              <span className="text-[#74777e]">Plan Contratado:</span>
              <span className="font-bold text-[#0051d5]">{patient.plan}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#eff4ff]">
              <span className="text-[#74777e]">Categoría de Cotizante:</span>
              <span className="font-bold text-[#001428]">{patient.affiliateType}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#eff4ff]">
              <span className="text-[#74777e]">Copago Vigente 2024:</span>
              <span className="font-bold text-[#001428] font-mono">{patient.copayStandard}</span>
            </div>
          </div>
        </div>

        {/* Facility & Contact */}
        <div className="bg-white rounded-2xl border border-[#dce9ff] p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-[#001428] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0051d5]" />
            <span>Sede Primaria y Contacto</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#eff4ff]">
              <span className="text-[#74777e]">IPS Asignada:</span>
              <span className="font-bold text-[#001428]">{patient.assignedFacility}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#eff4ff]">
              <span className="text-[#74777e]">Correo Registrado:</span>
              <span className="font-semibold text-[#001428]">{patient.email}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#eff4ff]">
              <span className="text-[#74777e]">Teléfono Móvil:</span>
              <span className="font-mono text-[#001428] font-bold">{patient.phone}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#f8f9ff] rounded-xl border border-[#eff4ff]">
              <span className="text-[#74777e]">Validación BDUA:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Al día
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
