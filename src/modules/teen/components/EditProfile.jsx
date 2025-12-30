import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EditProfile = () => {
  const navigate = useNavigate();
  const [tempName, setTempName] = useState('Teen User'); // Default, should be passed or fetched

  // In a real app, fetch user data here
  useEffect(() => {
    // For now, assume default
  }, []);

  const handleSave = () => {
    // Save logic, perhaps update global state or localStorage
    // For now, just navigate back
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="h-screen bg-[#d1e5e6] flex flex-col w-full relative mobile-only overflow-y-auto">
      {/* Background circle decorations */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(140, 24, 85)' }}></div>
      <div className="absolute top-40 right-10 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(248, 22%, 50%)' }}></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(186, 26%, 62%)' }}></div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-300 p-4 flex items-center">
        <button onClick={() => navigate('/')} className="mr-4 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black text-lg tracking-tight text-black">Edit Profile</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 space-y-4">
        <div className="bg-white/50 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300 space-y-4">
          <h3 className="text-lg font-bold text-black">Edit Profile</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6]"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#d1e5e6] text-black rounded-lg hover:bg-opacity-80 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-opacity-80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;