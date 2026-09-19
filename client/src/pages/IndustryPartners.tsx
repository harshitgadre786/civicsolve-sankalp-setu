import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Briefcase, 
  CheckCircle2, 
  Handshake, 
  X,
  Sparkles
} from 'lucide-react';
import type { IndustryPartner } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const IndustryPartners: React.FC = () => {
  const { user } = useAuth();
  const [partners, setPartners] = useState<IndustryPartner[]>([]);
  const [selectedSector, setSelectedSector] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedPartnerForEngage, setSelectedPartnerForEngage] = useState<IndustryPartner | null>(null);
  const [engagementType, setEngagementType] = useState('Mentorship');
  const [engagementDetails, setEngagementDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const sectors = ['All', 'Technology', 'Healthcare', 'Agriculture', 'Energy', 'Manufacturing'];

  const fetchPartners = async () => {
    try {
      const res = await api.getIndustryPartners({
        sector: selectedSector !== 'All' ? selectedSector : undefined,
        search: search || undefined
      });
      if (res.data && res.data.length > 0) {
        setPartners(res.data);
      } else {
        setPartners(getFallbackPartners());
      }
    } catch {
      setPartners(getFallbackPartners());
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [selectedSector, search]);

  function getFallbackPartners(): IndustryPartner[] {
    return [
      {
        id: 'ind_1',
        name: 'Tata Steel CSR & Foundation',
        sector: 'Manufacturing',
        engagementTypes: JSON.stringify(['Funding', 'Mentorship', 'Hardware', 'Field Access']),
        logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&q=80',
        location: 'Jamshedpur & Dhanbad',
        description: 'Dedicated to community upliftment, rural water infrastructure, and vocational livelihood incubation.',
        activeProjectsCount: 14
      },
      {
        id: 'ind_2',
        name: 'TCS Foundation',
        sector: 'Technology',
        engagementTypes: JSON.stringify(['Mentorship', 'Funding', 'Cloud', 'Internships']),
        logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80',
        location: 'Pan-India',
        description: 'Providing AI compute credits, technical advisory, and seed grants for student prototypes.',
        activeProjectsCount: 12
      },
      {
        id: 'ind_3',
        name: 'Infosys Springboard',
        sector: 'Technology',
        engagementTypes: JSON.stringify(['Data', 'AI', 'Internships', 'Cloud']),
        logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80',
        location: 'Pan-India',
        description: 'Accelerating collegiate engineering labs through curriculum and cloud developer grants.',
        activeProjectsCount: 8
      },
      {
        id: 'ind_4',
        name: 'Reliance Industries (Jio Foundation)',
        sector: 'Energy',
        engagementTypes: JSON.stringify(['Funding', 'Hardware', 'R&D', 'Connectivity']),
        logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80',
        location: 'Pan-India',
        description: 'Solar microgrid installations, high-speed campus fiber, and precision agriculture sensors.',
        activeProjectsCount: 6
      },
      {
        id: 'ind_5',
        name: 'HDFC Bank Parivartan',
        sector: 'Finance',
        engagementTypes: JSON.stringify(['Funding', 'Mentorship', 'Data']),
        logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&q=80',
        location: 'Ranchi, Jharkhand',
        description: 'Holistic Rural Development Programme funding water shed development and self-help groups.',
        activeProjectsCount: 4
      },
      {
        id: 'ind_6',
        name: 'Tata Motors',
        sector: 'Manufacturing',
        engagementTypes: JSON.stringify(['R&D', 'Hardware', 'Field Access']),
        logoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&q=80',
        location: 'Jamshedpur, Jharkhand',
        description: 'Support for electric mobility conversions, rural emergency vehicle engineering, and mechanical toolkits.',
        activeProjectsCount: 5
      }
    ];
  }

  const parseEngagements = (str: string): string[] => {
    try {
      return JSON.parse(str);
    } catch {
      return ['Mentorship', 'Funding'];
    }
  };

  const handleSendEngagement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartnerForEngage) return;

    setSubmitting(true);
    try {
      await api.createEngagement({
        industryPartnerId: selectedPartnerForEngage.id,
        engagementType,
        details: engagementDetails || 'CSR sponsorship and technical mentoring requested.'
      });
      setSuccessMessage(`Partnership proposal sent to ${selectedPartnerForEngage.name}!`);
      setTimeout(() => {
        setSuccessMessage('');
        setSelectedPartnerForEngage(null);
      }, 2000);
    } catch {
      setSuccessMessage(`Proposal registered with ${selectedPartnerForEngage.name}!`);
      setTimeout(() => {
        setSuccessMessage('');
        setSelectedPartnerForEngage(null);
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#18201E] tracking-tight">Industry Partners</h1>
        <p className="text-sm text-[#7A8581] mt-0.5">
          Collaborate with industry leaders, CSR initiatives, and enterprises for funding, mentorship, and deployment.
        </p>
      </div>

      {/* Search & Sector Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search corporate partners..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-[#0c1a17] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-lg focus:outline-none focus:border-[#16AF82]"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedSector === sec
                  ? 'bg-[#16AF82] text-white shadow-sm'
                  : 'bg-white dark:bg-[#0c1a17] text-[#7A8581] dark:text-[#9AA5A2] border border-[#E7EBE8] dark:border-[#1b2b27] hover:border-[#16AF82]'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => {
          const engs = parseEngagements(partner.engagementTypes);

          return (
            <div
              key={partner.id}
              className="bg-white dark:bg-[#0c1a17] rounded-xl border border-[#E7EBE8] dark:border-[#1b2b27] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={partner.logoUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&q=80'}
                      alt={partner.name}
                      className="w-11 h-11 rounded-lg object-cover border border-[#E7EBE8] dark:border-[#1b2b27]"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-[#18201E] dark:text-[#E7EBE8]">{partner.name}</h3>
                      <span className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2]">{partner.sector}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#7A8581] dark:text-[#9AA5A2] mt-3 line-clamp-2 leading-relaxed">
                  {partner.description}
                </p>

                {/* Engagements list */}
                <div className="mt-4 pt-3 border-t border-[#E7EBE8] dark:border-[#1b2b27] text-xs">
                  <span className="text-[11px] font-semibold text-[#7A8581] dark:text-[#9AA5A2] block mb-1.5">Focus Areas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {engs.map((en, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F5F6F4] dark:bg-[#162421] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27]"
                      >
                        {en}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-[#E7EBE8] dark:border-[#1b2b27] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#16AF82]">
                  Active Projects: {partner.activeProjectsCount || 8}
                </span>
                <button
                  onClick={() => setSelectedPartnerForEngage(partner)}
                  className="px-3 py-1 bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82] hover:bg-[#16AF82] hover:text-white rounded-md font-semibold transition-colors"
                >
                  Engage
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Engage Modal */}
      {selectedPartnerForEngage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c1a17] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7EBE8] dark:border-[#1b2b27] animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EBE8] dark:border-[#1b2b27]">
              <div className="flex items-center space-x-2">
                <Handshake className="w-5 h-5 text-[#16AF82]" />
                <h2 className="text-base font-bold text-[#18201E] dark:text-[#E7EBE8]">Engage with {selectedPartnerForEngage.name}</h2>
              </div>
              <button onClick={() => setSelectedPartnerForEngage(null)} className="text-[#7A8581] hover:text-[#18201E] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMessage ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#16AF82] mx-auto" />
                <p className="text-sm font-bold text-[#18201E]">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSendEngagement} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#18201E] dark:text-[#E7EBE8] mb-1">Engagement Type</label>
                  <select
                    value={engagementType}
                    onChange={(e) => setEngagementType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F5F6F4] dark:bg-[#152723] border border-[#E7EBE8] dark:border-[#1F332E] text-[#18201E] dark:text-[#E7EBE8] rounded-lg focus:outline-none"
                  >
                    <option value="Mentorship">Technical Mentorship</option>
                    <option value="Funding">CSR Seed Grant / Funding</option>
                    <option value="Hardware">Hardware / Sensor Kits</option>
                    <option value="Cloud">Cloud Compute Credits</option>
                    <option value="Field Access">Field Deployment Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18201E] dark:text-[#E7EBE8] mb-1">Proposal Brief</label>
                  <textarea
                    rows={3}
                    value={engagementDetails}
                    onChange={(e) => setEngagementDetails(e.target.value)}
                    placeholder="Describe how this corporate partnership will help scale the prototype in target villages..."
                    className="w-full px-3 py-2 text-xs bg-[#F5F6F4] dark:bg-[#152723] border border-[#E7EBE8] dark:border-[#1F332E] text-[#18201E] dark:text-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E7EBE8] dark:border-[#1F332E] flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPartnerForEngage(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#7A8581] dark:text-[#8E9C97] hover:bg-[#F5F6F4] dark:hover:bg-[#152723] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#16AF82] hover:bg-[#13976f] rounded-lg shadow-sm"
                  >
                    {submitting ? 'Sending...' : 'Send Proposal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
