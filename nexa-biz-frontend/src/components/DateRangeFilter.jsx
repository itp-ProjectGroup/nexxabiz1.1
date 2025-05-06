import { useState } from 'react';

const DateRangeFilter = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilter = () => {
    onFilterChange({ startDate, endDate });
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    onFilterChange({ startDate: '', endDate: '' });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter by Date
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-700 shadow-lg rounded-lg p-4 z-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleClearFilter}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded"
            >
              Clear
            </button>
            <button
              onClick={handleApplyFilter}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;