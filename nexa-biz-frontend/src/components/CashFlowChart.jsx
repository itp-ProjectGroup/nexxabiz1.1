import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CashFlowChart = ({ payments = [], orders = [], products = [] }) => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);

  // Process data based on the selected period
  useEffect(() => {
    setLoading(true);
    
    // Helper function to calculate expenses for an order
    const calculateExpenseTotal = (order) => {
      if (!products || !Array.isArray(order.od_items)) return 0;
      
      return order.od_items.reduce((sum, item) => {
        const product = products.find(p => p.manufacturingID === item.manufacturingID);
        const price = product?.ManufacturingCost || 0;
        return sum + price * item.qty;
      }, 0);
    };
    
    // Get date parts based on period
    const getDateKey = (date) => {
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      
      // For weekly: YYYY-WW (year-week number)
      if (period === "weekly") {
        const startOfYear = new Date(d.getFullYear(), 0, 1);
        const days = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        // Only show "Week X" without the year
        return `Week ${weekNumber}`;
      }
      
      // For monthly: MMM YYYY
      if (period === "monthly") {
        return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      }
      
      // For yearly: YYYY
      return `${d.getFullYear()}`;
    };

    // Group data by date
    const groupData = () => {
      // Create a map to store aggregated data
      const dataMap = new Map();
      
      // Group income (payments)
      payments.forEach(payment => {
        const dateKey = getDateKey(payment.createdAt);
        if (!dateKey) return;
        
        if (!dataMap.has(dateKey)) {
          dataMap.set(dateKey, { date: dateKey, income: 0, expenses: 0 });
        }
        const entry = dataMap.get(dateKey);
        entry.income += payment.paymentAmount;
      });
      
      // Group expenses (from orders)
      orders.forEach(order => {
        const dateKey = getDateKey(order.createdAt || order.od_date);
        if (!dateKey) return;
        
        if (!dataMap.has(dateKey)) {
          dataMap.set(dateKey, { date: dateKey, income: 0, expenses: 0 });
        }
        
        const expenseAmount = calculateExpenseTotal(order);
        const entry = dataMap.get(dateKey);
        entry.expenses += expenseAmount;
      });
      
      // Convert map to array and sort by date
      let result = Array.from(dataMap.values());
      
      // Store original date information for tooltip
      if (period === "weekly") {
        // Save the original data for sorting
        const dateInfo = new Map();
        
        // Process all entries for weekly - adding year info for sorting
        payments.forEach(payment => {
          const d = new Date(payment.createdAt);
          if (isNaN(d.getTime())) return;
          
          const startOfYear = new Date(d.getFullYear(), 0, 1);
          const days = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000));
          const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
          const key = `Week ${weekNumber}`;
          
          if (!dateInfo.has(key)) {
            dateInfo.set(key, { year: d.getFullYear(), weekNum: weekNumber });
          }
        });
        
        // Sort based on hidden year and week number
        result.sort((a, b) => {
          const aInfo = dateInfo.get(a.date) || { year: 0, weekNum: 0 };
          const bInfo = dateInfo.get(b.date) || { year: 0, weekNum: 0 };
          
          if (aInfo.year !== bInfo.year) return aInfo.year - bInfo.year;
          return aInfo.weekNum - bInfo.weekNum;
        });
      } else if (period === "monthly") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        result.sort((a, b) => {
          const [aMonth, aYear] = a.date.split(' ');
          const [bMonth, bYear] = b.date.split(' ');
          
          if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
          return months.indexOf(aMonth) - months.indexOf(bMonth);
        });
      } else {
        // Yearly is simple
        result.sort((a, b) => parseInt(a.date) - parseInt(b.date));
      }
      
      return result;
    };

    // Only process if we have data
    if (payments.length && orders.length && products.length) {
      const chartData = groupData();
      setData(chartData);
    } else {
      setData([]);
    }
    
    setLoading(false);
  }, [payments, orders, products, period]);

  // Custom tooltip to display more information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const income = payload[0].value;
      const expenses = payload[1].value;
      const profit = income - expenses;

      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
          <p className="text-white font-semibold">{label}</p>
          <p className="text-blue-400">Income: ${income.toFixed(2)}</p>
          <p className="text-red-400">Expenses: ${expenses.toFixed(2)}</p>
          <p className={`font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-500'}`}>
            Profit: ${profit.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Cash Flow Overview</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => handlePeriodChange("weekly")}
            className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${
              period === "weekly" 
                ? "bg-blue-500 text-white shadow-md" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => handlePeriodChange("monthly")}
            className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${
              period === "monthly" 
                ? "bg-blue-500 text-white shadow-md" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handlePeriodChange("yearly")}
            className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${
              period === "yearly" 
                ? "bg-blue-500 text-white shadow-md" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: "250px" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Loading chart data...</p>
          </div>
        ) : data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#9ca3af' }} 
                axisLine={{ stroke: '#444' }}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                tick={{ fill: '#9ca3af' }} 
                axisLine={{ stroke: '#444' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => <span style={{ color: '#e5e7eb' }}>{value}</span>}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#3b82f6' }}
                activeDot={{ r: 6, stroke: '#1e40af', strokeWidth: 2 }}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#ef4444' }}
                activeDot={{ r: 6, stroke: '#b91c1c', strokeWidth: 2 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No data available for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashFlowChart;