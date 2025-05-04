import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    od_Id: { type: String, required: true, unique: true },
    company_name: { type: String, required: true },
    od_status: { type: String, required: true, enum: ["Pending", "Completed", "Cancelled"] },
    pay_status: { type: String, required: true, enum: ["Paid", "Unpaid"] },
    od_Tamount: { type: Number, required: true },
    overdue_date: { type: Date, default: null }
});

const Order = mongoose.model("Order", OrderSchema);
export default Order; // ✅ Export as ES Module
