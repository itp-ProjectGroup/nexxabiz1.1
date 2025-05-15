import { X, Save, Edit2, Trash2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";

const PaymentDetails = ({ payment, isOpen, onClose, order, onDelete, products, payments, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPayment, setEditedPayment] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        if (order) {
            calculateRemainingBalance();
            setFadeIn(true);
        }
    }, [order, products, payments]);

    useEffect(() => {
        if (payment) {
            setEditedPayment({
                paymentMethod: payment.paymentMethod || "",
                paymentAmount: payment.paymentAmount || 0,
                remark: payment.remark || "",
                createdAt: payment.createdAt ? new Date(payment.createdAt).toISOString().split('T')[0] : ""
            });
        }
        if (!isOpen) {
            setIsEditing(false);
        }
    }, [payment, isOpen, refreshKey]);

    if (!payment || !isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPayment(prev => ({
            ...prev,
            [name]: name === "paymentAmount" ? parseFloat(value) || 0 : value
        }));
    };

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        try {
            const orderTotal = calculateOrderTotal(order);
            const newPaymentAmount = parseFloat(editedPayment.paymentAmount) || 0;

            // Calculate total paid amount excluding the current payment's original amount
            const otherPaymentsTotal = payments
                .filter(p => p.paymentId !== payment.paymentId && p.orderId === order.od_Id)
                .reduce((sum, p) => sum + (p.paymentAmount || 0), 0);
            
            // Total paid amount after applying the new payment amount
            const totalPaidWithNewAmount = otherPaymentsTotal + newPaymentAmount;

            // Validate that the total paid amount does not exceed orderTotal
            if (totalPaidWithNewAmount > orderTotal) {
                alert("Error: The total payment amount cannot exceed the order total.");
                setIsSubmitting(false);
                return;
            }

            const payload = {
                paymentMethod: editedPayment.paymentMethod,
                paymentAmount: newPaymentAmount,
                remark: editedPayment.remark,
                createdAt: editedPayment.createdAt ? new Date(editedPayment.createdAt).toISOString() : undefined
            };

            const response = await axios.put(
                `http://localhost:5000/api/payments/${payment.paymentId}`,
                payload
            );

            // Call onUpdate to notify parent of the updated payment
            if (typeof onUpdate === "function") {
                onUpdate(response.data); // Pass the updated payment data
            }

            // Recalculate remaining balance
            calculateRemainingBalance();

            setIsEditing(false);
            alert("Payment updated successfully");
        } catch (error) {
            console.error("Error updating payment:", error);
            alert(`Failed to update payment: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePayment = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this payment?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/payments/${payment.paymentId}`);
                alert("Payment deleted successfully.");
                onClose();
                if (typeof onDelete === "function") {
                    onDelete();
                }
            } catch (error) {
                console.error("Error deleting payment:", error);
                alert(`Failed to delete payment: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const calculateOrderTotal = (order) => {
        if (!products || !Array.isArray(products) || !order || !Array.isArray(order.od_items)) return 0;
    
        return order.od_items.reduce((sum, item) => {
            const product = products.find(p => p.manufacturingID === item.manufacturingID);
            const price = product?.sellingPrice || 0;
            return sum + price * item.qty;
        }, 0);
    };

    const getPaidAmountForOrder = (orderId) => {
        if (!payments || !Array.isArray(payments)) return 0;
        const orderPayments = payments.filter(payment => payment.orderId === orderId);
        const totalPaidAmount = orderPayments.reduce((sum, payment) => sum + (payment.paymentAmount || 0), 0);
        return totalPaidAmount;
    };

    const calculateRemainingBalance = () => {
        if (!order) return;
        
        const orderTotal = calculateOrderTotal(order);
        const paidAmount = getPaidAmountForOrder(order.od_Id);
        const remaining = orderTotal - paidAmount;
        
        setRemainingBalance(remaining);
    };

    const refreshPaymentData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/payments/${payment.paymentId}`);
            if (response.data) {
                setRefreshKey(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error refreshing payment data:", error);
        }
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'paid': return 'bg-green-500';
            case 'partially paid': return 'bg-yellow-500';
            case 'pending': return 'bg-red-400';
            default: return 'bg-gray-500';
        }
    };

    const orderTotal = calculateOrderTotal(order);
    const paidAmount = getPaidAmountForOrder(order.od_Id);
    const completionPercentage = orderTotal ? (paidAmount / orderTotal) * 100 : 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 text-white p-6 pb-20 backdrop-blur-xl border border-gray-700"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
                            <h2 className="text-xl font-bold tracking-wide text-white">
                                {isEditing ? "✏️ Edit Payment" : "🧾 Payment Details"}
                            </h2>
                            <div className="flex items-center space-x-2">
                                {!isEditing && (
                                    <button
                                        onClick={refreshPaymentData}
                                        className="hover:text-green-400 transition-colors duration-200"
                                        aria-label="Refresh"
                                    >
                                        <RefreshCw size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="hover:text-red-400 transition-colors duration-200"
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                            {order && (
                                <div>
                                    <h3 className="text-base font-semibold mb-1 text-purple-400">Order Info</h3>
                                    <p><span className="font-medium">Company:</span> {order.company_name}</p>
                                    <p><span className="font-medium">Status:</span> {order.od_status}</p>
                                    
                                    <div className="mt-3 mb-2">
                                        <div className="flex justify-between mb-1 text-xs text-gray-400">
                                            <span>Payment Progress</span>
                                            <span>{completionPercentage.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                                            <div 
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${completionPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        <div className="bg-gray-800 p-2 rounded-lg">
                                            <p className="text-gray-400 text-xs">Order Total</p>
                                            <p className="text-sm font-bold text-white">${orderTotal.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-gray-800 p-2 rounded-lg">
                                            <p className="text-gray-400 text-xs">Amount Paid</p>
                                            <p className="text-sm font-bold text-white">${paidAmount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-3 bg-blue-900 bg-opacity-30 p-2 rounded-lg border border-blue-700">
                                        <div>
                                            <p className="text-blue-300 text-xs">Remaining Balance</p>
                                            <p className="text-sm font-bold text-white">${remainingBalance.toFixed(2)}</p>
                                        </div>
                                        <div className={`${getStatusColor(order.pay_status)} px-2 py-0.5 rounded-full text-white text-xs`}>
                                            {order.pay_status || 'Pending'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-700">
                                <h3 className="text-base font-semibold mb-1 text-teal-400">Payment Info</h3>
                                
                                <p><span className="font-medium">Payment ID:</span> {payment.paymentId}</p>
                                <p><span className="font-medium">Order ID:</span> {payment.orderId}</p>
                                
                                {isEditing ? (
                                    <>
                                        <div className="mt-3 space-y-3">
                                        <div className="flex gap-4 flex-wrap">
                                            <div className="flex-1 min-w-[120px]">
                                                <label className="block text-xs font-medium mb-1 text-gray-300">Payment Method</label>
                                                <select
                                                    name="paymentMethod"
                                                    value={editedPayment.paymentMethod}
                                                    onChange={handleInputChange}
                                                    className="w-full p-1.5 bg-gray-700 rounded border border-gray-600 text-white text-xs"
                                                >
                                                    <option value="Cash">Cash</option>
                                                    <option value="Credit Card">Credit Card</option>
                                                    <option value="Bank Transfer">Bank Transfer</option>
                                                    <option value="Cheque">Cheque</option>
                                                    <option value="PayPal">PayPal</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            
                                            <div className="flex-1 min-w-[100px]">
                                                <label className="block text-xs font-medium mb-1 text-gray-300">Amount</label>
                                                <input
                                                    type="number"
                                                    name="paymentAmount"
                                                    value={editedPayment.paymentAmount}
                                                    onChange={handleInputChange}
                                                    step="0.01"
                                                    min="0"
                                                    className="w-full p-1.5 bg-gray-700 rounded border border-gray-600 text-white text-xs"
                                                />
                                            </div>
                                            
                                            <div className="flex-1 min-w-[100px]">
                                                <label className="block text-xs font-medium mb-1 text-gray-300">Date</label>
                                                <input
                                                    type="date"
                                                    name="createdAt"
                                                    value={editedPayment.createdAt}
                                                    onChange={handleInputChange}
                                                    className="w-full p-1.5 bg-gray-700 rounded border border-gray-600 text-white text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1 text-gray-300">Remark</label>
                                            <textarea
                                                name="remark"
                                                value={editedPayment.remark}
                                                onChange={handleInputChange}
                                                className="w-full p-1.5 bg-gray-700 rounded border border-gray-600 text-white text-xs h-16"
                                            />
                                        </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><span className="font-medium">Method:</span> {payment.paymentMethod}</p>
                                        <p><span className="font-medium">Amount:</span> ${payment.paymentAmount ? payment.paymentAmount.toFixed(2) : '0.00'}</p>
                                        <p><span className="font-medium">Date:</span> {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}</p>
                                        <p><span className="font-medium">Remark:</span> {payment.remark || 'N/A'}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-700 pt-0" />
                        
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSaveChanges}
                                        disabled={isSubmitting}
                                        className={`flex items-center gap-1 px-3 py-1.5 text-white bg-teal-500 rounded-lg text-xs ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-600'} transition-colors duration-300`}
                                    >
                                        {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-1 px-3 py-1.5 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-300 text-xs"
                                    >
                                        <X size={14} />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors duration-300 text-xs"
                                    >
                                        <Edit2 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDeletePayment}
                                        className="flex items-center gap-1 px-3 py-1.5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-300 text-xs"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentDetails;