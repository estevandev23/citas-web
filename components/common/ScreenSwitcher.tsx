"use client";

import React from 'react';
import { ScreenView } from '@/types/clinical';
import { LayoutDashboard, CalendarSearch, FileCheck2, CalendarClock, FileText, Lock, UserPlus, KeyRound } from 'lucide-react';

interface ScreenSwitcherProps {
  currentView: ScreenView;
  onSelectView: (view: ScreenView) => void;
}

export const ScreenSwitcher: React.FC<ScreenSwitcherProps> = ({ currentView, onSelectView }) => {
  const screens: { id: ScreenView; label: string; icon: React.ReactNode; group: 'portal' | 'auth' }[] = [
    { id: 'dashboard', label: '1. Inicio / Mi Salud', icon: <LayoutDashboard className="w-3.5 h-3.5" />, group: 'portal' },
    { id: 'search-booking', label: '2. Buscar y Agendar Citas', icon: <CalendarSearch className="w-3.5 h-3.5" />, group: 'portal' },
    { id: 'booking-auth', label: '3. Autorización EPS & Radicación', icon: <FileCheck2 className="w-3.5 h-3.5" />, group: 'portal' },
    { id: 'my-appointments', label: '4. Mis Citas Médicas', icon: <CalendarClock className="w-3.5 h-3.5" />, group: 'portal' },
    { id: 'records', label: '5. Historial Clínico & Lab', icon: <FileText className="w-3.5 h-3.5" />, group: 'portal' },
    { id: 'login', label: '6. Iniciar Sesión (Simulador)', icon: <Lock className="w-3.5 h-3.5" />, group: 'auth' },
    { id: 'register', label: '7. Registro de Paciente', icon: <UserPlus className="w-3.5 h-3.5" />, group: 'auth' },
    { id: 'recovery', label: '8. Recuperar / Reset Clave', icon: <KeyRound className="w-3.5 h-3.5" />, group: 'auth' },
  ];

  return (
    <nav aria-label="Navegación de pantallas" className="bg-[#001428] text-white border-b border-[#0f2942] sticky top-0 z-50 px-3 py-1.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs">
        <div className="flex items-center gap-1.5 shrink-0 text-[#7991af] font-semibold uppercase tracking-wider text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Navegador de Pantallas:</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {screens.map((s) => {
            const isActive = currentView === s.id || (s.id === 'recovery' && currentView === 'reset-password');
            return (
              <button
                key={s.id}
                onClick={() => onSelectView(s.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#0051d5] text-white font-semibold shadow-sm'
                    : 'text-[#eff4ff] hover:bg-[#0f2942] hover:text-white'
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
