import React, { useState } from 'react';
import { ScreenView, Appointment, LabResult } from './types/clinical';
import { PATIENT_CAROLINA, INITIAL_APPOINTMENTS, LAB_RESULTS } from './data/mockData';
import { ScreenSwitcher } from './components/common/ScreenSwitcher';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { PdfModal } from './components/common/PdfModal';
import { SupportChatModal } from './components/common/SupportChatModal';

import { DashboardView } from './components/dashboard/DashboardView';
import { SearchBookingView } from './components/booking/SearchBookingView';
import { AuthorizationBookingView } from './components/booking/AuthorizationBookingView';
import { MyAppointmentsView } from './components/appointments/MyAppointmentsView';
import { ClinicalRecordsView } from './components/records/ClinicalRecordsView';
import { PatientProfileView } from './components/profile/PatientProfileView';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { PasswordRecoveryView } from './components/auth/PasswordRecoveryView';

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('dashboard');
  const [patient, setPatient] = useState(PATIENT_CAROLINA);
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

  const isAuthView =
    currentView === 'login' ||
    currentView === 'register' ||
    currentView === 'recovery' ||
    currentView === 'reset-password';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-[#eff4ff] selection:text-[#0051d5]">
      {/* 1. Global Review Screen Switcher Bar */}
      <ScreenSwitcher currentView={currentView} onSelectView={setCurrentView} />

      {/* 2. Main Layout Container */}
      {isAuthView ? (
        // Clean Auth Layout for Login, Register, Recovery
        <main className="flex-1 flex flex-col justify-center py-8">
          {currentView === 'login' && (
            <LoginView
              onLoginSuccess={() => setCurrentView('dashboard')}
              onNavigate={setCurrentView}
            />
          )}
          {currentView === 'register' && (
            <RegisterView
              onRegisterSuccess={() => setCurrentView('dashboard')}
              onNavigate={setCurrentView}
            />
          )}
          {(currentView === 'recovery' || currentView === 'reset-password') && (
            <PasswordRecoveryView
              onNavigate={setCurrentView}
              initialSubStep={currentView === 'reset-password' ? 'reset' : 'request'}
            />
          )}
        </main>
      ) : (
        // Patient Portal Layout with Header and Sidebar
        <div className="flex-1 flex flex-col min-h-[calc(100vh-33px)]">
          {/* Header */}
          <Header
            patient={patient}
            currentView={currentView}
            onNavigate={setCurrentView}
            onOpenSupport={() => setIsSupportChatOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />

          <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
            {/* Sidebar Navigation */}
            <Sidebar
              currentView={currentView}
              onNavigate={setCurrentView}
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
                  onNavigate={setCurrentView}
                  onOpenPdf={handleOpenPdf}
                  onOpenSupport={() => setIsSupportChatOpen(true)}
                />
              )}

              {currentView === 'search-booking' && (
                <SearchBookingView
                  onNavigate={setCurrentView}
                  onSelectAppointment={(booking) => setSelectedBooking(booking)}
                />
              )}

              {currentView === 'booking-auth' && (
                <AuthorizationBookingView
                  selectedBooking={selectedBooking}
                  onNavigate={setCurrentView}
                  onAppointmentCreated={handleAppointmentCreated}
                  onOpenPdf={handleOpenPdf}
                />
              )}

              {currentView === 'my-appointments' && (
                <MyAppointmentsView
                  appointments={appointments}
                  onNavigate={setCurrentView}
                  onOpenPdf={handleOpenPdf}
                  onUpdateAppointment={handleUpdateAppointment}
                  onCancelAppointment={handleCancelAppointment}
                />
              )}

              {currentView === 'records' && (
                <ClinicalRecordsView
                  onNavigate={setCurrentView}
                  onOpenPdf={handleOpenPdf}
                />
              )}

              {currentView === 'profile' && (
                <PatientProfileView
                  patient={patient}
                  onNavigate={setCurrentView}
                  onOpenPdf={handleOpenPdf}
                />
              )}
            </main>
          </div>
        </div>
      )}

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
