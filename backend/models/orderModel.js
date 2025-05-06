import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    od_Id: {
      type: String,
      required: true,
      unique: true, // Ensures od_Id is unique (e.g., "OD001")
    },
    company_name: {
      type: String,
      required: true,
    },
    od_status: {
      type: String,
      required: true,
      default: "Processing",
    },
    od_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    pay_status: {
      type: String,
      required: true,
      default: "Pending",
    },
    overdue_date: {
      type: Date,
      required: true,
    },
    od_items: [
      {
        manufacturingID: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
    userID: {
      type: String,
      required: true,
      ref: "User", // Assuming userID references the User model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;