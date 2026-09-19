import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  ThumbsUp, 
  Clock, 
  Users, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Check,
  AlertCircle, 
  Send,
  Building,
  GraduationCap,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import type { Challenge, Comment } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ProgressStepper } from '../components/ProgressStepper';

interface ChallengeDetailProps {
  challengeId: string;
  onBack: () => void;
  onNavigateToAIMatching?: (statement: string) => void;
}

export const ChallengeDetail: React.FC<ChallengeDetailProps> = ({ 
  challengeId, 
  onBack,
  onNavigateToAIMatching 
}) => {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-analysis' | 'collaborators' | 'comments'>('overview');
  const [isSupported, setIsSupported] = useState(false);
  const [supportersCount, setSupportersCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const loadChallenge = async () => {
      setLoading(true);
      try {
        const res = await api.getChallengeById(challengeId);
        if (res.data) {
          setChallenge(res.data);
          setIsSupported(res.data.isSupportedByCurrentUser || false);
          setSupportersCount(res.data.supportersCount || 1248);
        }
      } catch {
        // Fallback default
        setChallenge({
          id: challengeId,
          title: 'Water shortage in rural areas',
          description: 'The village is facing severe water shortage due to irregular rainfall and poor water storage facilities. This has affected drinking water supply and agriculture in the region. Groundwater levels have plummeted past 180 feet during summer months.',
          category: 'Environment',
          location: 'Ranchi, Jharkhand',
          district: 'Ranchi',
          priority: 'HIGH',
          status: 'OPEN',
          daysLeft: 12,
          supportersCount: 1248,
          viewsCount: 4200,
          affectedPeople: 2500,
          createdById: 'usr_1',
          createdAt: '2026-01-20',
          mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80']),
          aiClassification: {
            id: 'ai_1',
            challengeId,
            detectedCategory: 'Environment',
            confidence: 0.94,
            detectedSkills: JSON.stringify(['IoT', 'Data Analytics', 'Environmental Science', 'Python']),
            reasoning: 'AI auto-classified as Environment & Water Security with 94% confidence. Identified high need for remote sensing telemetry and drought-resilient community harvesting.'
          }
        });
        setSupportersCount(1248);
      } finally {
        setLoading(false);
      }
    };

    const loadComments = async () => {
      try {
        const res = await api.getComments(challengeId);
        if (res.data) setComments(res.data);
      } catch {
        setComments([
          {
            id: 'c_1',
            challengeId,
            userId: 'u_1',
            authorName: 'Prof. R. K. Sharma',
            authorRole: 'University Mentor (BIT Sindri)',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
            content: 'Our team in Dhanbad has tested an automated groundwater telemetry board. We can dispatch 4 student researchers to survey the borewells.',
            createdAt: '2 hours ago'
          },
          {
            id: 'c_2',
            challengeId,
            userId: 'u_2',
            authorName: 'Priya Nair',
            authorRole: 'Industry Partner (Tata Steel CSR)',
            authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
            content: 'We can fund the solar pump conversion kits and provide technical mentorship through our rural water cell.',
            createdAt: '1 day ago'
          }
        ]);
      }
    };

    loadChallenge();
    loadComments();
  }, [challengeId]);

  const handleToggleSupport = async () => {
    try {
      const res = await api.supportChallenge(challengeId);
      if (res.data) {
        setIsSupported(res.data.supported);
        setSupportersCount(res.data.supportersCount);
      }
    } catch {
      setIsSupported(!isSupported);
      setSupportersCount(prev => isSupported ? prev - 1 : prev + 1);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.createComment(challengeId, newComment);
      if (res.data) {
        setComments([res.data, ...comments]);
        setNewComment('');
      }
    } catch {
      const mockComment: Comment = {
        id: 'c_' + Date.now(),
        challengeId,
        userId: user?.id || 'demo',
        authorName: user?.name || 'Harshit Gadre',
        authorRole: 'Student Innovator',
        authorAvatar: user?.avatar,
        content: newComment,
        createdAt: 'Just now'
      };
      setComments([mockComment, ...comments]);
      setNewComment('');
    }
  };

  if (!challenge) {
    return <div className="p-8 text-center text-sm text-[#7A8581]">Loading challenge details...</div>;
  }

  let skillsList: string[] = ['IoT', 'Data Analytics', 'Environmental Science', 'Python'];
  try {
    if (challenge.aiClassification?.detectedSkills) {
      skillsList = JSON.parse(challenge.aiClassification.detectedSkills);
    }
  } catch {}

  let photoUrl = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80';
  try {
    if (challenge.mediaUrls) {
      const parsed = JSON.parse(challenge.mediaUrls);
      if (Array.isArray(parsed) && parsed.length > 0) photoUrl = parsed[0];
    }
  } catch {}

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-xs font-semibold text-[#7A8581] hover:text-[#18201E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Challenges</span>
      </button>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18201E] dark:text-white tracking-tight">{challenge.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#7A8581] dark:text-[#9AA5A2]">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#16AF82]" />
              <span>{challenge.location}</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              (challenge.severity || challenge.priority) === 'CRITICAL' ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300' :
              (challenge.severity || challenge.priority) === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300' :
              'bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82]'
            }`}>
              {challenge.severity || challenge.priority} Severity
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82]">
              {challenge.category}
            </span>
            {challenge.assignedDepartment && (
              <span className="flex items-center space-x-1 text-[#16AF82] font-semibold bg-emerald-50 dark:bg-[#121c1a] px-2.5 py-0.5 rounded-full border border-[#16AF82]/20">
                <Building className="w-3 h-3" />
                <span>{challenge.assignedDepartment}</span>
              </span>
            )}
            <span className="flex items-center space-x-1 text-[#7A8581] dark:text-[#9AA5A2]">
              <UserIcon className="w-3 h-3 text-[#16AF82]" />
              <span>Reported by {challenge.createdBy?.name || 'Verified Citizen'}</span>
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleSupport}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm ${
              isSupported
                ? 'bg-[#16AF82] text-white'
                : 'bg-white dark:bg-[#0c1a17] text-[#16AF82] border border-[#16AF82] hover:bg-[#DDF2E7] dark:hover:bg-[#16AF82]/20'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{isSupported ? 'Supported' : 'Support / Upvote'}</span>
          </button>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2500);
              }
            }}
            className={`px-3 py-2 border rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
              isCopied
                ? 'bg-[#DDF2E7] dark:bg-[#16AF82]/20 border-[#16AF82]/40 text-[#16AF82]'
                : 'bg-white dark:bg-[#0c1a17] text-[#7A8581] dark:text-[#9AA5A2] border-[#E7EBE8] dark:border-[#1b2b27] hover:text-[#18201E] dark:hover:text-white hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a]'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16AF82]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 bg-white dark:bg-[#0c1a17] p-4 rounded-xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm max-w-xl transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#DDF2E7] dark:bg-[#16AF82]/20 flex items-center justify-center text-[#16AF82]">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-base font-bold text-[#18201E] dark:text-white">{supportersCount.toLocaleString()}</p>
            <p className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2]">Supporters</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 border-l border-[#E7EBE8] dark:border-[#1b2b27] pl-4">
          <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] dark:bg-amber-950/40 flex items-center justify-center text-[#D97706]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-base font-bold text-[#18201E] dark:text-white">{challenge.daysLeft || 12}</p>
            <p className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2]">Days Left</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 border-l border-[#E7EBE8] dark:border-[#1b2b27] pl-4">
          <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] dark:bg-sky-950/40 flex items-center justify-center text-[#0284C7]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-base font-bold text-[#18201E] dark:text-white">
              {challenge.affectedPeople ? `${(challenge.affectedPeople / 1000).toFixed(1)}k` : '2.5k'}
            </p>
            <p className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2]">People affected</p>
          </div>
        </div>
      </div>

      {/* Database-Driven Civic Status Timeline (Reported -> Verified -> Assigned -> In Progress -> Resolved) */}
      <div className="bg-white dark:bg-[#0c1a17] p-5 rounded-2xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7EBE8] dark:border-[#1b2b27] pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#16AF82]" />
            <h4 className="text-xs font-bold text-[#18201E] dark:text-white uppercase tracking-wider">
              Civic Resolution Lifecycle & Department Tracking
            </h4>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2]">Current Status:</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82]">
              {(challenge.status || 'REPORTED').replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* 5-Step Civic Timeline Bar */}
        <div className="grid grid-cols-5 gap-2 relative pt-2">
          {[
            { key: 'REPORTED', label: 'Reported', desc: 'Logged with GPS & evidence' },
            { key: 'VERIFIED', label: 'Verified', desc: 'Municipal field review' },
            { key: 'ASSIGNED', label: 'Assigned', desc: 'Dispatched to department' },
            { key: 'IN_PROGRESS', label: 'In Progress', desc: 'Active ground repairs' },
            { key: 'RESOLVED', label: 'Resolved', desc: 'Verified & closed' }
          ].map((stage, idx) => {
            const currentIdx = (() => {
              const st = (challenge.status || 'REPORTED').toUpperCase();
              if (st === 'RESOLVED' || st === 'CLOSED') return 4;
              if (st === 'IN_PROGRESS' || st === 'IN_DEPLOYMENT') return 3;
              if (st === 'ASSIGNED' || st === 'APPROVED') return 2;
              if (st === 'VERIFIED' || st === 'UNDER_REVIEW') return 1;
              return 0;
            })();

            const isPassed = idx < currentIdx || (idx === currentIdx && (challenge.status === 'RESOLVED' || challenge.status === 'CLOSED'));
            const isCurrent = idx === currentIdx && !(challenge.status === 'RESOLVED' || challenge.status === 'CLOSED');
            const matchedTimeline = (challenge.timeline || []).find((t: any) => t.stage === stage.key);

            return (
              <div key={stage.key} className="flex flex-col items-center text-center space-y-1.5 relative">
                {/* Connecting Line */}
                {idx < 4 && (
                  <div className={`absolute top-3.5 left-1/2 w-full h-0.5 -z-0 ${
                    idx < currentIdx ? 'bg-[#16AF82]' : 'bg-[#E7EBE8] dark:bg-[#1b2b27]'
                  }`} />
                )}

                {/* Step Circle */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                  isPassed
                    ? 'bg-[#16AF82] text-white shadow-sm'
                    : isCurrent
                    ? 'bg-[#16AF82] text-white ring-4 ring-[#DDF2E7] dark:ring-[#16AF82]/25'
                    : 'bg-[#F5F6F4] dark:bg-[#121c1a] text-[#7A8581] dark:text-[#9AA5A2] border border-[#E7EBE8] dark:border-[#1b2b27]'
                }`}>
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 animate-pulse" />
                  ) : (
                    idx + 1
                  )}
                </div>

                <span className={`text-[11px] font-bold leading-tight ${
                  isPassed || isCurrent ? 'text-[#18201E] dark:text-white' : 'text-[#7A8581] dark:text-[#9AA5A2]'
                }`}>
                  {stage.label}
                </span>

                <span className="text-[9px] text-[#7A8581] dark:text-[#9AA5A2] hidden sm:block">
                  {matchedTimeline?.timestamp 
                    ? new Date(matchedTimeline.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                    : stage.desc}
                </span>
              </div>
            );
          })}
        </div>

        {/* Milestone Audit Log */}
        <div className="mt-3 pt-3 border-t border-[#E7EBE8] dark:border-[#1b2b27] space-y-2">
          <span className="text-[10px] font-bold text-[#7A8581] dark:text-[#9AA5A2] uppercase tracking-wider block">
            Official Audit Trail & Timeline Milestones
          </span>
          <div className="space-y-1.5">
            {((challenge.timeline && challenge.timeline.length > 0) ? challenge.timeline : [
              {
                id: 'tl_1',
                stage: 'REPORTED',
                title: 'Problem Reported via Mobile Citizen Portal',
                description: 'Civic telemetry captured with GPS coordinates & photo evidence.',
                actorName: challenge.createdBy?.name || 'Verified Citizen',
                timestamp: challenge.createdAt
              }
            ]).map((ev: any, i: number) => (
              <div key={ev.id || i} className="text-xs flex items-start space-x-2 text-[#4A5552] dark:text-[#C5D0CD]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16AF82] mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-[#18201E] dark:text-white">{ev.title}</span>
                  {ev.actorName && <span className="text-[#7A8581] dark:text-[#9AA5A2]"> — {ev.actorName}</span>}
                  <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2] ml-2">
                    ({new Date(ev.timestamp || challenge.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
                  </span>
                  {ev.description && <p className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2] mt-0.5">{ev.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-[#E7EBE8] dark:border-[#152320] text-xs font-semibold">
        {(['overview', 'ai-analysis', 'collaborators', 'comments'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-[#16AF82] text-[#16AF82]'
                : 'border-transparent text-[#7A8581] hover:text-[#18201E] dark:text-[#9AA5A2] dark:hover:text-white'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Photo */}
              <div className="h-72 w-full rounded-2xl overflow-hidden border border-[#E7EBE8] dark:border-[#152320] shadow-sm">
                <img src={photoUrl} alt={challenge.title} className="w-full h-full object-cover" />
              </div>

              {/* Problem Description */}
              <div className="bg-white dark:bg-[#0c1a17] p-6 rounded-2xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm space-y-3 transition-colors">
                <h3 className="font-bold text-base text-[#18201E] dark:text-white">Problem Description</h3>
                <p className="text-sm text-[#4A5552] dark:text-[#C5D0CD] leading-relaxed">
                  {challenge.description}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-[#E7EBE8] dark:border-[#1b2b27] text-xs">
                  <div>
                    <span className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2] block">Location</span>
                    <span className="font-semibold text-[#18201E] dark:text-white">{challenge.location}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2] block">Category</span>
                    <span className="font-semibold text-[#18201E] dark:text-white">{challenge.category}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2] block">Submission Type</span>
                    <span className="font-semibold text-[#18201E] dark:text-white">Community Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-analysis' && (
            <div className="bg-white dark:bg-[#0c1a17] p-6 rounded-2xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm space-y-4 transition-colors">
              <div className="flex items-center space-x-2 text-[#16AF82]">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#18201E] dark:text-white">AI Domain Assessment</h3>
              </div>
              <p className="text-xs text-[#7A8581] dark:text-[#9AA5A2]">
                Evaluated through deep semantic analysis across regional challenge taxonomies.
              </p>

              <div className="p-4 rounded-xl bg-[#F9FCFA] dark:bg-[#121c1a] border border-[#E7EBE8] dark:border-[#1b2b27] space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#7A8581] dark:text-[#9AA5A2]">Categorization Confidence</span>
                  <span className="font-bold text-[#16AF82]">94% Match</span>
                </div>
                <div className="w-full bg-[#E7EBE8] dark:bg-[#1b2b27] rounded-full h-2">
                  <div className="bg-[#16AF82] h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <p className="text-[#4A5552] dark:text-[#C5D0CD] pt-2 leading-relaxed">
                  {challenge.aiClassification?.reasoning ||
                    'High semantic overlap with water conservation datasets. The challenge indicates acute ground drawdown and irrigation deficits in plateau topographies.'}
                </p>
              </div>

              {onNavigateToAIMatching && (
                <button
                  onClick={() => onNavigateToAIMatching(`${challenge.title}: ${challenge.description}`)}
                  className="w-full py-2.5 bg-[#16AF82] text-white rounded-lg text-xs font-semibold hover:bg-[#13976f] transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Find University & Industry Matches in AI Matching Screen</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'collaborators' && (
            <div className="bg-white dark:bg-[#0c1a17] p-6 rounded-2xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm space-y-4 transition-colors">
              <h3 className="font-bold text-base text-[#18201E] dark:text-white">Assigned Collaborators & Mentors</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-[#E7EBE8] dark:border-[#1b2b27] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-[#DDF2E7] dark:bg-[#16AF82]/20 flex items-center justify-center text-[#16AF82]">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#18201E] dark:text-white">BIT Sindri (Environmental Lab)</p>
                      <p className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2]">Student Team: Green Innovators (12 members)</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82] font-semibold rounded-full">
                    Active Lead
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-[#E7EBE8] dark:border-[#1b2b27] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] dark:bg-sky-950/40 flex items-center justify-center text-[#0284C7]">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#18201E] dark:text-white">Tata Steel CSR & Foundation</p>
                      <p className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2]">Engagement: Hardware + Solar Pumps Grant</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 bg-[#E0F2FE] dark:bg-sky-950/40 text-[#0284C7] font-semibold rounded-full">
                    Sponsor Partner
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="bg-white dark:bg-[#0c1a17] p-6 rounded-2xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm space-y-4 transition-colors">
              <h3 className="font-bold text-base text-[#18201E] dark:text-white">Stakeholder Discussion</h3>

              {/* Add Comment Form */}
              <form onSubmit={handlePostComment} className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share advice, field observations, or university participation..."
                  className="flex-1 px-3.5 py-2 text-xs bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-white border border-[#E7EBE8] dark:border-[#1b2b27] rounded-lg focus:outline-none focus:border-[#16AF82]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#16AF82] text-white rounded-lg text-xs font-semibold hover:bg-[#13976f] flex items-center space-x-1 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>

              {/* Comments Feed */}
              <div className="divide-y divide-[#E7EBE8] dark:divide-[#1b2b27] pt-2">
                {comments.map((c) => (
                  <div key={c.id} className="py-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={c.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
                          alt={c.authorName}
                          className="w-6 h-6 rounded-full object-cover border border-[#E7EBE8] dark:border-[#1b2b27]"
                        />
                        <span className="text-xs font-bold text-[#18201E] dark:text-white">{c.authorName}</span>
                        <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2] bg-[#F5F6F4] dark:bg-[#121c1a] px-2 py-0.5 rounded-full border border-[#E7EBE8] dark:border-[#1b2b27]">
                          {c.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2]">{c.createdAt}</span>
                    </div>
                    <p className="text-xs text-[#4A5552] dark:text-[#C5D0CD] pl-8 leading-relaxed">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis Card matching Mockup Screen 3 (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#0c1a17] p-5 rounded-2xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-[#E7EBE8] dark:border-[#1b2b27] pb-3">
              <div className="flex items-center space-x-2 text-[#16AF82]">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold text-[#18201E] dark:text-white">AI Analysis</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82] font-bold rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-[#7A8581] dark:text-[#9AA5A2]">
              <p className="font-semibold text-[#18201E] dark:text-white">AI pipeline processed:</p>
              <div className="space-y-1.5 pl-1">
                <div className="flex items-center space-x-2 text-[#18201E] dark:text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16AF82]" />
                  <span>Identifying category: <strong className="text-[#16AF82]">{challenge.category}</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-[#18201E] dark:text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16AF82]" />
                  <span>Detecting location: <strong>{challenge.location}</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-[#18201E] dark:text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16AF82]" />
                  <span>Suggesting required technical skills</span>
                </div>
                <div className="flex items-center space-x-2 text-[#18201E] dark:text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16AF82]" />
                  <span>Scanning local cluster for duplicates: <strong>0 found</strong></span>
                </div>
              </div>
            </div>

            {/* Required Skills Badges matching mockup */}
            <div className="pt-3 border-t border-[#E7EBE8] dark:border-[#1b2b27]">
              <span className="text-xs font-bold text-[#18201E] dark:text-white block mb-2">Required Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#C5D0CD] border border-[#E7EBE8] dark:border-[#1b2b27]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Reasoning Summary */}
            <div className="p-3 bg-[#F9FCFA] dark:bg-[#121c1a] rounded-xl border border-[#E7EBE8] dark:border-[#1b2b27] text-[11px] text-[#4A5552] dark:text-[#C5D0CD] leading-snug">
              {challenge.aiClassification?.reasoning ||
                'Auto-routed to Bit Sindri & Birsa Agricultural University research incubators.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
