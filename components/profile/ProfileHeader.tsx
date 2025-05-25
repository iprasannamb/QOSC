import { useRef } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { User } from 'firebase/auth';

// Add constants for default images
const DEFAULT_BANNER = '/images/default-banner.jpg';
const DEFAULT_PROFILE_PHOTO = '/images/default-pp.jpg';

interface ProfileHeaderProps {
  name: string;
  profilePhoto: string;
  bannerPhoto: string;
  onEditBanner: () => void;
  onEditProfile: () => void;
}

const ProfileHeader = ({ 
  name, 
  profilePhoto = DEFAULT_PROFILE_PHOTO, 
  bannerPhoto = DEFAULT_BANNER, 
  onEditBanner, 
  onEditProfile 
}: ProfileHeaderProps) => {
  return (
    <div className="relative h-64 w-full">
      {/* Banner */}
      <div className="h-full w-full">
        <img 
          src={bannerPhoto || DEFAULT_BANNER} 
          alt="Profile Banner" 
          className="h-full w-full object-cover"
          onError={(e) => {
            // If the banner image fails to load, use the default banner
            e.currentTarget.src = DEFAULT_BANNER;
          }}
        />
      </div>
      
      {/* Banner Edit Button */}
      <button 
        onClick={onEditBanner}
        className="absolute top-4 right-4 bg-gray-800/70 p-2 rounded-full text-white hover:bg-gray-700/70"
      >
        <FiEdit2 size={20} />
      </button>
      
      {/* Profile Photo */}
      <div className="absolute -bottom-16 left-8 h-32 w-32 rounded-full border-4 border-gray-900 overflow-hidden">
        {profilePhoto ? (
          <img 
            src={profilePhoto} 
            alt={name} 
            className="h-full w-full object-cover"
            onError={(e) => {
              // If the profile photo fails to load, use the default profile photo
              e.currentTarget.src = DEFAULT_PROFILE_PHOTO;
            }}
          />
        ) : (
          <img 
            src={DEFAULT_PROFILE_PHOTO} 
            alt={name} 
            className="h-full w-full object-cover"
          />
        )}
        
        {/* Profile Photo Edit Button */}
        <button 
          onClick={onEditProfile}
          className="absolute bottom-0 right-0 bg-gray-800/70 p-1.5 rounded-full text-white hover:bg-gray-700/70"
        >
          <FiEdit2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;

