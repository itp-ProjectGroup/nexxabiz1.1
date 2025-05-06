import express from "express";
import { getOrders,getOrderById, updateOverdueDate, updateOrderPaymentStatus} from "../controllers/orderController.js"; // ✅ Ensure .js extension

const router = express.Router();

// Fetch all orders
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/overdue", updateOverdueDate);
router.patch("/:orderId/status", updateOrderPaymentStatus);

export default router; // ✅ Export default
