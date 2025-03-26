const express = require('express');
const {addProduct, getProduct,updateProduct} =  require('../controllers/productController');
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

// Update a product
router.put('/:id', updateProduct);

module.exports = router;
