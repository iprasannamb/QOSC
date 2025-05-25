import { useState, useRef } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';

// Quantum domains list
const QUANTUM_DOMAINS = [
  "Quantum Computing",
  "Quantum Information Theory",
  "Quantum Cryptography",
  "Quantum Communication",
  "Quantum Machine Learning",
  "Quantum Algorithms",
  "Quantum Error Correction",
  "Quantum Simulation",
  "Quantum Chemistry",
  "Quantum Optics",
  "Quantum Metrology",
  "Quantum Sensing",
  "Quantum Materials",
  "Topological Quantum Computing",
  "Quantum Annealing",
  "Quantum Software Development",
  "Quantum Hardware Engineering",
  "Quantum Network Architecture",
  "Quantum Biology",
  "Quantum Finance"
];

// Add constant for default profile photo
const DEFAULT_PROFILE_PHOTO = '/images/default-pp.jpg';

interface ProfileEditModalProps {
  profile: {
    name: string;
    email: string;
    bio: string;
    domain: string;
    skills: string[];
    profilePhoto: string;
  };
  onClose: () => void;
  onSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onProfilePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  isSaving: boolean;
}

const ProfileEditModal = ({ 
  profile, 
  onClose, 
  onSave, 
  onInputChange, 
  onProfilePhotoChange,
  onAddSkill,
  onRemoveSkill,
  newSkill,
  setNewSkill,
  isSaving
}: ProfileEditModalProps) => {
  const profilePhotoRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
              {profile.profilePhoto ? (
                <img 
                  src={profile.profilePhoto} 
                  alt={profile.name} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // If the profile photo fails to load, use the default profile photo
                    e.currentTarget.src = DEFAULT_PROFILE_PHOTO;
                  }}
                />
              ) : (
                <img 
                  src={DEFAULT_PROFILE_PHOTO} 
                  alt={profile.name} 
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <button
              onClick={() => profilePhotoRef.current?.click()}
              className="flex items-center text-purple-400 hover:text-purple-300"
            >
              <FiUpload className="mr-2" />
              Change Profile Photo
            </button>
            <input
              ref={profilePhotoRef}
              type="file"
              accept="image/*"
              onChange={onProfilePhotoChange}
              className="hidden"
            />
          </div>
          
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={onInputChange}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={onInputChange}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={onInputChange}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 h-24 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Quantum Domain</label>
            <select
              name="domain"
              value={profile.domain}
              onChange={onInputChange}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="">Select a domain</option>
              {QUANTUM_DOMAINS.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Skills</label>
            <div className="flex">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 bg-gray-700 text-white rounded-l-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === 'Enter' && onAddSkill()}
              />
              <button
                onClick={onAddSkill}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.skills.map((skill, index) => (
                <div key={index} className="flex items-center bg-gray-700 rounded-full pl-3 pr-1 py-1">
                  <span className="text-gray-300 text-sm">{skill}</span>
                  <button
                    onClick={() => onRemoveSkill(skill)}
                    className="ml-1 text-gray-400 hover:text-red-400 p-1"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
