import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema({
    u_businessname: { type: String, required: true },
    u_email: { type: String, required: true, unique: true },
    u_phoneNo: { type: String, required: true },
    u_address: { type: String, required: true },
}, { timestamps: true });

// Automatically create a UserID as a primary key
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.userID = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

export default User;
