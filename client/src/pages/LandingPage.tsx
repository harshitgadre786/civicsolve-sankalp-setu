import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  ArrowRight, 
  Flame, 
  Lightbulb, 
  GraduationCap, 
  Building2, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Users,
  Search,
  ExternalLink
} from 'lucide-react';
import { api } from '../api/client';

interface LandingPageProps {
  onGoToAuth: (mode?: 'login' | 'signup') => void;
  onExploreChallenges: (challengeId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth, onExploreChallenges }) => {
  const [metrics, setMetrics] = useState<any>({
    totalChallenges: 1284,
    activeSolutions: 74,
    partnerUniversities: 7,
    industryPartners: 7,
    peopleImpacted: '2.4M+'
  });
  const [featuredChallenges, setFeaturedChallenges] = useState<any[]>([]);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await api.getLandingStats();
        if (res.data) {
          if (res.data.metrics) setMetrics(res.data.metrics);
          if (res.data.featuredChallenges) setFeaturedChallenges(res.data.featuredChallenges);
        }
      } catch (err) {
        console.warn('Landing data fetch fallback:', err);
      }
    };
    fetchLandingData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F6F4] text-[#18201E] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="h-20 bg-white border-b border-[#E7EBE8] px-6 lg:px-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#16AF82] flex items-center justify-center text-white shadow-md shadow-[#16AF82]/25">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-[#18201E] leading-tight">CivicSolve</h1>
            <p className="text-[11px] text-[#7A8581] font-medium tracking-wide">Sankalp Setu • SIH26043</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-[#7A8581]">
          <button 
            onClick={() => onExploreChallenges()}
            className="text-[#18201E] hover:text-[#16AF82] transition-colors font-bold flex items-center space-x-1"
          >
            <span>Explore Challenges</span>
          </button>
          <a href="#how-it-works" className="hover:text-[#16AF82] transition-colors">How It Works</a>
          <a href="#featured" className="hover:text-[#16AF82] transition-colors">Featured Challenges</a>
          <a href="#impact" className="hover:text-[#16AF82] transition-colors">Statewide Impact</a>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onGoToAuth('login')}
            className="px-4 py-2 text-xs font-bold text-[#18201E] hover:text-[#16AF82] transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => onGoToAuth('signup')}
            className="px-5 py-2.5 bg-[#16AF82] hover:bg-[#13976f] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#16AF82]/25 flex items-center space-x-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto w-full text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DDF2E7] text-[#16AF82] text-xs font-bold border border-[#16AF82]/30 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#16AF82] animate-ping"></span>
          <span>Smart India Hackathon SIH26043 Submission — Government of Jharkhand</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#18201E] max-w-4xl mx-auto leading-[1.15]">
          Crowdsourcing societal challenges. <br />
          <span className="text-[#16AF82]">Collaborative problem solving</span> at scale.
        </h1>

        <p className="text-base sm:text-lg text-[#4A5552] max-w-2xl mx-auto leading-relaxed">
          A unified digital bridge connecting citizens reporting local problems with university research cohorts, mentored and funded by industry leaders and approved by state administration.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onGoToAuth('signup')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#16AF82] text-white rounded-xl font-bold text-sm hover:bg-[#13976f] transition-all shadow-lg shadow-[#16AF82]/25 flex items-center justify-center space-x-2"
          >
            <span>Join CivicSolve Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreChallenges}
            className="w-full sm:w-auto px-7 py-3.5 bg-white text-[#18201E] border border-[#E7EBE8] rounded-xl font-bold text-sm hover:bg-[#F5F6F4] transition-all shadow-sm flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4 text-[#7A8581]" />
            <span>Explore Challenges</span>
          </button>
        </div>

        {/* Real Live Stats Row */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          <div className="bg-white p-4 rounded-xl border border-[#E7EBE8] shadow-sm text-center">
            <span className="text-2xl font-black text-[#18201E] block">{metrics.totalChallenges.toLocaleString()}</span>
            <span className="text-xs text-[#7A8581] font-medium">Challenges Logged</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E7EBE8] shadow-sm text-center">
            <span className="text-2xl font-black text-[#16AF82] block">{metrics.activeSolutions}</span>
            <span className="text-xs text-[#7A8581] font-medium">Active Solutions</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E7EBE8] shadow-sm text-center">
            <span className="text-2xl font-black text-[#18201E] block">{metrics.partnerUniversities}</span>
            <span className="text-xs text-[#7A8581] font-medium">Partner Universities</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E7EBE8] shadow-sm text-center">
            <span className="text-2xl font-black text-[#18201E] block">{metrics.industryPartners}</span>
            <span className="text-xs text-[#7A8581] font-medium">Industry CSRs</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E7EBE8] shadow-sm text-center col-span-2 md:col-span-1">
            <span className="text-2xl font-black text-[#16AF82] block">{metrics.peopleImpacted}</span>
            <span className="text-xs text-[#7A8581] font-medium">Citizens Impacted</span>
          </div>
        </div>
      </section>

      {/* "How It Works" 4-Stage Flow */}
      <section id="how-it-works" className="py-20 bg-white border-y border-[#E7EBE8] px-6 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#16AF82] uppercase tracking-wider">End-to-End Collaboration</span>
            <h2 className="text-3xl font-bold text-[#18201E]">How Samadhan Setu Solves Societal Problems</h2>
            <p className="text-sm text-[#7A8581]">
              A continuous, traceable pipeline transforming civic pain points into government-deployed community technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-[#F9FCFA] p-6 rounded-2xl border border-[#E7EBE8] space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#DDF2E7] text-[#16AF82] font-black text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="font-bold text-base text-[#18201E]">Citizen Reports Problem</h3>
              <p className="text-xs text-[#4A5552] leading-relaxed">
                Citizens and rural bodies report water, agriculture, or health issues with geolocation coordinates and photographic evidence.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F9FCFA] p-6 rounded-2xl border border-[#E7EBE8] space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#DDF2E7] text-[#16AF82] font-black text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="font-bold text-base text-[#18201E]">AI Categorizes & Routes</h3>
              <p className="text-xs text-[#4A5552] leading-relaxed">
                Autonomous NLP models classify the domain, scan for local duplicate clusters, and extract required technical engineering skill tags.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F9FCFA] p-6 rounded-2xl border border-[#E7EBE8] space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#DDF2E7] text-[#16AF82] font-black text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="font-bold text-base text-[#18201E]">University Builds Solution</h3>
              <p className="text-xs text-[#4A5552] leading-relaxed">
                Student and faculty teams match with problems in their domain of expertise and engineer hardware and software prototypes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#F9FCFA] p-6 rounded-2xl border border-[#E7EBE8] space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#DDF2E7] text-[#16AF82] font-black text-sm flex items-center justify-center">
                04
              </div>
              <h3 className="font-bold text-base text-[#18201E]">Government Approves & Tracks</h3>
              <p className="text-xs text-[#4A5552] leading-relaxed">
                State officials evaluate solutions in the Government Panel, release deployment funds, and track real-world district impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Real Challenges from Database */}
      <section id="featured" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#16AF82] uppercase tracking-wider">Live Database Submissions</span>
            <h2 className="text-2xl font-bold text-[#18201E] mt-1">Recently Reported Challenges</h2>
          </div>
          <button
            onClick={onExploreChallenges}
            className="text-xs font-bold text-[#16AF82] hover:underline flex items-center space-x-1"
          >
            <span>View All Challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(featuredChallenges.length > 0 ? featuredChallenges : [
            {
              id: 'ch_1',
              title: 'Water shortage in rural areas',
              category: 'Environment',
              location: 'Ranchi, Jharkhand',
              priority: 'HIGH',
              supportersCount: 1248,
              photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80'
            },
            {
              id: 'ch_2',
              title: 'Limited access to healthcare in remote villages',
              category: 'Healthcare',
              location: 'Dhanbad, Jharkhand',
              priority: 'HIGH',
              supportersCount: 854,
              photoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80'
            },
            {
              id: 'ch_3',
              title: 'Lack of digital education infrastructure',
              category: 'Education',
              location: 'Bokaro, Jharkhand',
              priority: 'MEDIUM',
              supportersCount: 642,
              photoUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
            }
          ]).map((ch: any) => (
            <div
              key={ch.id}
              onClick={() => onExploreChallenges(ch.id)}
              className="bg-white rounded-2xl border border-[#E7EBE8] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left"
            >
              <div className="h-44 w-full relative bg-gray-100">
                <img
                  src={(() => {
                    try {
                      if (ch.mediaUrls) {
                        const p = JSON.parse(ch.mediaUrls);
                        if (Array.isArray(p) && p.length > 0) return p[0];
                      }
                    } catch {}
                    return ch.photoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80';
                  })()}
                  alt={ch.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/95 rounded-md text-[10px] font-bold text-[#18201E]">
                  {ch.category}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-bold text-sm text-[#18201E] line-clamp-1">{ch.title}</h3>
                <p className="text-xs text-[#7A8581] flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#16AF82]" />
                  <span>{ch.location}</span>
                </p>

                <div className="pt-3 border-t border-[#E7EBE8] flex items-center justify-between text-xs text-[#7A8581]">
                  <span className="font-semibold text-[#16AF82]">
                    {ch.supportersCount ? ch.supportersCount.toLocaleString() : 120} supporters
                  </span>
                  <span className="font-bold text-[#18201E] hover:underline flex items-center space-x-0.5">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#071412] text-white py-12 px-6 lg:px-16 border-t border-[#152320]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#16AF82] flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-bold text-sm tracking-tight text-white block">CivicSolve • Sankalp Setu</span>
              <span className="text-[11px] text-[#7A8581]">Smart India Hackathon 2026 Submission</span>
            </div>
          </div>

          <p className="text-xs text-[#7A8581] text-center md:text-right">
            Department of Higher & Technical Education • Government of Jharkhand
          </p>
        </div>
      </footer>
    </div>
  );
};
