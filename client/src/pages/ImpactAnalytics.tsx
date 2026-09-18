import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Lightbulb, 
  Flame, 
  Download, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  PieChart as PieIcon,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const ImpactAnalytics: React.FC = () => {
  const { activeRole } = useAuth();
  const [analytics, setAnalytics] = useState<any>({
    kpis: {
      peopleImpacted: '2.4M',
      solutionsDeployed: 74,
      totalChallenges: 1284,
      activeTeams: 184,
      deltas: {
        peopleImpacted: '+18.7%',
        solutionsDeployed: '+12.1%',
        totalChallenges: '+12.1%',
        activeTeams: '+6.2%'
      }
    },
    impactTrend: [
      { month: 'Jan', beneficiaries: 180000, deployments: 4 },
      { month: 'Feb', beneficiaries: 240000, deployments: 7 },
      { month: 'Mar', beneficiaries: 310000, deployments: 12 },
      { month: 'Apr', beneficiaries: 420000, deployments: 19 },
      { month: 'May', beneficiaries: 580000, deployments: 28 },
      { month: 'Jun', beneficiaries: 720000, deployments: 35 },
      { month: 'Jul', beneficiaries: 950000, deployments: 44 },
      { month: 'Aug', beneficiaries: 1250000, deployments: 52 },
      { month: 'Sep', beneficiaries: 1600000, deployments: 61 },
      { month: 'Oct', beneficiaries: 1900000, deployments: 66 },
      { month: 'Nov', beneficiaries: 2150000, deployments: 70 },
      { month: 'Dec', beneficiaries: 2400000, deployments: 74 }
    ],
    sectorBreakdown: [
      { name: 'Agriculture', value: 32, color: '#16AF82' },
      { name: 'Healthcare', value: 24, color: '#2563EB' },
      { name: 'Education', value: 18, color: '#E8BE5A' },
      { name: 'Environment', value: 16, color: '#10B981' },
      { name: 'Others', value: 10, color: '#8B5CF6' }
    ],
    topDistricts: [
      { district: 'Ranchi', percentage: 26, beneficiaries: '624K' },
      { district: 'Dhanbad', percentage: 22, beneficiaries: '528K' },
      { district: 'East Singhbhum', percentage: 16, beneficiaries: '384K' },
      { district: 'Bokaro', percentage: 14, beneficiaries: '336K' },
      { district: 'Hazaribagh', percentage: 12, beneficiaries: '288K' },
      { district: 'Deoghar', percentage: 10, beneficiaries: '240K' }
    ],
    recentDeployments: [
      { id: '1', name: 'Smart Irrigation System', district: 'Ranchi, Jharkhand', date: '12 Jan 2026', leadTeam: 'Team Green Innovators' },
      { id: '2', name: 'AI Health Assistant', district: 'Dhanbad, Jharkhand', date: '8 Jan 2026', leadTeam: 'Team HealthTech' },
      { id: '3', name: 'Waste Segregation App', district: 'Bokaro, Jharkhand', date: '2 Jan 2026', leadTeam: 'Team Eco Warriors' },
      { id: '4', name: 'Clean Drinking Water Monitoring', district: 'Hazaribagh, Jharkhand', date: '28 Dec 2025', leadTeam: 'Team Jal Rakshak' }
    ]
  });

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await api.getImpactAnalytics();
        if (res.data) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.warn('Analytics fetch fallback to default state:', err);
      }
    };
    fetchImpact();
  }, []);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "District,Beneficiaries_Reached,Impact_Percentage\n"
      + analytics.topDistricts.map((d: any) => `${d.district},${d.beneficiaries},${d.percentage}%`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "CivicSolve_Jharkhand_Impact_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18201E] tracking-tight">Impact Overview</h1>
          <p className="text-sm text-[#7A8581] mt-0.5">
            Real stories. Measurable change across Jharkhand districts and participating institutions.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white text-[#18201E] border border-[#E7EBE8] rounded-lg text-xs font-semibold hover:bg-[#F5F6F4] transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#16AF82]" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs matching Screen 9 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm">
          <span className="text-xs font-semibold text-[#7A8581] uppercase tracking-wider">People Impacted</span>
          <div className="mt-2 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-[#18201E]">{analytics.kpis.peopleImpacted}</h2>
            <span className="text-xs font-semibold text-[#16AF82]">{analytics.kpis.deltas.peopleImpacted}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm">
          <span className="text-xs font-semibold text-[#7A8581] uppercase tracking-wider">Solutions Deployed</span>
          <div className="mt-2 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-[#18201E]">{analytics.kpis.solutionsDeployed}</h2>
            <span className="text-xs font-semibold text-[#16AF82]">{analytics.kpis.deltas.solutionsDeployed}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm">
          <span className="text-xs font-semibold text-[#7A8581] uppercase tracking-wider">Total Challenges</span>
          <div className="mt-2 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-[#18201E]">{analytics.kpis.totalChallenges.toLocaleString()}</h2>
            <span className="text-xs font-semibold text-[#16AF82]">{analytics.kpis.deltas.totalChallenges}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm">
          <span className="text-xs font-semibold text-[#7A8581] uppercase tracking-wider">Active Teams</span>
          <div className="mt-2 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-[#18201E]">{analytics.kpis.activeTeams}</h2>
            <span className="text-xs font-semibold text-[#16AF82]">{analytics.kpis.deltas.activeTeams}</span>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Impact Trend + Impact by Sector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#18201E]">Impact Trend</h3>
              <p className="text-xs text-[#7A8581]">Beneficiary coverage across consecutive deployment cycles</p>
            </div>
            <span className="text-xs font-semibold text-[#7A8581]">This Year</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.impactTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBeneficiaries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16AF82" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#16AF82" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7EBE8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7A8581' }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 11, fill: '#7A8581' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: any) => [`${(v / 1000).toLocaleString()}k beneficiaries`, 'Impact']}
                  contentStyle={{ backgroundColor: '#071412', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="beneficiaries"
                  stroke="#16AF82"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorBeneficiaries)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Sector Chart */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#18201E]">Impact by Sector</h3>
            <p className="text-xs text-[#7A8581]">Percentage allocation of deployed solutions</p>

            <div className="h-44 w-full mt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.sectorBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analytics.sectorBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => [`${v}%`, 'Share']}
                    contentStyle={{ backgroundColor: '#071412', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#E7EBE8]">
            {analytics.sectorBreakdown.map((sec: any) => (
              <div key={sec.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-2 text-[#4A5552]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.color }}></span>
                  <span>{sec.name}</span>
                </span>
                <span className="font-bold text-[#18201E]">{sec.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Top Districts Horizontal Bars + Recent Deployments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Districts */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#18201E]">Top Impacted Districts</h3>
              <p className="text-xs text-[#7A8581]">District beneficiaries as proportion of state totals</p>
            </div>
            <span className="text-xs font-semibold text-[#16AF82]">Jharkhand State</span>
          </div>

          <div className="space-y-3.5">
            {analytics.topDistricts.map((d: any) => (
              <div key={d.district} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#18201E]">{d.district}</span>
                  <span className="text-[#7A8581]">{d.percentage}% ({d.beneficiaries})</span>
                </div>
                <div className="w-full bg-[#E7EBE8] rounded-full h-2">
                  <div
                    className="bg-[#16AF82] h-2 rounded-full transition-all"
                    style={{ width: `${d.percentage * 3.5}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deployments Table */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-[#E7EBE8] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#18201E]">Recent Deployments</h3>
                <p className="text-xs text-[#7A8581]">Field implementations verified by local administrations</p>
              </div>
            </div>

            <div className="divide-y divide-[#E7EBE8]">
              {analytics.recentDeployments.map((dep: any) => (
                <div key={dep.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-[#18201E]">{dep.name}</h4>
                    <p className="text-[11px] text-[#7A8581] flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#16AF82]" />
                      <span>{dep.district} • {dep.leadTeam}</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-[#7A8581] font-medium whitespace-nowrap bg-[#F5F6F4] px-2.5 py-1 rounded-md">
                    {dep.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-[#7A8581] text-center pt-3 border-t border-[#E7EBE8]">
            Government dashboard synchronizes verified village outcomes every 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
