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

    // Display error message
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Display product list
    return (
        <div>
            <h1>Product List</h1>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>
                            <h2>{product.productName}</h2>
                            <p><strong>Manufacturing ID:</strong> {product.manufacturingID}</p>
                            <p><strong>Manufacturing Cost:</strong> ${product.ManufacturingCost}</p>
                            <p><strong>Selling Price:</strong> ${product.sellingPrice}</p>
                            <p><strong>Low Stock Level:</strong> {product.lowStockLevel}</p>
                            {product.images && product.images.length > 0 && (
                                <div>
                                    <strong>Images:</strong>
                                    {product.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:5000/${image}`} // Replace with your backend URL
                                            alt={`Product ${index + 1}`}
                                            style={{ width: '100px', margin: '5px' }}
                                        />
                                    ))}
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
