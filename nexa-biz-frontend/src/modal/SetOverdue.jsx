import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const SetOverdue = ({ order, isOpen, onClose, onUpdated }) => {
    const [overdueDate, setOverdueDate] = useState("");

    if (!isOpen || !order) return null;

    const handleSubmit = async () => {
        try {
            // Check if onUpdated is passed as a function before calling it
            if (typeof onUpdated === "function") {
                await axios.put(`http://localhost:5000/api/orders/${order.od_Id}/overdue`, {
                    overdue_date: overdueDate
                });
                alert("Overdue date updated!");
                onUpdated(); // Call the onUpdated function passed from parent
                onClose();
            } else {
                console.error("onUpdated is not a function");
            }
        } catch (error) {
            alert("Failed to update overdue date");
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full shadow-lg relative">
                {/* Close Icon */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white hover:text-red-400"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <h3 className="text-lg font-bold mb-4 text-center text-blue-600">Set Overdue Date</h3>
                <p className="mb-2 text-white"><strong>Order ID:</strong> {order.od_Id}</p>
                <p className="mb-4 text-white"><strong>Company Name:</strong> {order.company_name}</p>

                {/* Date input + Save button side by side */}
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="flex-1 p-2 rounded border bg-gray-800 text-white placeholder-white"
                        value={overdueDate}
                        onChange={(e) => setOverdueDate(e.target.value)}
                    />
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetOverdue;
