const express = require('express');
const { addProduct, getProduct, updateProduct, getSingleProduct } = require('../controllers/productController');
const Product = require('../models/Product');
const multer = require('multer');

const router = express.Router();

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Images will be stored in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Rename file with timestamp
    }
});

const upload = multer({ storage: storage });

//add a new Product
router.post('/', upload.array('images',5),(req,res, next)=>{
    console.log("Received fields:", req.body); // Log text fields
    console.log("Received files:", req.files); // Log uploaded files
    next();
},addProduct);

//get all products
router.get('/all',getProduct);

// Get single product by ID
router.get('/:id', getSingleProduct);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
