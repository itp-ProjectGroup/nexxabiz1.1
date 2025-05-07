import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

const FinSearchBar = ({ data, onSearch, placeholder = "Search by customer name..." }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  // Extract unique customer names from data
  const getUniqueCustomers = () => {
    if (!data || !data.length) return [];
    
    // Create a Set to store unique company names
    const uniqueCustomers = new Set();
    
    data.forEach(item => {
      if (item.company_name) {
        uniqueCustomers.add(item.company_name);
      }
    });
    
    return Array.from(uniqueCustomers);
  };

  // Filter suggestions based on input
  useEffect(() => {
    if (query) {
      const uniqueCustomers = getUniqueCustomers();
      const filtered = uniqueCustomers.filter(customer => 
        customer.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, data]);

  // Handle clicks outside the component to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    
    // If input is cleared, reset the search
    if (!value) {
      onSearch('');
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="w-96 max-w-md relative pt-2">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full px-4 py-1.5 rounded-full bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-600 text-white"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinSearchBar;