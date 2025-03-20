import React from 'react';
import ProductForm from './components/ProductForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProductList from './components/ProductList';
import './index.css';

function App() {
  return (
    <Router>
      <Navigation />
    <Routes>

        < Route path ="/add" element= {<ProductForm/>}/>
        <Route path="/all" element={<ProductList />} />

        </Routes>
    </Router>
  );
}

export default App;
