import express from "express";
import { getOrders,getOrderById } from "../controllers/orderController.js"; // ✅ Ensure .js extension

const router = express.Router();

// Fetch all orders
router.get("/", getOrders);
router.get("/:id", getOrderById);

export default router; // ✅ Export default
