"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScreenSwitcher } from "@/components/common/ScreenSwitcher";
import { LoginView } from "@/components/auth/LoginView";
import { PasswordRecoveryView } from "@/components/auth/PasswordRecoveryView";
import { ScreenView } from "@/types/clinical";

export default function LoginPage() {
  const router = useRouter();
  const [currentSubView, setCurrentSubView] = useState<'login' | 'recovery' | 'reset-password'>('login');

  const handleNavigate = (view: ScreenView) => {
    if (view === 'register') {
      router.push('/registro');
    } else if (view === 'recovery' || view === 'reset-password') {
      setCurrentSubView(view);
    } else if (view === 'login') {
      setCurrentSubView('login');
    } else {
      router.push(`/inicio?view=${view}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-[#eff4ff] selection:text-[#0051d5]">
      {/* Review Screen Switcher Bar */}
      <ScreenSwitcher
        currentView={currentSubView}
        onSelectView={handleNavigate}
      />

      <main className="flex-1 flex flex-col justify-center py-8">
        {currentSubView === 'login' && (
          <LoginView
            onLoginSuccess={() => router.push('/inicio')}
            onNavigate={handleNavigate}
          />
        )}

        {(currentSubView === 'recovery' || currentSubView === 'reset-password') && (
          <PasswordRecoveryView
            onNavigate={handleNavigate}
            initialSubStep={currentSubView === 'reset-password' ? 'reset' : 'request'}
          />
        )}
      </main>
    </div>
  );
}
