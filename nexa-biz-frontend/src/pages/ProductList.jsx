import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        productName: '',
        ManufacturingCost: '',
        sellingPrice: '',
        lowStockLevel: ''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                console.log('API Response:', response.data); // Debug the response
                setProducts(response.data);
                setLoading(false);
                setFilteredProducts(response.data);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = (searchTerm) => {
        const filtered = products.filter((product) =>
            product.manufacturingID.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleEdit = (productId) => {
        const productToEdit = products.find(product => product._id === productId);
        setEditingProduct(productToEdit);
        setEditFormData({
            productName: productToEdit.productName,
            ManufacturingCost: productToEdit.ManufacturingCost,
            sellingPrice: productToEdit.sellingPrice,
            lowStockLevel: productToEdit.lowStockLevel
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/api/products/${editingProduct._id}`,
                editFormData
            );

            const updatedProducts = products.map(product =>
                product._id === editingProduct._id ? response.data.product : product
            );

            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            setEditingProduct(null);
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Failed to update product');
        }
    };

    const handleDelete = async (productId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this product?');
        if (!isConfirmed) return;

        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`);

            const updatedProducts = products.filter(product => product._id !== productId);
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);

            alert('Product deleted successfully');
        } catch (err) {
            console.error('Error deleting product:', err);
            setError(`Failed to delete product: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-300">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-900/80 border border-red-800 text-red-200 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                    <p className="mt-2 text-sm text-red-300">Please check your connection and try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-900 text-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Product List</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by Manufacturing ID"
                        className="p-2 pl-8 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <svg
                        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {editingProduct && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-gray-800/90 p-6 rounded-lg w-full max-w-md border border-gray-700 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-4">Edit Product</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2 text-sm font-medium">Product Name</label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={editFormData.productName}
                                    onChange={handleEditFormChange}
                                    className="w-full p-2 rounded bg-gray-700/80 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2 text-sm font-medium">Manufacturing Cost</label>
                                <input
                                    type="number"
                                    name="ManufacturingCost"
                                    value={editFormData.ManufacturingCost}
                                    onChange={handleEditFormChange}
                                    className="w-full p-2 rounded bg-gray-700/80 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2 text-sm font-medium">Selling Price</label>
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    value={editFormData.sellingPrice}
                                    onChange={handleEditFormChange}
                                    className="w-full p-2 rounded bg-gray-700/80 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2 text-sm font-medium">Low Stock Level</label>
                                <input
                                    type="number"
                                    name="lowStockLevel"
                                    value={editFormData.lowStockLevel}
                                    onChange={handleEditFormChange}
                                    className="w-full p-2 rounded bg-gray-700/80 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 bg-gray-900/80 rounded-lg border border-gray-800">
                    <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M10.343 5.657a11 11 0 011.414 0M12 3a9 9 0 10.001 18.001A9 9 0 0012 3z"></path>
                    </svg>
                    <p className="text-gray-400 text-lg">No products found.</p>
                    <p className="text-gray-500 mt-2">Try a different search term or add new products.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900/80 shadow">
                    <table className="min-w-full text-left text-sm text-gray-300">
                        <thead className="border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Manufacturing ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Manufacturing Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Selling Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Low Stock Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredProducts.map((product) => (
                                <tr
                                    key={product._id}
                                    className="hover:bg-gray-800/50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-200">{product.manufacturingID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-100">{product.productName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-green-400">${product.ManufacturingCost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-blue-400">${product.sellingPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-amber-400">{product.lowStockLevel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                    {product.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 flex items-center"
                                                onClick={() => handleEdit(product._id)}
                                            >
                                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 flex items-center"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductList;
