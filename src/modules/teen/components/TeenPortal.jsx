import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import TeenPortalHeader from './TeenPortalHeader';
import IdTab from './IdTab';
import SecurityTab from './SecurityTab';
import RecoveryTab from './RecoveryTab';
import BottomNav from './BottomNav';

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

  // Generate QR Code
  const generateQR = async (text) => {
    try {
      const qr = await QRCode.toString(text, { type: 'svg', width: 200 });
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
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(140, 24, 85)' }}></div>
      <div className="absolute top-40 right-10 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(248, 22%, 50%)' }}></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(186, 26%, 62%)' }}></div>
      <TeenPortalHeader user={user} onEditProfile={() => navigate('/edit-profile')} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 pb-20 space-y-4">
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

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

    </div>
  );
};

export default TeenPortal;