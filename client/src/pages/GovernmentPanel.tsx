import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Users, 
  Building, 
  ExternalLink, 
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const GovernmentPanel: React.FC = () => {
  const { user } = useAuth();
  const [pendingQueue, setPendingQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolution, setSelectedSolution] = useState<any | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.getGovernmentQueue();
      if (res.data) {
        setPendingQueue(res.data);
      }
    } catch {
      setPendingQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const openDecisionModal = (solution: any, type: 'APPROVE' | 'REJECT') => {
    setSelectedSolution(solution);
    setDecisionType(type);
    setReviewComment(
      type === 'APPROVE'
        ? 'Approved for district pilot deployment. Field funding authorized under State Innovation Fund.'
        : 'Requires additional sensor telemetry validation before field clearance can be granted.'
    );
  };

  const handleProcessDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolution) return;

    setSubmitting(true);
    try {
      await api.reviewSolution(selectedSolution.id, {
        decision: decisionType,
        comment: reviewComment
      });

      setFeedbackSuccess(
        decisionType === 'APPROVE'
          ? `"${selectedSolution.title}" has been APPROVED. In-app notification dispatched to student team!`
          : `"${selectedSolution.title}" returned for revision with reviewer remarks.`
      );

      setSelectedSolution(null);
      fetchQueue();

      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err) {
      console.error('Decision error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-[#18201E] tracking-tight">Government Review Panel</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DDF2E7] text-[#16AF82]">
              Official Review Queue
            </span>
          </div>
          <p className="text-sm text-[#7A8581] mt-0.5">
            Evaluate, approve, or reject collegiate prototypes before authorization for state field deployment.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-3 py-1.5 bg-[#FEF3C7] text-[#D97706] rounded-lg border border-[#FCD34D]">
            {pendingQueue.length} Solutions Awaiting Action
          </span>
        </div>
      </div>

      {feedbackSuccess && (
        <div className="p-4 bg-[#DDF2E7] border border-[#16AF82]/40 rounded-xl text-xs font-bold text-[#16AF82] flex items-center space-x-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{feedbackSuccess}</span>
        </div>
      )}

      {/* Queue List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-[#E7EBE8] text-center text-xs text-[#7A8581]">
            Loading pending review queue...
          </div>
        ) : pendingQueue.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E7EBE8] text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#16AF82] mx-auto" />
            <h3 className="font-bold text-base text-[#18201E]">Review Queue Clear</h3>
            <p className="text-xs text-[#7A8581]">
              All university solutions have been processed. New collegiate submissions will appear here.
            </p>
          </div>
        ) : (
          pendingQueue.map((sol) => (
            <div
              key={sol.id}
              className="bg-white rounded-2xl border border-[#E7EBE8] p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row gap-5"
            >
              {/* Left thumbnail / category */}
              <div className="w-full lg:w-60 h-44 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                <img
                  src={(() => {
                    try {
                      const p = JSON.parse(sol.mediaUrls);
                      return Array.isArray(p) && p.length > 0 ? p[0] : sol.mediaUrls;
                    } catch {
                      return 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80';
                    }
                  })()}
                  alt={sol.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/95 rounded-md text-[10px] font-bold text-[#18201E]">
                  {sol.category}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-amber-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Pending Review
                </span>
              </div>

              {/* Center description & team details */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-[#18201E]">{sol.title}</h3>
                  <p className="text-xs text-[#4A5552] mt-1 leading-relaxed">{sol.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#E7EBE8] text-xs">
                    <div>
                      <span className="text-[10px] text-[#7A8581] uppercase font-bold block">
                        Submitting University Team
                      </span>
                      <span className="font-semibold text-[#18201E] flex items-center space-x-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-[#16AF82]" />
                        <span>{sol.team?.name || 'Green Innovators'}</span>
                        <span className="text-[#7A8581]">({sol.team?.memberCount || 10} members)</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#7A8581] uppercase font-bold block">
                        Target District & Challenge
                      </span>
                      <span className="font-semibold text-[#18201E] flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#16AF82]" />
                        <span>{sol.challenge?.location || 'Ranchi, Jharkhand'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review action buttons */}
                <div className="pt-3 border-t border-[#E7EBE8] flex items-center justify-between text-xs">
                  <div className="text-[11px] text-[#7A8581] flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Submitted {new Date(sol.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <button
                      onClick={() => openDecisionModal(sol, 'REJECT')}
                      className="px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-xl font-semibold transition-colors flex items-center space-x-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject with Remarks</span>
                    </button>

                    <button
                      onClick={() => openDecisionModal(sol, 'APPROVE')}
                      className="px-5 py-2 bg-[#16AF82] text-white hover:bg-[#13976f] rounded-xl font-semibold transition-all shadow-md shadow-[#16AF82]/20 flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authorize & Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Decision Modal */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E7EBE8] animate-fadeIn text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EBE8]">
              <div className="flex items-center space-x-2">
                {decisionType === 'APPROVE' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#16AF82]" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <h3 className="text-base font-bold text-[#18201E]">
                  {decisionType === 'APPROVE' ? 'Approve Solution' : 'Reject Solution'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSolution(null)}
                className="text-[#7A8581] hover:text-[#18201E] p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessDecision} className="mt-4 space-y-4">
              <div>
                <span className="text-xs text-[#7A8581] block">Solution:</span>
                <p className="text-sm font-bold text-[#18201E]">{selectedSolution.title}</p>
                <p className="text-xs text-[#7A8581]">Team: {selectedSolution.team?.name}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18201E] mb-1">
                  Official Reviewer Remarks *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-xl focus:outline-none focus:border-[#16AF82]"
                />
                <span className="text-[10px] text-[#7A8581] mt-1 block">
                  This decision will generate an in-app notification to the collegiate team lead and update the progress lifecycle stepper.
                </span>
              </div>

              <div className="pt-3 border-t border-[#E7EBE8] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedSolution(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#7A8581] hover:bg-[#F5F6F4] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm ${
                    decisionType === 'APPROVE'
                      ? 'bg-[#16AF82] hover:bg-[#13976f]'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {submitting ? 'Recording...' : decisionType === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
