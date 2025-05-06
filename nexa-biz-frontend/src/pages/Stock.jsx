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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Transform the data to match our chart requirements
        const transformedData = data.map(product => ({
          id: product._id,
          productName: product.productName,
          quantity: product.quantity || 0,
          price: product.sellingPrice || 0,
          manufacturingDate: product.manufacturingDate || new Date().toISOString(),
          lastUpdated: product.updatedAt || new Date().toISOString()
        }));

        setStockData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError(`Failed to fetch stock data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  // Function to export data as CSV
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
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };

  // Function to export data as PDF
  const handleExportPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    const chartSection = document.querySelector("#chart-section");
    if (!chartSection) {
      console.error("Chart section not found");
      return;
    }

    try {
      const canvas = await html2canvas(chartSection, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);

      // Add a new page for the table
      doc.addPage();

      doc.setFontSize(14);
      doc.text("Stock Data Table", 14, 20);

      let startY = 30;

      stockData.forEach((item, index) => {
        doc.setFontSize(10);
        doc.text(
          `• ${item.productName}, Qty: ${item.quantity}, Price: $${item.price.toFixed(2)}, Added: ${item.manufacturingDate}, Updated: ${new Date(item.lastUpdated).toLocaleDateString()}`,
          14,
          startY + index * 7
        );
      });

      doc.save("stock_report.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  // Function to group products by month
  const getProductsByMonth = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Initialize an object to count products per month
    const monthlyCounts = {};

    // Initialize all months with 0 count
    monthNames.forEach(month => {
      monthlyCounts[month] = 0;
    });

    // Count products per month using manufacturingDate
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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading stock data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <p className="mt-2 text-sm">Please check if the backend server is running and accessible.</p>
      </div>
    </div>
  );

  if (stockData.length === 0) return (
    <div className="p-4">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">No Data Available</strong>
        <span className="block sm:inline"> No stock data found.</span>
      </div>
    </div>
  );

  // Prepare data for all charts
  const productNames = stockData.map(item => item.productName);
  const quantities = stockData.map(item => item.quantity);
  const prices = stockData.map(item => item.price);
  const monthlyData = getProductsByMonth();

  // Bar chart data for stock quantities
  const barChartData = {
    labels: productNames,
    datasets: [
      {
        label: 'Stock Quantity',
        data: quantities,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Line chart data for price trends
  const lineChartData = {
    labels: productNames,
    datasets: [
      {
        label: 'Price',
        data: prices,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // New chart: Monthly product additions
  const monthlyChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Products Added',
        data: monthlyData.counts,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Analysis',
      },
    },
  };

  const monthlyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Product Additions',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleExportCSV}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Stock Management</h2>

      <div id="chart-section" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Stock Quantities</h3>
            <Bar data={barChartData} options={chartOptions} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Price Trends</h3>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Monthly Product Additions</h3>
            <Bar
              data={monthlyChartData}
              options={monthlyChartOptions}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Stock Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Product Name</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Added Date</th>
                <th className="py-2 px-4 border-b">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.productName}</td>
                  <td className="py-2 px-4 border-b">{item.quantity}</td>
                  <td className="py-2 px-4 border-b">${item.price.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{item.manufacturingDate}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stock;
