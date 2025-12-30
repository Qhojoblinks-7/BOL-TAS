import React from 'react';
import { Search } from 'lucide-react';

const SearchTab = ({ searchQuery, setSearchQuery, searchResults, handleSearch, handleCheckIn }) => {
  return (
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
  );
};

export default SearchTab;