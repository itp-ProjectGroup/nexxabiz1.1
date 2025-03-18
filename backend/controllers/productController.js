const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Store images in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });


//add a new product
const addProduct = async (req,res) => {
    const{manufacturingID, productName, ManufacturingCost, sellingPrice, lowStockLevel} = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    try{
        const newProduct = new Product({manufacturingID,productName,ManufacturingCost,sellingPrice,lowStockLevel,images});
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

module.exports = {addProduct, upload}

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
