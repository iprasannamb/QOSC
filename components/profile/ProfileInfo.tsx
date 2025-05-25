interface ProfileInfoProps {
  name: string;
  email: string;
  bio: string;
  domain: string;
  skills: string[];
  onEditProfile: () => void;
}

const ProfileInfo = ({ name, email, bio, domain, skills, onEditProfile }: ProfileInfoProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h1 className="text-2xl font-bold text-white mb-1">{name}</h1>
      <p className="text-gray-400 mb-4">{email}</p>
      
      <div className="border-t border-gray-700 pt-4 mt-4">
        <h2 className="text-lg font-semibold text-white mb-2">About</h2>
        <p className="text-gray-300">{bio || "No bio provided yet."}</p>
      </div>
      
      <div className="border-t border-gray-700 pt-4 mt-4">
        <h2 className="text-lg font-semibold text-white mb-2">Domain</h2>
        <p className="text-gray-300">{domain || "No domain selected yet."}</p>
      </div>
      
      <div className="border-t border-gray-700 pt-4 mt-4">
        <h2 className="text-lg font-semibold text-white mb-2">Skills</h2>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-gray-300 text-sm">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No skills added yet.</p>
        )}
      </div>
      
      <button
        onClick={onEditProfile}
        className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileInfo;