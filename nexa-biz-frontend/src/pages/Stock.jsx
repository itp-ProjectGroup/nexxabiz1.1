import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [returnCount, setReturnCount] = useState(0); // New state for return count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const transformedData = data.map(product => ({
          id: product._id,
          productName: product.productName,
          quantity: product.quantity || 0,
          price: product.sellingPrice || 0,
          manufacturingDate: product.manufacturingDate || new Date().toISOString(),
          lastUpdated: product.updatedAt || new Date().toISOString()
        }));

        setStockData(transformedData);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError(`Failed to fetch stock data: ${err.message}`);
      }
    };

    const fetchReturns = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/returns');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Calculate total return count by summing quantities in od_items
        const totalReturns = data.reduce((sum, returnItem) => {
          const itemQuantities = returnItem.od_items.reduce((itemSum, item) => itemSum + item.qty, 0);
          return sum + itemQuantities;
        }, 0);
        setReturnCount(totalReturns);
      } catch (err) {
        console.error('Error fetching return data:', err);
        setError(`Failed to fetch return data: ${err.message}`);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchStockData(), fetchReturns()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleExportCSV = () => {
    const csvData = stockData.map(item => ({
      'Product Name': item.productName,
      'Quantity': item.quantity,
      'Price': item.price,
      'Added Date': item.manufacturingDate,
      'Last Updated': new Date(item.lastUpdated).toLocaleDateString()
    }));

    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stock_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    try {
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text("Stock Report", 105, 15, { align: "center" });

      doc.setFontSize(14);
      doc.text("Stock Details", 14, 30);

      const headers = ["Product Name", "Quantity", "Price", "Added Date", "Last Updated"];
      const columnWidths = [60, 25, 25, 40, 40];
      let yPos = 40;

      let xPos = 10;
      headers.forEach((header, i) => {
        doc.text(header, xPos, yPos);
        xPos += columnWidths[i];
      });

      yPos += 5;
      doc.line(10, yPos, 200, yPos);

      stockData.forEach((item, index) => {
        yPos += 10;
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }

        xPos = 10;
        doc.text(item.productName.substring(0, 25), xPos, yPos);
        xPos += columnWidths[0];
        doc.text(item.quantity.toString(), xPos, yPos);
        xPos += columnWidths[1];
        doc.text(`$${item.price.toFixed(2)}`, xPos, yPos);
        xPos += columnWidths[2];
        const addedDate = new Date(item.manufacturingDate).toLocaleDateString();
        doc.text(addedDate, xPos, yPos);
        xPos += columnWidths[3];
        const updatedDate = new Date(item.lastUpdated).toLocaleDateString();
        doc.text(updatedDate, xPos, yPos);
      });

      yPos += 20;
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.text(`Total Products: ${stockData.length}`, 14, yPos);
      yPos += 10;
      const totalQuantity = stockData.reduce((sum, item) => sum + item.quantity, 0);
      doc.text(`Total Quantity: ${totalQuantity}`, 14, yPos);
      yPos += 10;
      const totalValue = stockData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      doc.text(`Total Inventory Value: $${totalValue.toFixed(2)}`, 14, yPos);
      yPos += 10;
      doc.text(`Total Returns: ${returnCount}`, 14, yPos);
      yPos += 10;
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, yPos);

      doc.save("stock_report.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const getProductsByMonth = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyCounts = {};
    monthNames.forEach(month => {
      monthlyCounts[month] = 0;
    });

    stockData.forEach(product => {
      const date = new Date(product.manufacturingDate);
      const month = monthNames[date.getMonth()];
      monthlyCounts[month]++;
    });

    return {
      labels: monthNames,
      counts: monthNames.map(month => monthlyCounts[month])
    };
  };

  const calculateMetrics = () => {
    const totalProductCount = stockData.reduce((sum, item) => sum + item.quantity, 0);
    const targetRevenue = stockData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      totalProductCount,
      targetRevenue,
      returnCount
    };
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-300">Loading stock data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4">
      <div className="bg-red-900/80 border border-red-800 text-red-200 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <p className="mt-2 text-sm text-red-300">Please check if the backend server is running and accessible.</p>
      </div>
    </div>
  );

  if (stockData.length === 0) return (
    <div className="p-4">
      <div className="bg-amber-900/80 border border-amber-800 text-amber-200 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">No Data Available</strong>
        <span className="block sm:inline"> No stock data found.</span>
      </div>
    </div>
  );

  const productNames = stockData.map(item => item.productName);
  const quantities = stockData.map(item => item.quantity);
  const prices = stockData.map(item => item.price);
  const monthlyData = getProductsByMonth();
  const metrics = calculateMetrics();

  const barChartData = {
    labels: productNames,
    datasets: [
      {
        label: 'Stock Quantity',
        data: quantities,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        hoverWBackgroundColor: 'rgba(59, 130, 246, 0.9)',
      },
    ],
  };

  const lineChartData = {
    labels: productNames,
    datasets: [
      {
        label: 'Price',
        data: prices,
        fill: false,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.1,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointHoverRadius: 5,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Products Added',
        data: monthlyData.counts,
        backgroundColor: 'rgba(251, 191, 36, 0.7)',
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(251, 191, 36, 0.9)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
        },
      },
      title: {
        display: true,
        text: 'Stock Analysis',
        color: '#ffffff',
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#d1d5db',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#d1d5db',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const monthlyChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Monthly Product Additions',
      },
    },
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        beginAtZero: true,
        ticks: {
          ...chartOptions.scales.y.ticks,
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-gray-100">
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Export CSV
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          Export PDF
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-white">Stock Management</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-900/80 p-4 rounded-lg border border-blue-800 shadow-lg">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-blue-200 mb-1">Total Product Count</h3>
            <p className="text-3xl font-bold text-white">{metrics.totalProductCount.toLocaleString()}</p>
            <p className="text-sm text-blue-300 mt-1">Sum of all product quantities</p>
          </div>
        </div>

        <div className="bg-green-900/80 p-4 rounded-lg border border-green-800 shadow-lg">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-green-200 mb-1">Target Revenue</h3>
            <p className="text-3xl font-bold text-white">${metrics.targetRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="text-sm text-green-300 mt-1">Based on current inventory and prices</p>
          </div>
        </div>

        <div className="bg-amber-900/80 p-4 rounded-lg border border-amber-800 shadow-lg">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-amber-200 mb-1">Total Returns</h3>
            <p className="text-3xl font-bold text-white">{metrics.returnCount.toLocaleString()}</p>
            <p className="text-sm text-amber-300 mt-1">Total quantity of returned products</p>
          </div>
        </div>
      </div>

      <div id="chart-section" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2 text-white">Stock Quantities</h3>
            <div className="h-64">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2 text-white">Price Trends</h3>
            <div className="h-64">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2 text-white">Monthly Product Additions</h3>
            <div className="h-64">
              <Bar data={monthlyChartData} options={monthlyChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;
