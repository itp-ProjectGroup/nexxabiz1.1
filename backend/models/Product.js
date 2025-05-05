const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    manufacturingID: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    ManufacturingCost: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    lowStockLevel: { type: Number, required: true },
    quantity: { type: Number, required: true },
    manufacturingDate: { type: Date, required: true },
    images: { type: [String], required: false },
    size: { type: String, default: '' },
    theme: { type: String, default: '' },
    material: { type: String, default: '' },
    color: { type: String, default: '' },
    function: { type: String, default: '' },
    brand: { type: String, default: '' },
    promotions: { type: [Number], default: [] }
});

module.exports = mongoose.model('Product', ProductSchema);
