import express from "express";
import { createPayment, getAllPayments, updatePayment, deletePayment } from "../controllers/paymentController.js"; // Import the controller function

const router = express.Router();

// Define the POST route for creating a new payment
router.post("/", createPayment);
router.get("/", getAllPayments); // ✅ GET route for fetching payments
router.put("/:paymentId", updatePayment);
router.delete("/:paymentId", deletePayment);

export default router;
