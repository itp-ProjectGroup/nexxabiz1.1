import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    u_fullName: { type: String, required: true },
    u_pEmail: { type: String, required: true, unique: true },
    u_pPhone: { type: String, required: true },
    u_p1stLine: { type: String, required: true },
    u_p2ndLine: { type: String, required: true },
    u_pCity: { type: String, required: true },
    u_pCountry: { type: String, required: true },
    u_pZip: { type: String, required: true },
    u_dob: { type: Date, required: true },
    u_gender: { type: String, required: true },
    u_companyName: { type: String },
    u_businessRegNumber: { type: String },
    u_cEmail: { type: String },
    u_cPhone: { type: String },
    u_c1stLine: { type: String },
    u_c2ndLine: { type: String },
    u_cCity: { type: String },
    u_cCountry: { type: String },
    u_cZip: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    securityQuestion: { type: String, required: true },
    securityAnswer: { type: String, required: true },
    u_status: { type: String, enum: ["inactivate", "activate"], default: "inactivate" }, // New field to track approval status
    u_pricingRate: { type: Number, default: null }, // Dynamic pricing rate
    u_discountRate: { type: Number, default: null }, // Discount rate
    u_advanceRate: { type: Number, default: null } // Advance rate
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
