import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

export default function Profile() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Quantum computing enthusiast',
    notifications: true,
    theme: 'dark',
    language: 'en'
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setFadeIn(true);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string) => {
    setProfile(prev => ({ ...prev, [name]: !prev[name as keyof UserProfile] }));
  };

  return (
    <div className={`min-h-screen bg-gray-900 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`max-w-4xl mx-auto p-8 pt-20 transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <h1 className="text-4xl font-bold text-white mb-8">Profile & Settings</h1>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">User Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 h-24"
                />
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Enable Notifications</span>
                <button
                  onClick={() => handleToggleChange('notifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    profile.notifications ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                <select
                  name="language"
                  value={profile.language}
                  onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save and Logout Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => console.log('Saving profile...', profile)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Save Changes
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                router.push('/login');
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 