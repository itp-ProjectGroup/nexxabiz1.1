import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const PaymentGateway = ({ order, isOpen, onClose, onUpdated, products, payments }) => {
    const [paymentId, setPaymentId] = useState(""); 
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [remark, setRemark] = useState("");
    const [remainingBalance, setRemainingBalance] = useState(0);

    useEffect(() => {
        if (order) {
            generatePaymentId();
            calculateRemainingBalance();
        }
    }, [order, products, payments]);

    const generatePaymentId = () => {
        let lastPaymentId = localStorage.getItem("lastPaymentId") || "PID00000000";
        let numericPart = parseInt(lastPaymentId.substring(3)) + 1;
        let newPaymentId = `PID${numericPart.toString().padStart(8, "0")}`;
        setPaymentId(newPaymentId);
        localStorage.setItem("lastPaymentId", newPaymentId);
    };

    const calculateOrderTotal = (order) => {
        if (!products || !Array.isArray(order.od_items)) return 0;
    
        return order.od_items.reduce((sum, item) => {
            const product = products.find(p => p.manufacturingID === item.manufacturingID);
            const price = product?.sellingPrice || 0;
            return sum + price * item.qty;
        }, 0);
    };

    const getPaidAmountForOrder = (orderId) => {
        const orderPayments = payments.filter(payment => payment.orderId === orderId);
        const totalPaidAmount = orderPayments.reduce((sum, payment) => sum + payment.paymentAmount, 0);
        return totalPaidAmount;
    };

    const calculateRemainingBalance = () => {
        if (!order) return;
        
        const orderTotal = calculateOrderTotal(order);
        const paidAmount = getPaidAmountForOrder(order.od_Id);
        const remaining = orderTotal - paidAmount;
        
        setRemainingBalance(remaining);
    };

    const handlePayment = async () => {
        if (!paymentAmount || !paymentMethod) {
            alert("Please enter payment amount and select a payment method.");
            return;
        }

        // Check if payment amount exceeds remaining balance
        if (parseFloat(paymentAmount) > remainingBalance) {
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

        // Calculate if this payment will result in a fully paid order
        const newRemainingBalance = remainingBalance - parseFloat(paymentAmount);
        const willBePaid = newRemainingBalance <= 0.001; // Using small threshold to handle floating point errors

        try {
            // First save the payment
            await axios.post("http://localhost:5000/api/payments", paymentData);
            
            // Then update the order status if necessary
            if (willBePaid) {
                await updateOrderPaymentStatus(order.od_Id, 'Paid');
            }
            
            alert(`Payment Successful! Payment ID: ${paymentId}`);
            onUpdated(); // Refresh data
            onClose();   // Close modal
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed. Please try again.");
        }
    };
    
    const updateOrderPaymentStatus = async (orderId, status) => {
        try {
            // Assuming you have an API endpoint to update order status
            await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
                pay_status: status
            });
        } catch (error) {
            console.error("Error updating order status:", error);
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
                <p className="mb-2"><strong>Total Amount:</strong> ${calculateOrderTotal(order).toFixed(2)}</p>
                <p className="mb-2"><strong>Amount Paid:</strong> ${getPaidAmountForOrder(order.od_Id).toFixed(2)}</p>
                <p className="mb-4"><strong>Remaining Balance:</strong> ${remainingBalance.toFixed(2)}</p>
                <p className="mb-4"><strong>Payment Status:</strong> {order.pay_status || 'Pending'}</p>

                <label className="block mt-4 text-sm">Payment Amount</label>
                <input 
                    type="number" 
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={paymentAmount} 
                    onChange={(e) => setPaymentAmount(e.target.value)} 
                    max={remainingBalance}
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