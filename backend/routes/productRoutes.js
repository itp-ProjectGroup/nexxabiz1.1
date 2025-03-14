const express = require('express');
const {addProduct, getProduct} =  require('../controllers/productController');
const Product = require('../models/Product');

const router = express.Router();

//add a new Product
router.post('/',addProduct);

//get all products
router.get('/',getProduct);

module.exports = router;
