import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  ThumbsUp, 
  Clock, 
  ArrowRight, 
  Plus, 
  Check, 
  Users, 
  CheckCircle2, 
  BrainCircuit,
  Tag
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface ForYouProps {
  onSelectChallenge: (id: string) => void;
  onFormTeam: (challengeId: string) => void;
}

export const ForYou: React.FC<ForYouProps> = ({ onSelectChallenge, onFormTeam }) => {
  const { user } = useAuth();
  const [studentSkills, setStudentSkills] = useState<string[]>([
    'Python', 'IoT', 'React', 'C++', 'GIS', 'Agronomy', 'AI/ML'
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [rankedChallenges, setRankedChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);

  const fetchForYou = async () => {
    setLoading(true);
    try {
      const res = await api.getChallenges({ sort: 'latest' });
      const challenges = res.data || [];

      // Rank challenges based on student skills
      const scored = challenges.map((ch: any) => {
        let reqSkills: string[] = [];
        try {
          if (ch.requiredSkills) {
            reqSkills = JSON.parse(ch.requiredSkills);
          } else if (ch.aiClassification?.detectedSkills) {
            reqSkills = JSON.parse(ch.aiClassification.detectedSkills);
          }
        } catch {
          reqSkills = ['IoT', 'Data Analytics'];
        }
        if (reqSkills.length === 0) reqSkills = ['IoT', 'Python', 'Sensors'];

        const matched = reqSkills.filter(r =>
          studentSkills.some(s => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
        );

        const matchPct = Math.min(98, Math.max(52, Math.round((matched.length / reqSkills.length) * 70 + 28)));

        return {
          ...ch,
          matchPercentage: matchPct,
          matchedSkills: matched,
          requiredSkillsList: reqSkills,
          photoUrl: (() => {
            try {
              if (ch.mediaUrls) {
                const parsed = JSON.parse(ch.mediaUrls);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
              }
            } catch {}
            return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80';
          })()
        };
      }).sort((a: any, b: any) => b.matchPercentage - a.matchPercentage);

      setRankedChallenges(scored);
    } catch {
      setRankedChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForYou();
  }, [studentSkills]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !studentSkills.includes(newSkill.trim())) {
      const updated = [...studentSkills, newSkill.trim()];
      setStudentSkills(updated);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setStudentSkills(studentSkills.filter(s => s !== skill));
  };

  const handleClaim = (chId: string) => {
    setClaimedIds([...claimedIds, chId]);
    onFormTeam(chId);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-[#18201E] tracking-tight">For You</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DDF2E7] text-[#16AF82]">
              Student AI Match Feed
            </span>
          </div>
          <p className="text-sm text-[#7A8581] mt-0.5">
            Grassroots challenges curated and ranked for you based on your verified technical skill competencies.
          </p>
        </div>
      </div>

      {/* Student Skill Competency Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7EBE8] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-[#16AF82]" />
            <h3 className="text-xs font-bold text-[#18201E] uppercase tracking-wider">
              Your Active Technical Profile
            </h3>
          </div>
          <span className="text-[11px] text-[#7A8581]">Challenges re-rank automatically as you modify skills</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {studentSkills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-[#DDF2E7] text-[#16AF82] font-semibold text-xs rounded-lg flex items-center space-x-1.5 border border-[#16AF82]/20"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-red-500 font-bold ml-1 text-xs"
              >
                ×
              </button>
            </span>
          ))}

          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. Drone, Embedded)..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              className="px-3 py-1 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82] w-48"
            />
            <button
              onClick={handleAddSkill}
              className="px-3 py-1 bg-[#16AF82] text-white rounded-lg text-xs font-semibold hover:bg-[#13976f] transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Ranked Feed */}
      <div className="space-y-4">
        {rankedChallenges.map((ch, idx) => {
          const isClaimed = claimedIds.includes(ch.id);

          return (
            <div
              key={ch.id}
              className="bg-white rounded-2xl border border-[#E7EBE8] p-5 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row gap-5"
            >
              {/* Thumbnail */}
              <div className="w-full lg:w-56 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                <img
                  src={ch.photoUrl}
                  alt={ch.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/95 rounded-md text-[10px] font-bold text-[#18201E] shadow-sm">
                  {ch.category}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-[#16AF82] text-white rounded-md text-[11px] font-bold shadow-md">
                  #{idx + 1} Rank
                </span>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3
                        onClick={() => onSelectChallenge(ch.id)}
                        className="text-base font-bold text-[#18201E] hover:text-[#16AF82] transition-colors cursor-pointer line-clamp-1"
                      >
                        {ch.title}
                      </h3>
                      <p className="text-xs text-[#7A8581] flex items-center space-x-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#16AF82]" />
                        <span>{ch.location}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#DC2626]">{ch.priority} Priority</span>
                      </p>
                    </div>

                    {/* Match Score Badge */}
                    <div className="px-3.5 py-1.5 bg-[#DDF2E7] border border-[#16AF82]/30 rounded-xl text-center flex-shrink-0">
                      <span className="text-sm font-extrabold text-[#16AF82] block leading-tight">
                        {ch.matchPercentage}%
                      </span>
                      <span className="text-[10px] font-bold text-[#16AF82] uppercase tracking-wide">
                        Skill Match
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#4A5552] mt-2 line-clamp-2 leading-relaxed">
                    {ch.description}
                  </p>

                  {/* Skills tags: Highlight matched skills */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#7A8581] mr-1">Required:</span>
                    {ch.requiredSkillsList.map((skill: string, sIdx: number) => {
                      const isMatched = ch.matchedSkills.some((ms: string) => ms.toLowerCase() === skill.toLowerCase());
                      return (
                        <span
                          key={sIdx}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                            isMatched
                              ? 'bg-[#DDF2E7] text-[#16AF82] border border-[#16AF82]/40 ring-1 ring-[#16AF82]/20'
                              : 'bg-[#F5F6F4] text-[#7A8581] border border-[#E7EBE8]'
                          }`}
                        >
                          {skill} {isMatched && '✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="pt-3 border-t border-[#E7EBE8] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4 text-[#7A8581]">
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#16AF82]" />
                      <span>{ch.supportersCount || 120} supporters</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ch.daysLeft || 14} days left</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectChallenge(ch.id)}
                      className="px-3 py-1.5 bg-white border border-[#E7EBE8] hover:border-[#16AF82] text-[#18201E] rounded-lg font-semibold transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleClaim(ch.id)}
                      className="px-4 py-1.5 bg-[#16AF82] text-white hover:bg-[#13976f] rounded-lg font-semibold transition-colors shadow-sm flex items-center space-x-1"
                    >
                      {isClaimed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Team Formed</span>
                        </>
                      ) : (
                        <>
                          <Users className="w-3.5 h-3.5" />
                          <span>Claim & Form Team</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
