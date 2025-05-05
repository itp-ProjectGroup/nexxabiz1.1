import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  manufacturingID: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  ManufacturingCost: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  lowStockLevel: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  manufacturingDate: { type: Date, required: true },
  images: { type: [String], default: [] },
  size: { type: String },
  theme: { type: String },
  material: { type: String },
  color: { type: String },
  function: { type: String },
  brand: { type: String },
  promotions: { type: [Number], default: [] },
}, {
  timestamps: true
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
