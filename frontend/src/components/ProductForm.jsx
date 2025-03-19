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
      setProduct({  productName: '', ManufacturingCost: '',sellingPrice: '', lowStockLevel: '', image: '', }); // Clear form
    } catch (error) {

      //console.error('Error adding product:', error.response ? error.response.data : error.message);

      setMessage({ text:error.response?.data?.message || "failed to add product",
        type: "error"
      });
    }
  };

  return (
    <div className='max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800 mt-20'>
      <h1 className="text-xl font-bold text-white capitalize dark:text-white">Add New Product</h1>
      {message.text && (
        <p className={`message ${message.type === "success" ? "success" : "error"}`}>
          {message.text}
        </p>
        )
      }
      <form onSubmit={handleSubmit}  className="product-form">
      <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
        <div>
          <label className='text-white dark:text-gray-200' htmlFor="productName">Product Name:</label>
          <input
            className='block w-full px-4 py-2 mt-2 text-gray-700
                        bg-white border border-gray-300 rounded-md dark:bg-gray-800
                        dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
                        dark:focus:border-blue-500 focus:outline-none focus:ring'
            type="text"
            id="productName"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label  className='text-white dark:text-gray-200' htmlFor="ManufacturingCost">Manufacturing Cost:</label>
          <input
            className='block w-full px-4 py-2 mt-2 text-gray-700
                        bg-white border border-gray-300 rounded-md dark:bg-gray-800
                        dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
                        dark:focus:border-blue-500 focus:outline-none focus:ring'
            type="number"
            id="ManufacturingCost"
            name="ManufacturingCost"
            value={product.ManufacturingCost}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className='text-white dark:text-gray-200' htmlFor="sellingPrice">Selling Price:</label>
          <input
             className='block w-full px-4 py-2 mt-2 text-gray-700
                        bg-white border border-gray-300 rounded-md dark:bg-gray-800
                        dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
                        dark:focus:border-blue-500 focus:outline-none focus:ring'
            type="number"
            id="sellingPrice"
            name="sellingPrice"
            value={product.sellingPrice}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className='text-white dark:text-gray-200' htmlFor="lowStockLevel">Low Stock Level:</label>
          <input
             className='block w-full px-4 py-2 mt-2 text-gray-700
                        bg-white border border-gray-300 rounded-md dark:bg-gray-800
                        dark:text-gray-300 dark:border-gray-600 focus:border-blue-500
                        dark:focus:border-blue-500 focus:outline-none focus:ring'
            type="number"
            id="lowStockLevel"
            name="lowStockLevel"
            value={product.lowStockLevel}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white" htmlFor="images">Upload Images:</label>
          <div className='space-y-1 text-center border-2 border-dashed border-gray-300 p-4 rounded-lg'>
              <svg className="mx-auto h-12 w-12 text-white" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div className='flex text-sm text-gray-600 '>
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span className="">Upload a file</span>
                    <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                    />
                  </label>
                  <p className="pl-1 text-white">or drag and drop</p>
              </div>
              <p className="text-xs text-white">
                    (PNG, JPG, GIF up to 10MB)
              </p>
              {product.images.length > 0 && (
              <div className="mt-2 p-2 bg-gray-700 rounded-md">
                <h3 className="text-white text-sm font-semibold">Selected Files:</h3>
                <ul className="text-gray-300 text-xs">
                  {product.images.map((file, index) => (
                    <li key={index} className="truncate">{file.name}</li>
                  ))}
                </ul>
              </div>
              )}
          </div>

        </div>
      </div>
      <div className='flex justify-end mt-6'>
        <button className='px-6 py-2 leading-5 text-white transition-colors duration-200
                            transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none
                            focus:bg-gray-600'
                            type="submit">Add Product</button>
      </div>

      </form>
    </div>
  );
};

export default ProductForm;
