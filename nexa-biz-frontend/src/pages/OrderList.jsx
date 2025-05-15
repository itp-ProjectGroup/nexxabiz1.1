import { useEffect, useState } from "react";
import axios from "axios";
import { Responsive, WidthProvider } from "react-grid-layout";
import DashboardCard from "../components/DashboardCard";
import { FaMoneyBillWave, FaClipboardList, FaFileExport } from "react-icons/fa";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import SetOverdue from "../modal/SetOverdue";
import PaymentGateway from "../modal/PaymentGateway";
import PaymentDetails from "../modal/PaymentDetails";
import FinSearchBar from "../components/FinSearchBar";
import { User } from "lucide-react";
import AddOrderModal from "../modal/AddOrderModal";
import AddReturnModal from "../modal/AddReturnModal";
import UpdateOrderModal from "../modal/UpdateOrderModal";
import UpdateReturnModal from "../modal/UpdateReturnModal";
import BarChartComponent from "../components/BarChart";
import { Plus } from "lucide-react";
import { Line } from "react-chartjs-2";

const ResponsiveGridLayout = WidthProvider(Responsive);

const OrderList = () => {
    // Data states
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [products, setProducts] = useState([]);
    const [returns, setReturns] = useState([]);
    const [users, setUsers] = useState([]);
    // Status options
    const orderStatusOptions = ["Pending", "Processing", "Completed", "Cancelled"];
    const paymentStatusOptions = ["New", "Paid", "Overdue"];
    // UI states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState('');
    const [showExportOptions, setShowExportOptions] = useState(false);
    // Modal states
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
    const [isAddReturnModalOpen, setIsAddReturnModalOpen] = useState(false);
    const [isUpdateDetailsModalOpen, setIsUpdateDetailsModalOpen] = useState(false);
    const [isUpdateReturnModalOpen, setIsUpdateReturnModalOpen] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);
    // Filter states
    const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [filteredReturns, setFilteredReturns] = useState([]);
    const [dateFilteredOrders, setDateFilteredOrders] = useState([]);
    const [dateFilteredPayments, setDateFilteredPayments] = useState([]);
    const [dateFilteredReturns, setDateFilteredReturns] = useState([]);
    const [allFilteredData, setAllFilteredData] = useState({ orders: [], payments: [] });
    // Calculated states
    const [totalReturnAmount, setTotalReturnAmount] = useState(0);
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState('');

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                await Promise.all([
                    fetchOrders(),
                    fetchPayments(),
                    fetchProducts(),
                    fetchUsers(),
                    fetchReturns(),
                ]);
            } catch (err) {
                setError("Failed to load data. Please try again.");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users");
            setUsers(response.data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    };

    const fetchReturns = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/returns");
            setReturns(response.data || []);
            setDateFilteredReturns(response.data || []);
        } catch (error) {
            console.error("Error fetching returns:", error);
            throw error;
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/products");
            setProducts(response.data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    };

    const fetchPayments = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/payments");
            setPayments(response.data || []);
        } catch (error) {
            console.error("Error fetching payments:", error);
            throw error;
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/Orders");
            setOrders(response.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    };

    // Enrich orders with user company names
    useEffect(() => {
        if (orders.length > 0 && users.length > 0) {
            const shouldUpdate = orders.some(order => {
                const associatedUser = users.find(user => user.userID === order.userID);
                return associatedUser && order.company_name !== associatedUser.u_companyName;
            });

            if (!shouldUpdate) return;

            const enrichedOrders = orders.map(order => {
                const associatedUser = users.find(user => user.userID === order.userID);
                return {
                    ...order,
                    company_name: associatedUser?.u_companyName || order.company_name || '',
                };
            });

            setOrders(enrichedOrders);
        }
    }, [users, orders]);

    // Apply date filters and calculate total return amount
    useEffect(() => {
        let tempFilteredOrders = orders;
        let tempFilteredPayments = payments;
        let tempFilteredReturns = returns;

        if (dateFilter.startDate || dateFilter.endDate) {
            tempFilteredOrders = orders.filter(order => {
                const orderDate = new Date(order.od_date);
                let passesFilter = true;

                if (dateFilter.startDate) {
                    const startDate = new Date(dateFilter.startDate);
                    passesFilter = passesFilter && orderDate >= startDate;
                }

                if (dateFilter.endDate) {
                    const endDate = new Date(dateFilter.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    passesFilter = passesFilter && orderDate <= endDate;
                }

                return passesFilter;
            });

            tempFilteredPayments = payments.filter(payment => {
                const paymentDate = new Date(payment.createdAt);
                let passesFilter = true;

                if (dateFilter.startDate) {
                    const startDate = new Date(dateFilter.startDate);
                    passesFilter = passesFilter && paymentDate >= startDate;
                }

                if (dateFilter.endDate) {
                    const endDate = new Date(dateFilter.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    passesFilter = passesFilter && paymentDate <= endDate;
                }

                return passesFilter;
            });

            tempFilteredReturns = returns.filter(ret => {
                const returnDate = ret.ret_date ? new Date(ret.ret_date) : null;
                let passesFilter = true;

                if (dateFilter.startDate) {
                    const startDate = new Date(dateFilter.startDate);
                    passesFilter = passesFilter && returnDate && returnDate >= startDate;
                }

                if (dateFilter.endDate) {
                    const endDate = new Date(dateFilter.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    passesFilter = passesFilter && returnDate && returnDate <= endDate;
                }

                return passesFilter || !returnDate;
            });
        }

        setDateFilteredOrders(tempFilteredOrders);
        setDateFilteredPayments(tempFilteredPayments);
        setDateFilteredReturns(tempFilteredReturns);

        // Calculate total return amount for date-filtered returns
        const total = tempFilteredReturns.reduce((sum, ret) => sum + calculateReturnTotal(ret), 0);
        setTotalReturnAmount(total);
    }, [orders, payments, returns, dateFilter]);

    // Apply tab filters
    useEffect(() => {
        let tabFilteredOrders = dateFilteredOrders;
        let tabFilteredReturns = [];

        if (activeTab === "new") {
            tabFilteredOrders = dateFilteredOrders.filter(order => order.pay_status === "New");
        } else if (activeTab === "Return") {
            tabFilteredOrders = [];
            tabFilteredReturns = dateFilteredReturns;
        }

        setFilteredOrders(tabFilteredOrders);
        setFilteredPayments(dateFilteredPayments);
        setFilteredReturns(tabFilteredReturns);
    }, [dateFilteredOrders, dateFilteredPayments, dateFilteredReturns, activeTab]);

    // Apply search filters
    useEffect(() => {
        if (!searchQuery) {
            setAllFilteredData({
                orders: dateFilteredOrders,
                payments: dateFilteredPayments,
            });
            setFilteredOrders(dateFilteredOrders);
            setFilteredPayments(dateFilteredPayments);
            setFilteredReturns(activeTab === "Return" ? dateFilteredReturns : []);
        } else {
            const matchingOrders = dateFilteredOrders.filter(order => {
                const customerNameMatch = order.company_name &&
                    order.company_name.toLowerCase().includes(searchQuery.toLowerCase());
                return customerNameMatch && (activeTab === "all" || activeTab === "new" && order.pay_status === "New");
            });

            const matchingReturns = dateFilteredReturns.filter(ret => {
                const user = users.find(u => u.userID === ret.userID);
                const companyNameMatch = user?.u_companyName &&
                    user.u_companyName.toLowerCase().includes(searchQuery.toLowerCase());
                return companyNameMatch && activeTab === "Return";
            });

            const matchingOrderIds = new Set(matchingOrders.map(order => order.od_Id));
            const matchingPayments = dateFilteredPayments.filter(payment =>
                matchingOrderIds.has(payment.orderId)
            );

            setAllFilteredData({ orders: matchingOrders, payments: matchingPayments });
            setFilteredOrders(matchingOrders);
            setFilteredPayments(matchingPayments);
            setFilteredReturns(matchingReturns);
        }
    }, [searchQuery, activeTab, dateFilteredOrders, dateFilteredPayments, dateFilteredReturns, users]);

    // Update paid amounts for orders
    useEffect(() => {
        setDateFilteredOrders(prevOrders =>
            prevOrders.map(order => ({
                ...order,
                paidAmount: getPaidAmountForOrder(order.od_Id),
            }))
        );
    }, [dateFilteredPayments]);

    // Calculations
    const calculateOrderTotal = (order) => {
        if (!products || !order || !Array.isArray(order.od_items)) return 0;
        return order.od_items.reduce((sum, item) => {
            const product = products.find(p => p.manufacturingID === item.manufacturingID);
            const price = product?.sellingPrice || 0;
            return sum + price * item.qty;
        }, 0);
    };

    const calculateExpenseTotal = (order) => {
        if (!products || !order || !Array.isArray(order.od_items)) return 0;
        return order.od_items.reduce((sum, item) => {
            const product = products.find(p => p.manufacturingID === item.manufacturingID);
            const price = product?.ManufacturingCost || 0;
            return sum + price * item.qty;
        }, 0);
    };

    const calculateReturnTotal = (ret) => {
        if (!products || !ret || !Array.isArray(ret.od_items)) return 0;
        return ret.od_items.reduce((sum, item) => {
            const product = products.find(p => p.manufacturingID === item.manufacturingID);
            const price = product?.sellingPrice || 0;
            return sum + price * item.qty;
        }, 0);
    };

    const getPaidAmountForOrder = (orderId) => {
        const orderPayments = dateFilteredPayments.filter(payment => payment.orderId === orderId);
        return orderPayments.reduce((sum, payment) => sum + (payment.paymentAmount || 0), 0);
    };

    const totalSales = dateFilteredOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);
    const totalIncome = dateFilteredPayments.reduce((sum, p) => sum + (p.paymentAmount || 0), 0);
    const totalExpense = dateFilteredOrders.reduce((sum, order) => sum + calculateExpenseTotal(order), 0);
    const profit = totalIncome - totalExpense;

    // Handlers
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleDateFilterChange = (filter) => {
        setDateFilter(filter);
    };

    const handlePaymentActionClick = (payment) => {
        setSelectedPayment(payment);
        setIsPaymentDetailsModalOpen(true);
    };

    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handlePayClick = (order) => {
        setSelectedOrder(order);
        setIsPaymentModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const handleClosePaymentModal = () => {
        setSelectedOrder(null);
        setIsPaymentModalOpen(false);
    };

    const handlePaymentSuccess = () => {
        fetchPayments();
        fetchOrders();
    };

    const exportData = (format) => {
        setShowExportOptions(false);

        let filename = `report_${activeTab}_${new Date().toISOString().split('T')[0]}`;
        let headers = [];
        let dataToExport = [];

        if (activeTab === "Return") {
            filename = `return_report_${new Date().toISOString().split('T')[0]}`;
            headers = ["Return ID", "User ID", "Payment Status", "Total Amount"];
            dataToExport = filteredReturns.map(ret => ({
                "Return ID": ret.ret_Id || '',
                "User ID": ret.userID || '',
                "Payment Status": ret.pay_status || '',
                "Total Amount": `$${calculateReturnTotal(ret).toFixed(2)}`,
            }));
        } else {
            filename = `order_report_${activeTab}_${new Date().toISOString().split('T')[0]}`;
            headers = ["Order ID", "Company Name", "Order Status", "Payment Status", "Total Amount"];
            dataToExport = filteredOrders.map(order => ({
                "Order ID": order.od_Id || '',
                "Company Name": order.company_name || '',
                "Order Status": order.od_status || '',
                "Payment Status": order.pay_status || '',
                "Total Amount": `$${calculateOrderTotal(order).toFixed(2)}`,
            }));
        }

        if (format === "csv") {
            exportToCSV(dataToExport, headers, filename);
        } else if (format === "pdf") {
            exportToPDF(dataToExport, headers, filename);
        }
    };

    const exportToCSV = (data, headers, filename) => {
        let csvContent = headers.join(",") + "\n";

        data.forEach(item => {
            const row = headers.map(header => {
                let value = item[header] || "";
                value = String(value).replace(/"/g, '""');
                return `"${value}"`;
            });
            csvContent += row.join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = (data, headers, filename) => {
        const printWindow = window.open('', '_blank');

        let htmlContent = `
            <html>
            <head>
                <title>${filename}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    h1 { text-align: center; }
                    .no-print { margin: 20px 0; text-align: center; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>${filename.replace(/_/g, ' ').toUpperCase()}</h1>
                <table>
                    <thead>
                        <tr>
                            ${headers.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.forEach(item => {
            htmlContent += '<tr>';
            headers.forEach(header => {
                htmlContent += `<td>${item[header] || ''}</td>`;
            });
            htmlContent += '</tr>';
        });

        htmlContent += `
                    </tbody>
                </table>
                <div class="no-print">
                    <p>Click the button below to print or save as PDF</p>
                    <button onclick="window.print()">Print / Save as PDF</button>
                </div>
            </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    // Add new function to handle all field updates
    const handleFieldUpdate = async (orderId, field, newValue) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/Orders/${orderId}`, {
                [field]: newValue
            });
            
            if (response.data) {
                // Update local state
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.od_Id === orderId 
                            ? { ...order, [field]: newValue }
                            : order
                    )
                );
                setEditingCell(null);
                setEditValue('');
            }
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            // You might want to add error handling UI feedback here
        }
    };

    const handleCellClick = (orderId, field, value) => {
        setEditingCell({ orderId, field });
        setEditValue(value || '');
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editingCell) {
            handleFieldUpdate(editingCell.orderId, editingCell.field, editValue);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleEditSubmit(e);
        } else if (e.key === 'Escape') {
            setEditingCell(null);
            setEditValue('');
        }
    };

    const handleUpdateDetailsClick = (order) => {
        setSelectedOrder(order);
        setIsUpdateDetailsModalOpen(true);
    };

    const handleCloseUpdateDetailsModal = () => {
        setSelectedOrder(null);
        setIsUpdateDetailsModalOpen(false);
    };

    const handleUpdateReturnClick = (returnOrder) => {
        setSelectedReturn(returnOrder);
        setIsUpdateReturnModalOpen(true);
    };

    const handleCloseUpdateReturnModal = () => {
        setSelectedReturn(null);
        setIsUpdateReturnModalOpen(false);
    };

    // Render
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="p-4">
            <ResponsiveGridLayout
                className="layout mb-6"
                breakpoints={{ lg: 1024, md: 768, sm: 480 }}
                cols={{ lg: 6, md: 6, sm: 1 }}
                rowHeight={100}
                isDraggable={true}
                isResizable={false}
            >
                <div key="11" data-grid={{ x: 0, y: 0, w: 2, h: 1.2 }}>
                    <DashboardCard
                        title="Total Sales"
                        value={`$${totalSales.toFixed(2)}`}
                    />
                </div>
                <div key="13" data-grid={{ x: 2, y: 0, w: 1, h: 1 }}>
                    <DashboardCard
                        title="Orders"
                        value={orders.length}
                        disableCurrencyFormatting={true}
                    />
                </div>
                <div key="14" data-grid={{ x: 3, y: 0, w: 1, h: 1 }}>
                    <DashboardCard
                        title="Return"
                        value={returns.length}
                        disableCurrencyFormatting={true}
                    />
                </div>
                <div key="15" data-grid={{ x: 4, y: 0, w: 2, h: 2 }}>
                    <div 
                        onClick={() => setIsAddOrderModalOpen(true)}
                        className="h-full bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(30,64,175,0.3),rgba(255,255,255,0))]" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">Add Order</h3>
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                                    <Plus className="text-white" size={24} />
                                </div>
                            </div>
                            <p className="text-blue-100/90 text-sm mb-4">Create a new order with detailed information</p>
                            <div className="mt-auto">
                                <div className="flex items-center gap-2 text-blue-100/90 text-sm">
                                    <span className="px-2 py-1 rounded-full bg-white/10">Quick Add</span>
                                    <span className="px-2 py-1 rounded-full bg-white/10">Multiple Items</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div key="16" data-grid={{ x: 0, y: 1, w: 2, h: 1.2 }}>
                    <DashboardCard
                        title="Return Amount"
                        value={`$${totalReturnAmount.toFixed(2)}`}
                        valueClassName="text-red-500"
                    />
                </div>
                <div key="17" data-grid={{ x: 0, y: 2, w: 2, h: 1.6 }}>
                    <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),rgba(255,255,255,0))]" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Success Rate</h3>
                                    <p className="text-2xl font-bold text-blue-500 mt-1">
                                        {((orders.filter(order => order.od_status === 'Completed').length / orders.length) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 min-h-0 h-[calc(100%-80px)]">
                                <Line 
                                    data={{
                                        labels: Array.from({ length: 6 }, (_, i) => {
                                            const date = new Date();
                                            date.setMonth(date.getMonth() - (5 - i));
                                            return date.toLocaleString('default', { month: 'short' });
                                        }),
                                        datasets: [{
                                            label: 'Success Rate',
                                            data: Array.from({ length: 6 }, (_, i) => {
                                                const date = new Date();
                                                date.setMonth(date.getMonth() - (5 - i));
                                                const monthOrders = orders.filter(order => {
                                                    const orderDate = new Date(order.od_date);
                                                    return orderDate.getMonth() === date.getMonth() && 
                                                           orderDate.getFullYear() === date.getFullYear();
                                                });
                                                const monthCompleted = monthOrders.filter(order => order.od_status === 'Completed').length;
                                                return monthOrders.length > 0 ? (monthCompleted / monthOrders.length) * 100 : 0;
                                            }),
                                            fill: true,
                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                            borderColor: 'rgba(59, 130, 246, 1)',
                                            tension: 0.4,
                                            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                                            pointBorderColor: '#fff',
                                            pointBorderWidth: 2,
                                            pointRadius: 4,
                                            pointHoverRadius: 6,
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                                titleColor: '#fff',
                                                bodyColor: '#fff',
                                                borderColor: 'rgba(59, 130, 246, 0.5)',
                                                borderWidth: 1,
                                                padding: 10,
                                                displayColors: false,
                                                callbacks: {
                                                    label: function(context) {
                                                        return `Success Rate: ${context.parsed.y.toFixed(1)}%`;
                                                    }
                                                }
                                            }
                                        },
                                        scales: {
                                            x: {
                                                grid: {
                                                    display: false
                                                },
                                                ticks: {
                                                    color: '#9CA3AF'
                                                }
                                            },
                                            y: {
                                                beginAtZero: true,
                                                max: 100,
                                                grid: {
                                                    color: 'rgba(75, 85, 99, 0.1)'
                                                },
                                                ticks: {
                                                    color: '#9CA3AF',
                                                    callback: function(value) {
                                                        return value + '%';
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div key="18" data-grid={{ x: 2, y: 1, w: 2, h: 3 }}>
                    <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),rgba(255,255,255,0))]" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-end mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <span className="text-sm text-gray-300">Orders</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <span className="text-sm text-gray-300">Returns</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 min-h-0">
                                <div className="h-full w-full">
                                    <BarChartComponent
                                        orders={dateFilteredOrders}
                                        returns={dateFilteredReturns}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div key="27" data-grid={{ x: 4, y: 5, w: 2, h: 2 }}>
                    <div 
                        onClick={() => setIsAddReturnModalOpen(true)}
                        className="h-full bg-gradient-to-br from-red-800 to-red-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(153,27,27,0.3),rgba(255,255,255,0))]" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">Add Return</h3>
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                                    <Plus className="text-white" size={24} />
                                </div>
                            </div>
                            <p className="text-red-100/90 text-sm mb-4">Process a return with item details and refund information</p>
                            <div className="mt-auto">
                                <div className="flex items-center gap-2 text-red-100/90 text-sm">
                                    <span className="px-2 py-1 rounded-full bg-white/10">Quick Return</span>
                                    <span className="px-2 py-1 rounded-full bg-white/10">Refund Process</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ResponsiveGridLayout>

            <div className="mt-4 w-full mx-auto font-roboto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Order Summary</h2>
                    <div className="flex items-center">
                        <div className="mb-2 flex justify-center mr-65">
                            <FinSearchBar
                                data={[...orders, ...payments, ...returns]}
                                onSearch={handleSearch}
                                placeholder="Search by customer name..."
                            />
                        </div>
                        {(dateFilter.startDate || dateFilter.endDate) && (
                            <div className="mr-4 px-3 py-1 bg-blue-500 rounded text-sm flex items-center">
                                <span>
                                    {dateFilter.startDate ? new Date(dateFilter.startDate).toLocaleDateString() : 'Any'} -
                                    {dateFilter.endDate ? new Date(dateFilter.endDate).toLocaleDateString() : 'Any'}
                                </span>
                            </div>
                        )}
                        <div className="relative ml-2">
                            <button
                                onClick={() => setShowExportOptions(!showExportOptions)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                            >
                                <FaFileExport className="mr-2" /> Download PDF
                            </button>
                            {showExportOptions && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                                    <ul className="py-1">
                                        <li>
                                            <button
                                                onClick={() => exportData("pdf")}
                                                className="block px-4 py-2 text-sm text-white hover:bg-gray-600 w-full text-left"
                                            >
                                                Export as PDF
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex mb-4 border-b border-gray-600 overflow-x-auto">
                    {["all", "new", "Return"].map((tab) => (
                        <button
                            key={tab}
                            className={`py-2 px-4 ml-2 whitespace-nowrap ${
                                activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "all" ? "All Orders" : tab === "new" ? "New Orders" : "Return Orders"}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto p-4">
                    {activeTab === "Return" ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-400 uppercase text-sm text-center">
                                    <th className="py-3 px-4">Return ID</th>
                                    <th className="py-3 px-4">User ID</th>
                                    <th className="py-3 px-4">Payment Status</th>
                                    <th className="py-3 px-4">Total Amount</th>
                                    <th className="py-3 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReturns.map(ret => (
                                    <tr key={ret.ret_Id} className="border-b border-gray-700 hover:bg-gray-800 text-center">
                                        <td className="py-3 px-4 font-medium text-white">{ret.ret_Id || ''}</td>
                                        <td className="py-3 px-4 text-gray-300">{ret.userID || ''}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${
                                                    ret.pay_status === "Refunded" ? "bg-green-600" : "bg-red-600"
                                                } text-white`}
                                            >
                                                {ret.pay_status || ''}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">${calculateReturnTotal(ret).toFixed(2)}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleUpdateReturnClick(ret)}
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Update Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-400 uppercase text-sm text-center">
                                    <th className="py-3 px-4">Order ID</th>
                                    <th className="py-3 px-4">Company Name</th>
                                    <th className="py-3 px-4">Order Status</th>
                                    <th className="py-3 px-4">Payment Status</th>
                                    <th className="py-3 px-4">Total Amount</th>
                                    <th className="py-3 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.od_Id} className="border-b border-gray-700 hover:bg-gray-800 text-center">
                                        <td className="py-3 px-4 text-white">{order.od_Id || ''}</td>
                                        <td className="py-3 px-4 text-gray-300">
                                            {editingCell?.orderId === order.od_Id && editingCell?.field === 'company_name' ? (
                                                <form onSubmit={handleEditSubmit} className="flex items-center">
                                                    <input
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={handleKeyPress}
                                                        onBlur={handleEditSubmit}
                                                        className="w-full px-2 py-1 text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        autoFocus
                                                    />
                                                </form>
                                            ) : (
                                                <div 
                                                    onClick={() => handleCellClick(order.od_Id, 'company_name', order.company_name)}
                                                    className="cursor-pointer hover:bg-gray-700 px-2 py-1 rounded"
                                                >
                                                    {order.company_name || ''}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <select
                                                value={order.od_status || ''}
                                                onChange={(e) => handleFieldUpdate(order.od_Id, 'od_status', e.target.value)}
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    order.od_status === "Completed" ? "bg-green-600" : 
                                                    order.od_status === "Cancelled" ? "bg-red-600" :
                                                    order.od_status === "Processing" ? "bg-blue-600" : "bg-yellow-600"
                                                } text-white border-none focus:ring-2 focus:ring-blue-500`}
                                            >
                                                {orderStatusOptions.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${
                                                    order.pay_status === "Paid" ? "bg-green-600" : 
                                                    order.pay_status === "Overdue" ? "bg-red-600" : "bg-yellow-600"
                                                } text-white`}
                                            >
                                                {order.pay_status || 'New'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">
                                            {editingCell?.orderId === order.od_Id && editingCell?.field === 'total_amount' ? (
                                                <form onSubmit={handleEditSubmit} className="flex items-center">
                                                    <input
                                                        type="number"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={handleKeyPress}
                                                        onBlur={handleEditSubmit}
                                                        className="w-full px-2 py-1 text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        autoFocus
                                                    />
                                                </form>
                                            ) : (
                                                <div 
                                                    onClick={() => handleCellClick(order.od_Id, 'total_amount', calculateOrderTotal(order))}
                                                    className="cursor-pointer hover:bg-gray-700 px-2 py-1 rounded"
                                                >
                                                    ${calculateOrderTotal(order).toFixed(2)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {order.pay_status !== "Paid" ? (
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleUpdateDetailsClick(order)}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        Update Details
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Paid</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <SetOverdue
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdated={fetchOrders}
            />
            <PaymentGateway
                order={selectedOrder}
                isOpen={isPaymentModalOpen}
                onClose={handleClosePaymentModal}
                onUpdated={handlePaymentSuccess}
                products={products}
                payments={payments}
            />
            <PaymentDetails
                payment={selectedPayment}
                isOpen={isPaymentDetailsModalOpen}
                onClose={() => setIsPaymentDetailsModalOpen(false)}
                order={orders.find(o => o.od_Id === selectedPayment?.orderId)}
                onDelete={async () => {
                    await fetchPayments();
                    await fetchOrders();
                }}
            />
            <AddOrderModal
                isOpen={isAddOrderModalOpen}
                onClose={() => setIsAddOrderModalOpen(false)}
                onSubmit={fetchOrders}
                users={users}
                products={products}
                orders={orders}
            />
            <AddReturnModal
                isOpen={isAddReturnModalOpen}
                onClose={() => setIsAddReturnModalOpen(false)}
                onSubmit={fetchReturns}
                users={users}
                products={products}
                returns={returns}
            />
            <UpdateOrderModal
                isOpen={isUpdateDetailsModalOpen}
                onClose={handleCloseUpdateDetailsModal}
                onSubmit={fetchOrders}
                users={users}
                products={products}
                order={selectedOrder}
            />
            <UpdateReturnModal
                isOpen={isUpdateReturnModalOpen}
                onClose={handleCloseUpdateReturnModal}
                onSubmit={fetchReturns}
                users={users}
                products={products}
                returnOrder={selectedReturn}
            />
        </div>
    );
};

export default OrderList;