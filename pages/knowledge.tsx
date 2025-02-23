import { useState } from 'react';
import { MessageCircle, Share2, ArrowUp, ArrowDown, X, Search, Bell, Plus, User, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Chatbot from '../components/ChatBot';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
  };
  votes: number;
  comments: number;
  timestamp: string;
  tags: string[];
  isUpvoted: boolean;
  isDownvoted: boolean;
  isExpanded?: boolean;
  postComments: string[];
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export default function Knowledge() {
  const router = useRouter();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "Introduction to Quantum Gates",
      content: "Quantum gates are the building blocks of quantum circuits. Here's a simple explanation of how they work...",
      author: {
        name: "quantum_expert"
      },
      votes: 25,
      comments: 8,
      timestamp: "3h ago",
      tags: ["quantum-gates", "basics", "tutorial"],
      isUpvoted: false,
      isDownvoted: false,
      postComments: []
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "Someone commented on your post", time: "2m ago" },
    { id: 2, text: "Your post received 10 upvotes", time: "1h ago" },
    // Add more notifications as needed
  ]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your quantum computing assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleVote = (postId: number, isUpvote: boolean) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if ((isUpvote && post.isUpvoted) || (!isUpvote && post.isDownvoted)) {
          return {
            ...post,
            votes: isUpvote ? post.votes - 1 : post.votes + 1,
            isUpvoted: false,
            isDownvoted: false
          };
        }
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
        name: "Current User"
      },
      votes: 0,
      comments: 0,
      timestamp: "Just now",
      tags: newPost.tags.split(',').map(tag => tag.trim()),
      isUpvoted: false,
      isDownvoted: false,
      postComments: []
    };
    setPosts([newPostObj, ...posts]);
    setNewPost({ title: '', content: '', tags: '' });
  };

  const handleCommentClick = (postId: number) => {
    setPosts(posts.map(post => ({
      ...post,
      isExpanded: post.id === postId ? !post.isExpanded : post.isExpanded
    })));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        content: "I understand your interest in quantum computing. How can I assist you further?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  // Handle chat toggle
  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Handle chat close
  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  // Handle navigation
  const handleHomeClick = () => {
    router.push('/'); // Redirect to home page
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  // Function to handle adding comments to a post
  const handleAddComment = (postId: number, comment: string) => {
    if (!comment.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          postComments: [...post.postComments, comment]
        };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Home Button */}
            <button
              onClick={handleHomeClick}
              className="flex-shrink-0 text-xl font-bold hover:text-purple-400 transition-colors"
            >
              XREPO
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl px-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-4">
              {/* Create Post Button */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                <span>Create</span>
              </button>

              {/* Chat Button */}
              <button
                onClick={handleChatToggle}
                className={`p-1.5 rounded-lg transition-colors ${
                  isChatOpen 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <MessageSquare size={20} />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors relative"
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <h3 className="font-medium">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-700/50 cursor-pointer"
                        >
                          <p className="text-sm text-gray-300">{notification.text}</p>
                          <span className="text-xs text-gray-400">{notification.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Button */}
              <button 
                onClick={handleProfileClick}
                className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-2">
        {/* Share Modal */}
        {isShareModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800/90 backdrop-blur border border-gray-700/50 rounded-xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Share Your Knowledge</h2>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                handleSubmit(e);
                setIsShareModalOpen(false);
              }} className="space-y-4">
                <input
                  type="text"
                  placeholder="Share your quantum computing knowledge..."
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Explain your concept or share your insights..."
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 h-32 focus:outline-none focus:border-blue-500"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Add tags (e.g., quantum-gates, algorithms, theory)"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(false)}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Share2 size={20} />
                    Share
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts List with Inline Comments */}
        {posts.map(post => (
          <div key={post.id} 
               className="bg-gray-800 hover:bg-gray-800/80 rounded-md transition-colors group"
          >
            <div className="flex">
              {/* Left Sidebar - Voting */}
              <div className="w-10 rounded-l-md flex flex-col items-center py-2 space-y-1">
                <button
                  onClick={() => handleVote(post.id, true)}
                  className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                    post.isUpvoted ? 'text-orange-500' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <ArrowUp size={16} />
                </button>
                <span className={`text-xs font-bold ${
                  post.isUpvoted ? 'text-orange-500' : 
                  post.isDownvoted ? 'text-blue-500' : 'text-gray-400'
                }`}>
                  {post.votes}
                </span>
                <button
                  onClick={() => handleVote(post.id, false)}
                  className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                    post.isDownvoted ? 'text-blue-500' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <ArrowDown size={16} />
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-2">
                {/* Post Metadata */}
                <div className="flex items-center text-xs text-gray-400 mb-1">
                  <span className="font-medium text-gray-300">r/QuantumComputing</span>
                  <span className="mx-1">•</span>
                  <span>Posted by {post.author.name}</span>
                  <span className="mx-1">•</span>
                  <span>{post.timestamp}</span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-medium mb-2 text-gray-100">
                  {post.title}
                </h2>

                {/* Content Preview */}
                <p className="text-sm text-gray-300 mb-2 line-clamp-3">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <button 
                    onClick={() => handleCommentClick(post.id)}
                    className="flex items-center gap-1 hover:bg-gray-700/50 px-2 py-1 rounded-md transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span>{post.comments} Comments</span>
                  </button>
                </div>

                {/* Expanded Comments Section */}
                {post.isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="space-y-4">
                      {/* Add Comment Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="flex-1 bg-gray-700/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(post.id, e.currentTarget.value);
                              e.currentTarget.value = ''; // Clear input after submission
                            }
                          }}
                        />
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                          onClick={() => {
                            const input = document.querySelector(`input[placeholder="Add a comment..."]`) as HTMLInputElement;
                            handleAddComment(post.id, input.value);
                            input.value = ''; // Clear input after submission
                          }}
                        >
                          Comment
                        </button>
                      </div>
                      
                      {/* Display Comments */}
                      <div className="space-y-3">
                        {post.postComments.map((comment, index) => (
                          <div key={index} className="bg-gray-700/30 rounded-md p-3">
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                              <span className="font-medium">Current User</span>
                              <span className="mx-1">•</span>
                              <span>{new Date().toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm text-gray-300">{comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chatbot with improved modal handling */}
      {isChatOpen && <Chatbot onClose={handleChatClose} />}
    </div>
  );
}
