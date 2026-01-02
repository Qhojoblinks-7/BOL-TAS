import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import IdTab from './IdTab';
import SecurityTab from './SecurityTab';
import RecoveryTab from './RecoveryTab';
import AttendanceTab from './AttendanceTab';
import HelpTab from './HelpTab';
import ChurchGuidelinesTab from './ChurchGuidelinesTab';
import { SideDrawer, SideDrawerContent, SideDrawerHeader, SideDrawerTitle, SideDrawerDescription, SideDrawerTrigger, SideDrawerClose } from '@/components/shared/ui/side-drawer';
import { QrCode, Settings, Shield, Edit, LogOut, Menu, UserCheck, Calendar, HelpCircle, BookOpen } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shared/ui/avatar';
import { getUsherAssignmentForEmail } from '../../../utils/database';
import UsherActivationModal from './UsherActivationModal';

// Generate unique 5-digit personal code
const generatePersonalCode = () => {
  // For demo, generate random 5-digit code (in real app, ensure uniqueness)
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const TeenPortal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('teenProfile');
    if (stored) {
      const profile = JSON.parse(stored);
      return {
        displayName: profile.fullName,
        photoURL: profile.profilePhoto,
      };
    }
    return {
      displayName: 'Teen User',
      photoURL: null,
    };
  });
  const [personalCode, setPersonalCode] = useState(() => {
    const userAccount = localStorage.getItem('userAccount');
    if (userAccount) {
      const user = JSON.parse(userAccount);
      return user.personalCode;
    }
    // Fallback for demo
    const stored = localStorage.getItem('personalCode');
    if (stored) return stored;
    const newCode = generatePersonalCode();
    localStorage.setItem('personalCode', newCode);
    return newCode;
  });
  const [qrCode, setQrCode] = useState('');
  const [activeTab, setActiveTab] = useState(() => {
    const storedTab = localStorage.getItem('activeTab');
    return storedTab || 'id';
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasUsherAssignment, setHasUsherAssignment] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [showUsherModal, setShowUsherModal] = useState(false);

  // Generate QR Code
  const generateQR = async (text) => {
    try {
      const qr = await QRCode.toString(text, { type: 'svg', width: 300 });
      setQrCode(qr);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const updateQR = async () => {
      await generateQR(personalCode);
    };
    updateQR();
  }, [personalCode]);

  // Clear stored activeTab after component mounts
  useEffect(() => {
    localStorage.removeItem('activeTab');
  }, []);

  // Check for active usher assignments
  useEffect(() => {
    const checkUsherAssignment = () => {
      // Get current user account to find email
      const userAccount = localStorage.getItem('userAccount');
      if (userAccount) {
        const account = JSON.parse(userAccount);
        const email = account.email;
        if (email) {
          const assignment = getUsherAssignmentForEmail(email);
          setHasUsherAssignment(!!assignment);
          // Store assignment for modal if needed
          setCurrentMemberId(assignment ? assignment.memberId : null);
        }
      }
    };

    checkUsherAssignment();

    // Listen for assignment changes
    const handleAssignmentChange = () => {
      checkUsherAssignment();
    };

    window.addEventListener('tempUsherActivated', handleAssignmentChange);
    window.addEventListener('tempUsherExpired', handleAssignmentChange);
    window.addEventListener('assignmentCreated', handleAssignmentChange);
    window.addEventListener('assignmentRevoked', handleAssignmentChange);

    return () => {
      window.removeEventListener('tempUsherActivated', handleAssignmentChange);
      window.removeEventListener('tempUsherExpired', handleAssignmentChange);
      window.removeEventListener('assignmentCreated', handleAssignmentChange);
      window.removeEventListener('assignmentRevoked', handleAssignmentChange);
    };
  }, []);


  return (
    <div className="h-screen bg-[#d1e5e6] flex flex-col w-full relative mobile-only overflow-y-auto">
      {/* Background circle decorations */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-60 blur-xl" style={{ backgroundColor: 'hsl(140, 24, 85)' }}></div>
      <div className="absolute top-40 right-10 w-40 h-40 rounded-full opacity-60 blur-xl" style={{ backgroundColor: 'hsl(248, 22%, 50%)' }}></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full opacity-60 blur-xl" style={{ backgroundColor: 'hsl(186, 26%, 62%)' }}></div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 space-y-4">
        {activeTab === 'id' && (
          <IdTab personalCode={personalCode} qrCode={qrCode} />
        )}

        {activeTab === 'security' && (
          <SecurityTab />
        )}

        {activeTab === 'recovery' && (
          <RecoveryTab onRecover={() => {
            const newCode = generatePersonalCode();
            setPersonalCode(newCode);
            localStorage.setItem('personalCode', newCode);
          }} />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTab />
        )}

        {activeTab === 'help' && (
          <HelpTab />
        )}

        {activeTab === 'guidelines' && (
          <ChurchGuidelinesTab />
        )}
      </main>

      {/* Menu Button - Outside drawer to avoid focus conflicts */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="absolute top-4 left-4 z-10 text-white p-2 rounded-full shadow-lg bg-[hsl(186,70%,34%)]/80 backdrop-blur-lg hover:bg-[hsl(186,70%,34%)]"
        style={{ display: drawerOpen ? 'none' : 'block' }}
      >
        <Menu size={20} />
      </button>

      {/* Side Drawer Navigation */}
      <SideDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SideDrawerContent className="bg-[hsl(186,70%,34%)]/80 backdrop-blur-lg">
          <SideDrawerTitle className="sr-only">Navigation Menu</SideDrawerTitle>
          <SideDrawerDescription className="sr-only">Access your profile, security settings, recovery options, attendance records, help documentation, and church guidelines</SideDrawerDescription>
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback className="bg-white text-black">{user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-white font-medium">{user.displayName}</p>
              </div>
              <button onClick={() => navigate('/edit-profile')} className="text-white hover:text-gray-200 p-1">
                <Edit size={20} />
              </button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('userLoggedOut'))} className="text-white hover:text-gray-200 p-1">
                <LogOut size={20} />
              </button>
            </div>
          </div>
          <SideDrawerHeader>
            <h2 className="text-lg font-bold text-white">Navigation</h2>
          </SideDrawerHeader>
          <div className="flex flex-col space-y-2 p-4">
            <button
              onClick={() => {
                setActiveTab('id');
                setDrawerOpen(false);
              }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'id' ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'
              }`}
            >
              <QrCode size={20} />
              <span>ID Card</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('security');
                setDrawerOpen(false);
              }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'security' ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'
              }`}
            >
              <Settings size={20} />
              <span>Security</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('recovery');
                setDrawerOpen(false);
              }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'recovery' ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'
              }`}
            >
              <Shield size={20} />
              <span>Recovery</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('attendance');
                setDrawerOpen(false);
              }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'attendance' ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'
              }`}
            >
              <Calendar size={20} />
              <span>Attendance</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('help');
                setDrawerOpen(false);
              }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'help' ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'
              }`}
            >
              <HelpCircle size={20} />
              <span>Help & FAQ</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('guidelines');
                setDrawerOpen(false);
              }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'guidelines' ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'
              }`}
            >
              <BookOpen size={20} />
              <span>Church Guidelines</span>
            </button>
            {hasUsherAssignment && (
              <button
                onClick={() => {
                  setShowUsherModal(true);
                  setDrawerOpen(false);
                }}
                className="flex items-center space-x-3 p-3 rounded-lg transition-colors bg-green-600 text-white hover:bg-green-700"
              >
                <UserCheck size={20} />
                <span>Usher Duty</span>
              </button>
            )}
          </div>
        </SideDrawerContent>
      </SideDrawer>

      {/* Usher Activation Modal */}
      {showUsherModal && (
        <UsherActivationModal
          email={JSON.parse(localStorage.getItem('userAccount')).email}
          onSuccess={() => setShowUsherModal(false)}
          onCancel={() => setShowUsherModal(false)}
        />
      )}

    </div>
  );
};

export default TeenPortal;