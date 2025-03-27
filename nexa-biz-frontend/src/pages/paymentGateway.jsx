import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PaymentGateway = () => {
    const { orderId } = useParams(); // Get order ID from URL
    const [order, setOrder] = useState(null);
    const [paymentId, setPaymentId] = useState(""); 
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [remark, setRemark] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/api/orders/${orderId}`)
            .then(response => setOrder(response.data))
            .catch(error => console.error("Error fetching order:", error));

            generatePaymentId();
    }, [orderId]);


    const generatePaymentId = () => {
        // Get the last stored PID from localStorage or start from 1
        let lastPaymentId = localStorage.getItem("lastPaymentId") || "PID00000000";
        
        // Extract the numeric part, increment it, and format it back
        let numericPart = parseInt(lastPaymentId.substring(3)) + 1;
        let newPaymentId = `PID${numericPart.toString().padStart(8, "0")}`;

        // Save the new Payment ID to state and localStorage
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
            orderId,
            paymentAmount:parseFloat(paymentAmount),
            paymentMethod,
            remark,
        };

        axios.post("http://localhost:5000/api/payments", paymentData)
            .then(response => {
                alert(`Payment Successful! Payment ID: ${paymentId}`);
                window.location.href = "/OrderList"; // Redirect to order list
            })
            .catch(error => console.error("Payment Error:", error));
    };

    if (!order) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Payment for Order {orderId}</h2>
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
    );
};

export default PaymentGateway;
