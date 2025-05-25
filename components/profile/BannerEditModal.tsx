import { useRef } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';

interface BannerEditModalProps {
  bannerPhoto: string;
  onClose: () => void;
  onSave: () => void;
  onBannerPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
}

const BannerEditModal = ({ 
  bannerPhoto, 
  onClose, 
  onSave, 
  onBannerPhotoChange,
  isSaving
}: BannerEditModalProps) => {
  const bannerPhotoRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Edit Banner</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Banner Preview */}
          <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
            {bannerPhoto ? (
              <img 
                src={bannerPhoto} 
                alt="Banner" 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-purple-900 to-blue-900 flex items-center justify-center">
                <span className="text-white text-lg">No banner image set</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => bannerPhotoRef.current?.click()}
              className="flex items-center text-purple-400 hover:text-purple-300"
            >
              <FiUpload className="mr-2" />
              {bannerPhoto ? 'Change Banner Photo' : 'Upload Banner Photo'}
            </button>
            <input
              ref={bannerPhotoRef}
              type="file"
              accept="image/*"
              onChange={onBannerPhotoChange}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerEditModal;