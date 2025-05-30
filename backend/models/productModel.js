const mongoose =require ("mongoose");

const productSchema =mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },

    slug:{
        type:String,
        unique :true,
    },

    title:{
        type:String,
        require:[true,"please add a title"],
        trime :true,
    },

    description:{
        type:String,
        require:[true,"please add a description"],
        trime :true,
    },

    image:{
        type:Object,
        default:{},
    },

    category:{
        type:String,
        require:[true,"please add a category"],
        default:"All",
    },

    commission:{
        type:Number,
        default:0,
    },

    price:{
        type:Number,
        require:[true,"please add a price"],
    },

    height:{type:Number},
    lengthPic :{type:Number},
    width :{type:Number},
    mediumused :{type:Number},
    weight :{type:Number},
    isVerify:{type:Boolean , default :false},
    isSoldout:{type:Boolean , default :false},
    soldTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref :"User",
    },
     validityPeriod: {
    type: Number, // in days
    required: true,
  },
   expirationDate: {
    type: Date,
    required: true,
  },
 isExpired: {
  type: Boolean,
  default: false,
},

},
   {timestamps:true},
);

const Product = mongoose.model("Product", productSchema);
module.exports =Product;