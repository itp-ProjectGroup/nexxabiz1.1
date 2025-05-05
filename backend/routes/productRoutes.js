import express from "express";
import { getProductById, getAllProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);  // Add this route to get all products
router.get("/:id", getProductById);

export default router;