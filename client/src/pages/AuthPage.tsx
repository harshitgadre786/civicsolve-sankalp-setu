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
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
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
  const { login, loginSocial, setActiveRole } = useAuth();
  const [isSignup, setIsSignup] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('Ranchi, Jharkhand');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const googleAccounts = [
    {
      name: 'Harshit Gadre',
      email: 'harshitgadre786@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: 'STUDENT' as UserRole,
      badge: 'Primary Evaluator',
      desc: 'Lead Innovator • Sankalp Setu Team'
    },
    {
      name: 'Harshit Gadre',
      email: 'harshitgadre706@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: 'STUDENT' as UserRole,
      badge: 'Student Account',
      desc: 'Student Innovator • BIT Sindri'
    },
    {
      name: 'Dr. Ananya Sen',
      email: 'director.planning@jharkhand.gov.in',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      role: 'GOVERNMENT' as UserRole,
      badge: 'Govt Reviewer',
      desc: 'Director of Planning • Higher Education Dept'
    },
    {
      name: 'Amit Kumar',
      email: 'amit.kumar.jh@gov.in',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      role: 'CITIZEN' as UserRole,
      badge: 'Citizen',
      desc: 'Citizen Representative • Morabadi, Ranchi'
    }
  ];

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

  const handleSocialAuth = async (provider: string, payload?: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const ok = await loginSocial(provider, payload);
      if (ok) {
        setIsGoogleModalOpen(false);
        const targetRole = payload?.role || (provider === 'github' ? 'STUDENT' : provider === 'linkedin' ? 'INDUSTRY_PARTNER' : role);
        setActiveRole(targetRole);
        onSuccess(targetRole);
      } else {
        setErrorMsg(`${provider} authentication failed. Please try again.`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || `${provider} authentication failed.`);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Optional Turnstile token verification with backend if token exists
    if (turnstileToken && turnstileToken !== 'offline_turnstile_test_token') {
      try {
        await api.verifyTurnstile(turnstileToken);
      } catch (cfErr: any) {
        console.warn('Turnstile check non-blocking notice:', cfErr);
      }
    }

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
    <div className="min-h-screen bg-[#F5F6F4] dark:bg-[#071412] text-[#18201E] dark:text-[#E7EBE8] flex flex-col justify-center items-center p-4 sm:p-6 text-left font-sans transition-colors duration-200">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#16AF82] flex items-center justify-center text-white shadow-md shadow-[#16AF82]/25">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#18201E] dark:text-white">CivicSolve</span>
        </button>
        <p className="text-xs text-[#7A8581] dark:text-[#9AA5A2] mt-1 font-medium">
          Sankalp Setu • Single Sign-On Portal
        </p>
      </div>

      <div className="bg-white dark:bg-[#0c1a17] rounded-3xl border border-[#E7EBE8] dark:border-[#152320] shadow-xl max-w-xl w-full p-6 sm:p-8 space-y-5">
        {/* Toggle Login vs Signup */}
        <div className="flex bg-[#F5F6F4] dark:bg-[#121c1a] p-1 rounded-xl border border-[#E7EBE8] dark:border-[#1b2b27]">
          <button
            type="button"
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isSignup ? 'bg-white dark:bg-[#16AF82] text-[#16AF82] dark:text-white shadow-sm' : 'text-[#7A8581] hover:text-[#18201E] dark:text-[#9AA5A2] dark:hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isSignup ? 'bg-white dark:bg-[#16AF82] text-[#16AF82] dark:text-white shadow-sm' : 'text-[#7A8581] hover:text-[#18201E] dark:text-[#9AA5A2] dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google 1-Click Login Button */}
        <div className="w-full flex flex-col items-center justify-center space-y-2">
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 bg-white dark:bg-[#12221E] hover:bg-slate-50 dark:hover:bg-[#162924] border border-[#D5DDD8] dark:border-[#1F332E] rounded-xl text-xs font-semibold text-[#18201E] dark:text-[#E7EBE8] shadow-sm hover:shadow transition-all duration-200 group"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          <div className="w-full flex items-center space-x-3 my-1">
            <div className="flex-1 h-px bg-[#E7EBE8] dark:bg-[#1b2b27]"></div>
            <span className="text-[10px] uppercase font-bold text-[#7A8581] dark:text-[#9AA5A2]">Or continue with email</span>
            <div className="flex-1 h-px bg-[#E7EBE8] dark:bg-[#1b2b27]"></div>
          </div>
        </div>

        {/* Quick Demo Switcher */}
        <div className="space-y-1.5 p-3 rounded-xl bg-[#F9FCFA] dark:bg-[#0e1a17] border border-[#E7EBE8] dark:border-[#1b2b27]">
          <span className="text-[10px] font-bold text-[#7A8581] dark:text-[#9AA5A2] uppercase tracking-wider block">
            One-Click Demo Evaluator Access:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {demoAccounts.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => handleQuickDemoLogin(d)}
                className="px-2.5 py-1 bg-white dark:bg-[#162421] border border-[#E7EBE8] dark:border-[#1b2b27] hover:border-[#16AF82] hover:text-[#16AF82] text-[11px] font-semibold text-[#18201E] dark:text-[#E7EBE8] rounded-md transition-colors"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignup ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">Username / Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. harshit_gadre"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                  />
                </div>
              </div>

              {/* E-mail Address */}
              <div>
                <label className="block text-xs font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">E-mail Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                  />
                </div>
              </div>

              {/* Platform Role */}
              <div>
                <label className="block text-xs font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">Platform Role *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rolesList.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setRole(r.role)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        role === r.role
                          ? 'border-[#16AF82] bg-[#DDF2E7]/40 dark:bg-[#16AF82]/20 ring-1 ring-[#16AF82]'
                          : 'border-[#E7EBE8] dark:border-[#1b2b27] hover:border-gray-300'
                      }`}
                    >
                      <span className="font-bold text-[11px] text-[#18201E] dark:text-[#E7EBE8] block">{r.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* E-mail Address */}
              <div>
                <label className="block text-xs font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">E-mail Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com or demo@gov.in"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Cloudflare Turnstile Verification Box */}
          <div className="py-2 px-3 bg-[#F9FCFA] dark:bg-[#101c19] rounded-xl border border-[#E7EBE8] dark:border-[#1b2b27] flex flex-col items-center">
            <div className="flex items-center space-x-1.5 text-[11px] font-medium text-[#7A8581] dark:text-[#9AA5A2] mb-1.5 self-start">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16AF82]" />
              <span>Verify you are human</span>
            </div>
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken('offline_turnstile_test_token')}
              options={{ theme: 'auto', size: 'normal' }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#16AF82] hover:bg-[#13976f] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#16AF82]/25 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Terms & Privacy */}
          <p className="text-[11px] text-center text-[#7A8581] dark:text-[#8E9C97] pt-1">
            By continuing, you agree to <span className="text-[#16AF82] hover:underline cursor-pointer">Terms</span> & <span className="text-[#16AF82] hover:underline cursor-pointer">Privacy Policy</span>.
          </p>

          {/* Switch Login/Signup */}
          <div className="text-center pt-1">
            {isSignup ? (
              <span className="text-xs text-[#7A8581] dark:text-[#8E9C97]">
                Have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className="font-bold text-[#16AF82] hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span className="text-xs text-[#7A8581] dark:text-[#8E9C97]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className="font-bold text-[#16AF82] hover:underline"
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>

          {/* Social Logins Divider */}
          <div className="pt-2">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#E7EBE8] dark:border-[#1b2b27]"></div>
              <span className="bg-white dark:bg-[#0c1a17] px-3 text-[11px] text-[#7A8581] dark:text-[#8E9C97] absolute">
                or you can sign in with
              </span>
            </div>

            {/* Social Icons Row (LeetCode Style) */}
            <div className="flex items-center justify-center space-x-3.5 mt-5">
              {/* Google */}
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                title="Sign in with Google"
                className="w-10 h-10 rounded-full bg-[#F5F6F4] dark:bg-[#162421] border border-[#E7EBE8] dark:border-[#1b2b27] flex items-center justify-center hover:scale-110 hover:border-[#16AF82] hover:shadow-md transition-all group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
                </svg>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleSocialAuth('github')}
                title="Sign in with GitHub"
                className="w-10 h-10 rounded-full bg-[#F5F6F4] dark:bg-[#162421] border border-[#E7EBE8] dark:border-[#1b2b27] flex items-center justify-center hover:scale-110 hover:border-[#16AF82] hover:shadow-md transition-all text-[#18201E] dark:text-[#E7EBE8]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleSocialAuth('apple')}
                title="Sign in with Apple"
                className="w-10 h-10 rounded-full bg-[#F5F6F4] dark:bg-[#162421] border border-[#E7EBE8] dark:border-[#1b2b27] flex items-center justify-center hover:scale-110 hover:border-[#16AF82] hover:shadow-md transition-all text-[#18201E] dark:text-[#E7EBE8]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.09 1.73-0.95 2.75 1.01.08 2.05-.5 2.68-1.25z"/>
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => handleSocialAuth('linkedin')}
                title="Sign in with LinkedIn"
                className="w-10 h-10 rounded-full bg-[#F5F6F4] dark:bg-[#162421] border border-[#E7EBE8] dark:border-[#1b2b27] flex items-center justify-center hover:scale-110 hover:border-[#16AF82] hover:shadow-md transition-all"
              >
                <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </button>

              {/* DigiLocker / MeriPehchaan */}
              <button
                type="button"
                onClick={() => handleSocialAuth('digilocker')}
                title="Sign in with DigiLocker / MeriPehchaan (Govt of India)"
                className="w-10 h-10 rounded-full bg-[#DDF2E7] dark:bg-[#15342B] border border-[#16AF82]/40 flex items-center justify-center hover:scale-110 hover:shadow-md transition-all text-[#16AF82]"
              >
                <span className="text-[10px] font-black tracking-tight">GOV</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Switcher for SIH Evaluators */}
          <div className="pt-3 border-t border-[#E7EBE8] dark:border-[#1b2b27]">
            <span className="text-[10px] font-bold text-[#7A8581] dark:text-[#9AA5A2] uppercase tracking-wider block mb-1.5">
              SIH Evaluator Quick Access:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {demoAccounts.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(d)}
                  className="px-2 py-0.5 bg-[#F5F6F4] dark:bg-[#162421] border border-[#E7EBE8] dark:border-[#1b2b27] hover:border-[#16AF82] hover:text-[#16AF82] text-[10px] font-semibold text-[#18201E] dark:text-[#E7EBE8] rounded-md transition-colors"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Google Account Selector Modal (1-Click Google Sign-In) */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0E1E1B] rounded-2xl max-w-sm w-full p-5 border border-[#E7EBE8] dark:border-[#1F332E] shadow-2xl animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EBE8] dark:border-[#1F332E]">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
                </svg>
                <h3 className="font-bold text-sm text-[#18201E] dark:text-[#E7EBE8]">Sign in with Google</h3>
              </div>
              <button
                onClick={() => setIsGoogleModalOpen(false)}
                className="text-[#7A8581] hover:text-[#18201E] dark:hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#7A8581] dark:text-[#8E9C97]">
              Choose a verified Google account to continue to CivicSolve / Sankalp Setu:
            </p>

            {/* 1-Click Instant Accounts */}
            <div className="space-y-2">
              {googleAccounts.map((g) => (
                <button
                  key={g.email}
                  type="button"
                  onClick={() => handleSocialAuth('google', g)}
                  className="w-full p-2.5 rounded-xl border border-[#E7EBE8] dark:border-[#1F332E] hover:border-[#16AF82] dark:hover:border-[#16AF82] bg-[#F9FCFA] dark:bg-[#12221E] hover:bg-white dark:hover:bg-[#152B25] flex items-center space-x-3 transition-all text-left group"
                >
                  <img src={g.avatar} alt={g.name} className="w-8 h-8 rounded-full object-cover border border-[#16AF82]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="block text-xs font-bold text-[#18201E] dark:text-[#E7EBE8] truncate">{g.name}</span>
                      {g.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#16AF82]/10 text-[#16AF82] font-bold border border-[#16AF82]/20">
                          {g.badge}
                        </span>
                      )}
                    </div>
                    <span className="block text-[10px] text-[#7A8581] dark:text-[#8E9C97] truncate">{g.email}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Google Email input */}
            <div className="pt-2 border-t border-[#E7EBE8] dark:border-[#1F332E] space-y-2">
              <span className="text-[10px] font-semibold text-[#7A8581] dark:text-[#8E9C97] block">Or enter any Google email:</span>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="your.name@gmail.com"
                  className="flex-1 px-3 py-1.5 text-xs bg-[#F5F6F4] dark:bg-[#152723] border border-[#E7EBE8] dark:border-[#1F332E] text-[#18201E] dark:text-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                />
                <button
                  type="button"
                  onClick={() => handleSocialAuth('google', { email: customGoogleEmail, name: customGoogleEmail.split('@')[0] })}
                  disabled={!customGoogleEmail.includes('@')}
                  className="px-3 py-1.5 bg-[#16AF82] hover:bg-[#13976f] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
