import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const PaymentDetails = ({ payment, isOpen, onClose, order, onEdit, onDelete }) => {
    if (!payment || !isOpen) return null;

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
                            <h2 className="text-2xl font-bold tracking-wide text-white">🧾 Payment Details</h2>
                            <button
                                onClick={onClose}
                                className="hover:text-red-400 transition-colors duration-200"
                                aria-label="Close"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                            {/* Order Info First */}
                            {order && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-1 text-purple-400">Order Info</h3>
                                    <p><span className="font-medium">Company:</span> {order.company_name}</p>
                                    <p><span className="font-medium">Status:</span> {order.od_status}</p>
                                    <p><span className="font-medium">Total:</span> ${order.od_Tamount.toFixed(2)}</p>
                                </div>
                            )}

                            {/* Payment Info After */}
                            <div className="pt-4 border-t border-gray-700">
                                <h3 className="text-lg font-semibold mb-1 text-teal-400">Payment Info</h3>
                                <p><span className="font-medium">Payment ID:</span> {payment.paymentId}</p>
                                <p><span className="font-medium">Order ID:</span> {payment.orderId}</p>
                                <p><span className="font-medium">Method:</span> {payment.paymentMethod}</p>
                                <p><span className="font-medium">Amount:</span> ${payment.paymentAmount.toFixed(2)}</p>
                                <p><span className="font-medium">Date:</span> {new Date(payment.createdAt).toLocaleDateString()}</p>
                                <p><span className="font-medium">Remark:</span> {payment.remark}</p>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-700 pt-0" />
                        
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            <button
                                onClick={onEdit}
                                className="w-24 px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-700 transition-colors duration-300"
                            >
                                Edit
                            </button>
                            <button
                                onClick={async () => {
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
                                            alert("Failed to delete payment.");
                                        }
                                    }
                                }}
                                className="w-24 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-800 transition-colors duration-300"
                            >
                                Delete
                            </button>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentDetails;
