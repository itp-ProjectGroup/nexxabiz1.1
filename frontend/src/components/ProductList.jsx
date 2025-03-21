import React, { useEffect, useState } from 'react';
import axios from 'axios';


const ProductList = () => {
    const [products, setProducts] = useState([]); // State to store products
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to handle errors
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products/all'); // Replace with your backend URL
                setProducts(response.data); // Set the fetched products to state
                setLoading(false); // Set loading to false
                setFilteredProducts(response.data); //// Initialize filteredProducts with the same data
            } catch (err) {
                setError(err.message); // Set error message
                setLoading(false); // Set loading to false
            }
        };

        fetchProducts();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Display loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleSearch = (searchTerm) => {
        const filtered = products.filter((product) =>
            product.manufacturingID.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };


    // Display product list
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.images}</td>
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
