import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { User } from './types';
import WelcomeModal from './components/WelcomeModal';
import { isAdmin } from './utils/adminConfig';

// Components
import Header from './components/Header';
import Navigation from './components/Navigation';
import OnboardingSection from './components/OnboardingSection';
import AIAssistantSection from './components/AIAssistantSection';
import TeacherPoliSection from './components/TeacherPoliSection';
import ResourcesSection from './components/ResourcesSection';
import CommunitySection from './components/CommunitySection';
import SettingsSection from './components/SettingsSection';
import PlanRequiredModal from './components/PlanRequiredModal';

// Auth Components
import LoginPage from './components/LoginPage';
import PasswordCreationPage from './components/PasswordCreationPage';

// Admin Components (lazy loaded)
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));

type AuthStep = 'login' | 'verification' | 'password' | 'authenticated';

export default function App() {
  const [user, setUser] = useLocalStorage<User | null>('teacherpoli_user', null);
  const [activeTab, setActiveTab] = useState('onboarding');
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const [currentEmail, setCurrentEmail] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showPlanRequiredModal, setShowPlanRequiredModal] = useState(false);
  const [blockedTabName, setBlockedTabName] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Check if current user is admin
  const isUserAdmin = user && isAdmin(user.email);

  // Show welcome modal for first-time users
  React.useEffect(() => {
    if (user && user.firstAccess && !user.hasGeneratedPlan && authStep === 'authenticated' && !isUserAdmin) {
      // Show welcome modal after a short delay to ensure smooth transition
      setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
    }
  }, [user, authStep, isUserAdmin]);

  const handleLogin = async (email: string, password?: string) => {
    // Simular login bem-sucedido
    const userData: User = {
      name: email.split('@')[0],
      email,
      isVerified: true,
      hasPassword: true,
      hasGeneratedPlan: isAdmin(email), // Admins don't need to generate plan
      firstAccess: !localStorage.getItem(`user_completed_${email}`) && !isAdmin(email) // Admins skip onboarding
    };
    
    setUser(userData);
    setAuthStep('authenticated');
    
    // If admin, go directly to admin panel
    if (isAdmin(email)) {
      setShowAdminPanel(true);
    }
  };

  const handleNeedPassword = (email: string) => {
    setCurrentEmail(email);
    setAuthStep('password');
  };

  const handlePasswordCreated = () => {
    // Criar usuário após senha criada
    const userData: User = {
      name: currentEmail.split('@')[0],
      email: currentEmail,
      isVerified: true,
      hasPassword: true,
      hasGeneratedPlan: isAdmin(currentEmail),
      firstAccess: !isAdmin(currentEmail)
    };
    
    setUser(userData);
    setAuthStep('authenticated');
    
    // If admin, go directly to admin panel
    if (isAdmin(currentEmail)) {
      setShowAdminPanel(true);
    }
  };

  const handleBackToLogin = () => {
    setAuthStep('login');
    setCurrentEmail('');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('onboarding');
    setAuthStep('login');
    setCurrentEmail('');
    setShowAdminPanel(false);
  };

  const handlePlanGenerated = () => {
    if (user) {
      // Mark as completed in localStorage
      localStorage.setItem(`user_completed_${user.email}`, 'true');
      
      setUser({
        ...user,
        hasGeneratedPlan: true,
        firstAccess: false
      });
    }
  };

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
  };

  const handleLockedTabClick = (tabId: string) => {
    console.log('Tab bloqueada clicada:', tabId);
    setBlockedTabName(tabId);
    setShowPlanRequiredModal(true);
  };

  const handleGoToPlan = () => {
    console.log('Indo para o plano');
    setShowPlanRequiredModal(false);
    setActiveTab('ai-assistant');
  };

  const handleCommunityClick = () => {
    setActiveTab('community');
  };

  const handleSettingsClick = () => {
    setActiveTab('settings');
  };

  // Determine locked tabs based on user progress
  const getLockedTabs = () => {
    if (!user || isUserAdmin) return []; // Admins have access to everything
    
    // Only lock tabs on first access AND if user hasn't generated a plan yet
    if (user.firstAccess && !user.hasGeneratedPlan) {
      return ['teacher-poli', 'resources'];
    }
    
    return [];
  };

  if (!user || authStep !== 'authenticated') {
    switch (authStep) {
      case 'password':
        return (
          <PasswordCreationPage
            email={currentEmail}
            onPasswordCreated={handlePasswordCreated}
            onBack={handleBackToLogin}
          />
        );
      default:
        return (
          <LoginPage
            onLogin={handleLogin}
            onNeedPassword={handleNeedPassword}
          />
        );
    }
  }

  // Admin Panel View
  if (isUserAdmin && showAdminPanel) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Carregando painel administrativo...</p>
          </div>
        </div>
      }>
        <AdminPanel
          isVisible={true}
          onToggle={() => setShowAdminPanel(false)}
          userEmail={user.email}
        />
      </React.Suspense>
    );
  }

  // Student Application
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header 
          userName={user.name} 
          userEmail={user.email}
          onLogout={handleLogout}
          onCommunityClick={handleCommunityClick}
          onSettingsClick={handleSettingsClick}
          onAdminPanel={isUserAdmin ? () => setShowAdminPanel(true) : undefined}
        />
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          lockedTabs={getLockedTabs()}
          onLockedTabClick={handleLockedTabClick}
        />
        
        <main className="pb-20 lg:pb-8 pt-0 lg:pt-4">
          {activeTab === 'onboarding' && <OnboardingSection />}
          {activeTab === 'ai-assistant' && (
            <AIAssistantSection onPlanGenerated={handlePlanGenerated} />
          )}
          {activeTab === 'teacher-poli' && <TeacherPoliSection />}
          {activeTab === 'resources' && <ResourcesSection />}
          {activeTab === 'community' && <CommunitySection />}
          {activeTab === 'settings' && <SettingsSection />}
        </main>
      </div>

      {/* Welcome Modal - Only for students */}
      {!isUserAdmin && (
        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={handleWelcomeModalClose}
          userName={user.name}
        />
      )}

      {/* Plan Required Modal - Only for students */}
      {!isUserAdmin && (
        <PlanRequiredModal
          isOpen={showPlanRequiredModal}
          onClose={() => setShowPlanRequiredModal(false)}
          onGoToPlan={handleGoToPlan}
          tabName={blockedTabName}
        />
      )}
    </>
  );
}