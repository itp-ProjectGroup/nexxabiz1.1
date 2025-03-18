const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    manufacturingID:{ type:String, required: true,unique:true},
    productName:{type:String, required:true},
    ManufacturingCost:{ type:Number, required:true},
    sellingPrice:{type:Number, require:true},
    lowStockLevel:{type:Number,required:true},
    images:{type:[String], requierd:false},



});

module.exports = mongoose.model('Product', ProductSchema);
