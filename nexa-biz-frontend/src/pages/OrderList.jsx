import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
// Removed React Grid Layout imports as we're using a simpler grid approach

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all"); // "all" or "paid"
    const [orderDetailsTab, setOrderDetailsTab] = useState("current"); // "current" or "return"
    const [error, setError] = useState("");
    
    // State for Add Order form
    const [showAddOrderForm, setShowAddOrderForm] = useState(false);
    const [newOrder, setNewOrder] = useState({
        orderId: "",
        companyName: "",
        userId: "",
        items: [{ name: "", quantity: 1, price: 0 }],
    });
    
    // State for Return Order form
    const [showReturnOrderForm, setShowReturnOrderForm] = useState(false);
    const [returnOrder, setReturnOrder] = useState({
        orderId: "",
        companyName: "",
        userId: "",
        items: [{ name: "", quantity: 1, price: 0 }],
    });

    const [editingOrder, setEditingOrder] = useState(null);
    const [editFormData, setEditFormData] = useState({
        orderId: "",
        companyName: "",
        items: [{ name: "", quantity: 1, price: 0 }],
        od_status: "Processing",
        pay_status: "Pending"
    });

    const [searchOrderId, setSearchOrderId] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/api/orders")
        .then((response) => {
            setOrders(response.data);
            // Since we don't have a separate orderDetails endpoint, we'll use the orders data
            setOrderDetails(response.data.map(order => ({
                orderId: order.od_Id,
                companyName: order.company_name,
                items: order.items || [],
                totalAmount: order.od_Tamount,
                od_status: order.od_status,
                pay_status: order.pay_status,
                // Check if the order ID starts with 'RT' to determine if it's a return order
                type: order.od_Id.startsWith('RT') ? "return" : "current"
            })));
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setLoading(false);
        });
    }, []);

    // Calculate total for an order based on its items
    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
    };

    // Calculate total sales
    const calculateTotalSales = () => {
        return orders.reduce((total, order) => total + (order.od_Tamount || 0), 0);
    };

    // Calculate total orders count
    const calculateTotalOrders = () => {
        return orders.length;
    };

    // Calculate return orders count
    const calculateReturnOrders = () => {
        return orderDetails.filter(detail => detail.type === "return").length;
    };

    // Calculate total amount for current orders
    const calculateCurrentOrdersAmount = () => {
        return orderDetails
            .filter(detail => detail.type === "current")
            .reduce((total, detail) => total + detail.totalAmount, 0);
    };

    // Calculate total amount for return orders
    const calculateReturnOrdersAmount = () => {
        return orderDetails
            .filter(detail => detail.type === "return")
            .reduce((total, detail) => total + detail.totalAmount, 0);
    };

    // Chart data
    const chartData = {
        labels: ['Current Orders', 'Return Orders'],
        datasets: [
            {
                label: 'Order Amounts',
                data: [calculateCurrentOrdersAmount(), calculateReturnOrdersAmount()],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white'
                }
            },
            title: {
                display: true,
                text: 'Order Summary',
                color: 'white',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'white',
                    callback: function(value) {
                        return '$' + value.toFixed(2);
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        }
    };

    // Add new item field to Add Order form
    const addItemField = () => {
        setNewOrder({
            ...newOrder,
            items: [...newOrder.items, { name: "", quantity: 1, price: 0 }]
        });
    };

    // Add new item field to Return Order form
    const addReturnItemField = () => {
        setReturnOrder({
            ...returnOrder,
            items: [...returnOrder.items, { name: "", quantity: 1, price: 0 }]
        });
    };

    // Handle input change for Add Order form
    const handleAddOrderChange = (e, index, field) => {
        const { value } = e.target;
        
        if (field === 'orderId' || field === 'companyName' || field === 'userId') {
            setNewOrder({ ...newOrder, [field]: value });
        } else {
            const updatedItems = [...newOrder.items];
            updatedItems[index] = { 
                ...updatedItems[index], 
                [field]: field === 'name' ? value : Number(value) 
            };
            setNewOrder({ ...newOrder, items: updatedItems });
        }
    };

    // Handle input change for Return Order form
    const handleReturnOrderChange = (e, index, field) => {
        const { value } = e.target;
        
        if (field === 'orderId' || field === 'companyName' || field === 'userId') {
            setReturnOrder({ ...returnOrder, [field]: value });
        } else {
            const updatedItems = [...returnOrder.items];
            updatedItems[index] = { 
                ...updatedItems[index], 
                [field]: field === 'name' ? value : Number(value) 
            };
            setReturnOrder({ ...returnOrder, items: updatedItems });
        }
    };

    // Function to generate a unique Order ID
    const generateOrderId = () => {
        const existingIds = orders.map(order => order.od_Id);
        let newId;
        let counter = 1;
        
        do {
            newId = `OD${String(counter).padStart(3, '0')}`;
            counter++;
        } while (existingIds.includes(newId));
        
        return newId;
    };

    // Function to generate a unique Return Order ID
    const generateReturnOrderId = () => {
        const existingIds = orders.map(order => order.od_Id);
        let newId;
        let counter = 1;
        
        do {
            newId = `RT${String(counter).padStart(3, '0')}`;
            counter++;
        } while (existingIds.includes(newId));
        
        return newId;
    };

    // Reset form and error when opening/closing modal
    const handleOpenAddOrderForm = () => {
        setError("");
        setNewOrder({
            orderId: generateOrderId(),
            companyName: "",
            userId: "",
            items: [{ name: "", quantity: 1, price: 0 }],
        });
        setShowAddOrderForm(true);
    };

    // Handle opening return order form
    const handleOpenReturnOrderForm = () => {
        setReturnOrder({
            orderId: generateReturnOrderId(),
            companyName: "",
            userId: "",
            items: [{ name: "", quantity: 1, price: 0 }],
        });
        setShowReturnOrderForm(true);
    };

    // Submit Add Order form
    const handleAddOrderSubmit = (e) => {
        e.preventDefault();
        setError("");
        
        const totalAmount = calculateTotal(newOrder.items);
        
        const orderData = {
            od_Id: newOrder.orderId,
            company_name: newOrder.companyName,
            "user ID": newOrder.userId,
            od_status: "Processing",
            pay_status: "Pending",
            od_Tamount: totalAmount,
            items: newOrder.items.map(item => ({
                name: item.name,
                quantity: Number(item.quantity),
                price: Number(item.price)
            }))
        };
        
        // Send data to server
        axios.post("http://localhost:5000/api/orders", orderData)
        .then((response) => {
            const newOrderData = response.data;
            // Update orders state
            setOrders(prevOrders => [...prevOrders, newOrderData]);
            
            // Update orderDetails state
            setOrderDetails(prevDetails => [...prevDetails, {
                orderId: newOrderData.od_Id,
                companyName: newOrderData.company_name,
                userId: newOrderData["user ID"],
                items: newOrderData.items,
                totalAmount: newOrderData.od_Tamount,
                od_status: newOrderData.od_status,
                pay_status: newOrderData.pay_status,
                type: "current"
            }]);
            
            // Reset form and close popup
            setNewOrder({
                orderId: generateOrderId(),
                companyName: "",
                userId: "",
                items: [{ name: "", quantity: 1, price: 0 }]
            });
            setShowAddOrderForm(false);
        })
        .catch(error => {
            console.error("Error adding order:", error);
            if (error.response?.data?.message?.includes("duplicate key")) {
                setError("This Order ID already exists. Please try again.");
            } else {
                setError("Failed to add order. Please try again.");
            }
        });
    };

    // Submit Return Order form
    const handleReturnOrderSubmit = (e) => {
        e.preventDefault();
        
        const totalAmount = calculateTotal(returnOrder.items);
        
        const orderData = {
            od_Id: returnOrder.orderId,
            company_name: returnOrder.companyName,
            "user ID": returnOrder.userId,
            od_status: "Processing",
            pay_status: "Pending",
            od_Tamount: totalAmount,
            items: returnOrder.items.map(item => ({
                name: item.name,
                quantity: Number(item.quantity),
                price: Number(item.price)
            }))
        };
        
        console.log('Sending return order data:', orderData);
        
        // Send data to server
        axios.post("http://localhost:5000/api/orders", orderData)
        .then((response) => {
            console.log('Return order created successfully:', response.data);
            const newOrderData = response.data;
            // Update orders state
            setOrders(prevOrders => [...prevOrders, newOrderData]);
            
            // Update orderDetails state with type set to "return"
            setOrderDetails(prevDetails => [...prevDetails, {
                orderId: newOrderData.od_Id,
                companyName: newOrderData.company_name,
                userId: newOrderData["user ID"],
                items: newOrderData.items,
                totalAmount: newOrderData.od_Tamount,
                od_status: newOrderData.od_status,
                pay_status: newOrderData.pay_status,
                type: "return"
            }]);
            
            // Reset form and close popup
            setReturnOrder({
                orderId: generateReturnOrderId(),
                companyName: "",
                userId: "",
                items: [{ name: "", quantity: 1, price: 0 }]
            });
            setShowReturnOrderForm(false);
        })
        .catch(error => {
            console.error("Error adding return order:", error.response?.data || error.message);
            alert("Failed to add return order. Please try again.");
        });
    };

    // Remove item field from Add Order form
    const removeItemField = (index) => {
        const updatedItems = [...newOrder.items];
        updatedItems.splice(index, 1);
        setNewOrder({ ...newOrder, items: updatedItems.length ? updatedItems : [{ name: "", quantity: 1, price: 0 }] });
    };

    // Remove item field from Return Order form
    const removeReturnItemField = (index) => {
        const updatedItems = [...returnOrder.items];
        updatedItems.splice(index, 1);
        setReturnOrder({ ...returnOrder, items: updatedItems.length ? updatedItems : [{ name: "", quantity: 1, price: 0 }] });
    };

    // Handle delete order
    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
                setOrders(prevOrders => prevOrders.filter(order => order.od_Id !== orderId));
                setOrderDetails(prevDetails => prevDetails.filter(detail => detail.orderId !== orderId));
            } catch (error) {
                console.error("Error deleting order:", error);
                alert("Failed to delete order. Please try again.");
            }
        }
    };

    // Handle edit order
    const handleEditClick = (detail) => {
        setEditingOrder(detail.orderId);
        setEditFormData({
            orderId: detail.orderId,
            companyName: detail.companyName,
            items: detail.items,
            od_status: detail.od_status || "Processing",
            pay_status: detail.pay_status || "Pending"
        });
    };

    // Handle edit form change
    const handleEditFormChange = (e, index, field) => {
        const { value } = e.target;
        
        if (field === 'orderId' || field === 'companyName' || field === 'od_status' || field === 'pay_status') {
            setEditFormData(prev => ({ ...prev, [field]: value }));
        } else {
            const updatedItems = [...editFormData.items];
            updatedItems[index] = { 
                ...updatedItems[index], 
                [field]: field === 'name' ? value : Number(value) 
            };
            setEditFormData(prev => ({ ...prev, items: updatedItems }));
        }
    };

    // Handle edit form submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        const totalAmount = calculateTotal(editFormData.items);
        
        const orderData = {
            od_Id: editFormData.orderId,
            company_name: editFormData.companyName,
            od_status: editFormData.od_status,
            pay_status: editFormData.pay_status,
            od_Tamount: totalAmount,
            items: editFormData.items.map(item => ({
                name: item.name,
                quantity: Number(item.quantity),
                price: Number(item.price)
            }))
        };
        
        try {
            const response = await axios.put(`http://localhost:5000/api/orders/${editFormData.orderId}`, orderData);
            const updatedOrder = response.data;
            
            // Update orders state
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.od_Id === updatedOrder.od_Id ? updatedOrder : order
                )
            );
            
            // Update orderDetails state
            setOrderDetails(prevDetails => 
                prevDetails.map(detail => 
                    detail.orderId === updatedOrder.od_Id 
                        ? {
                            orderId: updatedOrder.od_Id,
                            companyName: updatedOrder.company_name,
                            items: updatedOrder.items,
                            totalAmount: updatedOrder.od_Tamount,
                            od_status: updatedOrder.od_status,
                            pay_status: updatedOrder.pay_status,
                            type: detail.type
                        }
                        : detail
                )
            );
            
            setEditingOrder(null);
        } catch (error) {
            console.error("Error updating order:", error);
            alert("Failed to update order. Please try again.");
        }
    };

    // Add new item field to edit form
    const addEditItemField = () => {
        setEditFormData(prev => ({
            ...prev,
            items: [...prev.items, { name: "", quantity: 1, price: 0 }]
        }));
    };

    // Remove item field from edit form
    const removeEditItemField = (index) => {
        const updatedItems = [...editFormData.items];
        updatedItems.splice(index, 1);
        setEditFormData(prev => ({
            ...prev,
            items: updatedItems.length ? updatedItems : [{ name: "", quantity: 1, price: 0 }]
        }));
    };

    // Filter order details based on search
    const getFilteredOrderDetails = () => {
        let filtered = orderDetails;
        
        // Apply search filter if search term exists
        if (searchOrderId) {
            filtered = filtered.filter(detail => 
                detail.orderId.toLowerCase().includes(searchOrderId.toLowerCase())
            );
        }
        
        // Apply tab filter
        return filtered.filter(detail => 
            orderDetailsTab === "return" ? detail.type === "return" : detail.type === "current"
        );
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchOrderId(e.target.value);
    };

    // Generate PDF report
    const generatePDFReport = () => {
        try {
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(16);
            doc.text('Order Details Report', 14, 15);
            
            // Add date
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
            
            // Add table
            const tableColumn = ["Order ID", "Company Name", "Items", "Order Status", "Payment Status", "Total Amount"];
            const tableRows = getFilteredOrderDetails().map(detail => [
                detail.orderId,
                detail.companyName,
                detail.items.map(item => item.name).join(", "),
                detail.od_status || "Processing",
                detail.pay_status || "Pending",
                `$${detail.totalAmount.toFixed(2)}`
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 30,
                theme: 'grid',
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245],
                },
                columnStyles: {
                    0: { cellWidth: 25 }, // Order ID
                    1: { cellWidth: 30 }, // Company Name
                    2: { cellWidth: 50 }, // Items
                    3: { cellWidth: 25 }, // Order Status
                    4: { cellWidth: 25 }, // Payment Status
                    5: { cellWidth: 25 }, // Total Amount
                },
            });

            // Add summary
            const finalY = doc.lastAutoTable.finalY || 30;
            doc.setFontSize(10);
            doc.text(`Total Orders: ${getFilteredOrderDetails().length}`, 14, finalY + 10);
            doc.text(`Total Amount: $${getFilteredOrderDetails().reduce((sum, detail) => sum + detail.totalAmount, 0).toFixed(2)}`, 14, finalY + 17);

            // Save the PDF
            doc.save(`order-details-report-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF report. Please try again.');
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    // Filtered orders based on active tab
    const filteredOrders = activeTab === "paid" ? orders.filter(order => order.pay_status === "Paid") : orders;
    
    // Filtered order details based on active tab
    const filteredOrderDetails = getFilteredOrderDetails();

    return (
        <div className="p-4">
            {/* Add Order Form Modal */}
            {showAddOrderForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
                    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto" style={{maxHeight: '90vh'}}>
                        <h2 className="text-xl font-bold mb-4">Add New Order</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-600 text-white rounded">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleAddOrderSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">Order ID</label>
                                <input 
                                    type="text" 
                                    value={newOrder.orderId} 
                                    onChange={(e) => handleAddOrderChange(e, null, 'orderId')} 
                                    className="w-full p-2 rounded bg-gray-700 text-white" 
                                    required 
                                    disabled
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">User ID</label>
                                <input 
                                    type="text" 
                                    value={newOrder.userId} 
                                    onChange={(e) => handleAddOrderChange(e, null, 'userId')} 
                                    className="w-full p-2 rounded bg-gray-700 text-white" 
                                    placeholder="UID00000"
                                    pattern="UID\d{5}"
                                    title="User ID must be in format UID00000"
                                    required 
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">Company Name</label>
                                <input 
                                    type="text" 
                                    value={newOrder.companyName} 
                                    onChange={(e) => handleAddOrderChange(e, null, 'companyName')} 
                                    className="w-full p-2 rounded bg-gray-700 text-white" 
                                    required 
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Items</label>
                                {newOrder.items.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            placeholder="Item name" 
                                            value={item.name} 
                                            onChange={(e) => handleAddOrderChange(e, index, 'name')} 
                                            className="flex-1 p-2 rounded bg-gray-700 text-white" 
                                            required 
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Qty" 
                                            value={item.quantity} 
                                            onChange={(e) => handleAddOrderChange(e, index, 'quantity')} 
                                            className="w-20 p-2 rounded bg-gray-700 text-white" 
                                            min="1" 
                                            required 
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Price" 
                                            value={item.price} 
                                            onChange={(e) => handleAddOrderChange(e, index, 'price')} 
                                            className="w-24 p-2 rounded bg-gray-700 text-white" 
                                            min="0" 
                                            step="0.01" 
                                            required 
                                        />
                                        {newOrder.items.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeItemField(index)} 
                                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                                            >
                                                X
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    onClick={addItemField} 
                                    className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                                >
                                    + Add Item
                                </button>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">Total Amount</label>
                                <input 
                                    type="text" 
                                    value={`${calculateTotal(newOrder.items).toFixed(2)}`} 
                                    className="w-full p-2 rounded bg-gray-700 text-white" 
                                    disabled 
                                />
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddOrderForm(false)} 
                                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                                >
                                    Add Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Return Order Form Modal */}
            {showReturnOrderForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
                    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto" style={{maxHeight: '90vh'}}>
                        <h2 className="text-xl font-bold mb-4">Return Order</h2>
                        <form onSubmit={handleReturnOrderSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">Order ID</label>
                                <input 
                                    type="text" 
                                    value={returnOrder.orderId} 
                                    onChange={(e) => handleReturnOrderChange(e, null, 'orderId')} 
                                    className="w-full p-2 rounded bg-gray-700 text-white" 
                                    required 
                                    disabled
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">User ID</label>
                                <input 
                                    type="text" 
                                    value={returnOrder.userId} 
                                    onChange={(e) => handleReturnOrderChange(e, null, 'userId')} 
                                    className="w-full p-2 rounded bg-gray-700 text-white" 
                                    placeholder="UID00000"
                                    pattern="UID\d{5}"
                                    title="User ID must be in format UID00000"
                                    required 
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">Company Name</label>
                                <input 
                                    type="text" 
                                    value={returnOrder.companyName} 
                                    onChange={(e) => handleReturnOrderChange(e, null, 'companyName')} 
                                    className="w-full p-2 rounded bg-gray-700 text-white" 
                                    required 
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Items to Return</label>
                                {returnOrder.items.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            placeholder="Item name" 
                                            value={item.name} 
                                            onChange={(e) => handleReturnOrderChange(e, index, 'name')} 
                                            className="flex-1 p-2 rounded bg-gray-700 text-white" 
                                            required 
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Qty" 
                                            value={item.quantity} 
                                            onChange={(e) => handleReturnOrderChange(e, index, 'quantity')} 
                                            className="w-20 p-2 rounded bg-gray-700 text-white" 
                                            min="1" 
                                            required 
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Price" 
                                            value={item.price} 
                                            onChange={(e) => handleReturnOrderChange(e, index, 'price')} 
                                            className="w-24 p-2 rounded bg-gray-700 text-white" 
                                            min="0" 
                                            step="0.01" 
                                            required 
                                        />
                                        {returnOrder.items.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeReturnItemField(index)} 
                                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                                            >
                                                X
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    onClick={addReturnItemField} 
                                    className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                                >
                                    + Add Item
                                </button>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">Total Return Amount</label>
                                <input 
                                    type="text" 
                                    value={`${calculateTotal(returnOrder.items).toFixed(2)}`} 
                                    className="w-full p-2 rounded bg-gray-700 text-white" 
                                    disabled 
                                />
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setShowReturnOrderForm(false)} 
                                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                                >
                                    Submit Return
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="w-98 h-36">
                    <DashboardCard
                        title="Total Sales"
                        value={`$${calculateTotalSales().toFixed(2)}`}
                        icon="💰"
                        description="Total revenue from all orders"
                    />
                </div>
                
                <div className="h-36">
                    <div 
                        className="bg-gray-800 text-white p-4 rounded-lg shadow-lg h-full cursor-pointer hover:bg-gray-700 transition-all"
                        onClick={handleOpenAddOrderForm}
                    >
                        <h3 className="text-xl font-bold mb-2">Add Orders</h3>
                        <p className="text-gray-300">Create new customer orders with multiple items</p>
                        <div className="mt-4 flex justify-center">
                            <span className="text-3xl text-blue-400">+</span>
                        </div>
                    </div>
                </div>
                
                <div className="h-36">
                    <div 
                        className="bg-gray-800 text-white p-4 rounded-lg shadow-lg h-full cursor-pointer hover:bg-gray-700 transition-all"
                        onClick={handleOpenReturnOrderForm}
                    >
                        <h3 className="text-xl font-bold mb-2">Return Orders</h3>
                        <p className="text-gray-300">Process customer returns and refunds</p>
                        <div className="mt-4 flex justify-center">
                            <span className="text-3xl text-red-400">↩</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Statistics Cards */}
            <div className="flex flex-col mb-10">
                <div className="flex gap-6 mb-0">
                    <div className="w-45 h-38">
                        <DashboardCard
                            title="Total Orders"
                            value={calculateTotalOrders()}
                            icon="📦"
                            description="Total number of orders in the system"
                            disableCurrencyFormatting={true}
                        />
                    </div>
                    
                    <div className="w-47 h-38">
                        <DashboardCard
                            title="Return Orders"
                            value={calculateReturnOrders()}
                            icon="↩️"
                            description="Total number of return orders"
                            disableCurrencyFormatting={true}
                        />
                    </div>

                    {/* Order Summary Chart */}
                    <div className="flex-1 bg-gray-800 p-4 rounded-2xl shadow-lg">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="w-98 h-44 -mt-48">
                    <DashboardCard
                        title="Success Rate"
                        value={`${((calculateTotalOrders() - calculateReturnOrders()) / calculateTotalOrders() * 100).toFixed(1)}%`}
                        icon="📈"
                        description="Percentage of successful orders"
                        disableCurrencyFormatting={true}
                    />
                </div>
            </div>
            
            {/* Order Details Section */}
            <div className="max-w-7xl mx-auto mt-10 font-roboto bg-gray-800 text-white p-6 rounded-lg shadow-lg mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Order Details</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={generatePDFReport}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                            </svg>
                            Download Report
                        </button>
                        <div className="relative w-96">
                            <input
                                type="text"
                                placeholder="Search by Order ID"
                                value={searchOrderId}
                                onChange={handleSearchChange}
                                className="w-full bg-gray-700 text-white px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {searchOrderId && (
                                <button
                                    onClick={() => setSearchOrderId("")}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="flex mb-4 border-b border-gray-600">
                    <button 
                        className={`py-2 px-4 ${orderDetailsTab === "current" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"}`} 
                        onClick={() => setOrderDetailsTab("current")}
                    >
                        Current Orders
                    </button>
                    <button 
                        className={`py-2 px-4 ml-2 ${orderDetailsTab === "return" ? "border-b-2 border-red-500 text-red-500" : "text-gray-400"}`} 
                        onClick={() => setOrderDetailsTab("return")}
                    >
                        Return Orders
                    </button>
                </div>

                <div className="overflow-x-auto p-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400 uppercase text-sm text-center">
                                <th className="py-3 px-4">Order ID</th>
                                <th className="py-3 px-4">Company Name</th>
                                <th className="py-3 px-4">Items</th>
                                <th className="py-3 px-4">Order Status</th>
                                <th className="py-3 px-4">Payment Status</th>
                                <th className="py-3 px-4">Total Amount</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredOrderDetails().map((detail, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 text-center">
                                    {editingOrder === detail.orderId ? (
                                        <>
                                    <td className="py-3 px-4">
                                                <input
                                                    type="text"
                                                    value={editFormData.orderId}
                                                    onChange={(e) => handleEditFormChange(e, null, 'orderId')}
                                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                                    disabled
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="text"
                                                    value={editFormData.companyName}
                                                    onChange={(e) => handleEditFormChange(e, null, 'companyName')}
                                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col gap-2">
                                                    {editFormData.items.map((item, idx) => (
                                                        <div key={idx} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={item.name}
                                                                onChange={(e) => handleEditFormChange(e, idx, 'name')}
                                                                className="flex-1 p-2 rounded bg-gray-700 text-white"
                                                                placeholder="Item name"
                                                            />
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => handleEditFormChange(e, idx, 'quantity')}
                                                                className="w-20 p-2 rounded bg-gray-700 text-white"
                                                                min="1"
                                                            />
                                                            <input
                                                                type="number"
                                                                value={item.price}
                                                                onChange={(e) => handleEditFormChange(e, idx, 'price')}
                                                                className="w-24 p-2 rounded bg-gray-700 text-white"
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                            {editFormData.items.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeEditItemField(idx)}
                                                                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                                                                >
                                                                    X
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={addEditItemField}
                                                        className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                                                    >
                                                        + Add Item
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={editFormData.od_status}
                                                    onChange={(e) => handleEditFormChange(e, null, 'od_status')}
                                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={editFormData.pay_status}
                                                    onChange={(e) => handleEditFormChange(e, null, 'pay_status')}
                                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Paid">Paid</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                ${calculateTotal(editFormData.items).toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={handleEditSubmit}
                                                        className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingOrder(null)}
                                                        className="bg-gray-600 text-white py-1 px-3 rounded hover:bg-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="py-3 px-4 font-medium text-white">{detail.orderId}</td>
                                            <td className="py-3 px-4 text-gray-300">{detail.companyName}</td>
                                            <td className="py-3 px-4 text-gray-300">
                                                <div className="flex flex-col items-start">
                                                    {detail.items.map((item, idx) => (
                                                        <div key={idx} className="mb-1 text-left">
                                                            {item.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${
                                                    detail.od_status === "Delivered" ? "bg-green-600 text-white" : 
                                                    detail.od_status === "Shipped" ? "bg-yellow-600 text-white" : 
                                                    "bg-orange-600 text-white"
                                                }`}>
                                                    {detail.od_status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                                <span className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${
                                                    detail.pay_status === "Paid" ? "bg-green-600 text-white" : 
                                                    "bg-red-600 text-white"
                                                }`}>
                                                    {detail.pay_status}
                                        </span>
                                    </td>
                                            <td className="py-3 px-4 text-gray-300">${detail.totalAmount.toFixed(2)}</td>
                                    <td className="py-3 px-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(detail)}
                                                        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOrder(detail.orderId)}
                                                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                    </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {getFilteredOrderDetails().length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-4 text-center text-gray-400">
                                        {searchOrderId 
                                            ? "No orders found matching the search criteria" 
                                            : `No ${orderDetailsTab === "return" ? "return" : "current"} orders found`}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Payment Records Section */}
            <div className="max-w-7xl mx-auto mt-10 font-roboto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Payment Records</h2>
                
                {/* Tabs */}
                <div className="flex mb-4 border-b border-gray-600">
                    <button 
                        className={`py-2 px-4 ${activeTab === "all" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"}`} 
                        onClick={() => setActiveTab("all")}
                    >
                        All Payments
                    </button>
                    <button 
                        className={`py-2 px-4 ml-2 ${activeTab === "paid" ? "border-b-2 border-green-500 text-green-500" : "text-gray-400"}`} 
                        onClick={() => setActiveTab("paid")}
                    >
                        Paid Payments
                    </button>
                </div>

                <div className="overflow-x-auto p-4">
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
                                    <td className="py-3 px-4 font-medium text-white">{order.od_Id}</td>
                                    <td className="py-3 px-4 text-gray-300">{order.company_name}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${order.od_status === "Delivered" ? "bg-green-600 text-white" : order.od_status === "Shipped" ? "bg-yellow-600 text-white" : "bg-orange-600 text-white"}`}>
                                            {order.od_status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${order.pay_status === "Paid" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                                            {order.pay_status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-300">${order.od_Tamount.toFixed(2)}</td>
                                    <td className="py-3 px-4">
                                        {order.pay_status !== "Paid" ? (
                                            <Link to={`/payment/${order.od_Id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                Pay
                                            </Link>
                                        ) : (
                                            <span className="text-gray-400">Paid</span>
                                        )}
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

export default OrderList;


