import React from 'react';
import { FiX, FiActivity, FiCode, FiStar, FiGitBranch, FiMessageSquare, FiUpload, FiCalendar } from 'react-icons/fi';
import { User } from '@/types/repository';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  starredCount: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  starredCount
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">User Profile</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-20 h-20 rounded-full border-2 border-blue-500"
          />
          <div>
            <h4 className="text-xl font-semibold">{user.name}</h4>
            <p className="text-gray-400">{user.role}</p>
            <div className="flex gap-4 mt-2">
              <div className="text-center">
                <div className="text-lg font-bold">{starredCount}</div>
                <div className="text-xs text-gray-400">Starred</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">3</div>
                <div className="text-xs text-gray-400">Uploads</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">12</div>
                <div className="text-xs text-gray-400">Contributions</div>
              </div>
            </div>
          </div>
        </div>
        
        <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiActivity /> Contribution History
        </h5>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {user.contributionHistory?.map((contribution, index) => (
            <div key={index} className="bg-gray-700/50 p-3 rounded-lg flex items-center gap-3">
              {contribution.type === 'commit' && <FiCode className="text-blue-400" />}
              {contribution.type === 'star' && <FiStar className="text-yellow-400" />}
              {contribution.type === 'fork' && <FiGitBranch className="text-green-400" />}
              {contribution.type === 'comment' && <FiMessageSquare className="text-purple-400" />}
              {contribution.type === 'upload' && <FiUpload className="text-orange-400" />}
              <div className="flex-1">
                <p>{contribution.description}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <FiCalendar /> {contribution.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};