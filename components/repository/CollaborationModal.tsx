import React, { useState } from 'react';
import { FiX, FiUsers } from 'react-icons/fi';

interface CollaborationModalProps {
  onClose: () => void;
  onAddCollaborator: (email: string, role: string) => void;
  algorithmName: string;
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  onClose,
  onAddCollaborator,
  algorithmName
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onAddCollaborator(email, role);
      setEmail('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FiUsers /> Add Collaborator
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <p className="text-gray-400 mb-4">
          Invite someone to collaborate on <span className="text-blue-400">{algorithmName}</span>. 
          They will be able to edit and contribute to the code based on their permission level.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              className="w-full bg-gray-700 rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="collaborator@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Permission Level</label>
            <select
              className="w-full bg-gray-700 rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="viewer">Viewer (can view and comment)</option>
              <option value="editor">Editor (can edit code)</option>
              <option value="admin">Admin (full control)</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

