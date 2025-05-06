import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
// Removed React Grid Layout imports as we're using a simpler grid approach

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all"); // "all" or "paid"
    const [orderDetailsTab, setOrderDetailsTab] = useState("current"); // "current" or "return"
    
    // State for Add Order form
    const [showAddOrderForm, setShowAddOrderForm] = useState(false);
    const [newOrder, setNewOrder] = useState({
        orderId: "",
        companyName: "",
        items: [{ name: "", quantity: 1, price: 0 }],
    });
    
    // State for Return Order form
    const [showReturnOrderForm, setShowReturnOrderForm] = useState(false);
    const [returnOrder, setReturnOrder] = useState({
        orderId: "",
        companyName: "",
        items: [{ name: "", quantity: 1, price: 0 }],
    });

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
                type: "current"
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
        
        if (field === 'orderId' || field === 'companyName') {
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
        
        if (field === 'orderId' || field === 'companyName') {
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

    // Submit Add Order form
    const handleAddOrderSubmit = (e) => {
        e.preventDefault();
        
        const totalAmount = calculateTotal(newOrder.items);
        
        const orderData = {
            od_Id: newOrder.orderId,
            company_name: newOrder.companyName,
            od_status: "Processing",
            pay_status: "Pending",
            od_Tamount: totalAmount,
            items: newOrder.items.map(item => ({
                name: item.name,
                quantity: Number(item.quantity),
                price: Number(item.price)
            }))
        };
        
        console.log('Sending order data:', orderData);
        
        // Send data to server
        axios.post("http://localhost:5000/api/orders", orderData)
        .then((response) => {
            console.log('Order created successfully:', response.data);
            const newOrderData = response.data;
            // Update orders state
            setOrders(prevOrders => [...prevOrders, newOrderData]);
            
            // Update orderDetails state
            setOrderDetails(prevDetails => [...prevDetails, {
                orderId: newOrderData.od_Id,
                companyName: newOrderData.company_name,
                items: newOrderData.items,
                totalAmount: newOrderData.od_Tamount,
                type: "current"
            }]);
            
            // Reset form and close popup
            setNewOrder({
                orderId: "",
                companyName: "",
                items: [{ name: "", quantity: 1, price: 0 }]
            });
            setShowAddOrderForm(false);
        })
        .catch(error => {
            console.error("Error adding order:", error.response?.data || error.message);
            alert("Failed to add order. Please try again.");
        });
    };

    // Submit Return Order form
    const handleReturnOrderSubmit = (e) => {
        e.preventDefault();
        
        const totalAmount = calculateTotal(returnOrder.items);
        
        const orderData = {
            od_Id: returnOrder.orderId,
            company_name: returnOrder.companyName,
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
            
            // Update orderDetails state
            setOrderDetails(prevDetails => [...prevDetails, {
                orderId: newOrderData.od_Id,
                companyName: newOrderData.company_name,
                items: newOrderData.items,
                totalAmount: newOrderData.od_Tamount,
                type: "return"
            }]);
            
            // Reset form and close popup
            setReturnOrder({
                orderId: "",
                companyName: "",
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

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    // Filtered orders based on active tab
    const filteredOrders = activeTab === "paid" ? orders.filter(order => order.pay_status === "Paid") : orders;
    
    // Filtered order details based on active tab
    const filteredOrderDetails = orderDetailsTab === "return" 
        ? orderDetails.filter(detail => detail.type === "return")
        : orderDetails.filter(detail => detail.type === "current");

    return (
        <div className="p-4">
            {/* Add Order Form Modal */}
            {showAddOrderForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
                    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto" style={{maxHeight: '90vh'}}>
                        <h2 className="text-xl font-bold mb-4">Add New Order</h2>
                        <form onSubmit={handleAddOrderSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">Order ID</label>
                                <input 
                                    type="text" 
                                    value={newOrder.orderId} 
                                    onChange={(e) => handleAddOrderChange(e, null, 'orderId')} 
                                    className="w-full p-2 rounded bg-gray-700 text-white" 
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
                <div className="h-36">
                    <DashboardCard
                        title="Total Sales"
                    />
                </div>
                
                <div className="h-36">
                    <div 
                        className="bg-gray-800 text-white p-4 rounded-lg shadow-lg h-full cursor-pointer hover:bg-gray-700 transition-all"
                        onClick={() => setShowAddOrderForm(true)}
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
                        onClick={() => setShowReturnOrderForm(true)}
                    >
                        <h3 className="text-xl font-bold mb-2">Return Orders</h3>
                        <p className="text-gray-300">Process customer returns and refunds</p>
                        <div className="mt-4 flex justify-center">
                            <span className="text-3xl text-red-400">↩</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Payment Records Section */}
            <div className="max-w-6xl mx-auto mt-10 font-roboto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
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
                                        <span className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${order.od_status === "Completed" ? "bg-green-600 text-white" : order.od_status === "Delivered" ? "bg-blue-600 text-white" : order.od_status === "Shipped" ? "bg-yellow-600 text-white" : "bg-orange-600 text-white"}`}>
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
            
            {/* Order Details Section */}
            <div className="max-w-6xl mx-auto mt-10 font-roboto bg-gray-800 text-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Order Details</h2>
                
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
                                <th className="py-3 px-4">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrderDetails.map((detail, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 text-center">
                                    <td className="py-3 px-4 font-medium text-white">{detail.orderId}</td>
                                    <td className="py-3 px-4 text-gray-300">{detail.companyName}</td>
                                    <td className="py-3 px-4 text-gray-300">
                                        <div className="flex flex-col items-start">
                                            {detail.items.map((item, idx) => (
                                                <div key={idx} className="mb-1 text-left">
                                                    {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-300">${detail.totalAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                            {filteredOrderDetails.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-gray-400">
                                        No {orderDetailsTab === "return" ? "return" : "current"} orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>    
    );
};

export default OrderList;