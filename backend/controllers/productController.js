const Product = require('../models/Product');

//add a new product
const addProduct = async (req,res) => {
    const{manufacturingID, productName, price} = req.body;

    try{
        const newProduct = new Product({manufacturingID,productName,price});
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    }
    catch(err){
        console.error('Error adding product:', err);

        let errorMessage = 'Internal Server Error';

        if (err.code === 11000) { // Duplicate key error (Unique constraint)
            errorMessage = 'Manufacturing ID must be unique';
        } else if (err.name === 'ValidationError') { // Mongoose validation errors
            errorMessage = 'Invalid product data';
        }

        res.status(500).json({message: errorMessage });
    }
};

//get all products
const getProduct = async (req,res) => {
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

module.exports = {addProduct, getProduct};
