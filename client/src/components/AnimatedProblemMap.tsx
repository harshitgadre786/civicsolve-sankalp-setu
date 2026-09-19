import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  X, 
  MapPin, 
  ThumbsUp, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  AlertTriangle,
  Building
} from 'lucide-react';
import { api } from '../api/client';

export interface ChallengePin {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string;
  location: string;
  lat: number;
  lng: number;
  priority: string;
  severity: string;
  status: string;
  assignedDepartment?: string;
  supportersCount: number;
  daysLeft: number;
  mediaUrls?: string;
  photoUrl?: string;
}

interface AnimatedProblemMapProps {
  onInspectChallenge?: (id: string) => void;
}

// Controller to smoothly animate and pan the map to selected coordinates
const MapController: React.FC<{ targetCoords: [number, number] | null }> = ({ targetCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 13, { duration: 1.2 });
    }
  }, [targetCoords, map]);
  return null;
};

// Custom animated pulsing marker with thumbnail and severity color
const createAnimatedIcon = (photoUrl: string, severityOrPriority: string, isSelected: boolean) => {
  const level = (severityOrPriority || 'HIGH').toUpperCase();
  const ringColor = level === 'CRITICAL' ? '#DC2626' : level === 'HIGH' ? '#EA580C' : '#16AF82';

  return L.divIcon({
    className: 'custom-animated-pin',
    html: `
      <div class="relative group cursor-pointer ${isSelected ? 'scale-125 z-50' : ''}">
        <span class="absolute -inset-1.5 rounded-full ${isSelected ? 'animate-ping' : 'opacity-70'}" style="background-color: ${ringColor}"></span>
        <div class="w-8 h-8 rounded-full border-2 ${isSelected ? 'border-white ring-2 ring-emerald-400' : 'border-white'} shadow-md overflow-hidden relative z-10 transition-transform transform group-hover:scale-110" style="box-shadow: 0 0 12px ${ringColor}">
          <img src="${photoUrl}" alt="pin" class="w-full h-full object-cover" />
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

export const AnimatedProblemMap: React.FC<AnimatedProblemMapProps> = ({ onInspectChallenge }) => {
  const [challenges, setChallenges] = useState<ChallengePin[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengePin | null>(null);
  const [liveComments, setLiveComments] = useState<any[]>([]);
  const [liveSupporters, setLiveSupporters] = useState<number>(0);
  const [isSupporting, setIsSupporting] = useState<boolean>(false);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [targetCoords, setTargetCoords] = useState<[number, number] | null>(null);

  // Fetch all challenge pins
  const loadChallenges = async () => {
    try {
      const res = await api.getChallenges();
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map((c: any) => {
          let photo = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80';
          try {
            if (c.mediaUrls) {
              const parsed = JSON.parse(c.mediaUrls);
              if (Array.isArray(parsed) && parsed.length > 0) photo = parsed[0];
            }
          } catch {}

          return {
            id: c.id,
            title: c.title,
            description: c.description,
            category: c.category,
            district: c.district || 'Ranchi',
            location: c.location || `${c.district}, Jharkhand`,
            lat: c.lat || 23.3441,
            lng: c.lng || 85.3096,
            priority: c.priority || 'HIGH',
            severity: c.severity || c.priority || 'HIGH',
            status: c.status || 'REPORTED',
            assignedDepartment: c.assignedDepartment || 'Jharkhand Municipal Corporation',
            supportersCount: c.supportersCount || 120,
            daysLeft: c.daysLeft || 14,
            photoUrl: photo
          };
        });
        setChallenges(mapped);
      }
    } catch (e) {
      console.warn('Map fetch error, fallback pins:', e);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  // Filter challenges based on search and pills
  const filteredChallenges = challenges.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      c.title.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.assignedDepartment && c.assignedDepartment.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'ALL' || c.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'ALL' || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSeverity = severityFilter === 'ALL' || (c.severity && c.severity.toLowerCase() === severityFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesStatus && matchesSeverity;
  });

  // Poll live details when a floating panel is open
  useEffect(() => {
    if (!selectedChallenge) return;

    let isMounted = true;
    setLiveSupporters(selectedChallenge.supportersCount);

    const pollDetails = async () => {
      try {
        const [chRes, commRes] = await Promise.all([
          api.getChallengeById(selectedChallenge.id),
          api.getComments(selectedChallenge.id)
        ]);
        if (isMounted) {
          if (chRes.data) {
            setLiveSupporters(chRes.data.supportersCount);
          }
          if (commRes.data) {
            setLiveComments(commRes.data);
          }
        }
      } catch (err) {
        // silent polling fallback
      }
    };

    pollDetails();
    const interval = setInterval(pollDetails, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedChallenge]);

  const handleSelectChallenge = (ch: ChallengePin) => {
    setSelectedChallenge(ch);
    setTargetCoords([ch.lat, ch.lng]);
  };

  const handleToggleSupport = async () => {
    if (!selectedChallenge) return;
    try {
      setIsSupporting(true);
      const res = await api.supportChallenge(selectedChallenge.id);
      if (res.data) {
        setLiveSupporters(res.data.supportersCount);
      }
    } catch {
      setLiveSupporters(prev => prev + 1);
    } finally {
      setIsSupporting(false);
    }
  };

  const categories = ['ALL', 'Infrastructure', 'Water & Sanitation', 'Environment', 'Public Safety', 'Healthcare', 'Education'];
  const statuses = ['ALL', 'REPORTED', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED'];
  const severities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'];

  return (
    <div className="space-y-3 text-left">
      {/* Search & Filter Controls Header */}
      <div className="bg-white dark:bg-[#0c1a17] p-3 rounded-2xl border border-[#E7EBE8] dark:border-[#152320] shadow-sm space-y-2.5 transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Map Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#7A8581] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by title, ID, locality (e.g. Ranchi, Pothole, Water)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#F5F6F4] dark:bg-[#121c1a] text-[#18201E] dark:text-[#E7EBE8] border border-[#E7EBE8] dark:border-[#1b2b27] rounded-xl focus:outline-none focus:border-[#16AF82]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A8581] hover:text-[#18201E] dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#7A8581] dark:text-[#9AA5A2] self-end sm:self-auto px-2">
            <span>Showing <strong className="text-[#16AF82] font-bold">{filteredChallenges.length}</strong> points</span>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E7EBE8] dark:border-[#1b2b27] text-xs">
          {/* Category Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full">
            <span className="text-[10px] font-bold uppercase text-[#7A8581] dark:text-[#9AA5A2] mr-1">Category:</span>
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#16AF82] text-white'
                    : 'bg-[#F5F6F4] dark:bg-[#121c1a] text-[#7A8581] dark:text-[#9AA5A2] hover:text-[#18201E] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#E7EBE8] dark:bg-[#1b2b27] hidden sm:block"></div>

          {/* Status Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold uppercase text-[#7A8581] dark:text-[#9AA5A2] mr-1">Status:</span>
            {statuses.map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-[#16AF82] text-white'
                    : 'bg-[#F5F6F4] dark:bg-[#121c1a] text-[#7A8581] dark:text-[#9AA5A2] hover:text-[#18201E]'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#E7EBE8] dark:bg-[#1b2b27] hidden sm:block"></div>

          {/* Severity Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold uppercase text-[#7A8581] dark:text-[#9AA5A2] mr-1">Severity:</span>
            {severities.map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                  severityFilter === sev
                    ? 'bg-[#16AF82] text-white'
                    : 'bg-[#F5F6F4] dark:bg-[#121c1a] text-[#7A8581] dark:text-[#9AA5A2] hover:text-[#18201E]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Canvas with Overlays */}
      <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-[#E7EBE8] dark:border-[#152320] shadow-sm">
        <MapContainer
          center={[23.6102, 85.2799]}
          zoom={8}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController targetCoords={targetCoords} />

          {filteredChallenges.map((ch) => {
            const isSelected = selectedChallenge?.id === ch.id;
            return (
              <Marker
                key={ch.id}
                position={[ch.lat, ch.lng]}
                icon={createAnimatedIcon(ch.photoUrl || '', ch.severity || ch.priority, isSelected)}
                eventHandlers={{
                  click: () => {
                    handleSelectChallenge(ch);
                  }
                }}
              >
                <Popup>
                  <div className="text-xs p-1 space-y-1">
                    <img src={ch.photoUrl} alt={ch.title} className="w-full h-20 rounded-md object-cover mb-1" />
                    <strong className="block font-bold text-[#18201E]">{ch.title}</strong>
                    <p className="text-[11px] text-[#7A8581]">{ch.location}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#DDF2E7] text-[#16AF82]">
                        {ch.category}
                      </span>
                      <button
                        onClick={() => handleSelectChallenge(ch)}
                        className="text-[10px] font-bold text-[#16AF82] hover:underline"
                      >
                        Inspect →
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Desktop Info Card / Mobile Bottom Sheet */}
        {selectedChallenge && (
          <div className="fixed sm:absolute bottom-0 left-0 right-0 sm:top-3 sm:right-3 sm:left-auto sm:bottom-3 sm:w-88 w-full max-h-[85vh] sm:max-h-none bg-white/95 dark:bg-[#0c1a17]/95 backdrop-blur-md rounded-t-3xl sm:rounded-2xl border border-[#E7EBE8] dark:border-[#1b2b27] shadow-2xl p-4 z-[500] flex flex-col justify-between animate-fadeIn overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E7EBE8] dark:border-[#1b2b27]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16AF82] animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16AF82]">
                    Civic Problem Telemetry
                  </span>
                </div>
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="text-[#7A8581] hover:text-[#18201E] dark:hover:text-white p-1 rounded-md hover:bg-[#F5F6F4] dark:hover:bg-[#121c1a]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo & Badges */}
              <div className="mt-3 relative h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#121c1a]">
                <img
                  src={selectedChallenge.photoUrl}
                  alt={selectedChallenge.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center space-x-1">
                  <span className="px-2 py-0.5 bg-white/90 dark:bg-[#071412]/90 rounded-md text-[10px] font-bold text-[#18201E] dark:text-white shadow-sm">
                    {selectedChallenge.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm ${
                    selectedChallenge.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                    selectedChallenge.severity === 'HIGH' ? 'bg-amber-600 text-white' :
                    'bg-[#16AF82] text-white'
                  }`}>
                    {selectedChallenge.severity}
                  </span>
                </div>
              </div>

              {/* Title & Department */}
              <h4 className="font-bold text-sm text-[#18201E] dark:text-white mt-2.5 line-clamp-2 leading-tight">
                {selectedChallenge.title}
              </h4>

              <p className="text-[11px] text-[#7A8581] dark:text-[#9AA5A2] flex items-center space-x-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#16AF82] flex-shrink-0" />
                <span>{selectedChallenge.location}</span>
              </p>

              {selectedChallenge.assignedDepartment && (
                <p className="text-[11px] text-[#16AF82] dark:text-[#52d3aa] font-medium flex items-center space-x-1 mt-0.5">
                  <Building className="w-3 h-3 flex-shrink-0" />
                  <span>{selectedChallenge.assignedDepartment}</span>
                </p>
              )}

              <p className="text-xs text-[#4A5552] dark:text-[#C5D0CD] mt-2 line-clamp-3 leading-relaxed">
                {selectedChallenge.description}
              </p>

              {/* Status & Supporters */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E7EBE8] dark:border-[#1b2b27] text-xs">
                <div className="p-2 bg-[#F9FCFA] dark:bg-[#121c1a] rounded-lg border border-[#E7EBE8] dark:border-[#1b2b27]">
                  <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2] block">Current Status</span>
                  <span className="text-xs font-bold text-[#16AF82] uppercase mt-0.5 block">
                    {selectedChallenge.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-2 bg-[#F9FCFA] dark:bg-[#121c1a] rounded-lg border border-[#E7EBE8] dark:border-[#1b2b27]">
                  <span className="text-[10px] text-[#7A8581] dark:text-[#9AA5A2] block">Supporters</span>
                  <span className="text-xs font-bold text-[#18201E] dark:text-white flex items-center space-x-1 mt-0.5">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#16AF82]" />
                    <span>{liveSupporters.toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Live Comments snippet */}
              {liveComments.length > 0 && (
                <div className="mt-2.5 space-y-1 text-left">
                  <span className="text-[10px] font-bold text-[#7A8581] dark:text-[#9AA5A2] uppercase tracking-wider block">
                    Citizen & Official Feedback ({liveComments.length})
                  </span>
                  <div className="p-2 rounded-lg bg-[#F5F6F4] dark:bg-[#121c1a] text-[11px] text-[#18201E] dark:text-[#E7EBE8] line-clamp-2">
                    <span className="font-semibold">{liveComments[0].authorName}: </span>
                    {liveComments[0].content}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-[#E7EBE8] dark:border-[#1b2b27] flex items-center space-x-2 mt-3">
              <button
                onClick={handleToggleSupport}
                disabled={isSupporting}
                className="flex-1 py-2 px-3 bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82] hover:bg-[#16AF82] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Support</span>
              </button>

              {onInspectChallenge && (
                <button
                  onClick={() => onInspectChallenge(selectedChallenge.id)}
                  className="py-2 px-4 bg-[#16AF82] text-white rounded-xl text-xs font-bold hover:bg-[#13976f] transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedProblemMap;
