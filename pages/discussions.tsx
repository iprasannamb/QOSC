import { useState } from 'react';
import { MessageCircle, ThumbsUp, Share2, Award, ArrowUp, ArrowDown } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  votes: number;
  comments: number;
  timestamp: string;
  tags: string[];
  isUpvoted: boolean;
  isDownvoted: boolean;
}

export default function Discussions() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "Understanding Quantum Entanglement",
      content: "Can someone explain quantum entanglement in simple terms? I'm struggling to grasp the concept...",
      author: {
        name: "quantum_learner",
        avatar: "/default-avatar.png"
      },
      votes: 42,
      comments: 15,
      timestamp: "2h ago",
      tags: ["quantum", "beginner", "question"],
      isUpvoted: false,
      isDownvoted: false
    },
    // Add more sample posts as needed
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleVote = (postId: number, isUpvote: boolean) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        // Reset votes if clicking the same button again
        if ((isUpvote && post.isUpvoted) || (!isUpvote && post.isDownvoted)) {
          return {
            ...post,
            votes: isUpvote ? post.votes - 1 : post.votes + 1,
            isUpvoted: false,
            isDownvoted: false
          };
        }
        // Handle new vote
        return {
          ...post,
          votes: isUpvote 
            ? post.votes + (post.isDownvoted ? 2 : 1)
            : post.votes - (post.isUpvoted ? 2 : 1),
          isUpvoted: isUpvote,
          isDownvoted: !isUpvote
        };
      }
      return post;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPostObj: Post = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      author: {
        name: "Current User",
        avatar: "/default-avatar.png"
      },
      votes: 0,
      comments: 0,
      timestamp: "Just now",
      tags: newPost.tags.split(',').map(tag => tag.trim()),
      isUpvoted: false,
      isDownvoted: false
    };
    setPosts([newPostObj, ...posts]);
    setNewPost({ title: '', content: '', tags: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Create Post Form */}
        <div className="bg-gray-800/30 backdrop-blur border border-gray-700/50 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
            <textarea
              placeholder="What's on your mind?"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 h-32 focus:outline-none focus:border-blue-500"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Post
            </button>
          </form>
        </div>

        {/* Posts List */}
        {posts.map(post => (
          <div key={post.id} className="bg-gray-800/30 backdrop-blur border border-gray-700/50 rounded-xl p-6">
            {/* Vote Buttons */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleVote(post.id, true)}
                  className={`p-1 rounded transition-colors ${
                    post.isUpvoted ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
                  }`}
                >
                  <ArrowUp size={20} />
                </button>
                <span className={`font-medium ${
                  post.isUpvoted ? 'text-blue-500' : 
                  post.isDownvoted ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {post.votes}
                </span>
                <button
                  onClick={() => handleVote(post.id, false)}
                  className={`p-1 rounded transition-colors ${
                    post.isDownvoted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <ArrowDown size={20} />
                </button>
              </div>

              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-400">
                    Posted by {post.author.name} • {post.timestamp}
                  </span>
                </div>

                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-300 mb-4">{post.content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700/50 text-blue-400 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 text-gray-400">
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <MessageCircle size={20} />
                    {post.comments} Comments
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <Share2 size={20} />
                    Share
                  </button>
                  <button className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                    <Award size={20} />
                    Award
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}