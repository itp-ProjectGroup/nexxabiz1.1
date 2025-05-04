import React from 'react';
import ProductForm from './components/ProductForm';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProductList from './components/ProductList';
import './index.css';
import Stock from './components/Stock';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<ProductForm />} />
            <Route path="/all" element={<ProductList />} />
            <Route path="/stock" element={<Stock />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
