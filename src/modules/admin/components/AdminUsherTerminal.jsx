import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { QrCode, Key, X, AlertCircle } from 'lucide-react';
import QRScanTab from '../../usher/components/QRScanTab';
import AdminBOLKeyTab from './AdminBOLKeyTab';
import SuccessOverlay from '../../usher/components/SuccessOverlay';
import UndoButton from '../../usher/components/UndoButton';
import { useGetChurchMembersQuery } from '../../../services/membersApi';
import { useGetUsersQuery } from '../../../services/usersApi';
import { useAddAttendanceRecordMutation } from '../../../services/attendanceApi';

const AdminUsherTerminal = () => {
  // RTK Query hooks
  const { data: churchMembers = [] } = useGetChurchMembersQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [addAttendanceRecord] = useAddAttendanceRecordMutation();

  const [activeTab, setActiveTab] = useState('qr');
  const [scanResult, setScanResult] = useState('');
  const [bolKeyInput, setBolKeyInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
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
      if (event.detail.page === 'usher') {
        const searchTerm = event.detail.searchTerm;
        if (searchTerm.trim()) {
          const results = churchMembers.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.personalCode.includes(searchTerm) ||
            member.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.parent.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
      }
    };

    window.addEventListener('globalSearch', handleGlobalSearch);
    return () => window.removeEventListener('globalSearch', handleGlobalSearch);
  }, [churchMembers]);

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

      {/* Search Results Table */}
      {searchResults.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="bg-[hsl(186,70%,34%)]/5 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Search Results ({searchResults.length})</h3>
            <p className="text-sm text-gray-600">Click on a member to view details and check them in</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Personal Code</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Area</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Parent</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Birth Year</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((member, index) => (
                  <tr key={member.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[hsl(186,70%,34%)]/5 transition-colors`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{member.personalCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.area}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.parent}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.birthYear}</td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowMemberDetails(true);
                        }}
                        className="px-3 py-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white text-xs rounded transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* QR SCAN TAB */}
        {activeTab === 'qr' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
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
          </div>
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
            <h2 className="text-2xl font-bold text-black mb-4">Confirm Check-in</h2>
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

      {/* Member Details Modal */}
      {showMemberDetails && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Member Details</h2>
              <button
                onClick={() => setShowMemberDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Member Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Member Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedMember.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Personal Code</p>
                    <p className="font-medium font-mono">{selectedMember.personalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Area</p>
                    <p className="font-medium">{selectedMember.area}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Birth Year</p>
                    <p className="font-medium">{selectedMember.birthYear}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Parent/Guardian</p>
                    <p className="font-medium">{selectedMember.parent}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowMemberDetails(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
                >
                  Close
                </button>
                <button
                  onClick={async () => {
                    // Find user by personal code
                    const user = users.find(u => u.personalCode === selectedMember.personalCode);
                    if (user) {
                      try {
                        const record = await addAttendanceRecord({
                          userId: user.id,
                          method: 'Manual Check-in',
                          service: 'Sunday Service',
                          location: 'Main Sanctuary'
                        }).unwrap();
                        setAttendanceLog(prev => [...prev, record]);
                        setLastCheckIn(record);
                        setShowSuccessOverlay(true);
                        setTimeout(() => setShowSuccessOverlay(false), 3000);
                        setShowUndo(true);
                        setTimeout(() => setShowUndo(false), 5000);
                        setShowMemberDetails(false);
                        setSearchResults([]);
                      } catch (error) {
                        console.error('Failed to add attendance record:', error);
                      }
                    }
                  }}
                  className="flex-1 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg font-bold transition-all active:scale-95"
                >
                  Confirm Presence
                </button>
              </div>
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