import React, { useState } from 'react';
import Link from 'next/link';
import { FiStar, FiGitBranch, FiGitCommit, FiMessageSquare, FiUsers, FiShare2 } from 'react-icons/fi';
import { Algorithm } from '@/types/repository';
import { CommentSection } from '../../components/repository/CommentSection';
import { CollaboratorList } from '../../components/repository/CollaboratorList';
import { toast } from 'react-hot-toast';

interface AlgorithmItemProps {
  algorithm: Algorithm;
  onStarToggle: (algorithmId: string) => void;
  onAddComment: (algorithmId: string, text: string) => void;
  onAddCollaborator: (algorithmId: string) => void;
}

export const AlgorithmItem: React.FC<AlgorithmItemProps> = ({
  algorithm,
  onStarToggle,
  onAddComment,
  onAddCollaborator
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Function to truncate description
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays <= 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/algorithm/${algorithm._id}`);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl shadow-xl hover:shadow-2xl transition group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
            {algorithm.name}
          </h3>
          <p className="text-gray-400 mb-3">
            {isExpanded ? algorithm.description : truncateDescription(algorithm.description)}
            {algorithm.description.length > 100 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-blue-400 hover:text-blue-300"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </p>
          <div className="flex gap-2 flex-wrap">
            {algorithm.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 ml-4">
          <div className="flex items-center gap-2">
            <button 
              className={`flex items-center gap-1 ${
                algorithm.userHasStarred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
              } transition-colors`}
              onClick={() => onStarToggle(algorithm._id)}
            >
              <FiStar className={algorithm.userHasStarred ? "fill-yellow-400" : ""} /> 
              <span>{algorithm.stars}</span>
            </button>
          </div>
          <Link href={`/algorithm/${algorithm._id}`} className="inline-block">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              View
            </button>
          </Link>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
        <span className="flex items-center gap-1">
          <FiGitBranch /> Version {algorithm.version}
        </span>
        <span className="flex items-center gap-1">
          <FiGitCommit /> Updated: {formatDate(algorithm.lastUpdated)}
        </span>
        <span>{algorithm.language}</span>
        <div className="flex items-center gap-1">
          <img 
            src={typeof algorithm.author === 'string' ? algorithm.author : algorithm.author.avatar} 
            alt={typeof algorithm.author === 'string' ? algorithm.author : algorithm.author.name}
            className="w-5 h-5 rounded-full"
          />
          <span>{typeof algorithm.author === 'string' ? algorithm.author : algorithm.author.name}</span>
        </div>
        <span>Complexity: {algorithm.complexity}</span>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button 
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          onClick={() => setShowComments(!showComments)}
        >
          <FiMessageSquare />
          <span>Comments ({Array.isArray(algorithm.comments) ? algorithm.comments.length : 0})</span>
        </button>
        
        <button 
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          onClick={() => onAddCollaborator(algorithm._id)}
        >
          <FiUsers />
          <span>Collaborate</span>
        </button>
        
        <button 
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          onClick={handleShare}
        >
          <FiShare2 />
          <span>Share</span>
        </button>
      </div>
      
      {/* Collaborators */}
      <CollaboratorList collaborators={algorithm.collaborators} />
      
      {/* Comments section */}
      {showComments && (
        <CommentSection 
          comments={Array.isArray(algorithm.comments) 
            ? algorithm.comments.map(comment => typeof comment === 'string' 
                ? { id: comment, text: comment, author: { id: '', name: 'Anonymous', avatar: '', role: '' }, createdAt: new Date().toISOString(), likes: 0, userHasLiked: false } 
                : comment)
            : []}
          onAddComment={(text) => onAddComment(algorithm._id, text)}
          algorithmId={algorithm._id}
        />
      )}
    </div>
  );
};





