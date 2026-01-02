import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { QrCode, Key, X, AlertCircle } from 'lucide-react';
import QRScanTab from '../../usher/components/QRScanTab';
import AdminBOLKeyTab from './AdminBOLKeyTab';
import SuccessOverlay from '../../usher/components/SuccessOverlay';
import UndoButton from '../../usher/components/UndoButton';
import mockDatabase from '../../../data/mockDatabase.json';
import { useAddAttendanceRecordMutation } from '../../../services/attendanceApi';

const AdminUsherTerminal = () => {
  const navigate = useNavigate();

  // Use mock data for demonstration
  const churchMembers = mockDatabase.churchMembers;
  const users = mockDatabase.users;
  const [addAttendanceRecord] = useAddAttendanceRecordMutation();

  const [activeTab, setActiveTab] = useState('qr');
  const [scanResult, setScanResult] = useState('');
  const [bolKeyInput, setBolKeyInput] = useState('');
  const [attendanceLog, setAttendanceLog] = useState(() => {
    const cached = localStorage.getItem('adminAttendanceLog');
    return cached ? JSON.parse(cached) : [];
  });
  const [showUndo, setShowUndo] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [scannedMember, setScannedMember] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [showScanErrorModal, setShowScanErrorModal] = useState(false);
  const scannerInstance = useRef(null);

  // Save attendance log to localStorage (separate from regular usher)
  useEffect(() => {
    localStorage.setItem('adminAttendanceLog', JSON.stringify(attendanceLog));
  }, [attendanceLog]);

  // Listen for global search events
  useEffect(() => {
    const handleGlobalSearch = (event) => {
      if (event.detail.page === 'check-in-terminal') {
        const searchTerm = event.detail.searchTerm;
        if (searchTerm.trim()) {
          const results = churchMembers.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.personalCode.includes(searchTerm) ||
            member.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.parent.toLowerCase().includes(searchTerm.toLowerCase())
          );
          navigate('/search-results', { state: { searchResults: results } });
        }
      }
    };

    window.addEventListener('globalSearch', handleGlobalSearch);
    return () => window.removeEventListener('globalSearch', handleGlobalSearch);
  }, [churchMembers, navigate]);

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
      setScanError('Invalid QR code format. Expected NNNNN format.');
      setShowScanErrorModal(true);
      return;
    }

    // Step 2: Member Lookup
    const member = lookupMember(decodedText);
    if (!member) {
      setScanError('Member not found. Please check the QR code or try manual entry.');
      setShowScanErrorModal(true);
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



  const handleUndo = () => {
    if (lastCheckIn) {
      setAttendanceLog(prev => prev.filter(item => item.timestamp !== lastCheckIn.timestamp));
      setLastCheckIn(null);
      setShowUndo(false);
    }
  };

  const tabs = [
    { id: 'qr', label: 'QR Scan', icon: QrCode },
    { id: 'key', label: 'BOL-Key', icon: Key }
  ];

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Usher Terminal</h1>
          <p className="text-sm text-gray-600 mt-1">Process attendance check-ins and manage service operations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Today's Check-ins</p>
            <p className="text-2xl font-bold text-[hsl(186,70%,34%)]">{attendanceLog.length}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 shadow-lg">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[hsl(186,70%,34%)] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/20'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* QR SCAN TAB */}
        {activeTab === 'qr' && (
          <QRScanTab
            isScanning={isScanning}
            scanResult={scanResult}
            scanError={null}
            startScanning={startScanning}
            stopScanning={stopScanning}
            onScanSuccess={onScanSuccess}
            onScanFailure={onScanFailure}
            onRetry={() => {
              setScanError(null);
              setScanResult('');
              setShowScanErrorModal(false);
            }}
          />
        )}

        {/* BOL-KEY TAB */}
        {activeTab === 'key' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <AdminBOLKeyTab
              bolKeyInput={bolKeyInput}
              setBolKeyInput={setBolKeyInput}
              handleBOLKeySubmit={handleBOLKeySubmit}
            />
          </div>
        )}

      </div>

      {/* Success Overlay */}
      <SuccessOverlay showSuccessOverlay={showSuccessOverlay} />

      {/* Undo Button */}
      <UndoButton showUndo={showUndo} handleUndo={handleUndo} />

      {/* Confirmation Dialog */}
      {showConfirmation && scannedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-black mb-2">QR Code Detected</h2>
            <p className="text-lg font-mono text-[hsl(186,70%,34%)] mb-4">{scanResult}</p>
            <p className="text-gray-600 mb-4">Please confirm member details to complete check-in.</p>
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
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCheckIn}
                className="flex-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
              >
                Confirm Check-in
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scan Error Modal */}
      {showScanErrorModal && scanError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-black mb-4">Scan Error</h2>
              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Scanned Code</p>
                <p className="font-medium text-black font-mono">{scanResult}</p>
              </div>
              <p className="text-gray-600 mb-6">{scanError}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowScanErrorModal(false);
                    setScanError(null);
                    setScanResult('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setShowScanErrorModal(false)}
                  className="flex-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsherTerminal;