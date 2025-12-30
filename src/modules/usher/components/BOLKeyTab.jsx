import React from 'react';
import { X } from 'lucide-react';

const BOLKeyTab = ({ bolKeyInput, handleKeypadPress, handleBOLKeySubmit }) => {
  return (
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
  );
};

export default BOLKeyTab;