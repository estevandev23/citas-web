"use client";

import React, { useState } from 'react';
import { ScreenView } from '@/types/clinical';
import { LAB_RESULTS } from '@/data/mockData';
import {
  FileText,
  Search,
  CheckCircle2,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

interface ClinicalRecordsViewProps {
  onNavigate: (view: ScreenView) => void;
  onOpenPdf: (docType: 'appointment_reminder' | 'lab_result' | 'medical_order', data: any) => void;
}

export const ClinicalRecordsView: React.FC<ClinicalRecordsViewProps> = ({ onNavigate: _onNavigate, onOpenPdf }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = LAB_RESULTS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.issuedBy.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dce9ff] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eff4ff] pb-5">
          <div>
            <span className="text-xs font-bold text-[#0051d5] uppercase tracking-wider">
              Diagnóstico y Resultados Oficiales
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#001428] mt-0.5">
              Historial Clínico y Exámenes
            </h1>
            <p className="text-xs text-[#74777e] mt-1">
              Consulte y descargue reportes con firma médica digital y código QR de autenticidad
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Firma Digital Certificada
            </span>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'laboratorio', 'cardiologia', 'hematologia'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#0051d5] text-white shadow-xs'
                    : 'bg-[#f8f9ff] text-[#43474d] hover:bg-[#eff4ff] border border-[#dce9ff]'
                }`}
              >
                {cat === 'all' ? 'Todos los Estudios' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por prueba o laboratorio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#001428] focus:outline-none focus:border-[#0051d5]"
            />
            <Search className="w-4 h-4 text-[#74777e] absolute left-3 top-2" />
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs hover:border-[#0051d5] transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0051d5] uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.isNew && (
                    <span className="text-[10px] font-bold bg-[#6ffbbe]/20 text-[#005236] px-2 py-0.5 rounded-full border border-[#6ffbbe]/40">
                      Nuevo Resultado
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#74777e]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#001428]">{item.title}</h3>
              <p className="text-[11px] text-[#74777e] mt-0.5">{item.issuedBy}</p>

              <div className="mt-3 p-3 bg-[#f8f9ff] rounded-xl border border-[#eff4ff] text-xs text-[#0b1c30] leading-relaxed font-mono text-[11px]">
                {item.summary}
              </div>
            </div>

            <div className="pt-3 border-t border-[#eff4ff] flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.status} para Descarga
              </span>

              <button
                onClick={() => onOpenPdf('lab_result', item)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#eff4ff] hover:bg-[#0051d5] text-[#0051d5] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-[#dce9ff]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ver Reporte PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
