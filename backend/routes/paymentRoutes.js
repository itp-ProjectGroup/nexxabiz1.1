import express from "express";
import { createPayment, getAllPayments } from "../controllers/paymentController.js"; // Import the controller function

const router = express.Router();

// Define the POST route for creating a new payment
router.post("/", createPayment);
router.get("/", getAllPayments); // ✅ GET route for fetching payments

export default router;
