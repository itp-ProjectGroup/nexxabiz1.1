import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [product, setProduct] = useState({
    manufacturingID: '',
    productName: '',
    price: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending product data:', product);  // Add this line to log the product details
    try {
      const response = await axios.post('http://localhost:5000/api/products', product);
      setMessage(response.data.message);
      setProduct({ manufacturingID: '', productName: '', price: '' }); // Clear form
    } catch (error) {
      //setMessage('Error adding product!');
      console.error('Error adding product:', error.response ? error.response.data : error.message);
      //setMessage(`Error adding product! ${error.response ? error.response.data.message : error.message}`);
      setMessage(`Error adding product! ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="manufacturingID">Manufacturing ID:</label>
          <input
            type="text"
            id="manufacturingID"
            name="manufacturingID"
            value={product.manufacturingID}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
