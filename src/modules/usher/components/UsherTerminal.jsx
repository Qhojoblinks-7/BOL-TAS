import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';
import UsherHeader from './UsherHeader';
import TabNavigation from './TabNavigation';
import QRScanTab from './QRScanTab';
import BOLKeyTab from './BOLKeyTab';
import SearchTab from './SearchTab';
import SuccessOverlay from './SuccessOverlay';
import UndoButton from './UndoButton';

const UsherTerminal = () => {
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
  const scannerInstance = useRef(null);

  const mockMembers = [
    { id: 1, name: 'John Doe', area: 'Greenwood', parent: 'Michael Doe', birthYear: '2009' },
    { id: 2, name: 'John Smith', area: 'Riverside', parent: 'David Smith', birthYear: '2008' },
    { id: 3, name: 'Jane Doe', area: 'Hillcrest', parent: 'Sarah Doe', birthYear: '2010' },
  ];


  // Save attendance log to localStorage
  useEffect(() => {
    localStorage.setItem('attendanceLog', JSON.stringify(attendanceLog));
  }, [attendanceLog]);

  const onScanSuccess = (decodedText) => {
    setScanResult(decodedText);
    setShowSuccessOverlay(true);
    setTimeout(() => setShowSuccessOverlay(false), 3000);
    const now = new Date();
    const timestamp = now.getTime();
    const checkIn = { method: 'QR Scan', key: decodedText, time: now.toLocaleTimeString(), timestamp };
    setAttendanceLog(prev => [...prev, checkIn]);
    setLastCheckIn(checkIn);
    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 5000);
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
    if (bolKeyInput.length === 6 && bolKeyInput.includes('-')) {
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
    } else if (bolKeyInput.length < 6) {
      if (bolKeyInput.length === 2 && digit !== '-') {
        setBolKeyInput(prev => prev + '-' + digit);
      } else {
        setBolKeyInput(prev => prev + digit);
      }
    }
  };

  const handleSearch = () => {
    const results = mockMembers.filter(member =>
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

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-5 space-y-4 md:space-y-5">
        {/* QR SCAN TAB */}
        {activeTab === 'qr' && (
          <QRScanTab
            isScanning={isScanning}
            scanResult={scanResult}
            startScanning={startScanning}
            stopScanning={stopScanning}
            onScanSuccess={onScanSuccess}
            onScanFailure={onScanFailure}
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
      
    </div>
  );
};

export default UsherTerminal;