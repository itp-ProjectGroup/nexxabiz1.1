import React, { useState } from 'react';
import axios from 'axios';
import './ProductForm.css';

const ProductForm = () => {
  const [product, setProduct] = useState({
    productName: '',
    ManufacturingCost: '',
    sellingPrice: '',
    lowStockLevel: '',
    images: [],
    size: '',
    theme: '',
    material: '',
    color: '',
    function: '',
    brand: '',
    promotions: []
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('details');

  // Dropdown options
  const sizeOptions = ['Small', 'Medium', 'Large', 'Giant'];
  const themeOptions = ['Birthday', 'Valentine\'s Day', 'Graduation', 'Get Well Soon'];
  const materialOptions = ['Plush', 'Cotton', 'Fleece', 'Eco-friendly / Recycled materials'];
  const colorOptions = ['Brown', 'White', 'Pink', 'Multi-color'];
  const functionOptions = ['Singing / Musical', 'Light-up', 'Talking', 'Customizable (with name/photo)'];
  const brandOptions = ['Branded teddy bears', 'Handmade collection', 'Limited Edition'];
  const promotionOptions = [10, 20, 30, 40, 50];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      images: Array.from(e.target.files)
    }));
  };

  const handleMultiSelect = (name, value) => {
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePromotionSelect = (value) => {
    setProduct(prev => ({
      ...prev,
      promotions: prev.promotions.includes(value)
        ? prev.promotions.filter(p => p !== value)
        : [...prev.promotions, value]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (product.sellingPrice < 0) {
      newErrors.sellingPrice = 'Selling price cannot be negative';
    }
    if (product.ManufacturingCost < 0) {
      newErrors.ManufacturingCost = 'Manufacturing cost cannot be negative';
    }
    if (product.sellingPrice && product.ManufacturingCost &&
        parseFloat(product.sellingPrice) <= parseFloat(product.ManufacturingCost)) {
      newErrors.sellingPrice = 'Selling price must be higher than manufacturing cost';
    }
    if (product.lowStockLevel < 0) {
      newErrors.lowStockLevel = 'Low stock level cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage({ text: 'Please fix the errors in the form', type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('productName', product.productName);
    formData.append('ManufacturingCost', product.ManufacturingCost);
    formData.append('sellingPrice', product.sellingPrice);
    formData.append('lowStockLevel', product.lowStockLevel);
    formData.append('size', product.size);
    formData.append('theme', product.theme);
    formData.append('material', product.material);
    formData.append('color', product.color);
    formData.append('function', product.function);
    formData.append('brand', product.brand);
    formData.append('promotions', JSON.stringify(product.promotions));

    product.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      });

      setMessage({ text: response.data.message, type: "success" });
      setProduct({
        productName: '',
        ManufacturingCost: '',
        sellingPrice: '',
        lowStockLevel: '',
        images: [],
        size: '',
        theme: '',
        material: '',
        color: '',
        function: '',
        brand: '',
        promotions: []
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to add product",
        type: "error"
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className='max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800 mt-20'>
    <h1 className="text-xl font-bold text-white capitalize dark:text-white">Add New Product</h1>

    {/* Tab Navigation */}
    <div className="flex border-b border-gray-200 dark:border-gray-700 mt-4">
      <button
        className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'text-white border-b-2 border-white' : 'text-gray-300'}`}
        onClick={() => setActiveTab('details')}
      >
        Product Details
      </button>
      <button
        className={`py-2 px-4 font-medium ${activeTab === 'pricing' ? 'text-white border-b-2 border-white' : 'text-gray-300'}`}
        onClick={() => setActiveTab('pricing')}
      >
        Pricing
      </button>
      <button
        className={`py-2 px-4 font-medium ${activeTab === 'images' ? 'text-white border-b-2 border-white' : 'text-gray-300'}`}
        onClick={() => setActiveTab('images')}
      >
        Images
      </button>
    </div>

    {message && (
      <p className={`mt-2 p-2 text-center text-white ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
        {message.text}
      </p>
    )}

    <form onSubmit={handleSubmit} className="product-form">
      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className='text-white dark:text-gray-200' htmlFor="productName">Product Name:</label>
            <input
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring'
              type="text"
              id="productName"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Size Selector */}
          <div>
            <label className='text-white dark:text-gray-200'>By Size:</label>
            <select
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              value={product.size}
              onChange={(e) => handleChange(e)}
              name="size"
            >
              <option value="">Select size</option>
              {sizeOptions.map((size, index) => (
                <option key={index} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Theme Selector */}
          <div>
            <label className='text-white dark:text-gray-200'>By Theme:</label>
            <select
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              value={product.theme}
              onChange={(e) => handleChange(e)}
              name="theme"
            >
              <option value="">Select theme</option>
              {themeOptions.map((theme, index) => (
                <option key={index} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          {/* Material Selector */}
          <div>
            <label className='text-white dark:text-gray-200'>By Material:</label>
            <select
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              value={product.material}
              onChange={(e) => handleChange(e)}
              name="material"
            >
              <option value="">Select material</option>
              {materialOptions.map((material, index) => (
                <option key={index} value={material}>{material}</option>
              ))}
            </select>
          </div>

          {/* Color Selector */}
          <div>
            <label className='text-white dark:text-gray-200'>By Color:</label>
            <select
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              value={product.color}
              onChange={(e) => handleChange(e)}
              name="color"
            >
              <option value="">Select color</option>
              {colorOptions.map((color, index) => (
                <option key={index} value={color}>{color}</option>
              ))}
            </select>
          </div>

          {/* Function Selector */}
          <div>
            <label className='text-white dark:text-gray-200'>By Function:</label>
            <select
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              value={product.function}
              onChange={(e) => handleChange(e)}
              name="function"
            >
              <option value="">Select function</option>
              {functionOptions.map((func, index) => (
                <option key={index} value={func}>{func}</option>
              ))}
            </select>
          </div>

          {/* Brand Selector */}
          <div>
            <label className='text-white dark:text-gray-200'>By Brand or Collection:</label>
            <select
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              value={product.brand}
              onChange={(e) => handleChange(e)}
              name="brand"
            >
              <option value="">Select brand/collection</option>
              {brandOptions.map((brand, index) => (
                <option key={index} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <label className='text-white dark:text-gray-200' htmlFor="ManufacturingCost">Manufacturing Cost:</label>
            <input
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring'
              type="number"
              id="ManufacturingCost"
              name="ManufacturingCost"
              value={product.ManufacturingCost}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
            {errors.ManufacturingCost && (
              <p className="mt-1 text-sm text-red-300">{errors.ManufacturingCost}</p>
            )}
          </div>

          <div>
            <label className='text-white dark:text-gray-200' htmlFor="sellingPrice">Selling Price:</label>
            <input
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring'
              type="number"
              id="sellingPrice"
              name="sellingPrice"
              value={product.sellingPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
            {errors.sellingPrice && (
              <p className="mt-1 text-sm text-red-300">{errors.sellingPrice}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className='text-white dark:text-gray-200'>Promotions:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {promotionOptions.map(discount => (
                <button
                  key={discount}
                  type="button"
                  className={`px-3 py-1 rounded-md ${product.promotions.includes(discount)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => handlePromotionSelect(discount)}
                >
                  {discount}%
                </button>
              ))}
            </div>
            {product.promotions.length > 0 && (
              <p className="mt-2 text-sm text-white">
                Selected: {product.promotions.join('%, ')}%
              </p>
            )}
          </div>

          <div>
            <label className='text-white dark:text-gray-200' htmlFor="lowStockLevel">Low Stock Level:</label>
            <input
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring'
              type="number"
              id="lowStockLevel"
              name="lowStockLevel"
              value={product.lowStockLevel}
              onChange={handleChange}
              min="0"
              required
            />
            {errors.lowStockLevel && (
              <p className="mt-1 text-sm text-red-300">{errors.lowStockLevel}</p>
            )}
          </div>
        </div>
      )}

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-white" htmlFor="images">Upload Images:</label>
          <div className='space-y-1 text-center border-2 border-dashed border-gray-300 p-4 rounded-lg mt-2'>
            <svg className="mx-auto h-12 w-12 text-white" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className='flex text-sm text-gray-600'>
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
      )}

      <div className='flex justify-between mt-6'>
        {activeTab !== 'details' && (
          <button
            type="button"
            className='px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-500 rounded-md hover:bg-gray-700 focus:outline-none'
            onClick={() => setActiveTab(activeTab === 'pricing' ? 'details' : 'pricing')}
          >
            Previous
          </button>
        )}

        {activeTab !== 'images' ? (
          <button
            type="button"
            className='px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none ml-auto'
            onClick={() => setActiveTab(activeTab === 'details' ? 'pricing' : 'images')}
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className='px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none ml-auto'
          >
            Add Product
          </button>
        )}
      </div>
    </form>
  </div>
);
};

export default ProductForm;
