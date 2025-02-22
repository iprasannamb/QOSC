import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'react-hot-toast';

interface NavigationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

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
  const maxDepth = 5; // Maximum nesting level

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
            <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full">
              Verified
            </span>
          )}
          <span className="text-gray-400 text-sm">{comment.timestamp}</span>
        </div>
        
        <p className="text-gray-200 mb-3">{comment.content}</p>
        
        <div className="flex items-center gap-4 text-sm">
          {/* Voting buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onVote(comment.id, true)}
              className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                comment.userVote === 'up' ? 'text-purple-400' : 'text-gray-400'
              }`}
            >
              ▲
            </button>
            <span className={`font-mono ${
              comment.votes > 0 ? 'text-purple-400' : 
              comment.votes < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {comment.votes}
            </span>
            <button
              onClick={() => onVote(comment.id, false)}
              className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                comment.userVote === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              ▼
            </button>
          </div>

          {/* Reply button */}
          {depth < maxDepth && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              Reply
            </button>
          )}

          {/* Delete button (if owner) */}
          {onDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        {/* Reply form */}
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
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-600/50 disabled:cursor-not-allowed"
              >
                Reply
              </button>
            </div>
          </form>
        )}

        {/* Nested replies */}
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

export default function Navigation({ isOpen, setIsOpen }: NavigationProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupCard, setShowSignupCard] = useState(false);
  const [signupCredentials, setSignupCredentials] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  // Check if we're on the profile page
  const isProfilePage = router.pathname === '/profile';

  const handleNavigation = (section: string) => {
    if (isProfilePage) {
      // If on profile page, redirect to main page with section hash
      router.push(`/#${section}`);
    } else {
      // Normal scroll behavior for main page
      scrollToSection(section);
    }
  };

  useEffect(() => {
    // Check login status on mount and when localStorage changes
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loginStatus);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      if (sectionId !== 'home' && !isLoggedIn) {
        // Only show login prompt for non-home sections when not logged in
        setShowLoginCard(true);
        return;
      }
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate login
      if (credentials.email && credentials.password) {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        setShowLoginCard(false);
        setCredentials({ email: '', password: '' });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (signupCredentials.password !== signupCredentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Simulate signup
      if (signupCredentials.email && signupCredentials.password) {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        setShowSignupCard(false);
        setSignupCredentials({ email: '', password: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 p-2 hover:bg-gray-800/50 rounded-lg transition-colors z-50"
        aria-label="Toggle Menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`h-0.5 w-full bg-white transform transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}></span>
          <span className={`h-0.5 bg-white transform transition-all duration-300 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}></span>
          <span className={`h-0.5 w-full bg-white transform transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}></span>
        </div>
      </button>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-transparent text-white p-4 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 ml-16">
            <Link href="/" className="text-2xl font-bold">
              XREPO
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            {/* Navigation buttons */}
            <button 
              onClick={() => handleNavigation('home')}
              className="text-lg relative group"
            >
              <span className="relative z-10 hover:text-purple-400 transition-colors duration-300">Home</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </button>

            <button 
              onClick={() => handleNavigation('about')}
              className={`text-lg relative group ${isLoggedIn ? '' : 'text-gray-400'}`}
            >
              <span className="relative z-10 group-hover:text-purple-400 transition-colors duration-300">About</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </button>

            <button 
              onClick={() => handleNavigation('features')}
              className={`text-lg relative group ${isLoggedIn ? '' : 'text-gray-400'}`}
            >
              <span className="relative z-10 group-hover:text-purple-400 transition-colors duration-300">Features</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </button>

            {/* Auth buttons */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {!isProfilePage && (
                  <Link 
                    href="/profile" 
                    className="text-lg relative group"
                  >
                    <span className="relative z-10 hover:text-purple-400 transition-colors duration-300">Profile</span>
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-lg bg-purple-600 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-full bg-purple-800 group-hover:translate-x-0"></span>
                  <span className="relative group-hover:text-white transition-colors duration-300">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowLoginCard(true)}
                  className="px-6 py-2 rounded-lg bg-purple-600 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-full bg-purple-800 group-hover:translate-x-0"></span>
                  <span className="relative group-hover:text-white transition-colors duration-300">Sign In</span>
                </button>
                <button
                  onClick={() => setShowSignupCard(true)}
                  className="px-6 py-2 rounded-lg border border-purple-600 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-0 h-full transition-all duration-300 ease-out transform bg-purple-600/20 group-hover:w-full"></span>
                  <span className="relative group-hover:text-white transition-colors duration-300">Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Login Card with improved styling */}
      {showLoginCard && !isLoggedIn && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-gray-900/95 w-full max-w-md p-6 border-gray-800">
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Sign In Required</h2>
                <button
                  onClick={() => setShowLoginCard(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 mb-6">
                Please sign in to access this feature and explore all our quantum computing resources.
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
                <div className="text-center text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Sign Up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Signup Card */}
      {showSignupCard && !isLoggedIn && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-gray-900/95 w-full max-w-md p-6 border-gray-800">
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create Account</h2>
                <button
                  onClick={() => setShowSignupCard(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 mb-6">
                Sign up to access all our quantum computing features and resources.
              </p>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupCredentials.email}
                    onChange={(e) => setSignupCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={signupCredentials.password}
                    onChange={(e) => setSignupCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={signupCredentials.confirmPassword}
                    onChange={(e) => setSignupCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Creating account...</span>
                    </div>
                  ) : (
                    'Sign Up'
                  )}
                </button>
                <div className="text-center text-gray-400">
                  Already have an account?{' '}
                  <button 
                    onClick={() => {
                      setShowSignupCard(false);
                      setShowLoginCard(true);
                    }} 
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 