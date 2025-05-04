import express from "express";
import { getOrders,getOrderById, updateOverdueDate} from "../controllers/orderController.js"; // ✅ Ensure .js extension

const router = express.Router();

// Fetch all orders
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/overdue", updateOverdueDate);

export default router; // ✅ Export default
