import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const FinDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all"); // "all", "paid", "new"

    useEffect(() => {
        axios.get("http://localhost:5000/api/Orders")
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    // Filtered orders based on active tab
    const filteredOrders = orders.filter(order => {
        if (activeTab === "paid") return order.pay_status === "Paid";
        if (activeTab === "new") return order.od_status === "New" || order.od_status === "Pending";
        return true; // all
    });

    return (
        <div className="max-w-6xl mx-auto mt-10 font-roboto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Payment Records</h2>

            {/* Tabs */}
            <div className="flex mb-4 border-b border-gray-600">
                <button 
                    className={`py-2 px-4 ml-2 ${activeTab === "new" ? "border-b-2 border-yellow-500 text-yellow-500" : "text-gray-400"}`} 
                    onClick={() => setActiveTab("new")}
                >
                    New Orders
                </button>
                
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
                                        <Link to={`/admin/payment/${order.od_Id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
    );
};

export default FinDashboard;
