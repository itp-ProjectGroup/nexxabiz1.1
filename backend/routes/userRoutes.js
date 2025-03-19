import express from "express";
import { registerUser, getAllUsers, getUserById } from "../controllers/userController.js";

const router = express.Router();

// User Registration Route
router.post("/register", registerUser);

// Fetch all users
router.get("/", getAllUsers);

// Fetch a single user by ID
router.get("/:id", getUserById);

export default router;
