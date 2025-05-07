import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
});

const OrderSchema = new mongoose.Schema({
  od_Id: { type: String, required: true, unique: true },
  company_name: { type: String, required: true },
  "user ID": { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^UID\d{5}$/.test(v);
      },
      message: props => `${props.value} is not a valid User ID! Must be in format UID00000`
    }
  },
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
  od_date: { type: Date, default: Date.now },
  overdue_date: { type: Date, default: null },
  od_items: { type: [OrderItemSchema], default: [] },
  userID: { type: String, required: true }, // <- New field added here
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
