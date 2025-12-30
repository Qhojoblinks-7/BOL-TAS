import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Keyboard, Search, CheckCircle, Undo, X, LogOut, Camera } from 'lucide-react';

const UsherTerminal = () => {
  const [activeTab, setActiveTab] = useState('qr');
  const [scanResult, setScanResult] = useState('');
  const [bolKeyInput, setBolKeyInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [attendanceLog, setAttendanceLog] = useState([]);
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
    setShowSuccessOverlay(true);
    setTimeout(() => setShowSuccessOverlay(false), 3000);
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
      const checkIn = { method: 'BOL-Key Entry', key: bolKeyInput, time: new Date().toLocaleTimeString(), timestamp: Date.now() };
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
    const timestamp = Date.now();
    const checkIn = { method: 'Smart Search', name: member.name, area: member.area, parent: member.parent, time: new Date().toLocaleTimeString(), timestamp };
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
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b-2 border-[hsl(186,70%,34%)]/30 p-4 md:p-5 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black">Usher Terminal</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5">Church Attendance Check-in</p>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('userLoggedOut'))}
          className="p-2.5 rounded-full hover:bg-red-50 transition-colors text-red-600 hover:text-red-700 active:scale-95"
          title="Logout"
        >
          <LogOut size={24} />
        </button>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 flex shadow-sm sticky top-[72px] z-9">
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex-1 p-3 md:p-4 text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1 border-b-2 ${
            activeTab === 'qr'
              ? 'border-[hsl(186,70%,34%)]/80 bg-[hsl(186,70%,34%)]/5 text-black'
              : 'border-transparent text-gray-600 hover:bg-gray-50'
          }`}
        >
          <QrCode size={22} />
          <span className="text-xs md:text-sm font-medium">QR Scan</span>
        </button>
        <button
          onClick={() => setActiveTab('key')}
          className={`flex-1 p-3 md:p-4 text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1 border-b-2 ${
            activeTab === 'key'
              ? 'border-[hsl(186,70%,34%)]/80 bg-[hsl(186,70%,34%)]/5 text-black'
              : 'border-transparent text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Keyboard size={22} />
          <span className="text-xs md:text-sm font-medium">BOL-Key</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 p-3 md:p-4 text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1 border-b-2 ${
            activeTab === 'search'
              ? 'border-[hsl(186,70%,34%)]/80 bg-[hsl(186,70%,34%)]/5 text-black'
              : 'border-transparent text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Search size={22} />
          <span className="text-xs md:text-sm font-medium">Search</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-5 space-y-4 md:space-y-5">
        {/* QR SCAN TAB */}
        {activeTab === 'qr' && (
          <>
            {/* Camera Feed Box */}
            {isScanning && (
              <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200 flex items-center justify-center">
                <div className="w-full max-w-sm">
                  <h4 className="text-lg font-bold text-black mb-4 text-center">Live Camera Feed</h4>
                  <div id="qr-reader" className="rounded-lg overflow-hidden border-2 border-[hsl(186,70%,34%)]/30 mx-auto"></div>
                </div>
              </div>
            )}

            {/* Control Box */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <h3 className="text-xl md:text-2xl font-bold text-black mb-4">Scan QR Code</h3>
              <p className="text-sm md:text-base text-gray-600 mb-5">Position the QR code within the frame to check in attendees.</p>
              <div className="space-y-3">
                <button 
                  onClick={isScanning ? stopScanning : startScanning}
                  className="w-full bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 md:py-4 rounded-lg active:scale-95 transition-all duration-100 font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Camera size={20} />
                  {isScanning ? 'Stop Scanning' : 'Start Camera Scan'}
                </button>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const html5QrCode = new Html5Qrcode("qr-reader");
                        html5QrCode.scanFile(file, true)
                          .then(onScanSuccess)
                          .catch(onScanFailure);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg transition-colors font-medium text-base">
                    Upload Image
                  </button>
                </div>
              </div>
            </div>

            {/* Result Box */}
            {scanResult && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 md:p-6 shadow-lg border-2 border-green-300 animate-pulse">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={28} />
                  <div>
                    <p className="text-xs md:text-sm text-green-700 font-semibold">Successfully Checked In</p>
                    <p className="text-base md:text-lg font-bold text-green-900">{scanResult}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* BOL-KEY TAB */}
        {activeTab === 'key' && (
          <>
            {/* Input Display */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl md:text-2xl font-bold text-black mb-4">BOL-Key Entry</h3>
              <div className="bg-gradient-to-r from-[hsl(186,70%,34%)]/5 to-[hsl(186,70%,34%)]/10 border-2 border-[hsl(186,70%,34%)]/30 p-6 md:p-8 rounded-lg text-center mb-6">
                <p className="text-xs md:text-sm text-gray-600 mb-2">Enter your 6-digit BOL-Key</p>
                <span className="text-4xl md:text-5xl font-mono font-bold text-[hsl(186,70%,34%)] tracking-widest">{bolKeyInput || '••-•••'}</span>
              </div>
            </div>

            {/* Keypad */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200">
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
                {[1,2,3,4,5,6,7,8,9,'-',0].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeypadPress(digit)}
                    className="bg-gradient-to-b from-gray-50 to-gray-100 border-2 border-gray-300 p-4 md:p-5 text-xl md:text-2xl font-bold hover:bg-gradient-to-b hover:from-gray-100 hover:to-gray-200 active:bg-gray-200 active:scale-95 transition-all duration-100 rounded-lg min-h-[56px] md:min-h-[64px] shadow-sm hover:shadow-md"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={() => handleKeypadPress('backspace')}
                  className="bg-gradient-to-b from-red-100 to-red-200 border-2 border-red-400 p-4 md:p-5 text-lg font-bold hover:from-red-200 hover:to-red-300 active:bg-red-300 active:scale-95 transition-all duration-100 rounded-lg min-h-[56px] md:min-h-[64px] shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={() => handleKeypadPress('clear')}
                  className="col-span-2 bg-gradient-to-b from-yellow-100 to-yellow-200 border-2 border-yellow-400 p-4 md:p-5 text-lg font-bold hover:from-yellow-200 hover:to-yellow-300 active:bg-yellow-300 active:scale-95 transition-all duration-100 rounded-lg min-h-[56px] md:min-h-[64px] shadow-sm hover:shadow-md"
                >
                  Clear All
                </button>
              </div>
              <button
                onClick={handleBOLKeySubmit}
                disabled={bolKeyInput.length !== 6}
                className="w-full bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-4 md:py-5 rounded-lg active:scale-95 transition-all duration-100 font-bold text-base md:text-lg shadow-md hover:shadow-lg disabled:shadow-none"
              >
                Check In
              </button>
            </div>
          </>
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <>
            {/* Search Box */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl md:text-2xl font-bold text-black mb-4">Smart Search</h3>
              <div className="space-y-3">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by member name..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[hsl(186,70%,34%)] focus:ring-2 focus:ring-[hsl(186,70%,34%)]/20 text-base transition-all"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white px-4 py-3 rounded-lg active:scale-95 transition-all duration-100 font-bold text-base shadow-md hover:shadow-lg"
                >
                  Search Members
                </button>
              </div>
            </div>

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map(member => (
                  <div key={member.id} className="bg-white rounded-xl p-4 md:p-5 shadow-md border border-gray-200 hover:shadow-lg hover:border-[hsl(186,70%,34%)]/50 transition-all">
                    <div className="mb-3">
                      <h4 className="font-bold text-lg text-black">{member.name}</h4>
                      <p className="text-sm text-gray-600">Area: <span className="font-medium text-gray-800">{member.area}</span></p>
                      <p className="text-sm text-gray-600">Parent: <span className="font-medium text-gray-800">{member.parent}</span></p>
                    </div>
                    <button
                      onClick={() => handleCheckIn(member)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2.5 rounded-lg active:scale-95 transition-all duration-100 font-bold text-sm shadow-md hover:shadow-lg"
                    >
                      Check In
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Success Overlay */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-2xl animate-bounce-in max-w-sm mx-4 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle size={64} className="text-green-500 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">Scan Successful!</h2>
            <p className="text-xl md:text-2xl font-semibold text-gray-800">Marked Present</p>
          </div>
        </div>
      )}

      {/* Undo Button */}
      {showUndo && (
        <div className="fixed bottom-24 md:bottom-32 right-4 md:right-5 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-xl border-2 border-red-600 z-50 active:scale-95 transition-all duration-100">
          <button
            onClick={handleUndo}
            className="flex items-center font-bold text-sm md:text-base gap-2"
          >
            <Undo size={18} />
            <span className="hidden md:inline">Undo</span>
          </button>
        </div>
      )}
      
    </div>
  );
};

export default UsherTerminal;