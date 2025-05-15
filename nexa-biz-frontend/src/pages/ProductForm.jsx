import React, { useState, useRef } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [product, setProduct] = useState({
    productName: '',
    ManufacturingCost: '',
    sellingPrice: '',
    lowStockLevel: '',
    quantity: '',
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
  const inputRefs = useRef({});

  const sizeOptions = ['Small', 'Medium', 'Large', 'Giant'];
  const themeOptions = ['Birthday', 'Valentine\'s Day', 'Graduation', 'Get Well Soon'];
  const materialOptions = ['Plush', 'Cotton', 'Fleece', 'Eco-friendly / Recycled materials'];
  const colorOptions = ['Brown', 'White', 'Pink', 'Multi-color'];
  const functionOptions = ['Singing / Musical', 'Light-up', 'Talking', 'Customizable (with name/photo)'];
  const brandOptions = ['Branded teddy bears', 'Handmade collection', 'Limited Edition'];
  const promotionOptions = [10, 20, 30, 40, 50];

  const validateField = (name, value) => {
    const newErrors = {};
    if (!value && inputRefs.current[name]?.required) {
      newErrors[name] = `${name.replace(/([A-Z])/g, ' $1').trim()} is required`;
    } else if (name === 'productName' && value.length < 3) {
      newErrors[name] = 'Product name must be at least 3 characters';
    } else if (['ManufacturingCost', 'sellingPrice', 'lowStockLevel', 'quantity'].includes(name)) {
      if (isNaN(value) || value === '') {
        newErrors[name] = `${name.replace(/([A-Z])/g, ' $1').trim()} must be a valid number`;
      } else if (parseFloat(value) < 0) {
        newErrors[name] = `${name.replace(/([A-Z])/g, ' $1').trim()} cannot be negative`;
      } else if (name === 'sellingPrice' && product.ManufacturingCost && parseFloat(value) <= parseFloat(product.ManufacturingCost)) {
        newErrors[name] = 'Selling price must be higher than manufacturing cost';
      }
    }
    return newErrors[name] || '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    const fields = Object.keys(inputRefs.current);
    const currentIndex = fields.indexOf(name);

    for (let i = 0; i < currentIndex; i++) {
      const prevField = fields[i];
      const prevValue = product[prevField];
      const error = validateField(prevField, prevValue);
      if (error) {
        setErrors(prev => ({ ...prev, [prevField]: error }));
        inputRefs.current[prevField]?.focus();
        return;
      }
    }
  };

  const handleImageChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      images: Array.from(e.target.files)
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
    Object.keys(inputRefs.current).forEach(name => {
      const error = validateField(name, product[name]);
      if (error) newErrors[name] = error;
    });
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
    Object.entries(product).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((image) => formData.append('images', image));
      } else if (key === 'promotions') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: { 'content-type': 'multipart/form-data' }
      });
      setMessage({ text: response.data.message, type: "success" });
      setProduct({
        productName: '',
        ManufacturingCost: '',
        sellingPrice: '',
        lowStockLevel: '',
        quantity: '',
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
      setErrors({});
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

      <div className="flex border-b border-gray-700 mb-6">
        {['details', 'pricing', 'images'].map(tab => (
          <button
            key={tab}
            type="button"
            className={`py-2 px-4 font-medium text-sm ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded-md ${message.type === "success" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"}`}>
          {message.text}
        </div>
      )}

      <form id="productForm">
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
                onFocus={handleFocus}
                ref={el => inputRefs.current.productName = el}
                required
              />
              {errors.productName && <p className="mt-1 text-sm text-red-400">{errors.productName}</p>}
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
                onFocus={handleFocus}
                ref={el => inputRefs.current.manufacturingDate = el}
                required
              />
              {errors.manufacturingDate && <p className="mt-1 text-sm text-red-400">{errors.manufacturingDate}</p>}
            </div>

            {['size', 'theme', 'material', 'color', 'function', 'brand'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{`By ${field.charAt(0).toUpperCase() + field.slice(1)}:`}</label>
                <select
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                  value={product[field]}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  name={field}
                  ref={el => inputRefs.current[field] = el}
                >
                  <option value="">Select {field}</option>
                  {(field === 'size' ? sizeOptions :
                    field === 'theme' ? themeOptions :
                    field === 'material' ? materialOptions :
                    field === 'color' ? colorOptions :
                    field === 'function' ? functionOptions :
                    brandOptions).map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                {errors[field] && <p className="mt-1 text-sm text-red-400">{errors[field]}</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {['ManufacturingCost', 'sellingPrice', 'lowStockLevel', 'quantity'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').trim()}:</label>
                <input
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  id={field}
                  name={field}
                  value={product[field]}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  min="0"
                  step={field === 'ManufacturingCost' || field === 'sellingPrice' ? "0.01" : "1"}
                  ref={el => inputRefs.current[field] = el}
                  required
                />
                {errors[field] && <p className="mt-1 text-sm text-red-400">{errors[field]}</p>}
              </div>
            ))}

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
          </div>
        )}

        {activeTab === 'images' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Images:</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-700 hover:border-gray-500 transition-colors">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656  halogenL28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
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
                if (validateForm()) {
                  setActiveTab(activeTab === 'details' ? 'pricing' : 'images');
                } else {
                  const firstErrorField = Object.keys(errors).find(key => errors[key]);
                  if (firstErrorField) inputRefs.current[firstErrorField]?.focus();
                }
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="ml-auto px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={handleSubmit}
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
