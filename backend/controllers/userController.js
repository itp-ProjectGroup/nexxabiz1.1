import User from "../models/User.js";
import bcrypt from 'bcryptjs';

// Register user
export const registerUser = async (req, res) => {
    try {
        const { 
            u_fullName,
            u_pEmail,
            u_pPhone,
            u_p1stLine,
            u_p2ndLine,
            u_pCity,
            u_pCountry,
            u_pZip,
            u_dob,
            u_gender,
            u_companyName,
            u_businessRegNumber,
            u_cEmail,
            u_cPhone,
            u_c1stLine,
            u_c2ndLine,
            u_cCity,
            u_cCountry,
            u_cZip,
            username,
            password,
            confirmPassword,
            securityQuestion,
            securityAnswer,
        } = req.body;

        if (!u_fullName || !u_pEmail || !u_pPhone || !password || !username) {
          return res.status(400).json({ message: "Required fields are missing" });
        }
        

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Password and Confirm Password do not match' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ u_pEmail }, { username }] });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new User({
          u_fullName,
          u_pEmail,
          u_pPhone,
          u_p1stLine,
          u_p2ndLine,
          u_pCity,
          u_pCountry,
          u_pZip,
          u_dob,
          u_gender,
          u_companyName,
          u_businessRegNumber,
          u_cEmail,
          u_cPhone,
          u_c1stLine,
          u_c2ndLine,
          u_cCity,
          u_cCountry,
          u_cZip,
          username,
          password: hashedPassword,
          confirmPassword: hashedPassword,
          securityQuestion,
          securityAnswer,
        });

        // Save the user to the database
        // The pre-save middleware will generate the sequential userID
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error("🔥 ERROR REGISTERING USER:", error);
        res.status(500).json({ 
          message: "Internal Server Error", 
          error: error.message,
          stack: error.stack  
        });
    }
};

// Fetch all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "userID u_companyName u_status u_fullName"); // Select only necessary fields
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Fetch a single user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ userID: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userID: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ userID: req.params.id });
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};