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

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products/all');
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

            // Update the products list
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
        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`);
            const updatedProducts = products.filter(product => product._id !== productId);
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Failed to delete product');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='p-6 dark:bg-gray-800 min-h-screen'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Product List</h1>
                <input
                    type="text"
                    placeholder="Search by Manufacturing ID"
                    className="p-2 rounded-lg dark:bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Edit Product</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-white mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={editFormData.productName}
                                    onChange={handleEditFormChange}
                                    className="w-full p-2 rounded dark:bg-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white mb-2">Manufacturing Cost</label>
                                <input
                                    type="number"
                                    name="ManufacturingCost"
                                    value={editFormData.ManufacturingCost}
                                    onChange={handleEditFormChange}
                                    className="w-full p-2 rounded dark:bg-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white mb-2">Selling Price</label>
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    value={editFormData.sellingPrice}
                                    onChange={handleEditFormChange}
                                    className="w-full p-2 rounded dark:bg-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white mb-2">Low Stock Level</label>
                                <input
                                    type="number"
                                    name="lowStockLevel"
                                    value={editFormData.lowStockLevel}
                                    onChange={handleEditFormChange}
                                    className="w-full p-2 rounded dark:bg-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {filteredProducts.length === 0 ? (
                <p className="text-gray-400">No products found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full dark:bg-gray-900 rounded-lg overflow-hidden">
                        <thead className="bg-blue-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Manufacturing ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Manufacturing Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Selling Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Low Stock Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Images</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-700">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-blue-750">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.manufacturingID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.productName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${product.ManufacturingCost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${product.sellingPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.lowStockLevel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {product.images && product.images.length > 0 ? (
                                            product.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Product ${index}`}
                                                    className="h-10 w-10 object-cover rounded inline-block mr-1"
                                                />
                                            ))
                                        ) : 'No images'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600"
                                            onClick={() => handleEdit(product._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </button>
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
