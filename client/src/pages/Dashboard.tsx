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
  ArrowRight,
  User as UserIcon,
  CheckCircle2,
  Clock,
  ThumbsUp,
  AlertCircle,
  Edit3,
  X,
  Building,
  Activity,
  Layers,
  Phone,
  Mail,
  Filter,
  Tag
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AnimatedProblemMap } from '../components/AnimatedProblemMap';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  onNavigate: (tab: string, itemId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, activeRole, updateUser } = useAuth();
  const [activeTabMode, setActiveTabMode] = useState<'overview' | 'my-dashboard'>('overview');
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

  // User Dashboard & Reports State
  const [myReportsData, setMyReportsData] = useState<{
    reports: any[];
    statistics: {
      totalReports: number;
      activeReports: number;
      resolvedReports: number;
      communitySupport: number;
    };
    recentActivity: any[];
  }>({
    reports: [],
    statistics: { totalReports: 0, activeReports: 0, resolvedReports: 0, communitySupport: 0 },
    recentActivity: []
  });

  // Profile Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || 'Harshit Gadre',
    phone: user?.phone || '+91 98765 43210',
    location: user?.location || 'Ranchi, Jharkhand',
    organization: user?.organization || 'BIT Sindri / Student Innovator',
    skills: user?.skills || 'Python, IoT, GIS, Civic Tech'
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '+91 98765 43210',
        location: user.location || 'Ranchi, Jharkhand',
        organization: user.organization || 'BIT Sindri / Student Innovator',
        skills: user.skills || 'Python, IoT, GIS, Civic Tech'
      });
    }
  }, [user]);

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

  const fetchMyReports = async () => {
    try {
      const res = await api.getMyReports();
      if (res.data) {
        setMyReportsData(res.data);
      }
    } catch (err) {
      console.warn('User reports fetch fallback:', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchMyReports();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMsg(null);
    try {
      const res = await api.patchProfile(editForm);
      if (res.data) {
        updateUser(res.data);
        setUpdateMsg('Profile updated successfully!');
        setTimeout(() => {
          setIsEditModalOpen(false);
          setUpdateMsg(null);
        }, 1200);
      }
    } catch (err: any) {
      setUpdateMsg(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

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

      {/* Dashboard View Switcher */}
      <div className="flex items-center space-x-3 border-b border-[#E7EBE8] dark:border-[#152320] pb-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTabMode('overview')}
          className={`flex items-center space-x-2 pb-2 border-b-2 transition-all ${
            activeTabMode === 'overview'
              ? 'border-[#16AF82] text-[#16AF82]'
              : 'border-transparent text-[#7A8581] hover:text-[#18201E] dark:text-[#9AA5A2] dark:hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Jharkhand State Civic Overview</span>
        </button>

        <button
          onClick={() => setActiveTabMode('my-dashboard')}
          className={`flex items-center space-x-2 pb-2 border-b-2 transition-all ${
            activeTabMode === 'my-dashboard'
              ? 'border-[#16AF82] text-[#16AF82]'
              : 'border-transparent text-[#7A8581] hover:text-[#18201E] dark:text-[#9AA5A2] dark:hover:text-white'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>My Citizen Dashboard & Reports</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82]">
            {myReportsData.statistics.totalReports || myReportsData.reports.length}
          </span>
        </button>
      </div>

      {/* VIEW 1: INDIVIDUAL USER DASHBOARD */}
      {activeTabMode === 'my-dashboard' ? (
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white dark:bg-[#0c1a17] rounded-2xl border border-[#E7EBE8] dark:border-[#152320] p-6 shadow-sm transition-colors">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#16AF82]/40 shadow-sm"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-[#18201E] dark:text-white">{user?.name || 'Harshit Gadre'}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82]">
                      {activeRole.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#7A8581] dark:text-[#9AA5A2]">
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-[#16AF82]" />
                      <span>{user?.email || 'harshitgadre706@gmail.com'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-[#16AF82]" />
                      <span>{user?.phone || '+91 98765 43210'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#16AF82]" />
                      <span>{user?.location || 'Ranchi, Jharkhand'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-[#16AF82]" />
                      <span>{user?.organization || 'BIT Sindri / Student Innovator'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-white dark:bg-[#121c1a] border border-[#E7EBE8] dark:border-[#1b2b27] hover:border-[#16AF82] text-xs font-bold text-[#18201E] dark:text-[#E7EBE8] rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#16AF82]" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Skills Badges */}
            <div className="mt-4 pt-4 border-t border-[#E7EBE8] dark:border-[#1b2b27] flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#7A8581] dark:text-[#9AA5A2] mr-2 flex items-center space-x-1">
                <Tag className="w-3 h-3 text-[#16AF82]" />
                <span>Skill Tags:</span>
              </span>
              {(user?.skills ? user.skills.replace(/[\[\]"]/g, '').split(',') : ['Python', 'IoT', 'GIS', 'C++', 'Civic Tech']).map((sk: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 bg-[#F5F6F4] dark:bg-[#121c1a] text-[11px] font-medium text-[#18201E] dark:text-[#C5D0CD] rounded-md border border-[#E7EBE8] dark:border-[#1b2b27]"
                >
                  {sk.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* User Statistics Row (Live DB metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0c1a17] p-4 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A8581] dark:text-[#9AA5A2]">Total Reports Submitted</span>
                <div className="w-8 h-8 rounded-lg bg-[#DDF2E7] dark:bg-[#16AF82]/20 flex items-center justify-center text-[#16AF82]">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#18201E] dark:text-white mt-2">
                {myReportsData.statistics.totalReports}
              </p>
              <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2] mt-0.5 block">Recorded in State Registry</span>
            </div>

            <div className="bg-white dark:bg-[#0c1a17] p-4 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A8581] dark:text-[#9AA5A2]">Active / In Progress</span>
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] dark:bg-amber-950/40 flex items-center justify-center text-[#D97706]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#18201E] dark:text-white mt-2">
                {myReportsData.statistics.activeReports}
              </p>
              <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2] mt-0.5 block">Under Department Execution</span>
            </div>

            <div className="bg-white dark:bg-[#0c1a17] p-4 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A8581] dark:text-[#9AA5A2]">Resolved Civic Issues</span>
                <div className="w-8 h-8 rounded-lg bg-[#DDF2E7] dark:bg-[#16AF82]/20 flex items-center justify-center text-[#16AF82]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#18201E] dark:text-white mt-2">
                {myReportsData.statistics.resolvedReports}
              </p>
              <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2] mt-0.5 block">Verified Solutions Live</span>
            </div>

            <div className="bg-white dark:bg-[#0c1a17] p-4 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A8581] dark:text-[#9AA5A2]">Community Upvotes</span>
                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] dark:bg-sky-950/40 flex items-center justify-center text-[#0284C7]">
                  <ThumbsUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#18201E] dark:text-white mt-2">
                {myReportsData.statistics.communitySupport.toLocaleString()}
              </p>
              <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2] mt-0.5 block">Public Backing Received</span>
            </div>
          </div>

          {/* User's Submitted Problems Table */}
          <div className="bg-white dark:bg-[#0c1a17] rounded-2xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm p-5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#18201E] dark:text-white">My Submitted Civic Reports</h3>
                <p className="text-xs text-[#7A8581] dark:text-[#9AA5A2]">Directly synchronized with the Jharkhand database registry</p>
              </div>
              <button
                onClick={() => onNavigate('challenges')}
                className="px-3 py-1.5 bg-[#16AF82] text-white text-xs font-bold rounded-lg hover:bg-[#13976f] transition-colors flex items-center space-x-1"
              >
                <span>+ Report a Problem</span>
              </button>
            </div>

            {myReportsData.reports.length === 0 ? (
              <div className="p-8 text-center bg-[#F9FCFA] dark:bg-[#121c1a] rounded-xl border border-[#E7EBE8] dark:border-[#1b2b27]">
                <Layers className="w-8 h-8 text-[#7A8581] mx-auto mb-2 opacity-60" />
                <h4 className="text-xs font-bold text-[#18201E] dark:text-white">No reports submitted yet</h4>
                <p className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2] mt-1">Submit civic issues with geolocation and photo evidence to track their progress.</p>
                <button
                  onClick={() => onNavigate('challenges')}
                  className="mt-3 px-3.5 py-1.5 bg-[#16AF82] text-white text-xs font-semibold rounded-lg"
                >
                  Submit Your First Report
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7EBE8] dark:border-[#1b2b27] text-[#7A8581] dark:text-[#9AA5A2] uppercase font-semibold text-[10px] tracking-wider">
                      <th className="pb-3 px-2">Problem</th>
                      <th className="pb-3 px-4">District / Department</th>
                      <th className="pb-3 px-4">Severity</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 px-4">Submitted</th>
                      <th className="pb-3 px-4">Upvotes</th>
                      <th className="pb-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7EBE8] dark:divide-[#1b2b27]">
                    {myReportsData.reports.map((report) => {
                      const sev = (report.severity || report.priority || 'HIGH').toUpperCase();
                      const sevColor = sev === 'CRITICAL' ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300' :
                                       sev === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300' :
                                       'bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82]';

                      const st = (report.status || 'REPORTED').toUpperCase();
                      const stColor = st === 'RESOLVED' ? 'bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82]' :
                                      ['IN_PROGRESS', 'ASSIGNED'].includes(st) ? 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300' :
                                      'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300';

                      let thumb = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=120&q=80';
                      try {
                        if (report.mediaUrls) {
                          const parsed = JSON.parse(report.mediaUrls);
                          if (Array.isArray(parsed) && parsed.length > 0) thumb = parsed[0];
                        }
                      } catch {}

                      return (
                        <tr key={report.id} className="hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a] transition-colors">
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-3">
                              <img src={thumb} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#E7EBE8] dark:border-[#1b2b27]" />
                              <div>
                                <p className="font-bold text-[#18201E] dark:text-white line-clamp-1">{report.title}</p>
                                <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2]">{report.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-[#18201E] dark:text-white">{report.district || 'Ranchi'}</p>
                            <p className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2]">{report.assignedDepartment || 'Municipal Corp'}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sevColor}`}>
                              {sev}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stColor}`}>
                              {st.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#7A8581] dark:text-[#9AA5A2] whitespace-nowrap">
                            {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#18201E] dark:text-white">
                            <span className="flex items-center space-x-1">
                              <ThumbsUp className="w-3 h-3 text-[#16AF82]" />
                              <span>{report.supportersCount || 0}</span>
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button
                              onClick={() => onNavigate('challenge-detail', report.id)}
                              className="px-2.5 py-1 text-xs font-bold text-[#16AF82] hover:bg-[#DDF2E7] dark:hover:bg-[#16AF82]/20 rounded-md transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white dark:bg-[#0c1a17] rounded-2xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm p-5 transition-colors">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-4 h-4 text-[#16AF82]" />
              <h3 className="text-base font-bold text-[#18201E] dark:text-white">Recent Activity Timeline</h3>
            </div>
            <p className="text-xs text-[#7A8581] dark:text-[#9AA5A2] mb-4">Official progress, stage transitions, and departmental updates on your civic reports</p>

            <div className="space-y-3">
              {(myReportsData.recentActivity.length > 0 ? myReportsData.recentActivity : [
                {
                  id: 'act_1',
                  stage: 'ASSIGNED',
                  title: 'Assigned to Municipal Corporation',
                  description: 'Work order dispatched to Ranchi field engineering division.',
                  challengeTitle: 'Large Potholes on Main Road',
                  timestamp: new Date().toISOString()
                },
                {
                  id: 'act_2',
                  stage: 'VERIFIED',
                  title: 'Problem Verified by Field Inspector',
                  description: 'Physical inspection completed and photo evidence validated.',
                  challengeTitle: 'Large Potholes on Main Road',
                  timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
                },
                {
                  id: 'act_3',
                  stage: 'REPORTED',
                  title: 'Problem Reported via Mobile Citizen Portal',
                  description: 'Report entered into civic tracking database with GPS coordinates.',
                  challengeTitle: 'Large Potholes on Main Road',
                  timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
                }
              ]).map((act, i) => (
                <div key={act.id || i} className="flex items-start space-x-3 p-3 bg-[#F9FCFA] dark:bg-[#121c1a] rounded-xl border border-[#E7EBE8] dark:border-[#1b2b27]">
                  <div className="w-7 h-7 rounded-full bg-[#DDF2E7] dark:bg-[#16AF82]/20 flex items-center justify-center text-[#16AF82] flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#18201E] dark:text-white">{act.title}</span>
                      <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2]">
                        {new Date(act.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {act.challengeTitle && (
                      <p className="text-[11px] font-semibold text-[#16AF82] mt-0.5">
                        Issue: {act.challengeTitle}
                      </p>
                    )}
                    <p className="text-[#4A5552] dark:text-[#C5D0CD] mt-0.5 leading-relaxed">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: JHARKHAND STATE CIVIC OVERVIEW */
        <>
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Challenges */}
            <div className="bg-white dark:bg-[#0c1a17] p-5 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A8581] dark:text-[#9AA5A2] uppercase tracking-wider">Total Challenges</span>
                <div className="w-8 h-8 rounded-lg bg-[#DDF2E7] dark:bg-[#16AF82]/20 flex items-center justify-center text-[#16AF82]">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h2 className="text-2xl font-bold text-[#18201E] dark:text-white">{stats.kpis.totalChallenges.toLocaleString()}</h2>
                <span className="text-xs font-semibold text-[#16AF82] flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  {stats.kpis.deltas.challengesDelta} this month
                </span>
              </div>
            </div>

            {/* Active Solutions */}
            <div className="bg-white dark:bg-[#0c1a17] p-5 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A8581] dark:text-[#9AA5A2] uppercase tracking-wider">Active Solutions</span>
                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] dark:bg-sky-950/40 flex items-center justify-center text-[#0284C7]">
                  <Lightbulb className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h2 className="text-2xl font-bold text-[#18201E] dark:text-white">{stats.kpis.activeSolutions}</h2>
                <span className="text-xs font-semibold text-[#16AF82] flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  {stats.kpis.deltas.solutionsDelta} this month
                </span>
              </div>
            </div>

            {/* University Teams */}
            <div className="bg-white dark:bg-[#0c1a17] p-5 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A8581] dark:text-[#9AA5A2] uppercase tracking-wider">University Teams</span>
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] dark:bg-amber-950/40 flex items-center justify-center text-[#D97706]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h2 className="text-2xl font-bold text-[#18201E] dark:text-white">{stats.kpis.universityTeams}</h2>
                <span className="text-xs font-semibold text-[#16AF82] flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  {stats.kpis.deltas.teamsDelta} this month
                </span>
              </div>
            </div>

            {/* People Impacted */}
            <div className="bg-white dark:bg-[#0c1a17] p-5 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A8581] dark:text-[#9AA5A2] uppercase tracking-wider">People Impacted</span>
                <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] dark:bg-red-950/40 flex items-center justify-center text-[#DC2626]">
                  <HeartHandshake className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h2 className="text-2xl font-bold text-[#18201E] dark:text-white">{stats.kpis.peopleImpacted}</h2>
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
            <div className="lg:col-span-6 bg-white dark:bg-[#0c1a17] p-5 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#18201E] dark:text-white">Challenge Activity</h3>
                  <p className="text-xs text-[#7A8581] dark:text-[#9AA5A2]">Real-time civic submissions vs deployed university solutions</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="text-xs bg-[#F5F6F4] dark:bg-[#121c1a] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-lg px-2.5 py-1 text-[#18201E] dark:text-white focus:outline-none"
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7EBE8" className="dark:opacity-20" />
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

              <div className="flex items-center justify-center space-x-6 pt-3 border-t border-[#E7EBE8] dark:border-[#1b2b27] text-xs">
                <span className="flex items-center space-x-1.5 text-[#18201E] dark:text-[#E7EBE8]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16AF82]"></span>
                  <span>Challenges Submitted</span>
                </span>
                <span className="flex items-center space-x-1.5 text-[#18201E] dark:text-[#E7EBE8]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                  <span>Solutions In Progress</span>
                </span>
              </div>
            </div>

            {/* Interactive Animated Problem Map */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0c1a17] p-5 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-[#18201E] dark:text-white">Jharkhand Live Problem Map</h3>
                  <p className="text-xs text-[#7A8581] dark:text-[#9AA5A2]">Filterable pins with telemetry cards and auto-pan</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82] font-bold">
                  Database Live
                </span>
              </div>

              <div className="flex-1 w-full">
                <AnimatedProblemMap onInspectChallenge={(id) => onNavigate('challenge-detail', id)} />
              </div>
            </div>
          </div>

          {/* Bottom Section: Recent Challenges Table */}
          <div className="bg-white dark:bg-[#0c1a17] rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm p-5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#18201E] dark:text-white">Recent Statewide Submissions</h3>
                <p className="text-xs text-[#7A8581] dark:text-[#9AA5A2]">Latest societal challenges verified by AI categorization</p>
              </div>
              <button 
                onClick={() => onNavigate('challenges')}
                className="text-xs font-semibold text-[#16AF82] hover:underline flex items-center space-x-1"
              >
                <span>View All Challenges</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E7EBE8] dark:border-[#1b2b27] text-[#7A8581] dark:text-[#9AA5A2] uppercase font-semibold text-[10px] tracking-wider">
                    <th className="pb-3 px-2">#</th>
                    <th className="pb-3 px-4">Title</th>
                    <th className="pb-3 px-4">Location</th>
                    <th className="pb-3 px-4">Priority</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EBE8] dark:divide-[#1b2b27]">
                  {recentList.map((ch: any, idx: number) => {
                    const priorityColor = ch.priority === 'HIGH' ? 'bg-[#FEE2E2] dark:bg-red-950/40 text-[#DC2626]' :
                                          ch.priority === 'MEDIUM' ? 'bg-[#FEF3C7] dark:bg-amber-950/40 text-[#D97706]' : 'bg-[#E0F2FE] dark:bg-sky-950/40 text-[#0284C7]';
                    const statusColor = ch.status === 'OPEN' ? 'bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82]' :
                                        ch.status === 'IN_PROGRESS' ? 'bg-[#FEF3C7] dark:bg-amber-950/40 text-[#D97706]' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';

                    return (
                      <tr key={ch.id || idx} className="hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a] transition-colors">
                        <td className="py-3.5 px-2 font-medium text-[#7A8581] dark:text-[#9AA5A2]">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#18201E] dark:text-white max-w-xs truncate">
                          {ch.title}
                        </td>
                        <td className="py-3.5 px-4 text-[#7A8581] dark:text-[#9AA5A2]">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-[#16AF82]" />
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
                        <td className="py-3.5 px-4 text-[#7A8581] dark:text-[#9AA5A2] whitespace-nowrap">
                          {ch.date || '20 Jan 2026'}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <button
                            onClick={() => onNavigate('challenge-detail', ch.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#16AF82] hover:bg-[#DDF2E7] dark:hover:bg-[#16AF82]/20 rounded-md transition-colors"
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
        </>
      )}

      {/* Interactive Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#0c1a17] rounded-3xl border border-[#E7EBE8] dark:border-[#152320] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EBE8] dark:border-[#1b2b27]">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-[#16AF82]" />
                <h3 className="font-bold text-base text-[#18201E] dark:text-white">Edit Profile Details</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#7A8581] hover:text-[#18201E] dark:hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {updateMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                updateMsg.includes('successfully') ? 'bg-[#DDF2E7] text-[#16AF82]' : 'bg-red-50 text-red-700'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>{updateMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">District / Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="e.g. Ranchi, Jharkhand"
                  className="w-full px-3 py-2 bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">Organization / Institution</label>
                <input
                  type="text"
                  value={editForm.organization}
                  onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                  placeholder="e.g. BIT Sindri"
                  className="w-full px-3 py-2 bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18201E] dark:text-[#E7EBE8] mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  placeholder="Python, IoT, GIS, Civic Tech"
                  className="w-full px-3 py-2 bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E7EBE8] dark:border-[#1b2b27]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[#16AF82] text-white rounded-xl font-bold hover:bg-[#13976f] transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
