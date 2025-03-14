const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    manufacturingID:{ type:String, required: true,unique:true},
    productName:{type:String, required:true},
    price:{ type:Number, required:true},



});

module.exports = mongoose.model('Product', ProductSchema);
