import { X, Save, Edit2, Trash2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";

const PaymentDetails = ({ payment, isOpen, onClose, order, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPayment, setEditedPayment] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key for forcing re-render

    useEffect(() => {
        // Reset the form when a new payment is loaded
        if (payment) {
            setEditedPayment({
                paymentMethod: payment.paymentMethod || "",
                paymentAmount: payment.paymentAmount || 0,
                remark: payment.remark || "",
                createdAt: payment.createdAt ? new Date(payment.createdAt).toISOString().split('T')[0] : ""
            });
        }
        // Reset edit mode when modal is closed
        if (!isOpen) {
            setIsEditing(false);
        }
    }, [payment, isOpen, refreshKey]); // Add refreshKey dependency

    if (!payment || !isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPayment(prev => ({
            ...prev,
            [name]: name === "paymentAmount" ? parseFloat(value) : value
        }));
    };

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        try {
            // Create payload with only the fields that should be updated
            const payload = {
                paymentMethod: editedPayment.paymentMethod,
                paymentAmount: parseFloat(editedPayment.paymentAmount),
                remark: editedPayment.remark,
                createdAt: editedPayment.createdAt ? new Date(editedPayment.createdAt).toISOString() : undefined
            };

            const response = await axios.put(
                `http://localhost:5000/api/payments/${payment.paymentId}`,
                payload
            );
            
            // Force refresh the component with new data
            setRefreshKey(prev => prev + 1);
            setIsEditing(false);
            
            // Call the parent's refresh function if available
            if (typeof onDelete === "function") {
                onDelete(); // Use onDelete as a refresh trigger
            }
            
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
                onClose(); // Close the modal
                if (typeof onDelete === "function") {
                    onDelete(); // Let parent refresh payments
                }
            } catch (error) {
                console.error("Error deleting payment:", error);
                alert(`Failed to delete payment: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    // Function to manually refresh the payment data
    const refreshPaymentData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/payments/${payment.paymentId}`);
            if (response.data) {
                // This assumes your API can get a single payment by ID
                // You may need to adjust this logic based on your actual API design
                setRefreshKey(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error refreshing payment data:", error);
        }
    };

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
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
                            <h2 className="text-2xl font-bold tracking-wide text-white">
                                {isEditing ? "✏️ Edit Payment" : "🧾 Payment Details"}
                            </h2>
                            <div className="flex items-center space-x-2">
                                {!isEditing && (
                                    <button
                                        onClick={refreshPaymentData}
                                        className="hover:text-green-400 transition-colors duration-200"
                                        aria-label="Refresh"
                                    >
                                        <RefreshCw size={20} />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="hover:text-red-400 transition-colors duration-200"
                                    aria-label="Close"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                            {/* Order Info First */}
                            {order && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-1 text-purple-400">Order Info</h3>
                                    <p><span className="font-medium">Company:</span> {order.company_name}</p>
                                    <p><span className="font-medium">Status:</span> {order.od_status}</p>
                                    <p><span className="font-medium">Total:</span> ${order.od_Tamount ? order.od_Tamount.toFixed(2) : '0.00'}</p>
                                </div>
                            )}

                            {/* Payment Info After */}
                            <div className="pt-4 border-t border-gray-700">
                                <h3 className="text-lg font-semibold mb-1 text-teal-400">Payment Info</h3>
                                
                                <p><span className="font-medium">Payment ID:</span> {payment.paymentId}</p>
                                <p><span className="font-medium">Order ID:</span> {payment.orderId}</p>
                                
                                {isEditing ? (
                                    <>
                                        <div className="mt-3 space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-gray-300">Payment Method</label>
                                                <select
                                                    name="paymentMethod"
                                                    value={editedPayment.paymentMethod}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                                >
                                                    <option value="Cash">Cash</option>
                                                    <option value="Credit Card">Credit Card</option>
                                                    <option value="Bank Transfer">Bank Transfer</option>
                                                    <option value="PayPal">PayPal</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium mb-1 text-gray-300">Amount</label>
                                                    <input
                                                        type="number"
                                                        name="paymentAmount"
                                                        value={editedPayment.paymentAmount}
                                                        onChange={handleInputChange}
                                                        step="0.01"
                                                        className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                                    />
                                                </div>
                                                
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium mb-1 text-gray-300">Date</label>
                                                    <input
                                                        type="date"
                                                        name="createdAt"
                                                        value={editedPayment.createdAt}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-gray-300">Remark</label>
                                                <textarea
                                                    name="remark"
                                                    value={editedPayment.remark}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white h-20"
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
                                        className={`flex items-center gap-1 px-4 py-2 text-white bg-teal-500 rounded-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-600'} transition-colors duration-300`}
                                    >
                                        {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-1 px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                                    >
                                        <X size={16} />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1 px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors duration-300"
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDeletePayment}
                                        className="flex items-center gap-1 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-300"
                                    >
                                        <Trash2 size={16} />
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