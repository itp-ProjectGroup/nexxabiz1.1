import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SetOverdue from "../modal/SetOverdue"; // ✅ Import the modal

const FinDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    // ✅ Modal state
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch orders on mount
    useEffect(() => {
        fetchOrders();
    }, []);

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

    const filteredOrders = orders.filter(order => {
        if (activeTab === "paid") return order.pay_status === "Paid";
        if (activeTab === "new") return order.pay_status === "New";
        if (activeTab === "Pending") return order.pay_status === "Pending";
        return true;
    });

    // Handle view click for modal
    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto mt-10 font-roboto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Payment Records</h2>

            {/* Tabs */}
            <div className="flex mb-4 border-b border-gray-600">
                {["all", "new", "paid", "Pending"].map((tab) => (
                    <button 
                        key={tab}
                        className={`py-2 px-4 ml-2 ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"}`} 
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === "all" ? "All Payments" :
                         tab === "new" ? "New Orders" :
                         tab === "paid" ? "Paid Payments" : "Pending Payments"}
                    </button>
                ))}
            </div>

            {/* Table */}
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
                                    <span className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${order.od_status === "Completed" ? "bg-green-600" : "bg-yellow-600"} text-white`}>
                                        {order.od_status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${order.pay_status === "Paid" ? "bg-green-600" : "bg-red-600"} text-white`}>
                                        {order.pay_status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-300">${order.od_Tamount.toFixed(2)}</td>
                                <td className="py-3 px-4">
                                    {order.pay_status !== "Paid" ? (
                                        activeTab === "new" ? (
                                            <button 
                                                onClick={() => handleViewClick(order)} 
                                                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                View
                                            </button>
                                        ) : (
                                            <Link 
                                                to={`/admin/payment/${order.od_Id}`} 
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Pay
                                            </Link>
                                        )
                                    ) : (
                                        <span className="text-gray-400">Paid</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Modal Component */}
            <SetOverdue 
                order={selectedOrder} 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onUpdated={fetchOrders} // Pass fetchOrders as onUpdated
            />
        </div>
    );
};

export default FinDashboard;
