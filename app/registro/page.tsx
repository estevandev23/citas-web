"use client";

import { useRouter } from "next/navigation";
import { ScreenSwitcher } from "@/components/common/ScreenSwitcher";
import { RegisterView } from "@/components/auth/RegisterView";
import { ScreenView } from "@/types/clinical";

export default function RegistrationPage() {
  const router = useRouter();

  const handleNavigate = (view: ScreenView) => {
    if (view === 'login' || view === 'recovery' || view === 'reset-password') {
      router.push('/iniciar-sesion');
    } else if (view === 'register') {
      // already on register
    } else {
      router.push(`/inicio?view=${view}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-[#eff4ff] selection:text-[#0051d5]">
      {/* Review Screen Switcher Bar */}
      <ScreenSwitcher
        currentView="register"
        onSelectView={handleNavigate}
      />

      <main className="flex-1 flex flex-col justify-center py-8">
        <RegisterView
          onRegisterSuccess={() => router.push('/iniciar-sesion')}
          onNavigate={handleNavigate}
        />
      </main>
    </div>
  );
}
