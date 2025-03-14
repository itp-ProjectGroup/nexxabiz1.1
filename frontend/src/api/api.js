import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products'; // Adjust the API endpoint

// Function to add a product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};
