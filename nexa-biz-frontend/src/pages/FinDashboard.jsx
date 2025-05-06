import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Responsive, WidthProvider } from "react-grid-layout";
import DashboardCard from "../components/DashboardCard";
import { FaMoneyBillWave, FaClipboardList } from "react-icons/fa";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import SetOverdue from "../modal/SetOverdue";
import PaymentGateway from "../modal/PaymentGateway";
import PaymentDetails from "../modal/PaymentDetails";
import CashFlowChart from "../components/CashFlowChart";
import PaymentReminderCard from "../components/PaymentReminderCard";
import DateRangeFilter from "../components/DateRangeFilter"; // Import the new component

const ResponsiveGridLayout = WidthProvider(Responsive);

const FinDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);

    useEffect(() => {
        fetchOrders();
        fetchPayments();
        fetchProducts();
    }, []);

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

    // Separate states for date-filtered and tab-filtered data
    const [dateFilteredOrders, setDateFilteredOrders] = useState([]);
    const [dateFilteredPayments, setDateFilteredPayments] = useState([]);
    
    // Apply date filter to orders and payments
    useEffect(() => {
        // Filter orders based on date
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
                    // Set time to end of day for inclusive filtering
                    endDate.setHours(23, 59, 59, 999);
                    passesFilter = passesFilter && orderDate <= endDate;
                }
                
                return passesFilter;
            });
        }
        
        // Store date-filtered orders (before tab filtering)
        setDateFilteredOrders(tempFilteredOrders);
        
        // Filter payments based on date
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
                    // Set time to end of day for inclusive filtering
                    endDate.setHours(23, 59, 59, 999);
                    passesFilter = passesFilter && paymentDate <= endDate;
                }
                
                return passesFilter;
            });
        }
        
        // Store date-filtered payments
        setDateFilteredPayments(tempFilteredPayments);
    }, [orders, payments, dateFilter]);
    
    // Apply tab filter after date filter
    useEffect(() => {
        // Apply tab filter to the date-filtered orders
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
            return true; // For "all" tab
        });
        
        setFilteredOrders(tabFilteredOrders);
        
        // Update filteredPayments when activeTab changes
        // This is the fix: We need to set filteredPayments when tab changes to "allp"
        setFilteredPayments(dateFilteredPayments);
    }, [dateFilteredOrders, dateFilteredPayments, activeTab]);

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
        // Use date-filtered payments when calculating paid amount
        // This ensures consistent values regardless of tab selection
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
    
    // Enhance date-filtered orders with paid amount information
    useEffect(() => {
        setDateFilteredOrders(prevOrders =>
            prevOrders.map(order => ({
                ...order,
                paidAmount: getPaidAmountForOrder(order.od_Id),
            }))
        );
    }, [dateFilteredPayments]);

    // Count overdue orders based on date-filtered data (not tab-filtered)
    const overdueOrdersCount = dateFilteredOrders.filter(order => {
        const currentDate = new Date();
        const overdueDate = order.overdue_date ? new Date(order.overdue_date) : null;
        return order.pay_status === "Pending" && 
              overdueDate && 
              overdueDate <= currentDate;
    }).length;

    // Calculate metrics based on date-filtered data (not tab-filtered)
    // This ensures consistent dashboard metrics regardless of active tab
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
                <div key="1" data-grid={{ x: 0, y: 0, w: 1, h: 1.4 }}>
                <DashboardCard
                    title="Total Sales"
                    value={`$${totalSales.toFixed(2)}`}
                />
                </div>
                <div key="2" data-grid={{ x: 1, y: 0, w: 1, h: 1 }}>
                    <DashboardCard
                        title="Profit"
                        value={`$${profit.toFixed(2)}`}
                    />
                </div>
                <div key="3" data-grid={{ x: 2, y: 0, w: 1, h: 1 }}>
                    <DashboardCard
                        title="Amount due"
                        value={`$${amountDue.toFixed(2)}`}
                    />
                </div>
                <div key="4" data-grid={{ x: 3, y: 0, w: 1, h: 1 }}>
                    <DashboardCard
                        title="Overdue Orders"
                        value={overdueOrdersCount}
                        disableCurrencyFormatting={true} 
                    />
                </div>
                <div key="5" data-grid={{ x: 4, y: 0, w: 2, h: 4 }}>
                    <PaymentReminderCard 
                        orders={dateFilteredOrders} 
                        calculateOrderTotal={calculateOrderTotal}
                    />
                </div>
                <div key="6" data-grid={{ x: 0, y: 1, w: 1, h: 1.3 }}>
                    <DashboardCard
                        title="Total Income"
                        value={`$${totalIncome.toFixed(2)}`}
                    />
                </div>
                <div key="7" data-grid={{ x: 0, y: 2, w: 1, h: 1.3 }}>
                    <DashboardCard
                        title="Total Expense"
                        value={`$${totalExpense.toFixed(2)}`}
                    />
                </div>
                <div key="8" data-grid={{ x: 1, y: 1, w: 3, h: 3 }}>
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
            </ResponsiveGridLayout>

        <div className="mt-4 w-full mx-auto font-roboto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Payment Records</h2>
                <div className="flex items-center">
                    {(dateFilter.startDate || dateFilter.endDate) && (
                        <div className="mr-4 px-3 py-1 bg-blue-500 rounded text-sm flex items-center">
                            <span>
                                {dateFilter.startDate ? new Date(dateFilter.startDate).toLocaleDateString() : 'Any'} - 
                                {dateFilter.endDate ? new Date(dateFilter.endDate).toLocaleDateString() : 'Any'}
                            </span>
                        </div>
                    )}
                    <DateRangeFilter onFilterChange={handleDateFilterChange} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex mb-4 border-b border-gray-600 overflow-x-auto">
            {["all", "allp", "new", "paid", "Pending", "overdue"].map((tab) => (
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
                : "Overdue Payments"}
            </button>
            ))}
            </div>

            {/* Table */}
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
                ) : (
                    <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700 text-gray-400 uppercase text-sm text-center">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Company Name</th>
                        <th className="py-3 px-4">Order Status</th>
                  
                        {/* Payment Status only for tabs other than Pending and Overdue */}
                        {activeTab !== "Pending" && activeTab !== "overdue" && (
                          <th className="py-3 px-4">Payment Status</th>
                        )}
                  
                        <th className="py-3 px-4">Total Amount</th>
                  
                        {/* Show Paid Amount for both Pending and Overdue */}
                        {(activeTab === "Pending" || activeTab === "overdue") && (
                          <th className="py-3 px-4">Paid Amount</th>
                        )}

                        {/* Show Overdue Date only for overdue tab */}
                        {activeTab === "overdue" && (
                          <th className="py-3 px-4">Overdue Date</th>
                        )}
                  
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                  
                    <tbody>
                      {filteredOrders.map(order => (
                        <tr key={order.od_Id} className="border-b border-gray-700 hover:bg-gray-800 text-center">
                          <td className="py-3 px-4 font-medium text-white">{order.od_Id}</td>
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
                  
                          {/* Payment Status hidden for Pending and Overdue */}
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
                  
                          <td className="py-3 px-4 text-gray-300">
                            ${calculateOrderTotal(order).toFixed(2)}
                          </td>
                  
                          {/* Show Paid Amount for both Pending and Overdue */}
                          {(activeTab === "Pending" || activeTab === "overdue") && (
                            <td className="py-3 px-4 text-gray-300">
                              ${getPaidAmountForOrder(order.od_Id).toFixed(2)}
                            </td>
                          )}

                          {/* Show Overdue Date only for overdue tab */}
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
                onDelete={fetchPayments}
            />
        </div>
    );
};

export default FinDashboard;