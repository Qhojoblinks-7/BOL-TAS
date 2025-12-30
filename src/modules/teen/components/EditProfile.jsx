import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, X, HelpCircle, MessageSquare, Shield, Trophy, BookOpen, User, Mail, Church, Lock, Compass } from 'lucide-react';

const EditProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Personal Information
  const [fullName, setFullName] = useState('John Doe');
  const [preferredName, setPreferredName] = useState('John');
  const [dateOfBirth, setDateOfBirth] = useState('2008-05-15');
  const [gender, setGender] = useState('Male');
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Contact & Guardian Info
  const [email, setEmail] = useState('john@email.com');
  const [phoneNumber, setPhoneNumber] = useState('(555) 123-4567');
  const [guardianName, setGuardianName] = useState('Michael Doe');
  const [guardianPhone, setGuardianPhone] = useState('(555) 987-6543');
  const [guardianEmail, setGuardianEmail] = useState('michael@email.com');
  const [emergencyContact, setEmergencyContact] = useState('Sarah Doe - (555) 222-3333');

  // Church Engagement
  const [ministry, setMinistry] = useState('Youth Choir');
  const [membershipStatus, setMembershipStatus] = useState('Active Member');
  const [spiritualMilestones, setSpiritualMilestones] = useState('Baptized - 2018');

  // Permissions & Safety
  const [parentalConsent, setParentalConsent] = useState(true);
  const [privacySettings, setPrivacySettings] = useState('Friends Only');

  // Service-Specific Features
  const [attendanceRecords, setAttendanceRecords] = useState('45/52 (86%)');
  const [volunteerRoles, setVolunteerRoles] = useState('Ushering, Tech Team');
  const [points, setPoints] = useState('2,450');

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[#d1e5e6] to-[#c0dfe0] flex flex-col w-full relative mobile-only overflow-y-auto">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: 'hsl(186,70%,34%)' }}></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: 'hsl(186,70%,34%)' }}></div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b-2 border-[hsl(186,70%,34%)]/30 p-4 md:p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
          >
            <ArrowLeft size={24} className="text-black" />
          </button>
          <h1 className="font-bold text-2xl md:text-3xl text-black">Edit Profile</h1>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg font-bold transition-all active:scale-95 ${
            isEditing 
              ? 'bg-gray-300 text-black hover:bg-gray-400' 
              : 'bg-[hsl(186,70%,34%)]/80 text-white hover:bg-[hsl(186,70%,34%)]'
          }`}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-5 space-y-4 md:space-y-5">
        
        {/* Profile Photo Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[hsl(186,70%,34%)]/20 to-[hsl(186,70%,34%)]/5 flex items-center justify-center border-4 border-[hsl(186,70%,34%)]/30">
              <Camera size={40} className="text-[hsl(186,70%,34%)]/60" />
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[hsl(186,70%,34%)]/80 p-2 rounded-full cursor-pointer hover:bg-[hsl(186,70%,34%)] transition-all">
                <Camera size={16} className="text-white" />
                <input type="file" accept="image/*" className="hidden" />
              </label>
            )}
          </div>
          <h2 className="text-2xl font-bold text-black">{fullName}</h2>
          <p className="text-sm text-gray-600">@{preferredName}</p>
        </div>

        {/* 📋 Personal Information */}
        <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <User size={24} className="text-[hsl(186,70%,34%)]" /> Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 📧 Contact & Guardian Info */}
        <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Mail size={24} className="text-[hsl(186,70%,34%)]" /> Contact & Guardian Info
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
              />
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-black mb-3">Parent/Guardian Information</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Guardian Name"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                />
                <input
                  type="tel"
                  placeholder="Guardian Phone"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                />
                <input
                  type="email"
                  placeholder="Guardian Email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Emergency Contact</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
              />
            </div>
          </div>
        </div>

        {/* ⛪ Church Engagement */}
        <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Church size={24} className="text-[hsl(186,70%,34%)]" /> Church Engagement
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Ministry / Group</label>
              <select
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
              >
                <option>Youth Choir</option>
                <option>Bible Study</option>
                <option>Teen Fellowship</option>
                <option>Praise & Worship</option>
                <option>None</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Membership Status</label>
              <select
                value={membershipStatus}
                onChange={(e) => setMembershipStatus(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
              >
                <option>Active Member</option>
                <option>Visitor</option>
                <option>New Member</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Spiritual Milestones</label>
              <input
                type="text"
                value={spiritualMilestones}
                onChange={(e) => setSpiritualMilestones(e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., Baptized - 2018"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
              />
            </div>
          </div>
        </div>

        {/* 🎯 Service-Specific Features */}
        <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Trophy size={24} className="text-[hsl(186,70%,34%)]" /> Service Records & Recognition
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Attendance Records</p>
              <p className="text-lg font-bold text-blue-700">{attendanceRecords}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Volunteer Roles</p>
              <p className="text-lg font-bold text-purple-700">{volunteerRoles}</p>
            </div>
          </div>
        </div>

        {/* 🧭 Support & Guidance */}
        <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Compass size={24} className="text-[hsl(186,70%,34%)]" /> Support & Guidance
          </h3>
          <div className="space-y-3">
            <button className="w-full p-4 border-2 border-[hsl(186,70%,34%)]/30 rounded-lg hover:bg-[hsl(186,70%,34%)]/5 transition-all active:scale-95 text-left">
              <h4 className="font-semibold text-black mb-1 flex items-center gap-2">
                <BookOpen size={18} /> Church Guidelines
              </h4>
              <p className="text-sm text-gray-600">View youth code of conduct and policies</p>
            </button>
            <button className="w-full p-4 border-2 border-[hsl(186,70%,34%)]/30 rounded-lg hover:bg-[hsl(186,70%,34%)]/5 transition-all active:scale-95 text-left">
              <h4 className="font-semibold text-black mb-1 flex items-center gap-2">
                <HelpCircle size={18} /> Help & FAQ
              </h4>
              <p className="text-sm text-gray-600">How to use the system and troubleshoot issues</p>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 sticky bottom-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
            >
              <Save size={18} />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black px-4 py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditProfile;