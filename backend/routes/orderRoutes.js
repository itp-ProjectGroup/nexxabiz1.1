import express from "express";
import { getOrders } from "../controllers/orderController.js"; // ✅ Ensure .js extension

const router = express.Router();

// Fetch all orders
router.get("/", getOrders);

export default router; // ✅ Export default
