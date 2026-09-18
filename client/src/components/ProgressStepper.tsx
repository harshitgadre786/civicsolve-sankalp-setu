import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Rocket, ShieldCheck } from 'lucide-react';

interface ProgressEvent {
  id: string;
  stage: string;
  title: string;
  description?: string;
  actorName?: string;
  timestamp: string;
}

interface ProgressStepperProps {
  status: string; // PENDING_REVIEW, APPROVED, REJECTED, IN_DEPLOYMENT, DEPLOYED
  progressEvents?: ProgressEvent[];
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ status, progressEvents = [] }) => {
  const stages = [
    { key: 'SUBMITTED', label: 'Submitted', desc: 'Solution registered by team' },
    { key: 'UNDER_REVIEW', label: 'Under Review', desc: 'In Government evaluation queue' },
    { key: 'APPROVED', label: 'Approved', desc: 'Government clearance granted' },
    { key: 'IN_DEPLOYMENT', label: 'In Deployment', desc: 'Field trials active in district' },
    { key: 'DEPLOYED', label: 'Deployed / Live', desc: 'Operational in community' }
  ];

  const getStageIndex = (st: string) => {
    switch (st.toUpperCase()) {
      case 'PENDING_REVIEW': return 1;
      case 'APPROVED': return 2;
      case 'IN_DEPLOYMENT': return 3;
      case 'DEPLOYED': return 4;
      case 'REJECTED': return 1;
      default: return 1;
    }
  };

  const currentIdx = getStageIndex(status);
  const isRejected = status.toUpperCase() === 'REJECTED';

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E7EBE8] shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#E7EBE8] pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#16AF82]" />
          <h4 className="text-xs font-bold text-[#18201E] uppercase tracking-wider">
            Government Lifecycle & Deployment Stepper
          </h4>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
          isRejected ? 'bg-red-100 text-red-700' :
          status === 'DEPLOYED' ? 'bg-[#DDF2E7] text-[#16AF82]' :
          status === 'APPROVED' ? 'bg-[#DDF2E7] text-[#16AF82]' :
          'bg-amber-100 text-amber-800'
        }`}>
          {status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Horizontal Steps Bar */}
      <div className="grid grid-cols-5 gap-2 relative">
        {stages.map((stage, idx) => {
          const isPassed = idx < currentIdx || (idx === currentIdx && status === 'DEPLOYED');
          const isCurrent = idx === currentIdx && status !== 'DEPLOYED';
          const matchedEvent = progressEvents.find(e => e.stage === stage.key);

          return (
            <div key={stage.key} className="flex flex-col items-center text-center space-y-1.5 relative">
              {/* Connecting line */}
              {idx < stages.length - 1 && (
                <div className={`absolute top-3.5 left-1/2 w-full h-0.5 -z-0 ${
                  idx < currentIdx ? 'bg-[#16AF82]' : 'bg-[#E7EBE8]'
                }`} />
              )}

              {/* Circle Icon */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                isPassed
                  ? 'bg-[#16AF82] text-white shadow-sm'
                  : isCurrent
                  ? isRejected
                    ? 'bg-red-500 text-white'
                    : 'bg-[#16AF82] text-white ring-4 ring-[#DDF2E7]'
                  : 'bg-[#F5F6F4] text-[#7A8581] border border-[#E7EBE8]'
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
                isPassed || isCurrent ? 'text-[#18201E]' : 'text-[#7A8581]'
              }`}>
                {stage.label}
              </span>

              {matchedEvent?.timestamp && (
                <span className="text-[9px] text-[#7A8581] block">
                  {new Date(matchedEvent.timestamp).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline event notes */}
      {progressEvents.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#E7EBE8] space-y-1.5 text-left">
          <span className="text-[10px] font-bold text-[#7A8581] uppercase tracking-wider block">
            Recent Milestone Log
          </span>
          <div className="space-y-1">
            {progressEvents.slice(-2).map((ev) => (
              <div key={ev.id} className="text-xs flex items-start space-x-2 text-[#4A5552]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16AF82] mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-[#18201E]">{ev.title}</span>
                  {ev.actorName && <span className="text-[#7A8581]"> — {ev.actorName}</span>}
                  {ev.description && <p className="text-[11px] text-[#7A8581]">{ev.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
