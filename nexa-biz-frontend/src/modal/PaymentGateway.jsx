import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const PaymentGateway = ({ order, isOpen, onClose, onUpdated }) => {
    const [paymentId, setPaymentId] = useState(""); 
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [remark, setRemark] = useState("");

    useEffect(() => {
        if (order) {
            generatePaymentId();
        }
    }, [order]);

    const generatePaymentId = () => {
        let lastPaymentId = localStorage.getItem("lastPaymentId") || "PID00000000";
        let numericPart = parseInt(lastPaymentId.substring(3)) + 1;
        let newPaymentId = `PID${numericPart.toString().padStart(8, "0")}`;
        setPaymentId(newPaymentId);
        localStorage.setItem("lastPaymentId", newPaymentId);
    };

    const handlePayment = async () => {
        if (!paymentAmount || !paymentMethod) {
            alert("Please enter payment amount and select a payment method.");
            return;
        }

        if (parseFloat(paymentAmount) > order.od_Tamount) {
            alert("Total amount exceeding. Please enter a valid amount.");
            return;
        }

        const paymentData = {
            paymentId,
            orderId: order.od_Id,
            paymentAmount: parseFloat(paymentAmount),
            paymentMethod,
            remark,
        };

        try {
            await axios.post("http://localhost:5000/api/payments", paymentData);
            alert(`Payment Successful! Payment ID: ${paymentId}`);
            onUpdated(); // Refresh data
            onClose();   // Close modal
        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full shadow-lg relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Payment for Order {order.od_Id}</h2>
                    {/* Close Icon */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white hover:text-red-400"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>
                </div>

                <p className="mb-2"><strong>Company Name:</strong> {order.company_name}</p>
                <p className="mb-2"><strong>Total Amount:</strong> ${order.od_Tamount.toFixed(2)}</p>

                <label className="block mt-4 text-sm">Payment Amount</label>
                <input 
                    type="number" 
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={paymentAmount} 
                    onChange={(e) => setPaymentAmount(e.target.value)} 
                />

                <label className="block mt-4 text-sm">Payment Method</label>
                <select 
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="">Select Method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                </select>

                <label className="block mt-4 text-sm">Remark</label>
                <input 
                    type="text" 
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={remark} 
                    onChange={(e) => setRemark(e.target.value)} 
                />

                <button 
                    className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                    onClick={handlePayment}
                >
                    Confirm Payment
                </button>
            </div>
        </div>
    );
};

export default PaymentGateway;
