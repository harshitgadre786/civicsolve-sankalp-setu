import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  MapPin, 
  Layers, 
  ExternalLink, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import type { University } from '../types';
import { api } from '../api/client';

export const Universities: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [search, setSearch] = useState('');

  const departments = ['All', 'Engineering', 'Science', 'Management', 'Agriculture', 'Healthcare', 'Others'];

  const fetchUniversities = async () => {
    try {
      const res = await api.getUniversities({
        department: selectedDept !== 'All' ? selectedDept : undefined,
        search: search || undefined
      });
      if (res.data && res.data.length > 0) {
        setUniversities(res.data);
      } else {
        setUniversities(getFallbackUniversities());
      }
    } catch {
      setUniversities(getFallbackUniversities());
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [selectedDept, search]);

  function getFallbackUniversities(): University[] {
    return [
      {
        id: 'u_1',
        name: 'Birsa Institute of Technology (BIT) Sindri',
        shortName: 'BIT Sindri',
        location: 'Dhanbad, Jharkhand',
        district: 'Dhanbad',
        nirfRank: 'State Rank #1',
        logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80',
        departments: JSON.stringify(['CSE', 'AI/ML', 'Mining', 'Mechanical']),
        expertiseTags: JSON.stringify(['IoT', 'Mining Safety', 'Robotics', 'Environmental Tech']),
        activeProjectsCount: 24,
        description: 'Premier government engineering college of Jharkhand with dedicated incubation labs.'
      },
      {
        id: 'u_2',
        name: 'Indian Institute of Technology (ISM) Dhanbad',
        shortName: 'IIT ISM',
        location: 'Dhanbad, Jharkhand',
        district: 'Dhanbad',
        nirfRank: 'Top 15',
        logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&q=80',
        departments: JSON.stringify(['Data Science', 'Robotics', 'EEE']),
        expertiseTags: JSON.stringify(['Data Science', 'Robotics', 'AI', 'Earth Sciences']),
        activeProjectsCount: 18,
        description: 'Institute of National Importance pioneering deep-tech and resource sustainability.'
      },
      {
        id: 'u_3',
        name: 'National Institute of Technology (NIT) Jamshedpur',
        shortName: 'NIT Jamshedpur',
        location: 'Jamshedpur, Jharkhand',
        district: 'East Singhbhum',
        nirfRank: 'Top 70',
        logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&q=80',
        departments: JSON.stringify(['Mechanical', 'ECE', 'Civil']),
        expertiseTags: JSON.stringify(['Smart Manufacturing', 'Sensors', 'Civil Structures']),
        activeProjectsCount: 12,
        description: 'Excellence in manufacturing automation, material sciences, and rural tech.'
      },
      {
        id: 'u_4',
        name: 'Birsa Agricultural University (BAU)',
        shortName: 'BAU Ranchi',
        location: 'Ranchi, Jharkhand',
        district: 'Ranchi',
        nirfRank: 'ICAR Top 25',
        logoUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&q=80',
        departments: JSON.stringify(['Agronomy', 'Soil Science', 'Horticulture']),
        expertiseTags: JSON.stringify(['Agritech', 'Soil Health', 'Drip Irrigation']),
        activeProjectsCount: 15,
        description: 'Specializing in plateau farming models, drought-resistant seeds, and farmer training.'
      },
      {
        id: 'u_5',
        name: 'IIT Delhi',
        shortName: 'IIT Delhi',
        location: 'Delhi',
        district: 'National Partner',
        nirfRank: 'Top 5',
        logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80',
        departments: JSON.stringify(['Data Science', 'Robotics', 'EEE']),
        expertiseTags: JSON.stringify(['AI/ML', 'IoT', 'Hardware']),
        activeProjectsCount: 24,
        description: 'Collaborating mentor institution under SIH inter-state knowledge exchange.'
      },
      {
        id: 'u_6',
        name: 'IISc Bangalore',
        shortName: 'IISc',
        location: 'Karnataka',
        district: 'National Partner',
        nirfRank: 'Top 10',
        logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&q=80',
        departments: JSON.stringify(['Research', 'AI', 'BioTech']),
        expertiseTags: JSON.stringify(['Deep Learning', 'Sensors', 'BioTech']),
        activeProjectsCount: 16,
        description: 'Premier basic science and engineering research institute.'
      }
    ];
  }

  const parseTags = (str: string): string[] => {
    try {
      return JSON.parse(str);
    } catch {
      return ['AI/ML', 'IoT', 'Engineering'];
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#18201E] tracking-tight">Partner Universities</h1>
        <p className="text-sm text-[#7A8581] mt-0.5">
          Explore universities, higher education institutions, and their specialized research faculties.
        </p>
      </div>

      {/* Search & Department Filters matching Screen 5 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-[#7A8581] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-[#16AF82] text-white shadow-sm'
                  : 'bg-white text-[#7A8581] border border-[#E7EBE8] hover:border-[#16AF82]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map((uni) => {
          const tags = [...parseTags(uni.departments), ...parseTags(uni.expertiseTags)].slice(0, 4);

          return (
            <div
              key={uni.id}
              className="bg-white rounded-xl border border-[#E7EBE8] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={uni.logoUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&q=80'}
                      alt={uni.name}
                      className="w-11 h-11 rounded-lg object-cover border border-[#E7EBE8]"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-[#18201E] line-clamp-1">{uni.name}</h3>
                      <div className="flex items-center space-x-1 text-xs text-[#7A8581] mt-0.5">
                        <MapPin className="w-3 h-3 text-[#16AF82]" />
                        <span>{uni.location}</span>
                      </div>
                    </div>
                  </div>

                  {uni.nirfRank && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DDF2E7] text-[#16AF82] whitespace-nowrap">
                      {uni.nirfRank}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#7A8581] mt-3 line-clamp-2 leading-relaxed">
                  {uni.description}
                </p>

                {/* Capability Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F5F6F4] text-[#18201E] border border-[#E7EBE8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 mt-4 border-t border-[#E7EBE8] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#16AF82]">
                  {uni.activeProjectsCount || 12} active projects
                </span>
                <span className="text-[#7A8581] hover:text-[#18201E] font-medium flex items-center space-x-1 cursor-pointer">
                  <span>View Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
