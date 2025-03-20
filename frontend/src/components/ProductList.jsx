import React, { useEffect, useState } from 'react';
import axios from 'axios';


const ProductList = () => {
    const [products, setProducts] = useState([]); // State to store products
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to handle errors

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products/all'); // Replace with your backend URL
                setProducts(response.data); // Set the fetched products to state
                setLoading(false); // Set loading to false
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

    // Display product list
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            {products.length === 0 ? (
                <p  className="text-gray-600">No products found.</p>
            ) : (
                <ul className="w-full">
                    {products.map((product) => (
                        <li key={product._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-2">{product.productName}</h2>
                            <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <p ><strong className="font-medium">Manufacturing ID:</strong> {product.manufacturingID}</p>
                                <p><strong className="font-medium">Manufacturing Cost:</strong> ${product.ManufacturingCost}</p>
                                <p><strong className="font-medium">Selling Price:</strong> ${product.sellingPrice}</p>
                                <p><strong className="font-medium">Low Stock Level:</strong> {product.lowStockLevel}</p>
                            </div>
                            {product.images && product.images.length > 0 && (
                                <div className="mt-4">
                                    <strong className="font-medium">Images:</strong>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                    {product.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:5000/${image}`} // Replace with your backend URL
                                            alt={`Product ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded-md border"
                                        />
                                    ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductList;
