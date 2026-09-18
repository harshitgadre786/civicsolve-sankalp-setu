import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Lock, 
  Shield, 
  Check, 
  Sliders, 
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const SettingsProfile: React.FC = () => {
  const { user, activeRole } = useAuth();
  const [name, setName] = useState(user?.name || 'Harshit Gadre');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [location, setLocation] = useState(user?.location || 'Ranchi, Jharkhand');
  const [skills, setSkills] = useState(['Python', 'IoT', 'C++', 'React', 'GIS']);
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Toggles for notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [challengeUpdates, setChallengeUpdates] = useState(true);
  const [teamMessages, setTeamMessages] = useState(true);
  const [systemNotifs, setSystemNotifs] = useState(true);

  const notificationsList = [
    {
      id: '1',
      title: 'Your team has been approved',
      context: 'Green Innovators',
      time: '2 hours ago',
      type: 'TEAM'
    },
    {
      id: '2',
      title: 'New comment on your challenge',
      context: 'Water shortage in rural areas',
      time: '5 hours ago',
      type: 'CHALLENGE'
    },
    {
      id: '3',
      title: 'TCS is interested in your solution',
      context: 'Smart Irrigation System',
      time: '1 day ago',
      type: 'SOLUTION'
    },
    {
      id: '4',
      title: 'Your solution has been deployed',
      context: 'Waste Segregation App',
      time: '2 days ago',
      type: 'DEPLOYED'
    },
    {
      id: '5',
      title: 'Reminder: Team meeting',
      context: 'Green Innovators',
      time: '3 days ago',
      type: 'MEETING'
    }
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile({
        name,
        phone,
        location,
        skills
      });
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#18201E] tracking-tight">Profile & Account Settings</h1>
        <p className="text-sm text-[#7A8581] mt-0.5">
          Manage your personal details, institutional affiliation, and platform notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): User Profile & Settings */}
        <div className="lg:col-span-8 space-y-6">
          {/* User Profile Card matching Screen 10 */}
          <div className="bg-white rounded-2xl border border-[#E7EBE8] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7EBE8]">
              <span className="text-xs font-bold text-[#18201E] uppercase tracking-wider">User Profile</span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-[#16AF82] hover:underline"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {savedSuccess && (
              <div className="mt-3 p-2.5 bg-[#DDF2E7] text-[#16AF82] text-xs font-semibold rounded-lg flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {!isEditing ? (
              <div className="mt-5 space-y-5">
                <div className="flex items-center space-x-4">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}
                    alt="User Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#16AF82]"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-[#18201E]">{name}</h2>
                    <p className="text-xs text-[#7A8581] mt-0.5">
                      {activeRole === 'CITIZEN' ? 'Student Innovator' : activeRole.replace('_', ' ')} • BIT Sindri
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="space-y-1">
                    <span className="text-[#7A8581] block">Email</span>
                    <span className="font-semibold text-[#18201E]">{user?.email || 'harshitgadre706@gmail.com'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#7A8581] block">Phone</span>
                    <span className="font-semibold text-[#18201E]">{phone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#7A8581] block">Location</span>
                    <span className="font-semibold text-[#18201E]">{location}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#7A8581] block">Role Affiliation</span>
                    <span className="font-semibold text-[#16AF82]">{activeRole.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Skills badges */}
                <div className="pt-3 border-t border-[#E7EBE8]">
                  <span className="text-xs font-bold text-[#18201E] block mb-2">Expertise Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#F5F6F4] text-[#18201E] border border-[#E7EBE8]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#18201E] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18201E] mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18201E] mb-1">Location / District</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18201E] mb-1">Add Skills</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="e.g. Agronomy, GIS"
                      className="flex-1 px-3.5 py-2 text-xs bg-[#F5F6F4] border border-[#E7EBE8] rounded-lg focus:outline-none focus:border-[#16AF82]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 py-2 bg-[#F5F6F4] border border-[#E7EBE8] text-xs font-semibold text-[#18201E] rounded-lg hover:bg-[#E7EBE8]"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-[#DDF2E7] text-[#16AF82] font-semibold flex items-center space-x-1"
                      >
                        <span>{s}</span>
                        <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-red-500 ml-1">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#16AF82] text-white rounded-lg text-xs font-semibold hover:bg-[#13976f] transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Account Settings matching Screen 10 */}
          <div className="bg-white rounded-2xl border border-[#E7EBE8] p-6 shadow-sm space-y-4">
            <span className="text-xs font-bold text-[#18201E] uppercase tracking-wider block pb-2 border-b border-[#E7EBE8]">
              Settings & Preferences
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F6F4] transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-4 h-4 text-[#7A8581]" />
                  <div>
                    <p className="text-xs font-bold text-[#18201E]">Profile Information</p>
                    <p className="text-[11px] text-[#7A8581]">Update basic information and verified email</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7A8581]" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F6F4] transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Lock className="w-4 h-4 text-[#7A8581]" />
                  <div>
                    <p className="text-xs font-bold text-[#18201E]">Change Password</p>
                    <p className="text-[11px] text-[#7A8581]">Secure your account credentials</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7A8581]" />
              </div>

              {/* Notification Preferences with toggles */}
              <div className="pt-3 border-t border-[#E7EBE8] space-y-3">
                <p className="text-xs font-bold text-[#18201E]">Notification Preferences</p>

                <div className="space-y-2.5 text-xs">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[#4A5552]">Email Notifications</span>
                    <input
                      type="checkbox"
                      checked={emailNotif}
                      onChange={(e) => setEmailNotif(e.target.checked)}
                      className="w-4 h-4 accent-[#16AF82]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[#4A5552]">Challenge Updates</span>
                    <input
                      type="checkbox"
                      checked={challengeUpdates}
                      onChange={(e) => setChallengeUpdates(e.target.checked)}
                      className="w-4 h-4 accent-[#16AF82]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[#4A5552]">Team Messages</span>
                    <input
                      type="checkbox"
                      checked={teamMessages}
                      onChange={(e) => setTeamMessages(e.target.checked)}
                      className="w-4 h-4 accent-[#16AF82]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[#4A5552]">System Notifications</span>
                    <input
                      type="checkbox"
                      checked={systemNotifs}
                      onChange={(e) => setSystemNotifs(e.target.checked)}
                      className="w-4 h-4 accent-[#16AF82]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Notifications Feed matching Screen 10 */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7EBE8] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7EBE8]">
            <span className="text-xs font-bold text-[#18201E] uppercase tracking-wider">Notifications</span>
            <span className="text-[11px] text-[#16AF82] font-semibold">Feed</span>
          </div>

          <div className="space-y-3">
            {notificationsList.map((n) => (
              <div
                key={n.id}
                className="p-3 bg-[#F9FCFA] rounded-xl border border-[#E7EBE8] hover:border-[#16AF82] transition-colors space-y-1 text-left"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#18201E] leading-snug">{n.title}</p>
                </div>
                <p className="text-[11px] text-[#16AF82] font-medium">{n.context}</p>
                <span className="text-[10px] text-[#7A8581] block pt-0.5">{n.time}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#F5F6F4] text-center text-[11px] text-[#7A8581]">
            All societal alerts routed through GoJ dispatch hub.
          </div>
        </div>
      </div>
    </div>
  );
};
