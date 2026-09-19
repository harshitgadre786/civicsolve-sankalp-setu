import React, { useState } from 'react';
import { Search, Bell, RotateCcw, ChevronDown, CheckCircle2, Sun, Moon, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { UserRole } from '../types';

interface TopbarProps {
  onRefresh?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigate?: (tab: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onRefresh, searchQuery, setSearchQuery, onNavigate }) => {
  const { user, activeRole, setActiveRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Team Verified',
      desc: 'Green Innovators project roster approved by University Mentor.',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'New Stakeholder Comment',
      desc: 'Tata Steel CSR added feedback on Water shortage in rural areas.',
      time: '5 hours ago',
      read: false
    },
    {
      id: '3',
      title: 'Industry Match Found',
      desc: 'TCS Foundation flagged interest in Smart Irrigation System.',
      time: '1 day ago',
      read: true
    },
    {
      id: '4',
      title: 'Solution Live Deployment',
      desc: 'Waste Segregation App marked 100% completed in Bokaro district.',
      time: '2 days ago',
      read: true
    }
  ];

  const roleOptions: { role: UserRole; label: string; org: string }[] = [
    { role: 'STUDENT', label: 'Student Innovator', org: 'BIT Sindri / Student Innovators' },
    { role: 'CITIZEN', label: 'Citizen / Community', org: 'Ranchi, Jharkhand' },
    { role: 'UNIVERSITY_ADMIN', label: 'University Mentor', org: 'BIT Sindri / IIT ISM' },
    { role: 'INDUSTRY_PARTNER', label: 'Industry Partner', org: 'Tata Steel CSR / TCS' },
    { role: 'GOVERNMENT', label: 'Government Official', org: 'GoJ Higher Education' },
  ];

  return (
    <header className="h-16 bg-white dark:bg-[#071412] border-b border-[#E7EBE8] dark:border-[#152320] px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-colors duration-200">
      {/* Search Input */}
      <div className="relative w-96">
        <Search className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search challenges, solutions, institutions..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-[#F5F6F4] dark:bg-[#0c1a17] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-lg focus:outline-none focus:border-[#16AF82] transition-colors placeholder-[#7A8581]"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-[#DDF2E7] dark:bg-[#16AF82]/15 text-[#16AF82] rounded-lg text-xs font-semibold hover:bg-[#c9ebd8] dark:hover:bg-[#16AF82]/25 transition-colors border border-[#16AF82]/30"
          >
            <span className="w-2 h-2 rounded-full bg-[#16AF82]"></span>
            <span>Role: {activeRole.replace('_', ' ')}</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0c1a17] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 border-b border-[#E7EBE8] dark:border-[#1b2b27]">
                <p className="text-[11px] font-semibold text-[#7A8581] uppercase tracking-wider">Switch Testing Role</p>
              </div>
              {roleOptions.map((opt) => (
                <button
                  key={opt.role}
                  onClick={() => {
                    setActiveRole(opt.role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a] transition-colors ${
                    activeRole === opt.role ? 'bg-[#DDF2E7] dark:bg-[#16AF82]/20 font-semibold text-[#16AF82]' : 'text-[#18201E] dark:text-[#E7EBE8]'
                  }`}
                >
                  <div>
                    <p>{opt.label}</p>
                    <p className="text-[10px] text-[#7A8581]">{opt.org}</p>
                  </div>
                  {activeRole === opt.role && <CheckCircle2 className="w-3.5 h-3.5 text-[#16AF82]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle (Dark / Light Mode) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E7EBE8] dark:border-[#1b2b27] text-[#7A8581] hover:text-[#18201E] dark:hover:text-[#E7EBE8] hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a] transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#7A8581]" />
          )}
        </button>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Data"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E7EBE8] dark:border-[#1b2b27] text-[#7A8581] hover:text-[#18201E] dark:hover:text-[#E7EBE8] hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-[#E7EBE8] dark:border-[#1b2b27] text-[#7A8581] hover:text-[#18201E] dark:hover:text-[#E7EBE8] hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E5605F]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0c1a17] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#E7EBE8] dark:border-[#1b2b27] flex items-center justify-between">
                <span className="text-xs font-bold text-[#18201E] dark:text-[#E7EBE8] uppercase tracking-wider">Notifications</span>
                <span className="text-[11px] text-[#16AF82] font-semibold">2 New</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#E7EBE8] dark:divide-[#1b2b27]">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-left hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a] transition-colors ${!n.read ? 'bg-[#F9FCFA] dark:bg-[#0c1a17]' : ''}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#18201E] dark:text-[#E7EBE8]">{n.title}</p>
                      <span className="text-[10px] text-[#7A8581]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#7A8581] mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 pl-2 border-l border-[#E7EBE8] dark:border-[#1b2b27] hover:opacity-80 transition-opacity"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80"}
              alt="User avatar"
              className="w-9 h-9 rounded-full object-cover border border-[#E7EBE8] dark:border-[#1b2b27]"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-[#18201E] dark:text-[#E7EBE8] leading-tight">{user?.name || 'Harshit Gadre'}</p>
              <p className="text-[10px] text-[#7A8581] font-medium leading-none mt-0.5">
                {activeRole === 'CITIZEN' ? 'Student Innovator' : activeRole.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#7A8581]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0c1a17] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl shadow-xl py-1.5 z-50 animate-fadeIn">
              <div className="px-3.5 py-2 border-b border-[#E7EBE8] dark:border-[#1b2b27]">
                <p className="text-xs font-bold text-[#18201E] dark:text-[#E7EBE8]">{user?.name || 'Harshit Gadre'}</p>
                <p className="text-[10px] text-[#7A8581] truncate">{user?.email || 'harshitgadre786@gmail.com'}</p>
              </div>

              {onNavigate && (
                <>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2 text-[#18201E] dark:text-[#E7EBE8] hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a] transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#7A8581]" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('saved');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2 text-[#18201E] dark:text-[#E7EBE8] hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a] transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#7A8581]" />
                    <span>Saved Bookmarks</span>
                  </button>
                </>
              )}

              <div className="border-t border-[#E7EBE8] dark:border-[#1b2b27] mt-1 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
