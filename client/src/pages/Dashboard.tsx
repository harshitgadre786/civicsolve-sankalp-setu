import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Lightbulb, 
  Users, 
  HeartHandshake, 
  ArrowUpRight, 
  ChevronDown, 
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AnimatedProblemMap } from '../components/AnimatedProblemMap';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  onNavigate: (tab: string, itemId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, activeRole } = useAuth();
  const [yearFilter, setYearFilter] = useState('This Year');
  const [stats, setStats] = useState<any>({
    kpis: {
      totalChallenges: 1284,
      activeSolutions: 326,
      universityTeams: 184,
      peopleImpacted: '2.4M',
      deltas: {
        challengesDelta: '+12.5%',
        solutionsDelta: '+8.4%',
        teamsDelta: '+6.2%',
        impactDelta: '+18.7%'
      }
    },
    monthlyActivity: [
      { month: 'Jan', challenges: 85, solutions: 22 },
      { month: 'Feb', challenges: 110, solutions: 34 },
      { month: 'Mar', challenges: 95, solutions: 40 },
      { month: 'Apr', challenges: 135, solutions: 52 },
      { month: 'May', challenges: 160, solutions: 68 },
      { month: 'Jun', challenges: 145, solutions: 61 },
      { month: 'Jul', challenges: 180, solutions: 79 },
      { month: 'Aug', challenges: 210, solutions: 92 },
      { month: 'Sep', challenges: 235, solutions: 105 },
      { month: 'Oct', challenges: 195, solutions: 88 },
      { month: 'Nov', challenges: 220, solutions: 96 },
      { month: 'Dec', challenges: 240, solutions: 112 }
    ],
    recentChallenges: []
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getDashboardStats();
        if (res.data) {
          setStats((prev: any) => ({
            ...prev,
            ...res.data
          }));
        }
      } catch (err) {
        console.warn('Dashboard fetch fallback to seed state:', err);
      }
    };
    fetchDashboard();
  }, []);

  const defaultChallenges = [
    {
      id: 'ch_1',
      title: 'Water shortage in rural areas',
      location: 'Ranchi, Jharkhand',
      priority: 'HIGH',
      status: 'OPEN',
      date: '20 Jan 2026'
    },
    {
      id: 'ch_2',
      title: 'Healthcare access in remote villages',
      location: 'Dhanbad, Jharkhand',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      date: '18 Jan 2026'
    },
    {
      id: 'ch_3',
      title: 'Waste management and mine dust',
      location: 'Bokaro, Jharkhand',
      priority: 'MEDIUM',
      status: 'OPEN',
      date: '16 Jan 2026'
    },
    {
      id: 'ch_4',
      title: 'Crop disease in paddy fields',
      location: 'Ranchi, Jharkhand',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      date: '14 Jan 2026'
    }
  ];

  const recentList = stats.recentChallenges?.length > 0 ? stats.recentChallenges : defaultChallenges;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-left">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18201E] tracking-tight">
            Good Morning, {user?.name?.split(' ')[0] || 'Harshit'}
          </h1>
          <p className="text-sm text-[#7A8581] mt-0.5">
            Logged in as <strong className="text-[#16AF82] font-semibold">{activeRole.replace('_', ' ')}</strong> • Here is what is happening on CivicSolve today across Jharkhand.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {activeRole === 'GOVERNMENT' ? (
            <button 
              onClick={() => onNavigate('government-panel')}
              className="px-4 py-2 bg-[#16AF82] text-white rounded-lg text-sm font-semibold hover:bg-[#13976f] transition-all shadow-sm flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Review Solutions Queue</span>
            </button>
          ) : activeRole === 'STUDENT' ? (
            <button 
              onClick={() => onNavigate('for-you')}
              className="px-4 py-2 bg-[#16AF82] text-white rounded-lg text-sm font-semibold hover:bg-[#13976f] transition-all shadow-sm flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore My For You Feed</span>
            </button>
          ) : (
            <button 
              onClick={() => onNavigate('challenges')}
              className="px-4 py-2 bg-[#16AF82] text-white rounded-lg text-sm font-semibold hover:bg-[#13976f] transition-all shadow-sm flex items-center space-x-2"
            >
              <span>+ Post a Challenge</span>
            </button>
          )}
        </div>
      </div>

      {/* Role-Aware Operational Banners */}
      {activeRole === 'GOVERNMENT' && (
        <div className="p-4 bg-[#FEF3C7] border border-[#FCD34D] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#D97706] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#18201E]">Government Review Queue Active</h4>
              <p className="text-[11px] text-[#78350F]">Collegiate prototypes are pending formal technical approval for district deployment.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('government-panel')}
            className="px-3.5 py-1.5 bg-[#D97706] text-white rounded-lg text-xs font-bold hover:bg-[#B45309] transition-colors flex items-center space-x-1 self-start sm:self-auto"
          >
            <span>Open Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {activeRole === 'STUDENT' && (
        <div className="p-4 bg-[#DDF2E7] border border-[#16AF82]/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#16AF82] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#18201E]">High-Compatibility Challenges Matched</h4>
              <p className="text-[11px] text-[#16AF82] font-semibold">Your Python, IoT, and Agronomy skill tags match multiple grassroots problems in Ranchi and Dhanbad.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('for-you')}
            className="px-3.5 py-1.5 bg-[#16AF82] text-white rounded-lg text-xs font-bold hover:bg-[#13976f] transition-colors flex items-center space-x-1 self-start sm:self-auto"
          >
            <span>View Ranked Challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Challenges */}
        <div className="bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A8581] uppercase tracking-wider">Total Challenges</span>
            <div className="w-8 h-8 rounded-lg bg-[#DDF2E7] flex items-center justify-center text-[#16AF82]">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-[#18201E]">{stats.kpis.totalChallenges.toLocaleString()}</h2>
            <span className="text-xs font-semibold text-[#16AF82] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {stats.kpis.deltas.challengesDelta} this month
            </span>
          </div>
        </div>

        {/* Active Solutions */}
        <div className="bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A8581] uppercase tracking-wider">Active Solutions</span>
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-[#18201E]">{stats.kpis.activeSolutions}</h2>
            <span className="text-xs font-semibold text-[#16AF82] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {stats.kpis.deltas.solutionsDelta} this month
            </span>
          </div>
        </div>

        {/* University Teams */}
        <div className="bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A8581] uppercase tracking-wider">University Teams</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-[#18201E]">{stats.kpis.universityTeams}</h2>
            <span className="text-xs font-semibold text-[#16AF82] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {stats.kpis.deltas.teamsDelta} this month
            </span>
          </div>
        </div>

        {/* People Impacted */}
        <div className="bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A8581] uppercase tracking-wider">People Impacted</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-[#18201E]">{stats.kpis.peopleImpacted}</h2>
            <span className="text-xs font-semibold text-[#16AF82] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {stats.kpis.deltas.impactDelta} this month
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart + Animated Problem Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Challenge Activity Line/Area Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#18201E]">Challenge Activity</h3>
              <p className="text-xs text-[#7A8581]">Real-time civic submissions vs deployed university solutions</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-lg px-2.5 py-1 text-[#18201E] focus:outline-none"
              >
                <option value="This Year">This Year</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChallenges" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16AF82" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16AF82" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorSolutions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7EBE8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7A8581' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#7A8581' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#071412', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="challenges" stroke="#16AF82" strokeWidth={2.5} fillOpacity={1} fill="url(#colorChallenges)" name="Challenges" />
                <Area type="monotone" dataKey="solutions" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorSolutions)" name="Solutions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center space-x-6 pt-3 border-t border-[#E7EBE8] text-xs">
            <span className="flex items-center space-x-1.5 text-[#18201E]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16AF82]"></span>
              <span>Challenges Submitted</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#18201E]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
              <span>Solutions In Progress</span>
            </span>
          </div>
        </div>

        {/* Animated Problem Map with Live Floating Panel Overlay */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-[#18201E]">Live Problem Map</h3>
              <p className="text-xs text-[#7A8581]">Pulsing telemetry markers with live floating panel overlay</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DDF2E7] text-[#16AF82] font-bold">
              Realtime
            </span>
          </div>

          <div className="flex-1 w-full min-h-[280px]">
            <AnimatedProblemMap onInspectChallenge={(id) => onNavigate('challenge-detail', id)} />
          </div>

          <p className="text-[11px] text-[#7A8581] mt-2 text-center">
            Click any pulsing pin to launch the realtime telemetry panel and poll updates.
          </p>
        </div>
      </div>

      {/* Bottom Section: Recent Challenges Table */}
      <div className="bg-white rounded-xl border border-[#E7EBE8] shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#18201E]">Recent Challenges</h3>
            <p className="text-xs text-[#7A8581]">Latest societal challenges verified by AI categorization</p>
          </div>
          <button 
            onClick={() => onNavigate('challenges')}
            className="text-xs font-semibold text-[#16AF82] hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7EBE8] text-[#7A8581] uppercase font-semibold text-[10px] tracking-wider">
                <th className="pb-3 px-2">#</th>
                <th className="pb-3 px-4">Title</th>
                <th className="pb-3 px-4">Location</th>
                <th className="pb-3 px-4">Priority</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Date</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EBE8]">
              {recentList.map((ch: any, idx: number) => {
                const priorityColor = ch.priority === 'HIGH' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                                      ch.priority === 'MEDIUM' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#E0F2FE] text-[#0284C7]';
                const statusColor = ch.status === 'OPEN' ? 'bg-[#DDF2E7] text-[#16AF82]' :
                                    ch.status === 'IN_PROGRESS' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-gray-100 text-gray-700';

                return (
                  <tr key={ch.id || idx} className="hover:bg-[#F5F6F4] transition-colors">
                    <td className="py-3.5 px-2 font-medium text-[#7A8581]">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#18201E] max-w-xs truncate">
                      {ch.title}
                    </td>
                    <td className="py-3.5 px-4 text-[#7A8581]">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-[#7A8581]" />
                        <span>{ch.location}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityColor}`}>
                        {ch.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor}`}>
                        {ch.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#7A8581] whitespace-nowrap">
                      {ch.date || '20 Jan 2026'}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <button
                        onClick={() => onNavigate('challenge-detail', ch.id)}
                        className="px-2.5 py-1 text-xs font-medium text-[#16AF82] hover:bg-[#DDF2E7] rounded-md transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
