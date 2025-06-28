import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileSettings from '../components/profile/ProfileSettings';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import BannerEditModal from '../components/profile/BannerEditModal';
import PostsSection from '../components/profile/PostsSection';
import { FiUser, FiSettings, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { logoutUser } from '@/utils/firebase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  profilePhoto: string;
  bannerPhoto: string;
  domain: string;
  skills: string[];
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  timestamp: Date;
  type: 'progress' | 'achievement' | 'certificate';
}

// Mock user data for demo purposes
const MOCK_USER = {
  id: 'user123',
  name: 'Demo User',
  email: 'demo@example.com',
  photoURL: '/images/default-pp.jpg'
};

// Mock posts data
const MOCK_POSTS: Post[] = [
  {
    id: 'post1',
    title: 'My First Achievement',
    content: 'Completed the first module of my course!',
    imageUrl: 'https://via.placeholder.com/500?text=achievement',
    timestamp: new Date(),
    type: 'achievement'
  },
  {
    id: 'post2',
    title: 'Learning Progress',
    content: 'Making good progress on my project',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    type: 'progress'
  }
];

// Add constants for default images
const DEFAULT_BANNER = '/images/default-banner.jpg';
const DEFAULT_PROFILE_PHOTO = '/images/default-pp.jpg';

export default function Profile() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<typeof MOCK_USER | null>(null);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'progress' as const
  });
  const [postImage, setPostImage] = useState<File | null>(null);
  const [isPostingOpen, setIsPostingOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    bio: '',
    profilePhoto: '',
    bannerPhoto: '',
    domain: '',
    skills: [],
    notifications: true,
    theme: 'dark',
    language: 'en'
  });

  // Simulate authentication and profile loading
  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      // For demo, we'll assume the user is logged in
      setIsLoggedIn(true);
      setCurrentUser(MOCK_USER);
      
      // Try to load profile from localStorage first
      const savedProfile = localStorage.getItem('userProfile');
      
      if (savedProfile) {
        // Use the saved profile data
        const profileData = JSON.parse(savedProfile);
        setProfile({
          id: profileData.id || MOCK_USER.id,
          name: profileData.name || MOCK_USER.name,
          email: profileData.email || MOCK_USER.email,
          bio: profileData.bio || 'Software developer passionate about learning new technologies',
          profilePhoto: profileData.profilePhoto || MOCK_USER.photoURL,
          bannerPhoto: profileData.bannerPhoto || DEFAULT_BANNER,
          domain: profileData.domain || 'Web Development',
          skills: profileData.skills || ['JavaScript', 'React', 'TypeScript', 'Node.js'],
          notifications: profileData.notifications !== undefined ? profileData.notifications : true,
          theme: profileData.theme || 'dark',
          language: profileData.language || 'en'
        });
      } else {
        // Set up mock profile data if no saved profile exists
        setProfile({
          id: MOCK_USER.id,
          name: MOCK_USER.name,
          email: MOCK_USER.email,
          bio: 'Software developer passionate about learning new technologies',
          profilePhoto: MOCK_USER.photoURL,
          bannerPhoto: DEFAULT_BANNER, // Use the default banner image
          domain: 'Web Development',
          skills: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
          notifications: true,
          theme: 'dark',
          language: 'en'
        });
      }
      
      // Load mock posts
      setPosts(MOCK_POSTS);
      
      // Fade in the UI
      setFadeIn(true);
    };

    checkAuth();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string) => {
    setProfile(prev => ({ ...prev, [name]: !prev[name as keyof UserProfile] }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Simplified file handling with placeholder URLs
  const handleFileUpload = async (file: File, type: 'profile' | 'banner' | 'post') => {
    if (!file) return null;
    
    // For demo purposes, return a placeholder URL
    return `https://via.placeholder.com/500?text=${type}_image`;
  };

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Show loading toast
      const loadingToast = toast.loading('Updating profile photo...');
      
      try {
        // Use placeholder instead of actual upload
        const photoUrl = await handleFileUpload(file, 'profile');
        
        if (photoUrl) {
          setProfile(prev => ({ ...prev, profilePhoto: photoUrl }));
          toast.success('Profile photo updated successfully');
        } else {
          // If upload fails, use the default profile photo
          setProfile(prev => ({ ...prev, profilePhoto: DEFAULT_PROFILE_PHOTO }));
          toast.error('Failed to upload image, using default profile photo');
        }
      } catch (error) {
        console.error('Error updating profile photo:', error);
        toast.error('Failed to update profile photo');
        // Use default profile photo on error
        setProfile(prev => ({ ...prev, profilePhoto: DEFAULT_PROFILE_PHOTO }));
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  const handleBannerPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Show loading toast
      const loadingToast = toast.loading('Updating banner image...');
      
      try {
        // Use placeholder instead of actual upload
        const photoUrl = await handleFileUpload(file, 'banner');
        
        if (photoUrl) {
          setProfile(prev => ({ ...prev, bannerPhoto: photoUrl }));
          toast.success('Banner image updated successfully');
        } else {
          // If upload fails, use the default banner
          setProfile(prev => ({ ...prev, bannerPhoto: DEFAULT_BANNER }));
          toast.error('Failed to upload image, using default banner');
        }
      } catch (error) {
        console.error('Error updating banner image:', error);
        toast.error('Failed to update banner image');
        // Use default banner on error
        setProfile(prev => ({ ...prev, bannerPhoto: DEFAULT_BANNER }));
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPostImage(e.target.files[0]);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully');
    }, 1500);
  };

  const handleSaveBanner = async () => {
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
      setIsEditingBanner(false);
      toast.success('Banner updated successfully');
    }, 1500);
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate uploading image if one is selected
      let imageUrl = undefined;
      if (postImage) {
        imageUrl = await handleFileUpload(postImage, 'post');
      }
      
      // Create new post object
      const post: Post = {
        id: `post${Date.now()}`, // Generate a unique ID
        title: newPost.title,
        content: newPost.content,
        
        timestamp: new Date(),
        type: newPost.type
      };
      
      // Add to state
      setPosts(prev => [post, ...prev]);
      
      // Reset form
      setNewPost({
        title: '',
        content: '',
        type: 'progress'
      });
      setPostImage(null);
      setIsPostingOpen(false);
      
      toast.success('Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      // Remove from state
      setPosts(prev => prev.filter(post => post.id !== postId));
      
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn && fadeIn) {
      router.push('/');
    }
  }, [isLoggedIn, fadeIn, router]);

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

          {/* Profile Button with Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center"
              >
                <FiUser className="mr-2" />
                Profile
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
          <div className="mb-24">
            <ProfileHeader 
              name={profile.name}
              profilePhoto={profile.profilePhoto}
              bannerPhoto={profile.bannerPhoto}
              onEditBanner={() => setIsEditingBanner(true)}
              onEditProfile={() => setIsEditingProfile(true)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Profile Info */}
            <div className="md:col-span-1 space-y-6">
              <ProfileInfo 
                name={profile.name}
                email={profile.email}
                bio={profile.bio}
                domain={profile.domain}
                skills={profile.skills}
                onEditProfile={() => setIsEditingProfile(true)}
              />
              
              <ProfileSettings 
                notifications={profile.notifications}
                language={profile.language}
                onToggleChange={handleToggleChange}
                onInputChange={handleInputChange}
              />
            </div>
            
            {/* Right Column - Posts */}
            <div className="md:col-span-2">
              <PostsSection 
                posts={posts}
                onDeletePost={handleDeletePost}
                onCreatePost={handleCreatePost}
                newPost={newPost}
                setNewPost={setNewPost}
                postImage={postImage}
                onPostImageChange={handlePostImageChange}
                isPostingOpen={isPostingOpen}
                setIsPostingOpen={setIsPostingOpen}
                isSaving={isSaving}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Modals */}
      {isEditingProfile && (
        <ProfileEditModal 
          profile={profile}
          onClose={() => setIsEditingProfile(false)}
          onSave={handleSaveProfile}
          onInputChange={handleInputChange}
          onProfilePhotoChange={handleProfilePhotoChange}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          isSaving={isSaving}
        />
      )}
      
      {isEditingBanner && (
        <BannerEditModal 
          bannerPhoto={profile.bannerPhoto}
          onClose={() => setIsEditingBanner(false)}
          onSave={handleSaveBanner}
          onBannerPhotoChange={handleBannerPhotoChange}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};
