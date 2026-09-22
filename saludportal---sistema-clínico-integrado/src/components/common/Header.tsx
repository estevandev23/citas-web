import React, { useState } from 'react';
import { PatientProfile, ScreenView } from '../../types/clinical';
import { CLINIC_LOGO_URL } from '../../data/mockData';
import { Building2, HelpCircle, Bell, ChevronDown, LogOut, CheckCircle2, ShieldCheck, Menu, X, User } from 'lucide-react';

interface HeaderProps {
  patient: PatientProfile;
  currentView: ScreenView;
  onNavigate: (view: ScreenView) => void;
  onOpenSupport: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  currentView,
  onNavigate,
  onOpenSupport,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(patient.assignedFacility);

  const notifications = [
    {
      id: 'n1',
      title: 'Orden Médica en Auditoría',
      desc: 'Su orden ORD-8492 de Cardiología está en validación asistencial.',
      time: 'Hace 25 min',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Resultado de Laboratorio Listo',
      desc: 'El Perfil Lipídico Completo ya está disponible para descarga.',
      time: 'Ayer',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Recordatorio de Cita Médica',
      desc: 'Cita con Dr. Alejandro Restrepo el 24 Oct a las 09:30 AM.',
      time: 'Hace 2 días',
      unread: false,
    },
  ];

  return (
    <header className="bg-white border-b border-[#e5eeff] sticky top-[33px] z-40 px-4 lg:px-8 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Sede Selector */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-[#43474d] hover:bg-[#eff4ff] transition-colors"
              aria-label="Abrir menú"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Logo on mobile/compact */}
          <div className="flex lg:hidden items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <img src={CLINIC_LOGO_URL} alt="SaludPortal" className="h-7 w-auto object-contain" />
            <span className="text-sm font-bold text-[#001428]">SaludPortal</span>
          </div>

          {/* Sede selector badge / pill */}
          <div className="hidden sm:flex items-center gap-2 bg-[#eff4ff] border border-[#dce9ff] px-3 py-1.5 rounded-lg text-xs text-[#0b1c30]">
            <Building2 className="w-3.5 h-3.5 text-[#0051d5]" />
            <span className="text-[#74777e] font-medium">Sede:</span>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="bg-transparent font-semibold text-[#001428] focus:outline-none cursor-pointer"
            >
              <option value="Sede Central - Torre Médica">Sede Central - Torre Médica</option>
              <option value="Sede Norte - Torre Médica B">Sede Norte - Torre Médica B</option>
              <option value="Sede Teusaquillo">Sede Teusaquillo</option>
              <option value="Sede Virtual (Telemedicina)">Sede Virtual (Telemedicina)</option>
            </select>
          </div>
        </div>

        {/* Right Zone: Support, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Soporte y Ayuda */}
          <button
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0051d5] bg-[#eff4ff] hover:bg-[#dce9ff] rounded-lg transition-colors border border-[#dce9ff]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Soporte y Ayuda 24/7</span>
            <span className="sm:hidden">Ayuda</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-[#43474d] hover:bg-[#eff4ff] hover:text-[#0051d5] transition-colors"
              aria-label="Ver notificaciones"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#dce9ff] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-[#eff4ff] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#001428]">Notificaciones Clínicas</span>
                  <span className="text-[10px] font-semibold bg-[#eff4ff] text-[#0051d5] px-2 py-0.5 rounded-full">
                    2 nuevas
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#eff4ff]">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 text-left hover:bg-[#f8f9ff] transition-colors cursor-pointer ${
                        item.unread ? 'bg-[#f0f6ff]/40' : ''
                      }`}
                      onClick={() => setShowNotifications(false)}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-semibold text-[#0b1c30]">{item.title}</p>
                        <span className="text-[10px] text-[#74777e] shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-[#43474d] mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="px-3 py-2 border-t border-[#eff4ff] text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('records');
                    }}
                    className="text-[11px] font-semibold text-[#0051d5] hover:underline"
                  >
                    Ver historial completo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Summary */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-[#eff4ff] transition-colors border border-transparent hover:border-[#dce9ff]"
            >
              <div className="relative">
                <img
                  src={patient.avatarUrl}
                  alt={patient.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#0051d5]/20 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00a270] ring-1.5 ring-white"></span>
              </div>

              <div className="text-left hidden md:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#001428] leading-tight">{patient.name}</span>
                  <span className="text-[10px] font-semibold bg-[#e5eeff] text-[#0051d5] px-1.5 py-0.2 rounded text-[10px]">
                    {patient.eps}
                  </span>
                </div>
                <p className="text-[11px] text-[#74777e]">
                  {patient.documentType} {patient.documentNumber} • {patient.plan}
                </p>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-[#74777e] hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#dce9ff] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-[#eff4ff]">
                  <p className="text-xs font-bold text-[#001428]">{patient.name}</p>
                  <p className="text-[11px] text-[#74777e]">{patient.email}</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-[#00a270] font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Afiliación Activa - EPS Sanitas</span>
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#eff4ff] text-[#0b1c30] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#0051d5]" />
                    <span>Mi Perfil y Afiliación EPS</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('records');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#eff4ff] text-[#0b1c30] flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0051d5]" />
                    <span>Historial Clínico y Exámenes</span>
                  </button>
                  <div className="border-t border-[#eff4ff] my-1"></div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('login');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#ffdad6]/40 text-[#ba1a1a] flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión del Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
