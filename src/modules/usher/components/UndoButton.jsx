import React from 'react';
import { Undo } from 'lucide-react';

const UndoButton = ({ showUndo, handleUndo }) => {
  return (
    showUndo && (
      <div className="fixed bottom-24 md:bottom-32 right-4 md:right-5 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-xl border-2 border-red-600 z-50 active:scale-95 transition-all duration-100">
        <button
          onClick={handleUndo}
          className="flex items-center font-bold text-sm md:text-base gap-2"
        >
          <Undo size={18} />
          <span className="hidden md:inline">Undo</span>
        </button>
      </div>
    )
  );
};

export default UndoButton;