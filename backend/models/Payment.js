import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    paymentId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    paymentAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    remark: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment; // ✅ Export as ES Module