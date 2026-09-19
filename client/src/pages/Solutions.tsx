import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Plus, 
  Users, 
  Eye, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Github, 
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import type { Solution } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ProgressStepper } from '../components/ProgressStepper';

export const Solutions: React.FC = () => {
  const { user } = useAuth();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolutionForLifecycle, setSelectedSolutionForLifecycle] = useState<Solution | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Agriculture');
  const [teamName, setTeamName] = useState('Green Innovators');
  const [progressPct, setProgressPct] = useState(65);
  const [demoUrl, setDemoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSolutions = async () => {
    try {
      const res = await api.getSolutions({
        status: filterStatus !== 'All' ? filterStatus : undefined
      });
      if (res.data && res.data.length > 0) {
        setSolutions(res.data);
      } else {
        setSolutions(getFallbackSolutions());
      }
    } catch {
      setSolutions(getFallbackSolutions());
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, [filterStatus]);

  function getFallbackSolutions(): Solution[] {
    return [
      {
        id: 'sol_1',
        title: 'Smart Irrigation System',
        description: 'Automated solar-powered drip irrigation network using soil tension sensors to reduce water consumption by 42%.',
        category: 'Agriculture',
        status: 'IN_PROGRESS',
        progressPct: 65,
        viewsCount: 3200,
        impactReach: 450,
        createdAt: '2026-01-12',
        mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80']),
        team: {
          id: 't_1',
          name: 'Green Innovators',
          leadName: 'Harshit Gadre',
          memberCount: 12,
          skills: '[]',
          status: 'ACTIVE'
        }
      },
      {
        id: 'sol_2',
        title: 'AI Health Assistant',
        description: 'Portable solar-powered tele-diagnostic kit equipped with multi-lingual voice guided triage for ASHA workers.',
        category: 'Healthcare',
        status: 'TESTING',
        progressPct: 85,
        viewsCount: 2100,
        impactReach: 1200,
        createdAt: '2026-01-08',
        mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80']),
        team: {
          id: 't_2',
          name: 'HealthTech',
          leadName: 'Dr. Arpita Sen',
          memberCount: 8,
          skills: '[]',
          status: 'ACTIVE'
        }
      },
      {
        id: 'sol_3',
        title: 'Waste Segregation App',
        description: 'Computer-vision enabled municipal smart bin monitoring and citizen rewards platform connecting urban wards to recyclers.',
        category: 'Environment',
        status: 'DEPLOYED',
        progressPct: 100,
        viewsCount: 4800,
        impactReach: 18500,
        createdAt: '2026-01-02',
        mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80']),
        team: {
          id: 't_3',
          name: 'Eco Warriors',
          leadName: 'Rahul Murmu',
          memberCount: 10,
          skills: '[]',
          status: 'ACTIVE'
        }
      }
    ];
  }

  const handleCreateSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.createSolution({
        title,
        description,
        category,
        progressPct,
        demoUrl,
        status: progressPct >= 100 ? 'DEPLOYED' : progressPct > 70 ? 'TESTING' : 'IN_PROGRESS'
      });
      if (res.data) {
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        fetchSolutions();
      }
    } catch {
      setIsModalOpen(false);
      fetchSolutions();
    } finally {
      setSubmitting(false);
    }
  };

  const parseImage = (mediaUrls?: string) => {
    try {
      if (!mediaUrls) return 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80';
      const parsed = JSON.parse(mediaUrls);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : mediaUrls;
    } catch {
      return mediaUrls || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18201E] tracking-tight">All Solutions</h1>
          <p className="text-sm text-[#7A8581] mt-0.5">
            Innovative technological solutions engineered by university teams and industry mentors.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#16AF82] text-white rounded-lg text-sm font-semibold hover:bg-[#13976f] transition-all shadow-sm flex items-center space-x-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Solution</span>
        </button>
      </div>

      {/* Filter Row matching mockup */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          {['All', 'In Progress', 'Testing', 'Deployed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterStatus === st
                  ? 'bg-[#16AF82] text-white shadow-sm'
                  : 'bg-white text-[#7A8581] border border-[#E7EBE8] hover:border-[#16AF82]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <select className="text-xs bg-white border border-[#E7EBE8] rounded-lg px-3 py-1.5 text-[#18201E] focus:outline-none">
          <option>Sort by: Latest</option>
          <option>Sort by: Progress</option>
          <option>Sort by: Views</option>
        </select>
      </div>

      {/* Solutions Cards Grid matching Mockup Screen 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((sol) => {
          const imgUrl = parseImage(sol.mediaUrls);
          const isDeployed = sol.status === 'DEPLOYED';
          const isTesting = sol.status === 'TESTING';

          return (
            <div
              key={sol.id}
              className="bg-white dark:bg-[#0c1a17] rounded-xl border border-[#E7EBE8] dark:border-[#1b2b27] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image */}
              <div className="h-44 w-full relative bg-gray-100 dark:bg-[#152320] overflow-hidden">
                <img src={imgUrl} alt={sol.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 dark:bg-[#0c1a17]/95 text-[#18201E] dark:text-[#E7EBE8] shadow-sm backdrop-blur-sm border border-[#E7EBE8] dark:border-[#1b2b27]">
                    {sol.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    isDeployed ? 'bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82]' :
                    isTesting ? 'bg-[#E0F2FE] dark:bg-sky-950/40 text-[#0284C7]' :
                    'bg-[#FEF3C7] dark:bg-amber-950/40 text-[#D97706]'
                  }`}>
                    {sol.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-[#18201E] dark:text-[#E7EBE8] line-clamp-1">{sol.title}</h3>
                  <p className="text-xs text-[#7A8581] dark:text-[#8E9C97] mt-1 line-clamp-2">{sol.description}</p>

                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="font-semibold text-[#18201E] dark:text-[#E7EBE8]">
                      Team: {sol.team?.name || 'Green Innovators'}
                    </span>
                    <span className="text-[#7A8581] dark:text-[#8E9C97] flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{sol.team?.memberCount || 8} members</span>
                    </span>
                  </div>

                  {/* Progress Bar matching mockup */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#7A8581] dark:text-[#8E9C97]">Implementation</span>
                      <span className="font-bold text-[#16AF82]">{sol.progressPct}%</span>
                    </div>
                    <div className="w-full bg-[#E7EBE8] dark:bg-[#1b2b27] rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          isDeployed ? 'bg-[#16AF82]' : isTesting ? 'bg-[#3B82F6]' : 'bg-[#16AF82]'
                        }`}
                        style={{ width: `${sol.progressPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-[#E7EBE8] dark:border-[#1b2b27] flex items-center justify-between text-xs text-[#7A8581] dark:text-[#8E9C97]">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5 text-[#7A8581]" />
                    <span>{sol.viewsCount?.toLocaleString() || '2.1k'} views</span>
                  </span>
                  {isDeployed ? (
                    <span className="flex items-center space-x-1 font-semibold text-[#16AF82]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Live in Field</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>12 days left</span>
                    </span>
                  )}
                </div>

                {/* Inspect Lifecycle Button */}
                <button
                  onClick={() => setSelectedSolutionForLifecycle(sol)}
                  className="w-full mt-2 py-2 px-3 bg-[#F5F6F4] dark:bg-[#121c1a] hover:bg-[#DDF2E7] dark:hover:bg-[#16AF82]/20 text-[#18201E] dark:text-[#E7EBE8] hover:text-[#16AF82] dark:hover:text-[#16AF82] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16AF82]" />
                  <span>Inspect Lifecycle Stepper</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Solution Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c1a17] rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E7EBE8] dark:border-[#1b2b27] animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EBE8] dark:border-[#1b2b27]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#DDF2E7] dark:bg-[#16AF82]/20 flex items-center justify-center text-[#16AF82]">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-[#18201E] dark:text-[#E7EBE8]">Submit a University Solution</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#7A8581] hover:text-[#18201E] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSolution} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#18201E] dark:text-[#E7EBE8] mb-1">Solution Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Drone-assisted crop pest spray telemetry"
                  className="w-full px-3.5 py-2 text-xs bg-[#F5F6F4] dark:bg-[#152723] border border-[#E7EBE8] dark:border-[#1F332E] text-[#18201E] dark:text-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18201E] dark:text-[#E7EBE8] mb-1">Technical Architecture *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the hardware, software stack, deployment trials, and community impact..."
                  className="w-full px-3.5 py-2 text-xs bg-[#F5F6F4] dark:bg-[#152723] border border-[#E7EBE8] dark:border-[#1F332E] text-[#18201E] dark:text-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#18201E] dark:text-[#E7EBE8] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F5F6F4] dark:bg-[#152723] border border-[#E7EBE8] dark:border-[#1F332E] text-[#18201E] dark:text-[#E7EBE8] rounded-lg focus:outline-none"
                  >
                    <option value="Agriculture">Agriculture</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Education">Education</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18201E] dark:text-[#E7EBE8] mb-1">Progress % ({progressPct}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={progressPct}
                    onChange={(e) => setProgressPct(parseInt(e.target.value))}
                    className="w-full accent-[#16AF82] mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18201E] dark:text-[#E7EBE8] mb-1">Live Demo / Repository URL</label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://github.com/team/project or live URL"
                  className="w-full px-3.5 py-2 text-xs bg-[#F5F6F4] dark:bg-[#152723] border border-[#E7EBE8] dark:border-[#1F332E] text-[#18201E] dark:text-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                />
              </div>

              <div className="pt-3 border-t border-[#E7EBE8] dark:border-[#1F332E] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#7A8581] dark:text-[#8E9C97] hover:bg-[#F5F6F4] dark:hover:bg-[#152723] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#16AF82] hover:bg-[#13976f] rounded-lg shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Register Solution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Solution Lifecycle Stepper Modal */}
      {selectedSolutionForLifecycle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c1a17] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E7EBE8] dark:border-[#1b2b27] animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EBE8] dark:border-[#1b2b27]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#DDF2E7] dark:bg-[#16AF82]/20 flex items-center justify-center text-[#16AF82]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#18201E] dark:text-[#E7EBE8]">{selectedSolutionForLifecycle.title}</h2>
                  <p className="text-[11px] text-[#7A8581] dark:text-[#8E9C97]">Team: {selectedSolutionForLifecycle.team?.name || 'Assigned Innovators'}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSolutionForLifecycle(null)} 
                className="text-[#7A8581] hover:text-[#18201E] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#4A5552] dark:text-[#A0ABA7] leading-relaxed">
              {selectedSolutionForLifecycle.description}
            </p>

            {/* Stepper */}
            <ProgressStepper
              status={selectedSolutionForLifecycle.status}
              progressEvents={selectedSolutionForLifecycle.progressEvents || [
                {
                  id: 'pe_sub_sol',
                  stage: 'SUBMITTED',
                  title: 'Solution architecture registered',
                  actorName: selectedSolutionForLifecycle.team?.name || 'University Team',
                  timestamp: selectedSolutionForLifecycle.createdAt
                }
              ]}
            />

            {selectedSolutionForLifecycle.reviewerComment && (
              <div className="p-3.5 bg-[#F9FCFA] dark:bg-[#121c1a] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl text-xs space-y-1">
                <span className="font-bold text-[#18201E] dark:text-[#E7EBE8] block text-[11px] uppercase tracking-wider text-[#16AF82]">
                  Government Reviewer Rationale
                </span>
                <p className="text-[#4A5552] dark:text-[#A0ABA7] leading-relaxed">{selectedSolutionForLifecycle.reviewerComment}</p>
                {selectedSolutionForLifecycle.reviewedAt && (
                  <span className="text-[10px] text-[#7A8581] dark:text-[#8E9C97] block pt-1">
                    Recorded on {new Date(selectedSolutionForLifecycle.reviewedAt).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSolutionForLifecycle(null)}
                className="px-4 py-2 bg-[#16AF82] text-white rounded-lg text-xs font-semibold hover:bg-[#13976f] transition-colors shadow-sm"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
