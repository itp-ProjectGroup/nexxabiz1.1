import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Trash2, Save, Calendar } from 'lucide-react';

const UpdateOrderModal = ({ isOpen, onClose, onSubmit, order, users, products }) => {
    const [formData, setFormData] = useState({
        company_name: '',
        od_status: '',
        pay_status: '',
        od_items: [],
        od_date: '',
        notes: ''
    });

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300); // Match this with the transition duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (order) {
            setFormData({
                company_name: order.company_name || '',
                od_status: order.od_status || '',
                pay_status: order.pay_status || '',
                od_items: order.od_items || [],
                od_date: order.od_date ? new Date(order.od_date).toISOString().split('T')[0] : '',
                notes: order.notes || ''
            });
        }
    }, [order]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/Orders/${order.od_Id}`, formData);
            if (response.data) {
                onSubmit();
                onClose();
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.od_items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, od_items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            od_items: [...formData.od_items, { manufacturingID: '', qty: 1 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.od_items.filter((_, i) => i !== index);
        setFormData({ ...formData, od_items: newItems });
    };

    if (!isVisible && !isOpen) return null;

    return (
        <div 
            className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Multiple blur layers with 30% opacity */}
            <div 
                className={`absolute inset-0 bg-black transition-all duration-300 ${
                    isOpen ? 'opacity-30' : 'opacity-0'
                } backdrop-blur-2xl backdrop-filter`}
                onClick={onClose}
            />
            <div 
                className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? 'opacity-30' : 'opacity-0'
                } backdrop-blur-3xl backdrop-filter`}
                onClick={onClose}
            />

            {/* Modal content with reduced size */}
            <div 
                className={`relative bg-gray-800/95 rounded-xl p-4 w-full max-w-xl shadow-2xl border border-gray-700/50 transform transition-all duration-300 ${
                    isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                } backdrop-blur-sm`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Update Order Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Order Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.od_date}
                                    onChange={(e) => setFormData({ ...formData, od_date: e.target.value })}
                                    className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />
                                <Calendar className="absolute right-2 top-1.5 text-gray-400" size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Order Status
                            </label>
                            <select
                                value={formData.od_status}
                                onChange={(e) => setFormData({ ...formData, od_status: e.target.value })}
                                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                            >
                                <option value="Pending" className="bg-gray-700">Pending</option>
                                <option value="Processing" className="bg-gray-700">Processing</option>
                                <option value="Completed" className="bg-gray-700">Completed</option>
                                <option value="Cancelled" className="bg-gray-700">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Payment Status
                            </label>
                            <select
                                value={formData.pay_status}
                                onChange={(e) => setFormData({ ...formData, pay_status: e.target.value })}
                                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                            >
                                <option value="New" className="bg-gray-700">New</option>
                                <option value="Paid" className="bg-gray-700">Paid</option>
                                <option value="Overdue" className="bg-gray-700">Overdue</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Order Items
                        </label>
                        <div className="space-y-2">
                            {formData.od_items.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center bg-gray-700 p-2 rounded-lg">
                                    <select
                                        value={item.manufacturingID}
                                        onChange={(e) => handleItemChange(index, 'manufacturingID', e.target.value)}
                                        className="flex-1 px-3 py-1.5 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                    >
                                        <option value="" className="bg-gray-700">Select Product</option>
                                        {products.map(product => (
                                            <option key={product.manufacturingID} value={product.manufacturingID} className="bg-gray-700">
                                                {product.productName}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={item.qty}
                                        onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value))}
                                        className="w-20 px-3 py-1.5 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                        min="1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                            >
                                <Plus size={16} />
                                Add Item
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                            rows="2"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                            <Save size={16} />
                            Update Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateOrderModal; 