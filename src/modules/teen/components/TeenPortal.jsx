import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import IdTab from './IdTab';
import SecurityTab from './SecurityTab';
import RecoveryTab from './RecoveryTab';
import { SideDrawer, SideDrawerContent, SideDrawerHeader, SideDrawerTrigger, SideDrawerClose } from '@/components/shared/ui/side-drawer';
import { Home, Settings, Shield, Edit, LogOut, Menu } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shared/ui/avatar';

// Generate BOL-Key in YY-NNN format
const generateBolKey = () => {
  const year = new Date().getFullYear() % 100;
  const num = Math.floor(Math.random() * 1000);
  return `${year.toString().padStart(2, '0')}-${num.toString().padStart(3, '0')}`;
};

const TeenPortal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    displayName: 'Teen User',
    photoURL: null, // or a placeholder URL
  });
  const [bolKey, setBolKey] = useState(() => {
    const stored = localStorage.getItem('bolKey');
    if (stored) return stored;
    const newKey = generateBolKey();
    localStorage.setItem('bolKey', newKey);
    return newKey;
  });
  const [qrCode, setQrCode] = useState('');
  const [activeTab, setActiveTab] = useState('id');
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      await generateQR(bolKey);
    };
    updateQR();
  }, [bolKey]);


  return (
    <div className="h-screen bg-[#d1e5e6] flex flex-col w-full relative mobile-only overflow-y-auto">
      {/* Background circle decorations */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-60 blur-xl" style={{ backgroundColor: 'hsl(140, 24, 85)' }}></div>
      <div className="absolute top-40 right-10 w-40 h-40 rounded-full opacity-60 blur-xl" style={{ backgroundColor: 'hsl(248, 22%, 50%)' }}></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full opacity-60 blur-xl" style={{ backgroundColor: 'hsl(186, 26%, 62%)' }}></div>
      <button onClick={() => setDrawerOpen(true)} className="absolute top-4 left-4 z-10  text-white p-2 rounded-full shadow-lg bg-[hsl(186,70%,34%)]/80 backdrop-blur-lg hover:bg-[hsl(186,70%,34%)]">
        <Menu size={20} />
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 space-y-4">
        {activeTab === 'id' && (
          <IdTab bolKey={bolKey} qrCode={qrCode} />
        )}

        {activeTab === 'security' && (
          <SecurityTab />
        )}

        {activeTab === 'recovery' && (
          <RecoveryTab onRecover={() => {
            const newKey = generateBolKey();
            setBolKey(newKey);
            localStorage.setItem('bolKey', newKey);
          }} />
        )}
      </main>

      {/* Side Drawer Navigation */}
      <SideDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SideDrawerContent className="bg-[hsl(186,70%,34%)]/80 backdrop-blur-lg">
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
              <Home size={20} />
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
          </div>
        </SideDrawerContent>
      </SideDrawer>

    </div>
  );
};

export default TeenPortal;