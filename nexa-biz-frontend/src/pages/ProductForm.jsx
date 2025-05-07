import React, { useState } from 'react';
import axios from 'axios';
import './ProductForm.css';

const ProductForm = () => {
  const [product, setProduct] = useState({
    productName: '',
    ManufacturingCost: '',
    sellingPrice: '',
    lowStockLevel: '',
    quantity:'',
    images: [],
    size: '',
    theme: '',
    material: '',
    color: '',
    function: '',
    brand: '',
    promotions: [],
    manufacturingDate: new Date().toISOString().split('T')[0]
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
      setMessage({ text: 'Product add fail', type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('productName', product.productName);
    formData.append('ManufacturingCost', product.ManufacturingCost);
    formData.append('sellingPrice', product.sellingPrice);
    formData.append('lowStockLevel', product.lowStockLevel);
    formData.append('quantity', product.quantity);
    formData.append('size', product.size);
    formData.append('theme', product.theme);
    formData.append('material', product.material);
    formData.append('color', product.color);
    formData.append('function', product.function);
    formData.append('brand', product.brand);
    formData.append('promotions', JSON.stringify(product.promotions));
    formData.append('manufacturingDate', product.manufacturingDate);

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
        quantity:'',
        images: [],
        size: '',
        theme: '',
        material: '',
        color: '',
        function: '',
        brand: '',
        promotions: [],
        manufacturingDate: new Date().toISOString().split('T')[0]
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Add New Product</h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          type="button"
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'details' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('details')}
        >
          Product Details
        </button>
        <button
          type="button"
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'pricing' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing
        </button>
        <button
          type="button"
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'images' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('images')}
        >
          Images
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded-md ${message.type === "success" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} id="productForm">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="productName">Product Name:</label>
              <input
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                type="text"
                id="productName"
                name="productName"
                value={product.productName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="manufacturingDate">Manufacturing Date:</label>
              <input
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                type="date"
                id="manufacturingDate"
                name="manufacturingDate"
                value={product.manufacturingDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">By Size:</label>
              <select
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-300 mb-1">By Theme:</label>
              <select
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-300 mb-1">By Material:</label>
              <select
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-300 mb-1">By Color:</label>
              <select
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-300 mb-1">By Function:</label>
              <select
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-300 mb-1">By Brand or Collection:</label>
              <select
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="ManufacturingCost">Manufacturing Cost:</label>
              <input
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
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
                <p className="mt-1 text-sm text-red-400">{errors.ManufacturingCost}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="sellingPrice">Selling Price:</label>
              <input
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
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
                <p className="mt-1 text-sm text-red-400">{errors.sellingPrice}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Promotions:</label>
              <div className="flex flex-wrap gap-2">
                {promotionOptions.map(discount => (
                  <button
                    key={discount}
                    type="button"
                    className={`px-3 py-1 rounded-md text-sm ${product.promotions.includes(discount)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => handlePromotionSelect(discount)}
                  >
                    {discount}%
                  </button>
                ))}
              </div>
              {product.promotions.length > 0 && (
                <p className="mt-2 text-sm text-gray-300">
                  Selected: {product.promotions.join('%, ')}%
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="lowStockLevel">Low Stock Level:</label>
              <input
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                type="number"
                id="lowStockLevel"
                name="lowStockLevel"
                value={product.lowStockLevel}
                onChange={handleChange}
                min="0"
                required
              />
              {errors.lowStockLevel && (
                <p className="mt-1 text-sm text-red-400">{errors.lowStockLevel}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="quantity">Quantity:</label>
              <input
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                id="quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Images:</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-700 hover:border-gray-500 transition-colors">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex justify-center text-sm text-gray-400 mt-2">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-400 hover:text-blue-300">
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1 text-gray-400">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                (PNG, JPG, GIF up to 10MB)
              </p>
              {product.images.length > 0 && (
                <div className="mt-4 p-3 bg-gray-800 rounded-md">
                  <h3 className="text-gray-300 text-sm font-medium">Selected Files:</h3>
                  <ul className="text-gray-400 text-xs mt-1">
                    {product.images.map((file, index) => (
                      <li key={index} className="truncate">{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {activeTab !== 'details' && (
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => setActiveTab(activeTab === 'pricing' ? 'details' : 'pricing')}
            >
              Previous
            </button>
          )}

          {activeTab !== 'images' ? (
            <button
              type="button"
              className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                if (activeTab === 'details') setActiveTab('pricing');
                if (activeTab === 'pricing') setActiveTab('images');
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
