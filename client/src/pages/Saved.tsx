import React, { useState, useEffect } from 'react';
import { Bookmark, MapPin, ExternalLink, Trash2 } from 'lucide-react';
import { api } from '../api/client';

interface SavedProps {
  onNavigate: (tab: string, id?: string) => void;
}

export const Saved: React.FC<SavedProps> = ({ onNavigate }) => {
  const [savedItems, setSavedItems] = useState<any[]>([
    {
      id: 's_1',
      title: 'Water shortage in rural areas',
      category: 'Environment',
      location: 'Ranchi, Jharkhand',
      itemType: 'CHALLENGE',
      itemId: 'ch_1',
      date: 'Saved 2 days ago'
    },
    {
      id: 's_2',
      title: 'Smart Irrigation System',
      category: 'Agriculture',
      location: 'Ranchi, Jharkhand',
      itemType: 'SOLUTION',
      itemId: 'sol_1',
      date: 'Saved 3 days ago'
    },
    {
      id: 's_3',
      title: 'Birsa Agricultural University',
      category: 'Agritech',
      location: 'Ranchi, Jharkhand',
      itemType: 'UNIVERSITY',
      itemId: 'u_1',
      date: 'Saved 1 week ago'
    }
  ]);

  const handleRemove = (id: string) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-[#18201E] dark:text-[#E7EBE8] tracking-tight">Saved Items</h1>
        <p className="text-sm text-[#7A8581] dark:text-[#8E9C97] mt-0.5">
          Quickly access your bookmarked challenges, research solutions, and partner directories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {savedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#0c1a17] rounded-xl border border-[#E7EBE8] dark:border-[#1b2b27] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#DDF2E7] dark:bg-[#16AF82]/20 text-[#16AF82]">
                  {item.itemType}
                </span>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-[#7A8581] hover:text-red-500 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-bold text-sm text-[#18201E] dark:text-[#E7EBE8] mt-2.5 line-clamp-1">{item.title}</h3>
              <p className="text-xs text-[#7A8581] dark:text-[#8E9C97] mt-1 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-[#16AF82]" />
                <span>{item.location}</span>
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E7EBE8] dark:border-[#1b2b27] flex items-center justify-between text-xs">
              <span className="text-[#7A8581] dark:text-[#8E9C97] text-[11px]">{item.date}</span>
              <button
                onClick={() => onNavigate(item.itemType === 'CHALLENGE' ? 'challenge-detail' : item.itemType === 'SOLUTION' ? 'solutions' : 'universities', item.itemId)}
                className="font-semibold text-[#16AF82] hover:underline flex items-center space-x-1"
              >
                <span>Open</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
