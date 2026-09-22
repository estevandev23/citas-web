import React from 'react';
import { ScreenView } from '../../types/clinical';
import { CLINIC_LOGO_URL } from '../../data/mockData';
import {
  Home,
  CalendarPlus,
  CalendarCheck,
  FileSpreadsheet,
  UserCheck,
  PhoneCall,
  ShieldCheck,
  Building,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  currentView: ScreenView;
  onNavigate: (view: ScreenView) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen = true,
  onClose,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ScreenView,
      label: 'Inicio / Mi Salud',
      icon: <Home className="w-4 h-4" />,
      badge: null,
    },
    {
      id: 'search-booking' as ScreenView,
      label: 'Buscar y Agendar Citas',
      icon: <CalendarPlus className="w-4 h-4" />,
      badge: { text: 'Nuevo', color: 'bg-[#eff4ff] text-[#0051d5] border border-[#dce9ff]' },
    },
    {
      id: 'my-appointments' as ScreenView,
      label: 'Mis Citas Médicas',
      icon: <CalendarCheck className="w-4 h-4" />,
      badge: { text: '3 activas', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    },
    {
      id: 'records' as ScreenView,
      label: 'Historial Clínico y Exámenes',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: null,
    },
    {
      id: 'profile' as ScreenView,
      label: 'Mi Perfil y Afiliación EPS',
      icon: <UserCheck className="w-4 h-4" />,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-[33px] left-0 h-[calc(100vh-33px)] w-72 bg-white border-r border-[#e5eeff] flex flex-col justify-between p-4 z-40 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-5">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <img
              src={CLINIC_LOGO_URL}
              alt="SaludPortal Logo"
              className="w-10 h-10 object-contain rounded-xl p-1 bg-[#eff4ff] border border-[#dce9ff]"
            />
            <div>
              <h1 className="text-base font-bold text-[#001428] leading-none tracking-tight">
                Salud<span className="text-[#0051d5]">Portal</span>
              </h1>
              <p className="text-[11px] font-medium text-[#74777e] mt-0.5">Portal Oficial del Paciente</p>
            </div>
          </div>

          {/* Assigned Facility Card */}
          <div className="bg-[#eff4ff] rounded-xl p-3 border border-[#dce9ff]">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#0051d5] uppercase tracking-wider">
              <Building className="w-3.5 h-3.5" />
              <span>Sede Asignada</span>
            </div>
            <p className="text-xs font-bold text-[#001428] mt-1">Sede Central - Torre Médica</p>
            <p className="text-[11px] text-[#43474d] mt-0.5">Calle 127 # 20-18 • Bogotá D.C.</p>
          </div>

          {/* Menu Asistencial */}
          <nav aria-label="Menú Asistencial" className="flex flex-col gap-1">
            <span className="px-2 text-[11px] font-bold text-[#74777e] uppercase tracking-wider mb-1">
              Menú Asistencial
            </span>
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onClose) onClose();
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0051d5] text-white shadow-sm shadow-[#0051d5]/20'
                      : 'text-[#43474d] hover:bg-[#eff4ff] hover:text-[#001428]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={active ? 'text-white' : 'text-[#74777e]'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        active ? 'bg-white/20 text-white' : item.badge.color
                      }`}
                    >
                      {item.badge.text}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Emergency & Certification Box */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#eff4ff]">
          {/* Emergency Card */}
          <div className="bg-gradient-to-br from-[#001428] to-[#0f2942] rounded-xl p-3 text-white shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400">
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>Línea de Urgencias 24/7</span>
            </div>
            <p className="text-sm font-black tracking-wide mt-1 text-white">#936 <span className="text-xs font-normal text-[#d1e4ff]">o 01 8000 919100</span></p>
            <p className="text-[10px] text-[#7991af] mt-1 leading-snug">
              Atención inmediata de ambulancias y triage médico institucional.
            </p>
          </div>

          {/* Compliance & Security */}
          <div className="flex items-center justify-between text-[11px] text-[#74777e] px-1">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00a270]" />
              <span className="text-[10px]">MinSalud Res. 1552</span>
            </div>
            <a
              href="https://www.minsalud.gov.co"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-[#0051d5] hover:underline flex items-center gap-0.5"
            >
              Vigilado <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
