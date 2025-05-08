import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BarChartComponent = ({ orders = [], returns = [] }) => {
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState("monthly");
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    setChartLoading(true);

    const getDateKey = (date) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;

      if (chartPeriod === "weekly") {
        const startOfYear = new Date(d.getFullYear(), 0, 1);
        const days = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        return `Week ${weekNumber} ${d.getFullYear()}`;
      }

      if (chartPeriod === "monthly") {
        return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      }

      return `${d.getFullYear()}`;
    };

    const groupData = () => {
      const dataMap = new Map();

      // Process orders
      orders.forEach(order => {
        const dateKey = getDateKey(order.od_date);
        if (!dateKey) return;

        if (!dataMap.has(dateKey)) {
          dataMap.set(dateKey, { date: dateKey, orders: 0, returns: 0 });
        }
        const entry = dataMap.get(dateKey);
        entry.orders += 1;
      });

      // Process returns
      returns.forEach(ret => {
        const dateKey = getDateKey(ret.ret_date);
        if (!dateKey) {
          console.warn("Skipping return with invalid ret_date:", ret);
          return;
        }

        if (!dataMap.has(dateKey)) {
          dataMap.set(dateKey, { date: dateKey, orders: 0, returns: 0 });
        }
        const entry = dataMap.get(dateKey);
        entry.returns += 1;
      });

      let result = Array.from(dataMap.values());

      if (chartPeriod === "weekly") {
        const dateInfo = new Map();
        [...orders, ...returns].forEach(item => {
          const date = item.od_date || item.ret_date;
          const d = new Date(date);
          if (isNaN(d.getTime())) return;

          const startOfYear = new Date(d.getFullYear(), 0, 1);
          const days = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000));
          const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
          const key = `Week ${weekNumber} ${d.getFullYear()}`;

          if (!dateInfo.has(key)) {
            dateInfo.set(key, { year: d.getFullYear(), weekNum: weekNumber });
          }
        });

        result.sort((a, b) => {
          const aInfo = dateInfo.get(a.date) || { year: 0, weekNum: 0 };
          const bInfo = dateInfo.get(b.date) || { year: 0, weekNum: 0 };
          if (aInfo.year !== bInfo.year) return aInfo.year - bInfo.year;
          return aInfo.weekNum - bInfo.weekNum;
        });
      } else if (chartPeriod === "monthly") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        result.sort((a, b) => {
          const [aMonth, aYear] = a.date.split(' ');
          const [bMonth, bYear] = b.date.split(' ');
          if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
          return months.indexOf(aMonth) - months.indexOf(bMonth);
        });
      } else {
        result.sort((a, b) => parseInt(a.date) - parseInt(b.date));
      }

      return result;
    };

    if (orders.length || returns.length) {
      const chartData = groupData();
      console.log("Chart Data:", chartData); // Debug log
      setChartData(chartData);
    } else {
      setChartData([]);
    }

    setChartLoading(false);
  }, [orders, returns, chartPeriod]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const orders = payload.find(p => p.dataKey === 'orders')?.value || 0;
      const returns = payload.find(p => p.dataKey === 'returns')?.value || 0;

      return (
        <div className="bg-gray-900 p-3 border border-gray-700 rounded-lg shadow-md">
          <p className="text-gray-600 font-semibold text-xs">{label}</p>
          <p className="text-blue-500 text-xs">Orders: {orders}</p>
          <p className="text-red-500 text-xs">Returns: {returns}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 rounded-xl shadow-lg p-0 border border-gray-800">
      <div className="mb-4 px-4 pt-4">
        <h3 className="text-lg font-semibold text-gray-400 text-center">Order and Return Overview</h3>
        <div className="flex justify-center space-x-1.5 mt-2">
          <button
            onClick={() => setChartPeriod("weekly")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              chartPeriod === "weekly"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setChartPeriod("monthly")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              chartPeriod === "monthly"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setChartPeriod("yearly")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              chartPeriod === "yearly"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0" style={{ minHeight: "200px" }}>
        {chartLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">Loading chart data...</p>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 15 }}
            >
              
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Roboto' }}
                axisLine={{ stroke: '#d1d5db' }}
                angle={-30}
                textAnchor="end"
                height={40}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Roboto' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickFormatter={(value) => Math.round(value)}
                allowDecimals={false}
                label={{
                  value: 'Count',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 0,
                  fill: '#6b7280',
                  fontSize: 12,
                  fontFamily: 'Roboto',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                formatter={(value) => (
                  <span style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'Roboto' }}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                )}
              />
              <Bar
                dataKey="orders"
                fill="#3b82f6"
                name="Orders"
                radius={[3, 3, 0, 0]}
                barSize={20}
                opacity={0.85}
              />
              <Bar
                dataKey="returns"
                fill="#ef4444"
                name="Returns"
                radius={[3, 3, 0, 0]}
                barSize={20}
                opacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div prospectively="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">No data available for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChartComponent;