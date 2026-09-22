"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-provider';
import { ScreenView, Appointment, LabResult } from '@/types/clinical';
import { PATIENT_CAROLINA, INITIAL_APPOINTMENTS, LAB_RESULTS } from '@/data/mockData';
import { ScreenSwitcher } from '@/components/common/ScreenSwitcher';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { PdfModal } from '@/components/common/PdfModal';
import { SupportChatModal } from '@/components/common/SupportChatModal';

import { DashboardView } from '@/components/dashboard/DashboardView';
import { SearchBookingView } from '@/components/booking/SearchBookingView';
import { AuthorizationBookingView } from '@/components/booking/AuthorizationBookingView';
import { MyAppointmentsView } from '@/components/appointments/MyAppointmentsView';
import { ClinicalRecordsView } from '@/components/records/ClinicalRecordsView';
import { PatientProfileView } from '@/components/profile/PatientProfileView';

function PortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, session, clear } = useAuth();

  const currentView = (searchParams.get('view') as ScreenView) || 'dashboard';

  const patient = useMemo(() => {
    if (!session) return PATIENT_CAROLINA;
    return {
      ...PATIENT_CAROLINA,
      historyNumber: `HC-${session.userId}-FCV`,
    };
  }, [session]);

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [labResults, setLabResults] = useState<LabResult[]>(LAB_RESULTS);

  // Transfer state from search booking to authorization screen
  const [selectedBooking, setSelectedBooking] = useState<{
    doctor: any;
    date: string;
    slot: string;
    type: 'general' | 'especializada' | 'telemedicina';
  } | null>(null);

  // Modal states
  const [pdfModal, setPdfModal] = useState<{
    isOpen: boolean;
    documentType: 'appointment_reminder' | 'lab_result' | 'medical_order';
    data: any;
  }>({
    isOpen: false,
    documentType: 'appointment_reminder',
    data: null,
  });

  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If user is not authenticated and not checking, route to login
  useEffect(() => {
    if (status === 'anonymous') {
      router.replace('/iniciar-sesion');
    }
  }, [router, status]);

  const handleOpenPdf = (
    docType: 'appointment_reminder' | 'lab_result' | 'medical_order',
    data: any
  ) => {
    setPdfModal({
      isOpen: true,
      documentType: docType,
      data,
    });
  };

  const handleAppointmentCreated = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleUpdateAppointment = (updated: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleCancelAppointment = (id: string, reason: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'cancelada' as const,
              statusLabel: 'Cancelada por el Paciente',
              preparationNotes: `Cita cancelada. Motivo: ${reason}`,
            }
          : a
      )
    );
  };

  const handleViewChange = (view: ScreenView) => {
    if (view === 'login' || view === 'recovery' || view === 'reset-password') {
      router.push('/iniciar-sesion');
    } else if (view === 'register') {
      router.push('/registro');
    } else {
      router.push(`/inicio?view=${view}`);
    }
  };

  const handleLogout = () => {
    clear();
    router.replace('/iniciar-sesion');
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-3 border-[#0051d5] border-t-transparent rounded-full animate-spin"></span>
          <p className="text-xs font-semibold text-[#001428]">Validando sesión asistencial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-[#eff4ff] selection:text-[#0051d5]">
      {/* 1. Global Review Screen Switcher Bar */}
      <ScreenSwitcher currentView={currentView} onSelectView={handleViewChange} />

      {/* 2. Patient Portal Layout with Header and Sidebar */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh-33px)]">
        {/* Header */}
        <Header
          patient={patient}
          currentView={currentView}
          onNavigate={handleViewChange}
          onOpenSupport={() => setIsSupportChatOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
          {/* Sidebar Navigation */}
          <Sidebar
            currentView={currentView}
            onNavigate={handleViewChange}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {currentView === 'dashboard' && (
              <DashboardView
                patient={patient}
                appointments={appointments}
                labResults={labResults}
                onNavigate={handleViewChange}
                onOpenPdf={handleOpenPdf}
                onOpenSupport={() => setIsSupportChatOpen(true)}
              />
            )}

            {currentView === 'search-booking' && (
              <SearchBookingView
                onNavigate={handleViewChange}
                onSelectAppointment={(booking) => setSelectedBooking(booking)}
              />
            )}

            {currentView === 'booking-auth' && (
              <AuthorizationBookingView
                selectedBooking={selectedBooking}
                onNavigate={handleViewChange}
                onAppointmentCreated={handleAppointmentCreated}
                onOpenPdf={handleOpenPdf}
              />
            )}

            {currentView === 'my-appointments' && (
              <MyAppointmentsView
                appointments={appointments}
                onNavigate={handleViewChange}
                onOpenPdf={handleOpenPdf}
                onUpdateAppointment={handleUpdateAppointment}
                onCancelAppointment={handleCancelAppointment}
              />
            )}

            {currentView === 'records' && (
              <ClinicalRecordsView
                onNavigate={handleViewChange}
                onOpenPdf={handleOpenPdf}
              />
            )}

            {currentView === 'profile' && (
              <PatientProfileView
                patient={patient}
                onNavigate={handleViewChange}
                onOpenPdf={handleOpenPdf}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Clinical PDF Document Preview Modal */}
      <PdfModal
        isOpen={pdfModal.isOpen}
        onClose={() => setPdfModal((prev) => ({ ...prev, isOpen: false }))}
        documentType={pdfModal.documentType}
        data={pdfModal.data}
      />

      {/* 24/7 Clinical Assistant Support Chat Modal */}
      <SupportChatModal
        isOpen={isSupportChatOpen}
        onClose={() => setIsSupportChatOpen(false)}
      />
    </div>
  );
}

export default function StartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">
          <span className="w-8 h-8 border-3 border-[#0051d5] border-t-transparent rounded-full animate-spin"></span>
        </div>
      }
    >
      <PortalContent />
    </Suspense>
  );
}
