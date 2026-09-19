import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { Challenges } from './pages/Challenges';
import { ChallengeDetail } from './pages/ChallengeDetail';
import { Solutions } from './pages/Solutions';
import { Universities } from './pages/Universities';
import { IndustryPartners } from './pages/IndustryPartners';
import { Teams } from './pages/Teams';
import { AIMatching } from './pages/AIMatching';
import { ImpactAnalytics } from './pages/ImpactAnalytics';
import { SettingsProfile } from './pages/SettingsProfile';
import { Saved } from './pages/Saved';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ForYou } from './pages/ForYou';
import { GovernmentPanel } from './pages/GovernmentPanel';
import type { UserRole } from './types';

const MainApp: React.FC = () => {
  const { user, activeRole, login } = useAuth();
  const [viewMode, setViewMode] = useState<'landing' | 'auth' | 'app'>('app');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('ch_1');
  const [matchingSeedStatement, setMatchingSeedStatement] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (tab: string, itemId?: string) => {
    if (tab === 'landing') {
      setViewMode('landing');
      return;
    }
    if (tab === 'challenge-detail' && itemId) {
      setSelectedChallengeId(itemId);
      setActiveTab('challenge-detail');
    } else {
      setActiveTab(tab);
    }
  };

  const handleSelectChallenge = (id: string) => {
    setSelectedChallengeId(id);
    setActiveTab('challenge-detail');
  };

  const handleNavigateToAIMatching = (statement: string) => {
    setMatchingSeedStatement(statement);
    setActiveTab('ai-matching');
  };

  const handleAuthSuccess = (role: UserRole) => {
    setViewMode('app');
    if (role === 'GOVERNMENT') {
      setActiveTab('government-panel');
    } else if (role === 'STUDENT') {
      setActiveTab('for-you');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleExploreChallenges = async (challengeId?: string) => {
    if (!user) {
      // Auto-assign citizen demo session so visitor has full privileges (voting, camera, posting, inspecting)
      await login('citizen.jharkhand@gov.in');
    }
    setViewMode('app');
    if (challengeId) {
      setSelectedChallengeId(challengeId);
      setActiveTab('challenge-detail');
    } else {
      setActiveTab('challenges');
    }
  };

  // View: Public Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onGoToAuth={(mode) => {
          setAuthInitialMode(mode || 'login');
          setViewMode('auth');
        }}
        onExploreChallenges={handleExploreChallenges}
      />
    );
  }

  // View: Authentication
  if (viewMode === 'auth') {
    return (
      <AuthPage
        initialMode={authInitialMode}
        onSuccess={handleAuthSuccess}
        onBackToHome={() => setViewMode('landing')}
      />
    );
  }

  // View: Main Authenticated Portal
  return (
    <div className="min-h-screen bg-[#F5F6F4] dark:bg-[#071412] text-[#18201E] dark:text-[#E7EBE8] flex transition-colors duration-200">
      {/* Fixed Left Sidebar matching mockup #071412 */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onNavigateToLanding={() => setViewMode('landing')}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar matching mockup with search, notifications, user avatar */}
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNavigate={handleNavigate}
          onRefresh={() => {
            const current = activeTab;
            setActiveTab('temp');
            setTimeout(() => setActiveTab(current), 50);
          }}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard onNavigate={handleNavigate} />
          )}

          {activeTab === 'for-you' && (
            <ForYou
              onSelectChallenge={handleSelectChallenge}
              onFormTeam={(chId) => {
                setSelectedChallengeId(chId);
                setActiveTab('teams');
              }}
            />
          )}

          {activeTab === 'government-panel' && (
            <GovernmentPanel />
          )}

          {activeTab === 'challenges' && (
            <Challenges
              onSelectChallenge={handleSelectChallenge}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'challenge-detail' && (
            <ChallengeDetail
              challengeId={selectedChallengeId}
              onBack={() => setActiveTab('challenges')}
              onNavigateToAIMatching={handleNavigateToAIMatching}
            />
          )}

          {activeTab === 'solutions' && (
            <Solutions />
          )}

          {activeTab === 'universities' && (
            <Universities />
          )}

          {activeTab === 'industry' && (
            <IndustryPartners />
          )}

          {activeTab === 'teams' && (
            <Teams />
          )}

          {activeTab === 'ai-matching' && (
            <AIMatching initialStatement={matchingSeedStatement} />
          )}

          {activeTab === 'impact' && (
            <ImpactAnalytics />
          )}

          {activeTab === 'saved' && (
            <Saved onNavigate={handleNavigate} />
          )}

          {activeTab === 'settings' && (
            <SettingsProfile />
          )}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
