import React, { useState } from 'react';
import axios from 'axios';
import './ProductForm.css';

const ProductForm = () => {
  const [product, setProduct] = useState({
    manufacturingID: '',
    productName: '',
    ManufacturingCost: '',
    lowStockLevel: '',
    images: [],
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      images: Array.from(e.target.files)  // Store multiple selected files
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending product data:', product);  // Add this line to log the product details

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('productName', product.productName);
    formData.append('ManufacturingCost', product.ManufacturingCost);
    formData.append('sellingPrice', product.sellingPrice);
    formData.append('lowStockLevel', product.lowStockLevel);

    product.images.forEach((image) => {
      formData.append('images', image);  // Append each image to FormData
    });

    try {
      const response = await axios.post('http://localhost:5000/api/products', formData,{
        headers: {
          'content-type':'multipart/form-data'
        }
      });
      setMessage({ text: response.data.message, type: "success" });
      setProduct({ manufacturingID: '', productName: '', ManufacturingCost: '',sellingPrice: '', lowStockLevel: '', image: '', }); // Clear form
    } catch (error) {

      //console.error('Error adding product:', error.response ? error.response.data : error.message);

      setMessage({ text:error.response?.data?.message || "failed to add product",
        type: "error"
      });
    }
  };

  return (
    <div className='product-form-container'>
      <h1 className="form-title">Add New Product</h1>
      {message.text && (
        <p className={`message ${message.type === "success" ? "success" : "error"}`}>
          {message.text}
        </p>
        )
      }
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
          <label htmlFor="ManufacturingCost">Manufacturing Cost:</label>
          <input
            type="number"
            id="ManufacturingCost"
            name="ManufacturingCost"
            value={product.ManufacturingCost}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sellingPrice">Selling Price:</label>
          <input
            type="number"
            id="sellingPrice"
            name="sellingPrice"
            value={product.sellingPrice}
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
        <div className="form-group">
          <label htmlFor="images">Upload Images:</label>
          <input type="file" id="images" name="images" multiple accept="image/*" onChange={handleImageChange} required />
        </div>
        <button className='submit-button' type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
