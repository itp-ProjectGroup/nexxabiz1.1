import Product from "../models/Product.js";
import multer from 'multer';
import path from 'path';

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ manufacturing_ID: req.params.id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Function to generate unique Manufacturing ID
const generateManufacturingID = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `MF-${datePart}-${randomPart}`;
};

// Add a new product
export const addProduct = async (req, res) => {
    const {
        productName,
        ManufacturingCost,
        sellingPrice,
        lowStockLevel,
        quantity,
        manufacturingDate,
        size,
        theme,
        material,
        color,
        function: productFunction,
        brand,
        promotions
    } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    try {
        const manufacturingID = generateManufacturingID();
        const newProduct = new Product({
            manufacturingID,
            productName,
            ManufacturingCost,
            sellingPrice,
            lowStockLevel,
            quantity,
            manufacturingDate,
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
    } catch (err) {
        console.error('Error adding product:', err);

        let errorMessage = 'Internal Server Error';

        if (err.code === 11000) {
            errorMessage = 'Manufacturing ID must be unique';
        } else if (err.name === 'ValidationError') {
            errorMessage = 'Invalid product data';
        }

        res.status(500).json({ message: errorMessage });
    }
};


export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        productName,
        ManufacturingCost,
        sellingPrice,
        lowStockLevel,
        quantity,
        manufacturingDate,
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
                quantity,
                manufacturingDate,
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

// Get chart data function
export const getChartData = async (req, res) => {
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

