import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  X, 
  MapPin, 
  ThumbsUp, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { api } from '../api/client';

interface ChallengePin {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string;
  location: string;
  lat: number;
  lng: number;
  priority: string;
  status: string;
  supportersCount: number;
  daysLeft: number;
  mediaUrls?: string;
  photoUrl?: string;
}

interface AnimatedProblemMapProps {
  onInspectChallenge?: (id: string) => void;
}

// Custom animated pulsing marker with thumbnail
const createAnimatedIcon = (photoUrl: string, priority: string) => {
  const ringColor = priority === 'HIGH' ? '#DC2626' : priority === 'MEDIUM' ? '#D97706' : '#16AF82';

  return L.divIcon({
    className: 'custom-animated-pin',
    html: `
      <div class="relative group cursor-pointer">
        <span class="absolute -inset-1.5 rounded-full animate-ping opacity-60" style="background-color: ${ringColor}"></span>
        <div class="w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden relative z-10 transition-transform transform group-hover:scale-110" style="box-shadow: 0 0 10px ${ringColor}">
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
            status: c.status || 'OPEN',
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
    const interval = setInterval(pollDetails, 3500); // 3.5s live polling

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedChallenge]);

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

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-[#E7EBE8] shadow-sm">
      {/* Map Container */}
      <MapContainer
        center={[23.6102, 85.2799]}
        zoom={7}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {challenges.map((ch) => (
          <Marker
            key={ch.id}
            position={[ch.lat, ch.lng]}
            icon={createAnimatedIcon(ch.photoUrl || '', ch.priority)}
            eventHandlers={{
              click: () => {
                setSelectedChallenge(ch);
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
                    onClick={() => setSelectedChallenge(ch)}
                    className="text-[10px] font-bold text-[#16AF82] hover:underline"
                  >
                    Open Live Panel →
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Live Panel Overlay (Over map, not a page navigation) */}
      {selectedChallenge && (
        <div className="absolute top-3 right-3 bottom-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E7EBE8] shadow-2xl p-4 z-[500] flex flex-col justify-between animate-fadeIn text-left overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#E7EBE8]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16AF82] animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16AF82]">
                  Live Telemetry Panel
                </span>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-[#7A8581] hover:text-[#18201E] p-1 rounded-md hover:bg-[#F5F6F4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo & Priority badge */}
            <div className="mt-3 relative h-28 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={selectedChallenge.photoUrl}
                alt={selectedChallenge.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/95 rounded-md text-[10px] font-bold text-[#18201E]">
                {selectedChallenge.category}
              </span>
            </div>

            <h4 className="font-bold text-xs text-[#18201E] mt-2.5 line-clamp-2">
              {selectedChallenge.title}
            </h4>

            <p className="text-[11px] text-[#7A8581] flex items-center space-x-1 mt-1">
              <MapPin className="w-3 h-3 text-[#16AF82] flex-shrink-0" />
              <span>{selectedChallenge.location}</span>
            </p>

            <p className="text-xs text-[#4A5552] mt-2 line-clamp-3 leading-relaxed">
              {selectedChallenge.description}
            </p>

            {/* Live Stats Row */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E7EBE8] text-xs">
              <div className="p-2 bg-[#F9FCFA] rounded-lg border border-[#E7EBE8]">
                <span className="text-[10px] text-[#7A8581] block">Live Supporters</span>
                <span className="text-sm font-bold text-[#16AF82] flex items-center space-x-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{liveSupporters.toLocaleString()}</span>
                </span>
              </div>

              <div className="p-2 bg-[#F9FCFA] rounded-lg border border-[#E7EBE8]">
                <span className="text-[10px] text-[#7A8581] block">Days Left</span>
                <span className="text-sm font-bold text-[#18201E] flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{selectedChallenge.daysLeft} days</span>
                </span>
              </div>
            </div>

            {/* Live Comments snippet */}
            {liveComments.length > 0 && (
              <div className="mt-3 space-y-1 text-left">
                <span className="text-[10px] font-bold text-[#7A8581] uppercase tracking-wider block">
                  Latest Stakeholder Input ({liveComments.length})
                </span>
                <div className="p-2 rounded-lg bg-[#F5F6F4] text-[11px] text-[#18201E] line-clamp-2">
                  <span className="font-semibold">{liveComments[0].authorName}: </span>
                  {liveComments[0].content}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#E7EBE8] flex items-center space-x-2 mt-3">
            <button
              onClick={handleToggleSupport}
              disabled={isSupporting}
              className="flex-1 py-1.5 px-3 bg-[#DDF2E7] text-[#16AF82] hover:bg-[#16AF82] hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
            >
              <ThumbsUp className="w-3 h-3" />
              <span>Support</span>
            </button>

            {onInspectChallenge && (
              <button
                onClick={() => onInspectChallenge(selectedChallenge.id)}
                className="py-1.5 px-3 bg-[#16AF82] text-white rounded-lg text-xs font-semibold hover:bg-[#13976f] transition-colors flex items-center space-x-1"
              >
                <span>Full View</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
