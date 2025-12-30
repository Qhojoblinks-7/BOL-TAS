import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Keyboard, Search, CheckCircle, Undo, X } from 'lucide-react';

const UsherTerminal = () => {
  const [activeTab, setActiveTab] = useState('qr');
  const [scanResult, setScanResult] = useState('');
  const [bolKeyInput, setBolKeyInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [showUndo, setShowUndo] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const qrScannerRef = useRef(null);
  const scannerInstance = useRef(null);

  // Mock data for search
  const mockMembers = [
    { id: 1, name: 'John Doe', area: 'Greenwood', parent: 'Michael Doe', birthYear: '2009' },
    { id: 2, name: 'John Smith', area: 'Riverside', parent: 'David Smith', birthYear: '2008' },
    { id: 3, name: 'Jane Doe', area: 'Hillcrest', parent: 'Sarah Doe', birthYear: '2010' },
  ];

  // Load cached attendance log
  useEffect(() => {
    const cached = localStorage.getItem('attendanceLog');
    if (cached) {
      setAttendanceLog(JSON.parse(cached));
    }
  }, []);

  // Save attendance log to localStorage
  useEffect(() => {
    localStorage.setItem('attendanceLog', JSON.stringify(attendanceLog));
  }, [attendanceLog]);

  const onScanSuccess = (decodedText) => {
    setScanResult(decodedText);
    const timestamp = Date.now();
    const checkIn = { method: 'QR Scan', key: decodedText, time: new Date().toLocaleTimeString(), timestamp };
    setAttendanceLog(prev => [...prev, checkIn]);
    setLastCheckIn(checkIn);
    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 5000);
  };

  const onScanFailure = (error) => {
    console.warn(`QR scan error: ${error}`);
  };

  // Initialize QR scanner
  useEffect(() => {
    if (activeTab === 'qr' && !scannerInstance.current) {
      scannerInstance.current = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scannerInstance.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerInstance.current) {
        scannerInstance.current.clear();
        scannerInstance.current = null;
      }
    };
  }, [activeTab]);

  const handleBOLKeySubmit = () => {
    if (bolKeyInput.length === 6 && bolKeyInput.includes('-')) {
      const checkIn = { method: 'BOL-Key Entry', key: bolKeyInput, time: new Date().toLocaleTimeString(), timestamp: Date.now() };
      setAttendanceLog(prev => [...prev, checkIn]);
      setLastCheckIn(checkIn);
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
    const timestamp = Date.now();
    const checkIn = { method: 'Smart Search', name: member.name, area: member.area, parent: member.parent, time: new Date().toLocaleTimeString(), timestamp };
    setAttendanceLog(prev => [...prev, checkIn]);
    setLastCheckIn(checkIn);
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
    <div className="h-screen bg-[#d1e5e6] flex flex-col w-full relative mobile-only overflow-y-auto">
      {/* Background circle decorations */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(140, 24, 85)' }}></div>
      <div className="absolute top-40 right-10 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(248, 22%, 50%)' }}></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'hsl(186, 26%, 62%)' }}></div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-300 p-3 md:p-4">
        <h1 className="text-xl md:text-2xl font-bold text-black">Usher Terminal</h1>
        <p className="text-sm md:text-base text-gray-600">Church Attendance Check-in</p>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-300 flex">
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex-1 p-3 md:p-4 text-center transition-all duration-150 active:scale-95 touch-manipulation ${activeTab === 'qr' ? 'bg-[#d1e5e6] text-black' : 'text-gray-600 active:bg-gray-100'}`}
        >
          <QrCode size={20} className="mx-auto mb-1 md:mb-2" />
          <span className="text-sm md:text-base">QR Scan</span>
        </button>
        <button
          onClick={() => setActiveTab('key')}
          className={`flex-1 p-3 md:p-4 text-center transition-all duration-150 active:scale-95 touch-manipulation ${activeTab === 'key' ? 'bg-[#d1e5e6] text-black' : 'text-gray-600 active:bg-gray-100'}`}
        >
          <Keyboard size={20} className="mx-auto mb-1 md:mb-2" />
          <span className="text-sm md:text-base">BOL-Key</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 p-3 md:p-4 text-center transition-all duration-150 active:scale-95 touch-manipulation ${activeTab === 'search' ? 'bg-[#d1e5e6] text-black' : 'text-gray-600 active:bg-gray-100'}`}
        >
          <Search size={20} className="mx-auto mb-1 md:mb-2" />
          <span className="text-sm md:text-base">Search</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-3 md:p-4 space-y-3 md:space-y-4">
        {activeTab === 'qr' && (
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 md:p-6 shadow-lg border border-gray-300 text-center">
            <div id="qr-reader" className="mb-4 max-w-sm mx-auto"></div>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-black">QR Code Scanner</h3>
            {scanResult && (
              <div className="mt-4 p-3 md:p-4 bg-green-100 rounded-lg border border-green-300">
                <CheckCircle className="inline mr-2 text-green-600" size={20} />
                <span className="font-medium text-green-800 text-sm md:text-base">Checked in: {scanResult}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'key' && (
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 md:p-6 shadow-lg border border-gray-300">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-black">BOL-Key Entry</h3>
            <div className="mb-4">
              <div className="text-center p-3 md:p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <span className="text-xl md:text-2xl font-mono font-bold text-black">{bolKeyInput || 'YY-NNN'}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1,2,3,4,5,6,7,8,9,'-',0].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeypadPress(digit)}
                  className="bg-white border border-gray-300 p-3 md:p-4 text-lg md:text-xl font-bold hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all duration-100 touch-manipulation rounded min-h-[48px] md:min-h-[56px]"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => handleKeypadPress('backspace')}
                className="bg-red-100 border border-red-300 p-3 md:p-4 text-base md:text-lg font-bold hover:bg-red-50 active:bg-red-200 active:scale-95 transition-all duration-100 touch-manipulation rounded min-h-[48px] md:min-h-[56px]"
              >
                <X size={18} className="md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => handleKeypadPress('clear')}
                className="bg-yellow-100 border border-yellow-300 p-3 md:p-4 text-base md:text-lg font-bold hover:bg-yellow-50 active:bg-yellow-200 active:scale-95 transition-all duration-100 touch-manipulation col-span-2 rounded min-h-[48px] md:min-h-[56px]"
              >
                Clear
              </button>
            </div>
            <button
              onClick={handleBOLKeySubmit}
              disabled={bolKeyInput.length !== 6}
              className="w-full bg-[#d1e5e6] text-black px-4 py-3 rounded-lg hover:bg-opacity-80 active:bg-opacity-90 active:scale-95 transition-all duration-100 touch-manipulation disabled:opacity-50 font-bold text-base md:text-lg"
            >
              Check In
            </button>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 md:p-6 shadow-lg border border-gray-300">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-black">Smart Search</h3>
            <div className="space-y-3 md:space-y-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d1e5e6] focus:border-[#d1e5e6] text-base"
              />
              <button
                onClick={handleSearch}
                className="w-full bg-[#d1e5e6] text-black px-4 py-2 rounded-lg hover:bg-opacity-80 active:bg-opacity-90 active:scale-95 transition-all duration-100 touch-manipulation font-bold text-base md:text-lg"
              >
                Search
              </button>
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map(member => (
                    <div key={member.id} className="p-3 md:p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="font-bold text-black text-base md:text-lg">{member.name}</h4>
                      <p className="text-sm text-gray-600">Area: {member.area}</p>
                      <p className="text-sm text-gray-600">Parent: {member.parent}</p>
                      <button
                        onClick={() => handleCheckIn(member)}
                        className="mt-2 bg-green-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-600 active:bg-green-700 active:scale-95 transition-all duration-100 touch-manipulation font-bold text-sm md:text-base w-full"
                      >
                        Check In
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Undo Button */}
      {showUndo && (
        <div className="fixed top-3 md:top-4 right-3 md:right-4 bg-red-500 text-white p-3 md:p-4 rounded-lg shadow-lg border border-red-600 z-50">
          <button
            onClick={handleUndo}
            className="flex items-center font-bold text-sm md:text-base active:scale-95 transition-all duration-100 touch-manipulation"
          >
            <Undo size={18} className="mr-2 md:w-5 md:h-5" />
            Undo Last Check-in
          </button>
        </div>
      )}

      {/* Attendance Log */}
      <div className="bg-white border-t border-gray-300 p-3 md:p-4 max-h-32 md:max-h-40 overflow-y-auto">
        <h3 className="font-bold mb-2 text-black text-base md:text-lg">Recent Check-ins</h3>
        <div className="space-y-1">
          {attendanceLog.slice(-5).reverse().map((log, index) => (
            <div key={index} className="text-xs md:text-sm text-gray-600 border-b border-gray-200 pb-1">
              {log.time} - {log.method}: {log.key || log.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsherTerminal;