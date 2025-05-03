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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <select
              name="size"
              value={product.size}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select size</option>
              {sizeOptions.map((size, index) => (
                <option key={index} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturing Cost</label>
            <input
              type="number"
              name="ManufacturingCost"
              value={product.ManufacturingCost}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            {errors.ManufacturingCost && (
              <p className="mt-1 text-sm text-red-600">{errors.ManufacturingCost}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Selling Price</label>
            <input
              type="number"
              name="sellingPrice"
              value={product.sellingPrice}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            {errors.sellingPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.sellingPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Low Stock Level</label>
            <input
              type="number"
              name="lowStockLevel"
              value={product.lowStockLevel}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            {errors.lowStockLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.lowStockLevel}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
