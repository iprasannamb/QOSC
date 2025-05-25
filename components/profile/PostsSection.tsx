import { useState, useRef } from 'react';
import { FiPlus, FiTrash2, FiX, FiUpload } from 'react-icons/fi';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  timestamp: any;
  type: 'progress' | 'achievement' | 'certificate';
}

interface PostsSectionProps {
  posts: Post[];
  onDeletePost: (postId: string) => void;
  onCreatePost: (e: React.FormEvent) => void;
  newPost: {
    title: string;
    content: string;
    type: 'progress' | 'achievement' | 'certificate';
  };
  setNewPost: (post: any) => void;
  postImage: File | null;
  onPostImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPostingOpen: boolean;
  setIsPostingOpen: (isOpen: boolean) => void;
  isSaving: boolean;
}

const PostsSection = ({
  posts,
  onDeletePost,
  onCreatePost,
  newPost,
  setNewPost,
  postImage,
  onPostImageChange,
  isPostingOpen,
  setIsPostingOpen,
  isSaving
}: PostsSectionProps) => {
  const postImageRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      {/* Create Post Button */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <button
          onClick={() => setIsPostingOpen(true)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-3 rounded-lg text-left transition-colors duration-200"
        >
          <div className="flex items-center">
            <FiPlus className="mr-2" />
            <span>Share your progress, achievement or certificate...</span>
          </div>
        </button>
      </div>
      
      {/* Create Post Modal */}
      {isPostingOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Create Post</h2>
              <button onClick={() => setIsPostingOpen(false)} className="text-gray-400 hover:text-white">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={onCreatePost}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Post Type</label>
                  <select
                    value={newPost.type}
                    onChange={(e) => setNewPost({...newPost, type: e.target.value as any})}
                    className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="progress">Progress Update</option>
                    <option value="achievement">Achievement</option>
                    <option value="certificate">Certificate</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Enter a title for your post"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-md px-4 py-2 h-32 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Image (Optional)</label>
                  {postImage ? (
                    <div className="relative">
                      <img 
                        src={URL.createObjectURL(postImage)} 
                        alt="Post preview" 
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setNewPost({...newPost, image: null})}
                        className="absolute top-2 right-2 bg-gray-800/70 p-1 rounded-full text-white hover:bg-gray-700/70"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => postImageRef.current?.click()}
                      className="w-full h-24 border-2 border-dashed border-gray-600 rounded-md flex flex-col items-center justify-center text-gray-400 hover:text-gray-300 hover:border-gray-500"
                    >
                      <FiUpload size={24} className="mb-2" />
                      <span>Click to upload an image</span>
                    </button>
                  )}
                  <input
                    ref={postImageRef}
                    type="file"
                    accept="image/*"
                    onChange={onPostImageChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-700 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsPostingOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Posts List */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <span className="capitalize">{post.type}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {post.timestamp instanceof Date 
                        ? post.timestamp.toLocaleDateString() 
                        : new Date(post.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
              
              {/* Post Image (if any) */}
              {post.imageUrl && (
                <div className="w-full">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              
              {/* Post Content */}
              <div className="p-4 pt-2">
                <p className="text-gray-300 whitespace-pre-line">{post.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No posts yet. Share your first update!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsSection;
