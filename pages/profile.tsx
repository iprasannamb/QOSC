import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileSettings from '../components/profile/ProfileSettings';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import BannerEditModal from '../components/profile/BannerEditModal';
import PostsSection from '../components/profile/PostsSection';

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
      
      // Set up mock profile data
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
      
      // Load mock posts
      setPosts(MOCK_POSTS);
      
      // Fade in the UI
      setFadeIn(true);
    };
    
    // Simulate a delay for loading
    const timer = setTimeout(() => {
      checkAuth();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [router]);

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

  const handlePostImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPostImage(e.target.files[0]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate name length
      if (profile.name.trim().length < 2) {
        toast.error('Name must be at least 2 characters long');
        return;
      }

      // In a real app, you would save to a database here
      // For demo, we'll just update the state and show success
      
      toast.success('Profile updated successfully!');
      setIsEditingBanner(false);
      setIsEditingProfile(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      if (!newPost.title.trim() || !newPost.content.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      let imageUrl = '';
      if (postImage) {
        // Show loading toast for image upload
        const loadingToast = toast.loading('Processing post image...');
        
        try {
          // Use placeholder instead of actual upload
          imageUrl = await handleFileUpload(postImage, 'post') || '';
          toast.dismiss(loadingToast);
        } catch (error) {
          toast.dismiss(loadingToast);
          console.error('Error processing post image:', error);
          toast.error('Failed to process post image, but continuing with post creation');
        }
      }
      
      // Create a new post with a unique ID
      const newPostData: Post = {
        id: `post${Date.now()}`, // Generate a unique ID
        title: newPost.title,
        content: newPost.content,
        type: newPost.type,
        imageUrl,
        // Ensure timestamp is a standard JavaScript Date object
        timestamp: new Date()
      };
      
      // Add the new post to the state
      setPosts(prev => [newPostData, ...prev]);
      
      // Reset form
      setNewPost({
        title: '',
        content: '',
        type: 'progress'
      });
      setPostImage(null);
      setIsPostingOpen(false);
      
      toast.success('Post created successfully!');
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn && fadeIn) {
      router.push('/login');
    }
  }, [isLoggedIn, fadeIn, router]);

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <Navigation isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className="container mx-auto px-4 py-8 mt-16">
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
          onSave={handleSaveProfile}
          onBannerPhotoChange={handleBannerPhotoChange}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};
