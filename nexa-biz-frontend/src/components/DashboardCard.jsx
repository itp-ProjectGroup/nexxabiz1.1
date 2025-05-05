import React from "react";

// Helper function to format numbers with K, M, B suffixes
const formatLargeNumber = (value) => {
  // If the value is already a string that starts with a currency symbol,
  // extract the numeric part
  let numericValue = value;
  let isNegative = false;
  
  if (typeof value === 'string') {
    // Check for negative values with currency symbols (e.g., -$100 or $-100)
    isNegative = value.includes('-');
    
    // Check if it starts with a currency symbol
    if (value.startsWith('$')) {
      numericValue = value.substring(1);
    }
    
    // Remove any commas and the negative sign for parsing
    numericValue = parseFloat(numericValue.replace(/,/g, '').replace(/-/g, ''));
    
    // Apply negative sign if it was negative
    if (isNegative) {
      numericValue = -numericValue;
    }
  } else if (typeof value === 'number') {
    // Handle negative numbers
    isNegative = value < 0;
    numericValue = Math.abs(value);
  }
  
  // Check if parsing was successful and it's actually a number
  if (isNaN(numericValue)) {
    return value;
  }
  
  // Get the absolute value for formatting
  const absValue = Math.abs(numericValue);
  const sign = isNegative ? '-' : '';
  
  // Format large numbers with appropriate suffixes
  if (absValue >= 1000000000) {
    return `${sign}$${(absValue / 1000000000).toFixed(2).replace(/\.00$/, '')}B`;
  } else if (absValue >= 1000000) {
    return `${sign}$${(absValue / 1000000).toFixed(2).replace(/\.00$/, '')}M`;
  } else if (absValue >= 1000) {
    return `${sign}$${(absValue / 1000).toFixed(2).replace(/\.00$/, '')}K`;
  }
  
  // If it's a currency value, preserve the $ sign
  return `${sign}$${absValue.toFixed(2)}`;
};

const DashboardCard = ({ title, value, chart }) => {
  // Format the value if it appears to be a monetary value or large number
  let formattedValue = value;
  
  // Check if value is a string that looks like a monetary value or a number
  if (
    (typeof value === 'string' && (value.includes('$') || !isNaN(parseFloat(value)))) || 
    typeof value === 'number'
  ) {
    formattedValue = formatLargeNumber(value);
  }

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg h-full border border-gray-700 transition-all hover:shadow-xl overflow-hidden">
      {chart ? (
        <div className="h-full w-full">
          {chart}
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2 text-gray-300 truncate">{title}</h3>
          <div className="text-2xl md:text-3xl font-bold text-blue-400 break-words">{formattedValue}</div>
        </>
      )}
    </div>
  );
};

export default DashboardCard;