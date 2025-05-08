import express from "express";
import {
    getOrders,
    getOrderById,
    updateOverdueDate,
    updateOrderPaymentStatus,
    createOrder,
    deleteOrder,
    updateOrder
} from "../controllers/orderController.js";

const router = express.Router();

// Create new order
router.post("/", createOrder);

// Fetch all orders
router.get("/", getOrders);
router.get("/:id", getOrderById);

// Update and delete operations
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

// Other operations
router.put("/:id/overdue", updateOverdueDate);
router.patch("/:orderId/status", updateOrderPaymentStatus);

export default router;
