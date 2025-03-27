import express from "express";
import { createPayment } from "../controllers/paymentController.js"; // Import the controller function

const router = express.Router();

// Define the POST route for creating a new payment
router.post("/", createPayment);

export default router;
