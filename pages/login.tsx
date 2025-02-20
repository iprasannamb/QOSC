import { useState } from 'react';
import { useRouter } from 'next/router';
import VideoBackground from '../components/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically validate credentials with your backend
      // For now, we'll just simulate a login
      if (credentials.email && credentials.password) {
        setFadeOut(true);
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        
        // Delay navigation to show transition
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      setFadeOut(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <VideoBackground />
      
      <Card className="bg-white/10 backdrop-blur-md w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white text-center">
            Quantum Platform Login
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg bg-purple-600 text-white font-semibold transform transition-all duration-500
                ${isLoading ? 'bg-purple-400' : 'hover:bg-purple-700 hover:scale-105'}
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 