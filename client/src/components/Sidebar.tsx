import React from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  Lightbulb, 
  GraduationCap, 
  Building2, 
  Users, 
  Sparkles, 
  BarChart3, 
  Bookmark, 
  Settings, 
  LogOut,
  Layers,
  Compass,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateToLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onNavigateToLanding }) => {
  const { user, activeRole, logout } = useAuth();

  const currentRole = user?.role || activeRole;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(currentRole === 'STUDENT'
      ? [{ id: 'for-you', label: 'For You (Matched)', icon: Compass }]
      : []),
    ...(currentRole === 'GOVERNMENT'
      ? [{ id: 'government-panel', label: 'Govt Review Queue', icon: ShieldCheck }]
      : []),
    { id: 'challenges', label: 'Challenges', icon: Flame },
    { id: 'solutions', label: 'Solutions', icon: Lightbulb },
    { id: 'universities', label: 'Universities', icon: GraduationCap },
    { id: 'industry', label: 'Industry Partners', icon: Building2 },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'ai-matching', label: 'AI Matching', icon: Sparkles },
    { id: 'impact', label: 'Impact Analytics', icon: BarChart3 },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#071412] text-white flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-[#152320]">
      {/* Brand Logo Header */}
      <div 
        onClick={() => setActiveTab('dashboard')}
        className="p-5 border-b border-[#152320] flex items-center space-x-3 cursor-pointer hover:bg-[#0c1a17] transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-[#16AF82] flex items-center justify-center text-white shadow-md shadow-[#16AF82]/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white leading-tight">CivicSolve</h1>
          <p className="text-[11px] text-[#7A8581] font-medium tracking-wide">Sankalp Setu • Jharkhand</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#1F2927] text-[#16AF82] font-semibold border-l-2 border-[#16AF82]'
                  : 'text-[#9AA5A2] hover:text-white hover:bg-[#121c1a]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#16AF82]' : 'text-[#7A8581]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Slogan Banner */}
      <div className="px-4 py-3 mx-3 mb-3 rounded-lg bg-[#0e1a17] border border-[#1b2b27] text-left">
        <p className="text-[11px] text-[#16AF82] font-semibold uppercase tracking-wider">SIH 2026 Submission</p>
        <p className="text-xs text-[#9AA5A2] mt-1 leading-snug">Together for a smarter, stronger, and more inclusive tomorrow.</p>
      </div>

      {/* Public Portal & Logout Action */}
      <div className="p-3 border-t border-[#152320] space-y-1">
        {onNavigateToLanding && (
          <button
            onClick={onNavigateToLanding}
            className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-sm text-[#7A8581] hover:text-[#16AF82] hover:bg-[#121c1a] transition-colors"
          >
            <Globe className="w-4 h-4 text-[#16AF82]" />
            <span>Public Portal</span>
          </button>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-sm text-[#7A8581] hover:text-red-400 hover:bg-[#121c1a] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
