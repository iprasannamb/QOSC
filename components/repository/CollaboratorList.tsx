import React from 'react';
import { User } from '@/types/repository';

interface CollaboratorListProps {
  collaborators: User[];
}

export const CollaboratorList: React.FC<CollaboratorListProps> = ({ collaborators }) => {
  // Only show up to 5 collaborators in the preview
  const displayedCollaborators = collaborators.slice(0, 5);
  const remainingCount = collaborators.length - 5;

  return (
    <div className="flex items-center mb-4">
      <div className="flex -space-x-2 mr-2">
        {displayedCollaborators.map((user) => (
          <div 
            key={user.id} 
            className="w-6 h-6 rounded-full border border-gray-800 bg-gray-700 overflow-hidden"
            title={`${user.name} (${user.role})`}
          >
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="w-6 h-6 rounded-full border border-gray-800 bg-gray-700 flex items-center justify-center text-xs">
            +{remainingCount}
          </div>
        )}
      </div>
      <span className="text-xs text-gray-400">
        {collaborators.length === 1 
          ? '1 collaborator' 
          : `${collaborators.length} collaborators`}
      </span>
    </div>
  );
};
