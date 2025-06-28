import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Share2, ArrowUp, ArrowDown, X, Search, Bell, Plus, User, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Chatbot from '../components/ChatBot';
import Sidebar from '../components/Sidebar';
import { FiUser, FiSettings, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { logoutUser } from '@/utils/firebase';
import ProfileSetupDialog from '../components/ProfileSetupDialog';

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
  
  // Sidebar and profile menu state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Notifications state
  const [notifications] = useState([
    { id: 1, text: "Someone commented on your post", time: "2m ago" },
    { id: 2, text: "Your post received 10 upvotes", time: "1h ago" },
    // Add more notifications as needed
  ]);
  
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your quantum computing assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Profile setup state
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  
  // Check if profile setup has been completed
  useEffect(() => {
    const hasCompletedSetup = localStorage.getItem('profileSetupCompleted') === 'true';
    if (isLoggedIn && !hasCompletedSetup) {
      // Show profile setup dialog after a short delay
      const timer = setTimeout(() => {
        setShowProfileSetup(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);
  
  // Simulate authentication check
  useEffect(() => {
    // For demo, we'll assume the user is logged in
    setIsLoggedIn(true);
    setFadeIn(true);
  }, []);
  
  const handleProfileSetupComplete = (profileData: any) => {
    // Extract relevant profile data
    const userProfileData = {
      name: `${profileData.firstName} ${profileData.lastName}`,
      bio: '',  // Can be updated later in profile
      domain: '',  // Can be updated later in profile
      skills: profileData.interests || [], // Use interests as initial skills
      email: localStorage.getItem('userEmail') || '',
      profilePhoto: '/images/default-pp.jpg',
      bannerPhoto: '/images/default-banner.jpg',
      notifications: true,
      theme: 'dark',
      language: 'en'
    };
    
    // Save profile data
    localStorage.setItem('userProfile', JSON.stringify(userProfileData));
    localStorage.setItem('profileSetupCompleted', 'true');
    
    // Update user profile in database (would be implemented with actual backend)
    console.log('Profile setup completed:', userProfileData);
    
    // Close dialog
    setShowProfileSetup(false);
    
    // Show welcome toast
    toast.success(`Welcome to XREPO, ${profileData.firstName}!`);
  };

  // Handle click outside sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close sidebar if click is outside the sidebar and the sidebar is open
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Handle click outside profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu && profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);
  
  // Handle click outside notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications && notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setShowProfileMenu(false);
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
    }
  };

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
    <div className={`min-h-screen bg-gray-900 text-white ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                ></path>
              </svg>
            </button>
            <Link href="/" className="text-2xl font-bold ml-4">
              XREPO
            </Link>
          </div>

          {/* Knowledge-specific buttons */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search discussions..."
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-64 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Create Post Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-sm hidden md:block"
            >
              Share Knowledge
            </button>
            
            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                <Bell size={20} />
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div 
                  ref={notificationsRef}
                  className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700"
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-0"
                      >
                        <p className="text-sm">{notification.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
                      
            {/* Profile Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                <User size={20} />
              </button>
            
              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div 
                  ref={profileMenuRef}
                  className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700"
                >
                  <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    <FiUser className="mr-2" />
                    Go to Profile
                  </Link>
                  <Link 
                    href="/subscription" 
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    <FiCreditCard className="mr-2" />
                    My Subscription
                  </Link>
                  <Link 
                    href="/settings" 
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    <FiSettings className="mr-2" />
                    Settings and Privacy
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className={`pt-24 px-8 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Knowledge Base</h1>
          
          {/* Knowledge page content remains the same */}
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
                className="bg-gray-800 hover:bg-gray-800/80 rounded-md transition-colors group mb-4"
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
      </main>          
      {/* Profile Setup Dialog */}
      <ProfileSetupDialog 
        open={showProfileSetup}
        onOpenChange={setShowProfileSetup}
        onComplete={handleProfileSetupComplete}
      />
    </div>
  );
}
