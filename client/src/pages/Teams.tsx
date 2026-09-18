import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Mail,
  GraduationCap
} from 'lucide-react';
import type { Team } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const Teams: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // New Team Form
  const [teamName, setTeamName] = useState('');
  const [leadName, setLeadName] = useState('Harshit Gadre');
  const [skillInput, setSkillInput] = useState('Python, IoT, React');
  const [submitting, setSubmitting] = useState(false);

  const fetchTeams = async () => {
    try {
      const res = await api.getTeams();
      if (res.data && res.data.length > 0) {
        setTeams(res.data);
      } else {
        setTeams(getFallbackTeams());
      }
    } catch {
      setTeams(getFallbackTeams());
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  function getFallbackTeams(): Team[] {
    return [
      {
        id: 't_1',
        name: 'Green Innovators',
        leadName: 'Harshit Gadre',
        memberCount: 12,
        status: 'IN_PROGRESS',
        skills: JSON.stringify(['Python', 'IoT', 'ML', 'React']),
        avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&q=80',
        solutions: [{ title: 'Smart Irrigation System', status: 'IN_PROGRESS', progressPct: 65 }],
        members: [
          { id: 'm_1', teamId: 't_1', name: 'Harshit Gadre', role: 'Team Lead & IoT Architect', institution: 'BIT Sindri' },
          { id: 'm_2', teamId: 't_1', name: 'Ananya Sen', role: 'ML Engineer', institution: 'BIT Sindri' },
          { id: 'm_3', teamId: 't_1', name: 'Rohit Kumar', role: 'Hardware Specialist', institution: 'BIT Sindri' },
          { id: 'm_4', teamId: 't_1', name: 'Dr. S. K. Singh', role: 'Faculty Mentor', institution: 'BIT Sindri' }
        ]
      },
      {
        id: 't_2',
        name: 'HealthTech',
        leadName: 'Dr. Arpita Sen',
        memberCount: 8,
        status: 'TESTING',
        skills: JSON.stringify(['AI', 'Data Science', 'Biomedical Tech']),
        avatarUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&q=80',
        solutions: [{ title: 'AI Health Assistant', status: 'TESTING', progressPct: 85 }],
        members: [
          { id: 'm_5', teamId: 't_2', name: 'Dr. Arpita Sen', role: 'Lead Researcher', institution: 'IIT ISM Dhanbad' },
          { id: 'm_6', teamId: 't_2', name: 'Vivek Ranjan', role: 'App Developer', institution: 'IIT ISM Dhanbad' },
          { id: 'm_7', teamId: 't_2', name: 'Pooja Soren', role: 'Clinical Validation Intern', institution: 'AIIMS Deoghar' }
        ]
      },
      {
        id: 't_3',
        name: 'Eco Warriors',
        leadName: 'Rahul Murmu',
        memberCount: 10,
        status: 'DEPLOYED',
        skills: JSON.stringify(['React', 'Node.js', 'IoT', 'GIS']),
        avatarUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=120&q=80',
        solutions: [{ title: 'Waste Segregation App', status: 'DEPLOYED', progressPct: 100 }],
        members: [
          { id: 'm_8', teamId: 't_3', name: 'Rahul Murmu', role: 'Project Coordinator', institution: 'NIT Jamshedpur' },
          { id: 'm_9', teamId: 't_3', name: 'Kavita Singh', role: 'GIS Mapping Lead', institution: 'NIT Jamshedpur' },
          { id: 'm_10', teamId: 't_3', name: 'Deepak Roy', role: 'Firmware Engineer', institution: 'NIT Jamshedpur' }
        ]
      }
    ];
  }

  const parseSkills = (str: string): string[] => {
    try {
      return JSON.parse(str);
    } catch {
      return ['Python', 'IoT'];
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setSubmitting(true);
    try {
      const skillsArray = skillInput.split(',').map(s => s.trim());
      await api.createTeam({
        name: teamName,
        skills: skillsArray
      });
      setIsModalOpen(false);
      setTeamName('');
      fetchTeams();
    } catch {
      setIsModalOpen(false);
      fetchTeams();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18201E] tracking-tight">Active Teams</h1>
          <p className="text-sm text-[#7A8581] mt-0.5">
            Cross-disciplinary student and faculty cohorts engineering societal interventions.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#16AF82] text-white rounded-lg text-sm font-semibold hover:bg-[#13976f] transition-all shadow-sm flex items-center space-x-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Teams List matching Screen 7 */}
      <div className="space-y-4">
        {teams.map((team) => {
          const skills = parseSkills(team.skills);
          const isDeployed = team.status === 'DEPLOYED';
          const isTesting = team.status === 'TESTING';

          return (
            <div
              key={team.id}
              className="bg-white rounded-xl border border-[#E7EBE8] p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={team.avatarUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&q=80'}
                  alt={team.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E7EBE8]"
                />
                <div>
                  <h3 className="font-bold text-base text-[#18201E]">{team.name}</h3>
                  <p className="text-xs text-[#7A8581] mt-0.5">
                    {team.solutions && team.solutions.length > 0
                      ? team.solutions[0].title
                      : 'Smart Irrigation System'}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-[#7A8581] mt-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{team.memberCount || 10} members</span>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F5F6F4] text-[#18201E] border border-[#E7EBE8]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center space-x-4 self-end md:self-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isDeployed ? 'bg-[#DDF2E7] text-[#16AF82]' :
                  isTesting ? 'bg-[#E0F2FE] text-[#0284C7]' :
                  'bg-[#FEF3C7] text-[#D97706]'
                }`}>
                  {team.status.replace('_', ' ')}
                </span>

                <button
                  onClick={() => setSelectedTeam(team)}
                  className="px-3.5 py-1.5 bg-white border border-[#E7EBE8] hover:border-[#16AF82] text-xs font-semibold text-[#18201E] hover:text-[#16AF82] rounded-lg transition-colors flex items-center space-x-1"
                >
                  <span>View Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Roster Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E7EBE8] animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EBE8]">
              <div>
                <h2 className="text-base font-bold text-[#18201E]">{selectedTeam.name} Roster</h2>
                <p className="text-xs text-[#7A8581]">Lead: {selectedTeam.leadName}</p>
              </div>
              <button onClick={() => setSelectedTeam(null)} className="text-[#7A8581] hover:text-[#18201E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto">
              {(selectedTeam.members && selectedTeam.members.length > 0 ? selectedTeam.members : [
                { id: '1', name: selectedTeam.leadName, role: 'Team Lead', institution: 'BIT Sindri' },
                { id: '2', name: 'Ananya Sen', role: 'ML Engineer', institution: 'BIT Sindri' },
                { id: '3', name: 'Rohit Kumar', role: 'Hardware Engineer', institution: 'BIT Sindri' },
                { id: '4', name: 'Dr. S. K. Singh', role: 'Faculty Advisor', institution: 'BIT Sindri' }
              ]).map((m) => (
                <div key={m.id} className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E7EBE8] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#DDF2E7] flex items-center justify-center text-[#16AF82] font-bold text-xs">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#18201E]">{m.name}</p>
                      <p className="text-[10px] text-[#7A8581]">{m.institution || 'BIT Sindri'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-white border border-[#E7EBE8] rounded-md text-[#18201E]">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-[#E7EBE8] flex justify-end">
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-4 py-2 text-xs font-semibold text-[#18201E] bg-[#F5F6F4] hover:bg-[#E7EBE8] rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7EBE8] animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EBE8]">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#16AF82]" />
                <h2 className="text-base font-bold text-[#18201E]">Form a University Team</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#7A8581] hover:text-[#18201E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#18201E] mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., Jal Rakshak Innovators"
                  className="w-full px-3.5 py-2 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18201E] mb-1">Team Lead Name</label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18201E] mb-1">Core Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Python, IoT, React, GIS"
                  className="w-full px-3.5 py-2 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                />
              </div>

              <div className="pt-3 border-t border-[#E7EBE8] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#7A8581] hover:bg-[#F5F6F4] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#16AF82] hover:bg-[#13976f] rounded-lg shadow-sm"
                >
                  {submitting ? 'Creating...' : 'Register Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
