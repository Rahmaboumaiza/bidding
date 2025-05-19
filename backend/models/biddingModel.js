const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
const Product = require('./productModel');


const biddingProductSchema = new mongoose.Schema({
     user:{
            type:mongoose.Schema.Types.ObjectId,
            require:true,
            ref:"User",
        },
     product:{
            type:mongoose.Schema.Types.ObjectId,
            require:true,
            ref:"Product",
        },
     price:{
        type:Number,
        require:true,
         }, 
        
    
})


// const biddingProduct = mongoose.model('BiddingProduct', biddingProductSchema);

// ✅ Prevent OverwriteModelError by checking first
const BiddingProduct = mongoose.models.BiddingProduct || mongoose.model("BiddingProduct", biddingProductSchema);
module.exports = BiddingProduct  ;
