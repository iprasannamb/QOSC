import React, { useState } from 'react';
import { FiHeart, FiSend } from 'react-icons/fi';
import { Comment } from '@/types/repository';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  algorithmId: string;
  onLikeComment?: (commentId: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  algorithmId,
  onLikeComment
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <h4 className="text-lg font-medium mb-4">Comments</h4>
      
      {/* Comment list */}
      <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-sm mb-2">{comment.text}</p>
              <div className="flex justify-end">
                <button 
                  className={`flex items-center gap-1 text-xs ${
                    comment.userHasLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                  } transition-colors`}
                  onClick={() => onLikeComment && onLikeComment(comment.id)}
                >
                  <FiHeart className={comment.userHasLiked ? "fill-red-400" : ""} />
                  <span>{comment.likes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 bg-gray-700 rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-2 transition-colors"
          disabled={!newComment.trim()}
        >
          <FiSend size={16} />
        </button>
      </form>
    </div>
  );
};