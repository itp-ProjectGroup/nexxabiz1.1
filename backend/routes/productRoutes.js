import express from "express";
import multer from 'multer';
import Product from "../models/Product.js";
import { getProductById, getAllProducts, addProduct, updateProduct, getChartData} from "../controllers/productController.js";

const router = express.Router();

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });

// Add a new Product
router.post('/', upload.array('images', 5), (req, res, next) => {
    console.log("Received fields:", req.body);
    console.log("Received files:", req.files);
    next();
}, addProduct);
router.get("/", getAllProducts);  // Add this route to get all products
router.get("/:id", getProductById);

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

//charts
router.get('/charts', getChartData);

export default router;
