import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AddOrderModal = ({ isOpen, onClose, onSubmit, users, products, orders }) => {
    const [formData, setFormData] = useState({
        od_date: new Date().toISOString().split('T')[0],
        userID: '',
        customerName: '',
        od_items: [{ manufacturingID: '', productName: '', qty: 1 }]
    });
    
    // States for autocomplete
    const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showProductSuggestions, setShowProductSuggestions] = useState({});
    const [filteredProducts, setFilteredProducts] = useState({});
    
    // Refs for detecting clicks outside
    const modalRef = useRef(null);
    const customerInputRef = useRef(null);
    const productInputRefs = useRef([]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (customerInputRef.current && !customerInputRef.current.contains(event.target)) {
                setShowCustomerSuggestions(false);
            }
            Object.keys(showProductSuggestions).forEach(index => {
                if (productInputRefs.current[index] && 
                    !productInputRefs.current[index].contains(event.target)) {
                    setShowProductSuggestions(prev => ({
                        ...prev,
                        [index]: false
                    }));
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProductSuggestions]);

    // Close modal when ESC key is pressed
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Generate unique order ID
    const generateOrderId = () => {
        const lastOrder = orders.sort((a, b) => {
            const numA = parseInt(a.od_Id.replace('OD', '')) || 0;
            const numB = parseInt(b.od_Id.replace('OD', '')) || 0;
            return numB - numA;
        })[0];
        
        const lastNumber = lastOrder ? parseInt(lastOrder.od_Id.replace('OD', '')) : 0;
        return `OD${String(lastNumber + 1).padStart(3, '0')}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'customerName') {
            const filtered = users.filter(user => 
                user.u_companyName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCustomers(filtered);
            setShowCustomerSuggestions(true);
        }
    };

    const handleCustomerSelect = (user) => {
        setFormData(prev => ({ 
            ...prev, 
            userID: user.userID,
            customerName: user.u_companyName
        }));
        setShowCustomerSuggestions(false);
    };

    const handleProductSearch = (index, value) => {
        const newItems = [...formData.od_items];
        newItems[index] = { ...newItems[index], productName: value, manufacturingID: '' };
        setFormData(prev => ({ ...prev, od_items: newItems }));
        
        const filtered = products.filter(product => 
            product.productName.toLowerCase().includes(value.toLowerCase())
        );
        
        setFilteredProducts(prev => ({
            ...prev,
            [index]: filtered
        }));
        
        setShowProductSuggestions(prev => ({
            ...prev,
            [index]: true
        }));
    };

    const handleProductSelect = (index, product) => {
        const newItems = [...formData.od_items];
        newItems[index] = { 
            ...newItems[index], 
            manufacturingID: product.manufacturingID,
            productName: product.productName
        };
        
        setFormData(prev => ({ ...prev, od_items: newItems }));
        
        setShowProductSuggestions(prev => ({
            ...prev,
            [index]: false
        }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.od_items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData(prev => ({ ...prev, od_items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            od_items: [...prev.od_items, { manufacturingID: '', productName: '', qty: 1 }]
        }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            od_items: prev.od_items.filter((_, i) => i !== index)
        }));
        
        setShowProductSuggestions(prev => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
        });
        
        setFilteredProducts(prev => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!formData.userID) {
            alert("Please select a valid customer");
            return;
        }
        
        if (!/^UID\d{6}$/.test(formData.userID)) {
            alert("Invalid User ID format. Must be in format UIDxxxxxx (e.g., UID123456)");
            return;
        }
        
        const allProductsSelected = formData.od_items.every(item => item.manufacturingID);
        if (!allProductsSelected) {
            alert("Please select valid products from the suggestions for all items");
            return;
        }
        
        try {
            const newOrder = {
                od_Id: generateOrderId(),
                company_name: formData.customerName,
                userID: formData.userID,
                od_status: "Pending",
                pay_status: "New",
                od_date: new Date(formData.od_date),
                overdue_date: null,
                od_items: formData.od_items.map(item => ({
                    manufacturingID: item.manufacturingID,
                    qty: Number(item.qty)
                }))
            };
            
            const response = await axios.post("http://localhost:5000/api/Orders", newOrder);
            if (response.status === 201) {
                alert("Order created successfully!");
                onSubmit(); // Notify parent component
                onClose(); // Close modal
                setFormData({
                    od_date: new Date().toISOString().split('T')[0],
                    userID: '',
                    customerName: '',
                    od_items: [{ manufacturingID: '', productName: '', qty: 1 }]
                });
            }
        } catch (error) {
            console.error("Error adding order:", error);
            alert(`Failed to create order: ${error.response?.data?.message || error.message}`);
        }
    };

    // Modal animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: { opacity: 0, y: -50, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { type: 'spring', damping: 25, stiffness: 300 }
        },
        exit: { 
            opacity: 0, 
            y: -50, 
            scale: 0.95, 
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div 
                        ref={modalRef}
                        className="bg-gray-900 text-gray-100 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                            <h2 className="text-2xl font-bold text-white">Add New Order</h2>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Order ID</label>
                                    <input
                                        type="text"
                                        value={generateOrderId()}
                                        disabled
                                        className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Order Date</label>
                                    <input
                                        type="date"
                                        name="od_date"
                                        value={formData.od_date}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Customer</label>
                                <div ref={customerInputRef} className="relative">
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        placeholder="Start typing company name..."
                                        className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        required
                                        autoComplete="off"
                                    />
                                    <AnimatePresence>
                                        {showCustomerSuggestions && filteredCustomers.length > 0 && (
                                            <motion.div 
                                                className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg rounded-md max-h-60 overflow-auto border border-gray-700"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {filteredCustomers.map(user => (
                                                    <div
                                                        key={user.userID}
                                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors"
                                                        onClick={() => handleCustomerSelect(user)}
                                                    >
                                                        {user.u_companyName}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status</label>
                                <input
                                    type="text"
                                    value="New"
                                    disabled
                                    className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-300"
                                />
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-300">Order Items</label>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Item
                                    </button>
                                </div>
                                
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 pt-1 pb-1">
                                    {formData.od_items.map((item, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="flex flex-col md:flex-row gap-2 items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="flex-1 relative w-full">
                                                <div 
                                                    ref={el => productInputRefs.current[index] = el} 
                                                    className="relative"
                                                >
                                                    <input
                                                        type="text"
                                                        value={item.productName}
                                                        onChange={(e) => handleProductSearch(index, e.target.value)}
                                                        placeholder="Search product..."
                                                        className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                        required
                                                        autoComplete="off"
                                                    />
                                                    <AnimatePresence>
                                                        {showProductSuggestions[index] && 
                                                         filteredProducts[index] && 
                                                         filteredProducts[index].length > 0 && (
                                                            <motion.div 
                                                                className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg rounded-md max-h-60 overflow-auto border border-gray-700"
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                {filteredProducts[index].map(product => (
                                                                    <div
                                                                        key={product.manufacturingID}
                                                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors"
                                                                        onClick={() => handleProductSelect(index, product)}
                                                                    >
                                                                        {product.productName}
                                                                    </div>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                            
                                            <div className="w-full md:w-24 flex items-center">
                                                <label className="block text-xs text-gray-400 md:hidden mr-2">Qty:</label>
                                                <input
                                                    type="number"
                                                    value={item.qty}
                                                    onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    className="w-full md:w-24 rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                            
                                            {formData.od_items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex justify-center"
                                                    aria-label="Remove item"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Create Order
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddOrderModal;