import User from "../models/User.js";

// Register user
export const registerUser = async (req, res) => {
    try {
        const { u_businessname, u_email, u_phoneNo, u_address } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ u_email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Create new user
        const newUser = new User({ u_businessname, u_email, u_phoneNo, u_address });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error: error.message });
    }
};
