import mongoose from "mongoose";

// Updated order item schema based on sample JSON
const OrderItemSchema = new mongoose.Schema({
  manufacturingID: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 }
});

const OrderSchema = new mongoose.Schema({
  od_Id: { type: String, required: true, unique: true },
  company_name: { type: String, required: true },
  userID: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^UID\d{6}$/.test(v); // matches UID followed by 6 digits
      },
      message: props => `${props.value} is not a valid User ID! Must be in format UID000000`
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
    enum: ["Paid", "Unpaid", "Pending", "New"] // Added "New" since it's in the JSON
  },
  od_date: { type: Date, default: Date.now },
  overdue_date: { type: Date, default: null },
  od_items: { type: [OrderItemSchema], default: [] }
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
