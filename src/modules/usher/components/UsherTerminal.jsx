import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Clock, AlertTriangle } from 'lucide-react';
import UsherHeader from './UsherHeader';
import TabNavigation from './TabNavigation';
import QRScanTab from './QRScanTab';
import BOLKeyTab from './BOLKeyTab';
import SearchTab from './SearchTab';
import SuccessOverlay from './SuccessOverlay';
import UndoButton from './UndoButton';
import { useGetChurchMembersQuery } from '../../../services/membersApi';
import { useGetUsersQuery } from '../../../services/usersApi';
import { useAddAttendanceRecordMutation } from '../../../services/attendanceApi';

const UsherTerminal = () => {
  // RTK Query hooks
  const { data: churchMembers = [] } = useGetChurchMembersQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [addAttendanceRecord] = useAddAttendanceRecordMutation();

  const [activeTab, setActiveTab] = useState('qr');
  const [scanResult, setScanResult] = useState('');
  const [bolKeyInput, setBolKeyInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [attendanceLog, setAttendanceLog] = useState(() => {
    const cached = localStorage.getItem('attendanceLog');
    return cached ? JSON.parse(cached) : [];
  });
  const [showUndo, setShowUndo] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [scannedMember, setScannedMember] = useState(null);
  const [scanError, setScanError] = useState(null);
  const scannerInstance = useRef(null);


  const handleExpiration = () => {
    setIsExpired(true);

    // Update user role back to teen
    const userAccount = JSON.parse(localStorage.getItem('userAccount'));
    userAccount.role = 'teen';
    delete userAccount.expirationTimestamp;
    localStorage.setItem('userAccount', JSON.stringify(userAccount));

    // Dispatch event to update app state
    window.dispatchEvent(new CustomEvent('tempUsherExpired'));

    // Auto-redirect after showing message
    setTimeout(() => {
      window.location.reload(); // Force app to re-render with new role
    }, 3000);
  };

  // Save attendance log to localStorage
  useEffect(() => {
    localStorage.setItem('attendanceLog', JSON.stringify(attendanceLog));
  }, [attendanceLog]);

  // Expiration monitoring for tempUsher role
  useEffect(() => {
    const checkExpiration = () => {
      const userAccount = localStorage.getItem('userAccount');
      if (userAccount) {
        const account = JSON.parse(userAccount);
        if (account.role === 'tempUsher' && account.expirationTimestamp) {
          const now = Date.now();
          const timeLeft = account.expirationTimestamp - now;

          if (timeLeft <= 0) {
            // Expired - logout
            handleExpiration();
          } else {
            // Update countdown
            setTimeRemaining(Math.max(0, Math.floor(timeLeft / 1000)));
          }
        }
      }
    };

    // Check immediately
    checkExpiration();

    // Check every second for countdown
    const countdownInterval = setInterval(() => {
      checkExpiration();
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const formatTimeRemaining = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const validateQRFormat = (text) => {
    // Check if format is 5 digits (e.g., 12345)
    const formatRegex = /^\d{5}$/;
    return formatRegex.test(text);
  };

  const lookupMember = (code) => {
    // Lookup member by personalCode (5-digit)
    return churchMembers.find(member => member.personalCode === code);
  };

  const onScanSuccess = (decodedText) => {
    setScanResult(decodedText);
    setScanError(null);

    // Step 1: Format Validation
    if (!validateQRFormat(decodedText)) {
      setScanError('Invalid QR code format. Expected YY-NNN format.');
      return;
    }

    // Step 2: Member Lookup
    const member = lookupMember(decodedText);
    if (!member) {
      setScanError('Member not found. Please check the QR code or try manual entry.');
      return;
    }

    // Step 3: Show confirmation
    setScannedMember(member);
    setShowConfirmation(true);
  };

  const handleConfirmCheckIn = async () => {
    // Find user by personal code
    const user = users.find(u => u.personalCode === scanResult);
    if (user) {
      try {
        const record = await addAttendanceRecord({
          userId: user.id,
          method: 'QR Scan',
          service: 'Sunday Service',
          location: 'Main Sanctuary'
        }).unwrap();
        setAttendanceLog(prev => [...prev, record]);
        setLastCheckIn(record);
      } catch (error) {
        console.error('Failed to add attendance record:', error);
        setScanError('Failed to record attendance. Please try again.');
        return;
      }
    }
    setShowSuccessOverlay(true);
    setTimeout(() => setShowSuccessOverlay(false), 3000);
    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 5000);
    setShowConfirmation(false);
    setScannedMember(null);
    setScanResult('');
  };

  const handleCancelCheckIn = () => {
    setShowConfirmation(false);
    setScannedMember(null);
    setScanResult('');
  };

  const onScanFailure = (error) => {
    console.warn(`QR scan error: ${error}`);
  };

  const startScanning = () => {
    setIsScanning(true);
    setTimeout(() => {
      if (!scannerInstance.current && document.getElementById('qr-reader')) {
        try {
          scannerInstance.current = new Html5QrcodeScanner(
            'qr-reader',
            { 
              fps: 30, 
              qrbox: { width: 300, height: 300 },
              aspectRatio: 1.0,
              disableFlip: false
            },
            false
          );
          scannerInstance.current.render(onScanSuccess, onScanFailure);
        } catch (error) {
          console.error('Failed to start QR scanner:', error);
          onScanFailure(error);
          setIsScanning(false);
        }
      }
    }, 100);
  };

  const stopScanning = () => {
    if (scannerInstance.current) {
      scannerInstance.current.clear();
      scannerInstance.current = null;
    }
    setIsScanning(false);
  };

  const handleBOLKeySubmit = () => {
    if (bolKeyInput.length === 5) {
      const now = new Date();
      const checkIn = { method: 'BOL-Key Entry', key: bolKeyInput, time: now.toLocaleTimeString(), timestamp: now.getTime() };
      setAttendanceLog(prev => [...prev, checkIn]);
      setLastCheckIn(checkIn);
      setShowSuccessOverlay(true);
      setTimeout(() => setShowSuccessOverlay(false), 3000);
      setShowUndo(true);
      setTimeout(() => setShowUndo(false), 5000);
      setBolKeyInput('');
    }
  };

  const handleKeypadPress = (digit) => {
    if (digit === 'clear') {
      setBolKeyInput('');
    } else if (digit === 'backspace') {
      setBolKeyInput(prev => prev.slice(0, -1));
    } else if (bolKeyInput.length < 5) {
      setBolKeyInput(prev => prev + digit);
    }
  };

  const handleSearch = () => {
    const results = churchMembers.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleCheckIn = (member) => {
    const now = new Date();
    const timestamp = now.getTime();
    const checkIn = { method: 'Smart Search', name: member.name, area: member.area, parent: member.parent, time: now.toLocaleTimeString(), timestamp };
    setAttendanceLog(prev => [...prev, checkIn]);
    setLastCheckIn(checkIn);
    setShowSuccessOverlay(true);
    setTimeout(() => setShowSuccessOverlay(false), 3000);
    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 5000);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleUndo = () => {
    if (lastCheckIn) {
      setAttendanceLog(prev => prev.filter(item => item.timestamp !== lastCheckIn.timestamp));
      setLastCheckIn(null);
      setShowUndo(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[#d1e5e6] to-[#c0dfe0] flex flex-col w-full relative overflow-y-auto">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: 'hsl(186,70%,34%)' }}></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: 'hsl(186,70%,34%)' }}></div>

      {/* Header */}
      <UsherHeader />

      {/* Expiration Countdown Timer */}
      {timeRemaining !== null && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
          <Clock size={16} />
          <span>Session expires in: {formatTimeRemaining(timeRemaining)}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-5 space-y-4 md:space-y-5">
        {/* QR SCAN TAB */}
        {activeTab === 'qr' && (
          <QRScanTab
            isScanning={isScanning}
            scanResult={scanResult}
            scanError={scanError}
            startScanning={startScanning}
            stopScanning={stopScanning}
            onScanSuccess={onScanSuccess}
            onScanFailure={onScanFailure}
            onRetry={() => {
              setScanError(null);
              setScanResult('');
            }}
          />
        )}

        {/* BOL-KEY TAB */}
        {activeTab === 'key' && (
          <BOLKeyTab
            bolKeyInput={bolKeyInput}
            handleKeypadPress={handleKeypadPress}
            handleBOLKeySubmit={handleBOLKeySubmit}
          />
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <SearchTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            handleSearch={handleSearch}
            handleCheckIn={handleCheckIn}
          />
        )}
      </main>

      {/* Success Overlay */}
      <SuccessOverlay showSuccessOverlay={showSuccessOverlay} />

      {/* Undo Button */}
      <UndoButton showUndo={showUndo} handleUndo={handleUndo} />

      {/* Confirmation Dialog */}
      {showConfirmation && scannedMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-bold text-black mb-4">Confirm Check-in</h2>
            <div className="space-y-3 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-black">{scannedMember.name}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Area</p>
                <p className="font-medium text-black">{scannedMember.area}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Parent/Guardian</p>
                <p className="font-medium text-black">{scannedMember.parent}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Birth Year</p>
                <p className="font-medium text-black">{scannedMember.birthYear}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelCheckIn}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black px-4 py-3 rounded-lg font-bold text-base active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCheckIn}
                className="flex-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg font-bold text-base active:scale-95 transition-all"
              >
                Confirm Check-in
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expiration Overlay */}
      {isExpired && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4">Session Expired</h2>
            <p className="text-gray-600 mb-6">
              Your temporary usher session has expired at 12:00 PM. You will be redirected to the teen portal.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsherTerminal;