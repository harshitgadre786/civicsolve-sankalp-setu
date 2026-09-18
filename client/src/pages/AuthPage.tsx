import React, { useState } from 'react';
import { 
  Layers, 
  ArrowRight, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Building, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onSuccess: (role: UserRole) => void;
  onBackToHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  initialMode = 'login', 
  onSuccess,
  onBackToHome 
}) => {
  const { login, setActiveRole } = useAuth();
  const [isSignup, setIsSignup] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('Ranchi, Jharkhand');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rolesList: { role: UserRole; title: string; desc: string }[] = [
    { role: 'STUDENT', title: 'Student Innovator', desc: 'Join university teams and engineer societal solutions' },
    { role: 'CITIZEN', title: 'Citizen / Community', desc: 'Submit and upvote local challenges with photo evidence' },
    { role: 'UNIVERSITY_ADMIN', title: 'University Mentor', desc: 'Manage HEI incubation labs and faculty mentors' },
    { role: 'INDUSTRY_PARTNER', title: 'Industry Partner', desc: 'Sponsor solutions with CSR grants, equipment, and mentoring' },
    { role: 'GOVERNMENT', title: 'Government Reviewer', desc: 'Evaluate pending solutions and track state impact' }
  ];

  const demoAccounts = [
    { label: 'Student Innovator', email: 'harshitgadre706@gmail.com', role: 'STUDENT' as UserRole },
    { label: 'Government Reviewer', email: 'director.planning@jharkhand.gov.in', role: 'GOVERNMENT' as UserRole },
    { label: 'University Mentor', email: 'admin@bitsindri.ac.in', role: 'UNIVERSITY_ADMIN' as UserRole },
    { label: 'Industry Partner', email: 'priya.nair@tatasteel.com', role: 'INDUSTRY_PARTNER' as UserRole },
    { label: 'Citizen', email: 'citizen.jharkhand@gov.in', role: 'CITIZEN' as UserRole }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const ok = await login(email, password);
      if (ok) {
        if (isSignup) setActiveRole(role);
        onSuccess(role);
      } else {
        setErrorMsg('Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demo: typeof demoAccounts[0]) => {
    setLoading(true);
    setEmail(demo.email);
    setPassword('password123');
    try {
      await login(demo.email, 'password123');
      setActiveRole(demo.role);
      onSuccess(demo.role);
    } catch {
      setActiveRole(demo.role);
      onSuccess(demo.role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F4] flex flex-col justify-center items-center p-4 sm:p-6 text-left font-sans">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#16AF82] flex items-center justify-center text-white shadow-md shadow-[#16AF82]/25">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#18201E]">CivicSolve</span>
        </button>
        <p className="text-xs text-[#7A8581] mt-1 font-medium">
          Sankalp Setu • Single Sign-On Portal
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E7EBE8] shadow-xl max-w-xl w-full p-6 sm:p-8 space-y-6">
        {/* Toggle Login vs Signup */}
        <div className="flex bg-[#F5F6F4] p-1 rounded-xl border border-[#E7EBE8]">
          <button
            type="button"
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isSignup ? 'bg-white text-[#16AF82] shadow-sm' : 'text-[#7A8581] hover:text-[#18201E]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isSignup ? 'bg-white text-[#16AF82] shadow-sm' : 'text-[#7A8581] hover:text-[#18201E]'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Demo Switcher */}
        <div className="space-y-1.5 p-3 rounded-xl bg-[#F9FCFA] border border-[#E7EBE8]">
          <span className="text-[10px] font-bold text-[#7A8581] uppercase tracking-wider block">
            One-Click Demo Evaluator Access:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {demoAccounts.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => handleQuickDemoLogin(d)}
                className="px-2.5 py-1 bg-white border border-[#E7EBE8] hover:border-[#16AF82] hover:text-[#16AF82] text-[11px] font-semibold text-[#18201E] rounded-md transition-colors"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#18201E] mb-1">Select Your Platform Role *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rolesList.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setRole(r.role)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        role === r.role
                          ? 'border-[#16AF82] bg-[#DDF2E7]/40 ring-2 ring-[#16AF82]/20'
                          : 'border-[#E7EBE8] hover:border-gray-300'
                      }`}
                    >
                      <span className="font-bold text-xs text-[#18201E] block">{r.title}</span>
                      <span className="text-[10px] text-[#7A8581] leading-tight block mt-0.5">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18201E] mb-1">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harshit Gadre"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-xl focus:outline-none focus:border-[#16AF82]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18201E] mb-1">Institution / Organization</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. BIT Sindri"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-xl focus:outline-none focus:border-[#16AF82]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18201E] mb-1">District / Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ranchi, Jharkhand"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-xl focus:outline-none focus:border-[#16AF82]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-[#18201E] mb-1">Official Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.ac.in or user@domain.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-xl focus:outline-none focus:border-[#16AF82]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18201E] mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-xl focus:outline-none focus:border-[#16AF82]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#16AF82] hover:bg-[#13976f] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#16AF82]/25 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : isSignup ? 'Register & Enter Portal' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
