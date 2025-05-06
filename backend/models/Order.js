import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  manufacturingID: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
});

const OrderSchema = new mongoose.Schema({
  od_Id: { type: String, required: true, unique: true },
  company_name: { type: String, required: true },
  od_status: { 
    type: String, 
    required: true, 
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Completed", "Cancelled"] 
  },
  pay_status: { 
    type: String, 
    required: true, 
    enum: ["Paid", "Unpaid", "Pending"] 
  },
  od_Tamount: { type: Number, required: true },
  od_date: { type: Date, default: Date.now },
  overdue_date: { type: Date, default: null },
  od_items: { type: [OrderItemSchema], default: [] },
  userID: { type: String, required: true }, // <- New field added here
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
