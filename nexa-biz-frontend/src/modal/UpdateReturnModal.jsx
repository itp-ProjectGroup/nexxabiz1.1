import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Trash2, Save, Calendar } from 'lucide-react';

const UpdateReturnModal = ({ isOpen, onClose, onSubmit, returnOrder, users, products }) => {
    const [formData, setFormData] = useState({
        userID: '',
        pay_status: '',
        ret_items: [],
        ret_date: '',
        notes: ''
    });

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (returnOrder) {
            setFormData({
                userID: returnOrder.userID || '',
                pay_status: returnOrder.pay_status || '',
                ret_items: returnOrder.od_items || [],
                ret_date: returnOrder.ret_date ? new Date(returnOrder.ret_date).toISOString().split('T')[0] : '',
                notes: returnOrder.notes || ''
            });
        }
    }, [returnOrder]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/returns/${returnOrder.ret_Id}`, formData);
            if (response.data) {
                onSubmit();
                onClose();
            }
        } catch (error) {
            console.error('Error updating return:', error);
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.ret_items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, ret_items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            ret_items: [...formData.ret_items, { manufacturingID: '', qty: 1 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.ret_items.filter((_, i) => i !== index);
        setFormData({ ...formData, ret_items: newItems });
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
                    <h2 className="text-xl font-bold text-white">Update Return Details</h2>
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
                                User
                            </label>
                            <select
                                value={formData.userID}
                                onChange={(e) => setFormData({ ...formData, userID: e.target.value })}
                                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                            >
                                <option value="" className="bg-gray-700">Select User</option>
                                {users.map(user => (
                                    <option key={user.userID} value={user.userID} className="bg-gray-700">
                                        {user.u_companyName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Return Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.ret_date}
                                    onChange={(e) => setFormData({ ...formData, ret_date: e.target.value })}
                                    className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />
                                <Calendar className="absolute right-2 top-1.5 text-gray-400" size={16} />
                            </div>
                        </div>
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
                            <option value="Refunded" className="bg-gray-700">Refunded</option>
                            <option value="Pending" className="bg-gray-700">Pending</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Return Items
                        </label>
                        <div className="space-y-2">
                            {formData.ret_items.map((item, index) => (
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
                            Update Return
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateReturnModal; 