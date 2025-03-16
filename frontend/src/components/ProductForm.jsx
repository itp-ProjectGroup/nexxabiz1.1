import React, { useState } from 'react';
import axios from 'axios';
import './ProductForm.css';

const ProductForm = () => {
  const [product, setProduct] = useState({
    manufacturingID: '',
    productName: '',
    price: '',
    lowStockLevel: '',
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
      setProduct({ manufacturingID: '', productName: '', price: '',lowStockLevel: '', }); // Clear form
    } catch (error) {
      //setMessage('Error adding product!');
      console.error('Error adding product:', error.response ? error.response.data : error.message);
      //setMessage(`Error adding product! ${error.response ? error.response.data.message : error.message}`);
      setMessage(`Error adding product! ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className='product-form-container'>
      <h1 className="form-title">Add New Product</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}  className="product-form">
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
          <label htmlFor="lowStockLevel">Low Stock Level:</label>
          <input
            type="number"
            id="lowStockLevel"
            name="lowStockLevel"
            value={product.lowStockLevel}
            onChange={handleChange}
            required
          />
        </div>
        <button className='submit-button' type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
