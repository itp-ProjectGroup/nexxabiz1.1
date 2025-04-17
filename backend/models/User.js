import mongoose from "mongoose";

// Create a schema for tracking the last used user ID
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Function to generate a sequential user ID
const generateSequentialUserId = async () => {
    try {
        // Find the counter document or create it if it doesn't exist
        let counter = await Counter.findById('userID');
        
        if (!counter) {
            // Initialize the counter if it doesn't exist
            counter = new Counter({ _id: 'userID', seq: 0 });
        }
        
        // Increment the counter
        counter.seq += 1;
        await counter.save();
        
        // Format the ID with leading zeros (6 digits)
        const formattedId = `UID${String(counter.seq).padStart(6, '0')}`;
        return formattedId;
    } catch (error) {
        console.error('Error generating sequential user ID:', error);
        // Fallback to a random ID if there's an error
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        return `UID${randomNum}`;
    }
};

const userSchema = new mongoose.Schema({
    userID: { type: String, unique: true },
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

// Pre-save middleware to generate a sequential userID if not provided
userSchema.pre('save', async function(next) {
    if (!this.userID) {
        this.userID = await generateSequentialUserId();
    }
    next();
});

// Remove the toJSON transform since we now have a dedicated userID field
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

export default User;
