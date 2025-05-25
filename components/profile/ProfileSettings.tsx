interface ProfileSettingsProps {
  notifications: boolean;
  language: string;
  onToggleChange: (name: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ProfileSettings = ({ notifications, language, onToggleChange, onInputChange }: ProfileSettingsProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Enable Notifications</span>
          <button
            onClick={() => onToggleChange('notifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications ? 'bg-purple-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
          <select
            name="language"
            value={language}
            onChange={onInputChange}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;