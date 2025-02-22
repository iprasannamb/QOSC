import { useState, useCallback } from 'react';
import CommentComponent from '../components/CommentComponent';

interface Comment {
  id: number;
  content: string;
  author: string;
  expertise: string;
  votes: number;
  timestamp: string;
  verified: boolean;
  replies?: Comment[];
  parentId?: number;
  userVote?: 'up' | 'down' | null;
}

export default function ResourcePage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = useCallback((content: string) => {
    const newCommentObj: Comment = {
      id: Date.now(),
      content,
      author: 'Current User', // Replace with actual user
      expertise: 'User',
      votes: 0,
      timestamp: 'Just now',
      verified: false,
      replies: [],
      userVote: null
    };

    setComments(prev => [...prev, newCommentObj]);
    setNewComment('');
  }, []);

  const handleReply = useCallback((parentId: number, content: string) => {
    const newReply: Comment = {
      id: Date.now(),
      content,
      author: 'Current User', // Replace with actual user
      expertise: 'User',
      votes: 0,
      timestamp: 'Just now',
      verified: false,
      parentId,
      userVote: null
    };

    setComments(prev => {
      const addReplyToComment = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies)
            };
          }
          return comment;
        });
      };

      return addReplyToComment(prev);
    });
  }, []);

  const handleVote = useCallback((commentId: number, isUpvote: boolean) => {
    setComments(prev => {
      const updateCommentVote = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            const currentVote = comment.userVote;
            let voteDiff = 0;

            if (isUpvote && currentVote !== 'up') {
              voteDiff = currentVote === 'down' ? 2 : 1;
            } else if (!isUpvote && currentVote !== 'down') {
              voteDiff = currentVote === 'up' ? -2 : -1;
            }

            return {
              ...comment,
              votes: comment.votes + voteDiff,
              userVote: isUpvote ? 
                (currentVote === 'up' ? null : 'up') : 
                (currentVote === 'down' ? null : 'down')
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentVote(comment.replies)
            };
          }
          return comment;
        });
      };

      return updateCommentVote(prev);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Add new comment */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleAddComment(newComment);
        }}
        className="mb-8"
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={4}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-600/50 disabled:cursor-not-allowed"
          >
            Comment
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentComponent
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onVote={handleVote}
            onDelete={comment.author === 'Current User' ? 
              (commentId) => setComments(prev => prev.filter(c => c.id !== commentId)) : 
              undefined
            }
          />
        ))}
      </div>
    </div>
  );
} 