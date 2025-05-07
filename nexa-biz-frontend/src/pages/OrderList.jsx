import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Responsive, WidthProvider } from "react-grid-layout";
import DashboardCard from "../components/DashboardCard";
import { FaMoneyBillWave, FaClipboardList, FaFileExport } from "react-icons/fa";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import SetOverdue from "../modal/SetOverdue";
import PaymentGateway from "../modal/PaymentGateway";
import PaymentDetails from "../modal/PaymentDetails";
import CashFlowChart from "../components/CashFlowChart";
import PaymentReminderCard from "../components/PaymentReminderCard";
import DateRangeFilter from "../components/DateRangeFilter";
import FinSearchBar from "../components/FinSearchBar";
import { User } from "lucide-react";
import AddOrderModal from "../modal/AddOrderModal"; // Import the AddOrderModal

const ResponsiveGridLayout = WidthProvider(Responsive);

const MainDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [products, setProducts] = useState([]);
    const [returns, setReturns] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [exportType, setExportType] = useState('');
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allFilteredData, setAllFilteredData] = useState({orders: [], payments: []});

    useEffect(() => {
        fetchOrders();
        fetchPayments();
        fetchProducts();
        fetchUsers();
        fetchReturns();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchReturns = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/returns");
            setReturns(response.data);
        } catch (error) {
            console.error("Error fetching returns:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchPayments = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/payments");
            setPayments(response.data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/Orders");
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setLoading(false);
        }
    };

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
                    company_name: associatedUser?.u_companyName || order.company_name
                };
            });
    
            setOrders(enrichedOrders);
        }
    }, [users, orders]);

    // Separate states for date-filtered and tab-filtered data
    const [dateFilteredOrders, setDateFilteredOrders] = useState([]);
    const [dateFilteredPayments, setDateFilteredPayments] = useState([]);
    
    // Apply date filter to orders and payments
    useEffect(() => {
        let tempFilteredOrders = orders;
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
        }
        
        setDateFilteredOrders(tempFilteredOrders);
        
        let tempFilteredPayments = payments;
        if (dateFilter.startDate || dateFilter.endDate) {
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
        }
        
        setDateFilteredPayments(tempFilteredPayments);
    }, [orders, payments, dateFilter]);
    
    // Apply tab filter after date filter
    useEffect(() => {
        const tabFilteredOrders = dateFilteredOrders.filter(order => {
            if (activeTab === "paid") return order.pay_status === "Paid";
            if (activeTab === "new") return order.pay_status === "New";
            if (activeTab === "Pending") return order.pay_status === "Pending";
            if (activeTab === "overdue") {
                const currentDate = new Date();
                const overdueDate = order.overdue_date ? new Date(order.overdue_date) : null;
                return order.pay_status === "Pending" && 
                      overdueDate && 
                      overdueDate <= currentDate;
            }
            return true;
        });
        
        setFilteredOrders(tabFilteredOrders);
        setFilteredPayments(dateFilteredPayments);
    }, [dateFilteredOrders, dateFilteredPayments, activeTab]);

    const exportData = (format) => {
        setShowExportOptions(false);
        
        let dataToExport = [];
        let filename = "";
        let headers = [];
        
        if (activeTab === "allp") {
            filename = `payment_report_${new Date().toISOString().split('T')[0]}`;
            headers = ["Payment ID", "Order ID", "Method", "Date", "Amount"];
            
            dataToExport = filteredPayments.map(payment => ({
                "Payment ID": payment.paymentId,
                "Order ID": payment.orderId,
                "Method": payment.paymentMethod,
                "Date": new Date(payment.createdAt).toLocaleDateString(),
                "Amount": `$${payment.paymentAmount.toFixed(2)}`
            }));
        } else {
            filename = `order_report_${activeTab}_${new Date().toISOString().split('T')[0]}`;
            headers = ["Order ID", "Company Name", "Order Status"];
            
            if (activeTab !== "Pending" && activeTab !== "overdue") {
                headers.push("Payment Status");
            }
            
            headers.push("Total Amount");
            
            if (activeTab === "Pending" || activeTab === "overdue") {
                headers.push("Paid Amount");
            }
            
            if (activeTab === "overdue") {
                headers.push("Overdue Date");
            }
            
            dataToExport = filteredOrders.map(order => {
                const data = {
                    "Order ID": order.od_Id,
                    "Company Name": order.company_name,
                    "Order Status": order.od_status
                };
                
                if (activeTab !== "Pending" && activeTab !== "overdue") {
                    data["Payment Status"] = order.pay_status;
                }
                
                data["Total Amount"] = `$${calculateOrderTotal(order).toFixed(2)}`;
                
                if (activeTab === "Pending" || activeTab === "overdue") {
                    data["Paid Amount"] = `$${getPaidAmountForOrder(order.od_Id).toFixed(2)}`;
                }
                
                if (activeTab === "overdue") {
                    data["Overdue Date"] = order.overdue_date ? new Date(order.overdue_date).toLocaleDateString() : "N/A";
                }
                
                return data;
            });
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

    const getPaidAmountForOrder = (orderId) => {
        const orderPayments = dateFilteredPayments.filter(payment => payment.orderId === orderId);
        const totalPaidAmount = orderPayments.reduce((sum, payment) => sum + payment.paymentAmount, 0);
        return totalPaidAmount;
    };

    const calculateOrderTotal = (order) => {
        if (!products || !Array.isArray(order.od_items)) return 0;
    
        return order.od_items.reduce((sum, item) => {
            const product = products.find(p => p.manufacturingID === item.manufacturingID);
            const price = product?.sellingPrice || 0;
            return sum + price * item.qty;
        }, 0);
    };
    
    const calculateExpenseTotal = (order) => {
        if (!products || !Array.isArray(order.od_items)) return 0;
    
        return order.od_items.reduce((sum, item) => {
            const product = products.find(p => p.manufacturingID === item.manufacturingID);
            const price = product?.ManufacturingCost || 0;
            return sum + price * item.qty;
        }, 0);
    };

    const totalCapital = products.reduce((sum, product) => {
        const cost = product.ManufacturingCost ?? 0;
        const qty = product.quantity ?? 0;
        return sum + (cost * qty);
    }, 0);
      
    const handlePaymentSuccess = () => {
        fetchPayments();
        fetchOrders();
    };

    useEffect(() => {
        if (activeTab === "Pending" || activeTab === "paid" || activeTab === "overdue") {
            setFilteredOrders(prevOrders =>
                prevOrders.map(order => ({
                    ...order,
                    paidAmount: getPaidAmountForOrder(order.od_Id),
                }))
            );
        }
    }, [dateFilteredPayments, activeTab]);
    
    useEffect(() => {
        setDateFilteredOrders(prevOrders =>
            prevOrders.map(order => ({
                ...order,
                paidAmount: getPaidAmountForOrder(order.od_Id),
            }))
        );
    }, [dateFilteredPayments]);

    useEffect(() => {
        if (!searchQuery) {
            setAllFilteredData({
                orders: dateFilteredOrders,
                payments: dateFilteredPayments
            });
        }
    }, [dateFilteredOrders, dateFilteredPayments, searchQuery]);
        
    useEffect(() => {
        if (!searchQuery) {
            setFilteredOrders(
                dateFilteredOrders.filter(order => {
                    if (activeTab === "paid") return order.pay_status === "Paid";
                    if (activeTab === "new") return order.pay_status === "New";
                    if (activeTab === "Pending") return order.pay_status === "Pending";
                    if (activeTab === "overdue") {
                        const currentDate = new Date();
                        const overdueDate = order.overdue_date ? new Date(order.overdue_date) : null;
                        return order.pay_status === "Pending" && 
                            overdueDate && 
                            overdueDate <= currentDate;
                    }
                    return true;
                })
            );
            setFilteredPayments(dateFilteredPayments);
        } else {
            const matchingOrders = allFilteredData.orders.filter(order => {
                const customerNameMatch = order.company_name && 
                    order.company_name.toLowerCase().includes(searchQuery.toLowerCase());
                
                let tabCondition = true;
                if (activeTab === "paid") tabCondition = order.pay_status === "Paid";
                if (activeTab === "new") tabCondition = order.pay_status === "New";
                if (activeTab === "Pending") tabCondition = order.pay_status === "Pending";
                if (activeTab === "overdue") {
                    const currentDate = new Date();
                    const overdueDate = order.overdue_date ? new Date(order.overdue_date) : null;
                    tabCondition = order.pay_status === "Pending" && 
                        overdueDate && 
                        overdueDate <= currentDate;
                }
                
                return customerNameMatch && (activeTab === "all" || tabCondition);
            });
            
            const matchingOrderIds = new Set(matchingOrders.map(order => order.od_Id));
            const matchingPayments = allFilteredData.payments.filter(payment => 
                matchingOrderIds.has(payment.orderId)
            );
            
            setFilteredOrders(matchingOrders);
            setFilteredPayments(matchingPayments);
        }
    }, [searchQuery, activeTab, allFilteredData]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const overdueOrdersCount = dateFilteredOrders.filter(order => {
        const currentDate = new Date();
        const overdueDate = order.overdue_date ? new Date(order.overdue_date) : null;
        return order.pay_status === "Pending" && 
              overdueDate && 
              overdueDate <= currentDate;
    }).length;

    const totalSales = dateFilteredOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);
    const totalIncome = dateFilteredPayments.reduce((sum, p) => sum + p.paymentAmount, 0);
    const totalExpense = dateFilteredOrders.reduce((sum, order) => sum + calculateExpenseTotal(order), 0);
    const profit = totalIncome - totalExpense;
    const amountDue = totalSales - totalIncome;

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
                    <DashboardCard
                        title="Add Order"
                        onClick={() => setIsAddOrderModalOpen(true)}
                        className="cursor-pointer hover:bg-gray-100"
                    />
                </div>
                <div key="16" data-grid={{ x: 0, y: 1, w: 2, h: 1.2 }}>
                    <DashboardCard
                        title="Capital"
                        value={`$${totalCapital.toFixed(2)}`}
                    />
                </div>
                <div key="17" data-grid={{ x: 0, y: 2, w: 2, h: 1.6 }}>
                    <DashboardCard
                        title="Profit"
                        value={`$${profit.toFixed(2)}`}
                    />
                </div>
                <div key="18" data-grid={{ x: 2, y: 1, w: 2, h: 3 }}>
                    <DashboardCard
                        chart={
                            <div className="h-full w-full">
                                <CashFlowChart 
                                    payments={dateFilteredPayments} 
                                    orders={dateFilteredOrders} 
                                    products={products} 
                                />
                            </div>
                        }
                    />
                </div>
                <div key="27" data-grid={{ x: 4, y: 5, w: 2, h: 2 }}>
                    <DashboardCard
                        title="Profit"
                        value={`$${profit.toFixed(2)}`}
                    />
                </div>
            </ResponsiveGridLayout>

            <div className="mt-4 w-full mx-auto font-roboto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Payment Records</h2>
                    <div className="flex items-center">
                        <div className="mb-2 flex justify-center mr-40 ">
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
                        <div className="flex items-center">
                            <DateRangeFilter onFilterChange={handleDateFilterChange} />
                            <div className="relative ml-2">
                                <button 
                                    onClick={() => setShowExportOptions(!showExportOptions)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <FaFileExport className="mr-2" /> Export
                                </button>
                                {showExportOptions && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                                        <ul className="py-1">
                                            <li>
                                                <button 
                                                    onClick={() => exportData("csv")}
                                                    className="block px-4 py-2 text-sm text-white hover:bg-gray-600 w-full text-left"
                                                >
                                                    Export as CSV
                                                </button>
                                            </li>
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
                </div>

                <div className="flex mb-4 border-b border-gray-600 overflow-x-auto">
                    {["all", "allp", "new", "paid", "Pending", "overdue", "Return"].map((tab) => (
                        <button
                            key={tab}
                            className={`py-2 px-4 ml-2 whitespace-nowrap ${
                                activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "all"
                                ? "All Orders"
                                : tab === "allp"
                                ? "All Payments"
                                : tab === "new"
                                ? "New Orders"
                                : tab === "paid"
                                ? "Paid Orders"
                                : tab === "Pending"
                                ? "To be Paid Orders"
                                : tab === "overdue"
                                ? "Overdue Payments"
                                : "Refund Payments"}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto p-4">
                    {activeTab === "allp" ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-400 uppercase text-sm text-center">
                                    <th className="py-3 px-4">Payment ID</th>
                                    <th className="py-3 px-4">Order ID</th>
                                    <th className="py-3 px-4">Method</th>    
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Amount</th>
                                    <th className="py-3 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map(payment => (
                                    <tr key={payment.paymentId} className="border-b border-gray-700 hover:bg-gray-800 text-center">
                                        <td className="py-3 px-4 font-medium text-white">{payment.paymentId}</td>
                                        <td className="py-3 px-4 text-gray-300">{payment.orderId}</td>
                                        <td className="py-3 px-4 text-gray-300">{payment.paymentMethod}</td>
                                        <td className="py-3 px-4 text-gray-300">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-gray-300">${payment.paymentAmount.toFixed(2)}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handlePaymentActionClick(payment)}
                                                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : activeTab === "Return" ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-400 uppercase text-sm text-center">
                                    <th className="py-3 px-4">Return ID</th>
                                    <th className="py-3 px-4">User ID</th>
                                    <th className="py-3 px-4">Payment Status</th>
                                    <th className="py-3 px-4">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReturns.map(ret => (
                                    <tr key={ret.ret_Id} className="border-b border-gray-700 hover:bg-gray-800 text-center">
                                        <td className="py-3 px-4 font-medium text-white">{ret.ret_Id}</td>
                                        <td className="py-3 px-4 text-gray-300">{ret.userID}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${
                                                    ret.pay_status === "Refunded" ? "bg-green-600" : "bg-red-600"
                                                } text-white`}
                                            >
                                                {ret.pay_status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">${calculateReturnTotal(ret).toFixed(2)}</td>
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
                                    {activeTab !== "Pending" && activeTab !== "overdue" && (
                                        <th className="py-3 px-4">Payment Status</th>
                                    )}
                                    <th className="py-3 px-4">Total Amount</th>
                                    {(activeTab === "Pending" || activeTab === "overdue") && (
                                        <th className="py-3 px-4">Paid Amount</th>
                                    )}
                                    {activeTab === "overdue" && (
                                        <th className="py-3 px-4">Overdue Date</th>
                                    )}
                                    <th className="py-3 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.od_Id} className="border-b border-gray-700 hover:bg-gray-800 text-center">
                                        <td className="py-3 px-4 text-white">{order.od_Id}</td>
                                        <td className="py-3 px-4 text-gray-300">{order.company_name}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${
                                                    order.od_status === "Completed" ? "bg-green-600" : "bg-yellow-600"
                                                } text-white`}
                                            >
                                                {order.od_status}
                                            </span>
                                        </td>
                                        {activeTab !== "Pending" && activeTab !== "overdue" && (
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${
                                                        order.pay_status === "Paid" ? "bg-green-600" : "bg-red-600"
                                                    } text-white`}
                                                >
                                                    {order.pay_status}
                                                </span>
                                            </td>
                                        )}
                                        <td className="py-3 px-4 text-gray-300">${calculateOrderTotal(order).toFixed(2)}</td>
                                        {(activeTab === "Pending" || activeTab === "overdue") && (
                                            <td className="py-3 px-4 text-gray-300">${getPaidAmountForOrder(order.od_Id).toFixed(2)}</td>
                                        )}
                                        {activeTab === "overdue" && (
                                            <td className="py-3 px-4 text-gray-300">
                                                {order.overdue_date ? new Date(order.overdue_date).toLocaleDateString() : "N/A"}
                                            </td>
                                        )}
                                        <td className="py-3 px-4">
                                            {order.pay_status !== "Paid" ? (
                                                <button
                                                    onClick={() =>
                                                        activeTab === "new"
                                                            ? handleViewClick(order)
                                                            : handlePayClick(order)
                                                    }
                                                    className={`${
                                                        activeTab === "new" ? "bg-purple-500 hover:bg-purple-700" : "bg-blue-500 hover:bg-blue-700"
                                                    } text-white font-bold py-2 px-4 rounded`}
                                                >
                                                    {activeTab === "new" ? "View" : "Pay"}
                                                </button>
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

            {/* Modals */}
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
        </div>
    );
};

export default MainDashboard;