import { useState } from 'react';

interface CommentProps {
  comment: Comment;
  onReply: (parentId: number, content: string) => void;
  onVote: (commentId: number, isUpvote: boolean) => void;
  onDelete?: (commentId: number) => void;
  depth?: number;
}

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

const CommentComponent: React.FC<CommentProps> = ({ 
  comment, 
  onReply, 
  onVote, 
  onDelete,
  depth = 0 
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const maxDepth = 5;

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  return (
    <div className={`border-l-2 border-gray-700 pl-4 ${depth > 0 ? 'mt-2' : 'mt-4'}`}>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-purple-400">{comment.author}</span>
          {comment.verified && (
            <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full">Verified</span>
          )}
          <span className="text-gray-400 text-sm">{comment.timestamp}</span>
        </div>
        
        <p className="text-gray-200 mb-3">{comment.content}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onVote(comment.id, true)}
              className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                comment.userVote === 'up' ? 'text-purple-400' : 'text-gray-400'
              }`}
            >▲</button>
            <span className={`font-mono ${
              comment.votes > 0 ? 'text-purple-400' : 
              comment.votes < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>{comment.votes}</span>
            <button
              onClick={() => onVote(comment.id, false)}
              className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                comment.userVote === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}
            >▼</button>
          </div>

          {depth < maxDepth && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >Reply</button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >Delete</button>
          )}
        </div>

        {isReplying && (
          <form onSubmit={handleSubmitReply} className="mt-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full px-3 py-2 bg-gray-900 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >Cancel</button>
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-600/50 disabled:cursor-not-allowed"
              >Reply</button>
            </div>
          </form>
        )}

        {comment.replies?.map(reply => (
          <CommentComponent
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onVote={onVote}
            onDelete={onDelete}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentComponent; 