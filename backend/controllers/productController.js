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

// Function to generate a unique Manufacturing ID
const generateManufacturingID = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');  // Format: YYYYMMDD
    const randomPart = Math.floor(1000 + Math.random() * 9000);  // Random 4-digit number
    return `MF-${datePart}-${randomPart}`;
};

//add a new product
const addProduct = async (req,res) => {
    const {
        productName,
        ManufacturingCost,
        sellingPrice,
        lowStockLevel,
        size,
        theme,
        material,
        color,
        function: productFunction,
        brand,
        promotions
    } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    try{
        const manufacturingID = generateManufacturingID(); //generate unique id
        const newProduct = new Product({
            manufacturingID,
            productName,
            ManufacturingCost,
            sellingPrice,
            lowStockLevel,
            images,
            size,
            theme,
            material,
            color,
            function: productFunction,
            brand,
            promotions: promotions ? JSON.parse(promotions) : []
        });

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

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        productName,
        ManufacturingCost,
        sellingPrice,
        lowStockLevel,
        size,
        theme,
        material,
        color,
        function: productFunction,
        brand,
        promotions
    } = req.body;

    try {
        // Find the product by ID and update it
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                productName,
                ManufacturingCost,
                sellingPrice,
                lowStockLevel,
                size,
                theme,
                material,
                color,
                function: productFunction,
                brand,
                promotions: promotions ? JSON.parse(promotions) : []
            },
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Error updating product' });
    }
};

// Get single product by ID
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Error fetching product' });
    }
};


const getChartData = async (req, res) => {
    try {
      const products = await Product.find();

      // Monthly aggregation
      const monthlyData = await Product.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: "$lowStockLevel" }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      // Size distribution
      const sizeData = await Product.aggregate([
        { $group: { _id: "$size", count: { $sum: 1 } } }
      ]);

      res.status(200).json({
        products, // Send raw products data
        aggregatedData: {
          monthlyData,
          sizeData
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addProduct,
    getProduct,
    updateProduct,
    getSingleProduct,
    getChartData
};
