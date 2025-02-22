import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface NavigationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Navigation({ isOpen, setIsOpen }: NavigationProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

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
            {/* Home is always accessible */}
            <button 
              onClick={() => scrollToSection('home')}
              className="text-lg hover:text-purple-400 transition-colors"
            >
              Home
            </button>

            {/* Protected navigation items */}
            <button 
              onClick={() => scrollToSection('about')}
              className={`text-lg transition-colors ${
                isLoggedIn ? 'hover:text-purple-400' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className={`text-lg transition-colors ${
                isLoggedIn ? 'hover:text-purple-400' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              className={`text-lg transition-colors ${
                isLoggedIn ? 'hover:text-purple-400' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Community
            </button>
            
            {/* Auth buttons */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/profile" 
                  className="text-lg hover:text-purple-400 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowLoginCard(true)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Sign In
                </button>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg border border-purple-600 hover:bg-purple-600/20 transition-colors"
                >
                  Sign Up
                </Link>
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
    </>
  );
} 