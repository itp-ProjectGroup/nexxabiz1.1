const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    manufacturingID:{ type:String, required: true,unique:true},
    productName:{type:String, required:true},
    price:{ type:Number, required:true},
    lowStockLevel:{type:Number,required:true},
    images:{type:[String], requierd:false},



});

module.exports = mongoose.model('Product', ProductSchema);
