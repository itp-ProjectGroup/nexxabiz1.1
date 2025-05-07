import React from "react";

// Helper function to format numbers with K, M, B suffixes
const formatLargeNumber = (value) => {
  let numericValue = value;
  let isNegative = false;

  if (typeof value === 'string') {
    isNegative = value.includes('-');

    if (value.startsWith('$')) {
      numericValue = value.substring(1);
    }

    numericValue = parseFloat(numericValue.replace(/,/g, '').replace(/-/g, ''));

    if (isNegative) {
      numericValue = -numericValue;
    }
  } else if (typeof value === 'number') {
    isNegative = value < 0;
    numericValue = Math.abs(value);
  }

  if (isNaN(numericValue)) {
    return value;
  }

  const absValue = Math.abs(numericValue);
  const sign = isNegative ? '-' : '';

  if (absValue >= 1000000000) {
    return `${sign}$${(absValue / 1000000000).toFixed(2).replace(/\.00$/, '')}B`;
  } else if (absValue >= 1000000) {
    return `${sign}$${(absValue / 1000000).toFixed(2).replace(/\.00$/, '')}M`;
  } else if (absValue >= 1000) {
    return `${sign}$${(absValue / 1000).toFixed(2).replace(/\.00$/, '')}K`;
  }

  return `${sign}$${absValue.toFixed(2)}`;
};

const DashboardCard = ({ 
  title, 
  value, 
  chart, 
  icon, 
  description,
  disableCurrencyFormatting = false,
  onClick 
}) => {
  let formattedValue = value;

  if (!disableCurrencyFormatting && (
    (typeof value === 'string' && (value.includes('$') || !isNaN(parseFloat(value)))) ||
    typeof value === 'number'
  )) {
    formattedValue = formatLargeNumber(value);
  }

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer bg-gray-800 text-white p-4 rounded-lg shadow-lg h-full border border-gray-700 transition-all hover:shadow-xl overflow-hidden`}
    >
      {chart ? (
        <div className="h-full w-full">
          {chart}
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2 text-gray-300 truncate">{title}</h3>
          <div
            className={`text-2xl md:text-3xl font-bold break-words ${
              (typeof value === 'string' && value.includes('-')) || (typeof value === 'number' && value < 0)
                ? 'text-red-500'
                : 'text-blue-400'
            }`}
          >
            {formattedValue}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardCard;
