const asyncHandler =require("express-async-handler");
const Product = require("../models/productModel"); 
const BiddingProduct = require("../models/BiddingModel");
const User = require("../models/userModel"); 
const slugify =require("slugify");
const cloudinary=require("cloudinary");


const createProduct =asyncHandler(async (req,res)=>{
    const {title,description,category,price,height,lengthPic,width,mediumused,weight,expirationDate,validityPeriod, }=req.body;
    const userId =req.user.id;

    const originalSlug =slugify(title,{
        lower :true,
        remove :/[*+~.()'"!:@]/g,
        strict :true,
    });

    let slug =originalSlug;
    let suffix=1;

    while(await Product.findOne({slug})){
        slug =`${originalSlug}-${suffix}`;
        suffix++;
    }

    if (!title||!description||!price){
        res.status(400);
        throw new Error ("please fill out all required fiels");
    }

    let fileData={}
    if (req.file){
        let uploadFile
        try{
            uploadFile=await cloudinary.uploader.upload(req.file.path,{
                folder :"Bidding/product",
                resource_type :"image" ,
            }) ;
            
        }catch (error){
            console.log("================");
            console.log(error);
            console.log("================");
            res.status(500);
            throw new Error ("Image could not be uploaded")
        }

        fileData={
            fileName:req.file.originalname,
            filePath:uploadFile.secure_url,
            fileType:req.file.mimetype,
            public_id:uploadFile.public_id,
        }
    }

    // 👉 Fetch user role to check if admin
  const user = await User.findById(userId);
  const isVerify = user.role === "admin";

    const product= await Product.create({
        user :userId,
        title,
        slug:slug,description,category,price,height,lengthPic,width,mediumused,weight,image:fileData, validityPeriod,
      expirationDate,
      isExpired: false,isVerify,
    });
    res.status(201).json({
        success :true,
        data:product,
    })

});


const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort("-createdAt").populate("user");

  const productsWithDetails = await Promise.all(
    products.map(async (product) => {
      const latestBid = await BiddingProduct.findOne({ product: product._id }).sort("-createdAt");
      const biddingPrice = latestBid ? latestBid.price : product.price;

      const totalBids = await BiddingProduct.countDocuments({ product: product._id });

      return {
        ...product._doc,
        biddingPrice,
        totalBids, // Adding the total number of bids
      };
    })
  );

  res.status(200).json(productsWithDetails);
});

const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("user");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.status(200).json(product);
});

const getAllSoldProducts = asyncHandler(async (req, res) => {
    const product = await Product.find({ isSoldout: true }).sort("-createdAt").populate("user");
    res.status(200).json(product);
});

const deleteProduct=asyncHandler(async (req,res)=>{
    const {id} =req.params;
    const product =await Product.findById(id);

    if (!product){
        res.status(404);
        throw new Error ("product not found");
    }

    if (product.user?.toString() !==req.user.id){
        res.status(401);
        throw new Error ("user not authorized");
    }

    //now delete product product from cloudinary
    if (product.image &&product.image.public_id){
        try{
            await cloudinary.uploader.destroy(product.image.public_id);
        }catch (error){
            console.log(error);
            res.status(500);
            throw new Error ("Error deleting image from cloudinary");
        }
    }

    await Product.findByIdAndDelete(id)
    res.status(200).json({message :"prodcut deleted successfully"});
});

const updateProduct=asyncHandler(async (req,res)=>{
    const {title,description,category,price,height,lengthPic,width,mediumused,weight,isVerify}=req.body;
    const {id } =req.params;
    const product =await Product.findById(id);

    if (!product){
        res.status(404);
        throw new Error ("product not found");
    }
    if (product.user?.toString() !==req.user.id){
        res.status(401);
        throw new Error ("user not authorized");
    }

    if (req.body.height === "" || req.body.height === "null") {
        delete req.body.height;
    }

    if (req.body.width === "" || req.body.width === "null") {
         delete req.body.width;
    }



    let fileData={}
    if (req.file){
        let uploadFile
        try{
            uploadFile=await cloudinary.uploader.upload(req.file.path,{
                folder :"product-image",
                resource_type :"image" ,
            }) ;
            
        }catch (error){
            res.status(500);
            throw new Error ("Image could not be uploaded")
        }

        //if user upload image then delete previous drom cloud
        if (product.image &&product.image.public_id){
            try{
                await cloudinary.uploader.destroy(product.image.public_id);
            }catch (error){
                console.log(error);
                res.status(500);
                throw new Error ("Error deleting image from cloudinary");
            }
        }

        
        fileData={
            fileName:req.file.originalname,
            filePath:uploadFile.secure_url,
            fileType:req.file.mimetype,
            public_id:uploadFile.public_id,
        };
    }
     

    const updateProduct = await Product.findByIdAndUpdate({
        _id:id,},
        {
        title,description,category,price,height,lengthPic,width,mediumused,weight,isVerify,image:Object.keys(fileData).length ===0? Product?.image :fileData,
    },{
        new:true,
        runValidators:true,
    });
    res.status(201).json({updateProduct})

});

const getAllProductsOfUser=asyncHandler(async (req,res)=>{
    const userId =req.user._id;
    const products =await Product.find({user: userId}).sort("-createdAt").populate("user");
    res.json(products);
});

const getWonProducts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wonProducts = await Product.find({ soldTo: userId }).sort("-createdAt").populate("user");

  const productsWithPrices = await Promise.all(
    wonProducts.map(async (product) => {
      const latestBid = await BiddingProduct.findOne({ product: product._id }).sort("-createdAt");
      const biddingPrice = latestBid ? latestBid.price : product.price;
      return {
        ...product._doc,
        biddingPrice, // Adding the price field
      };
    })
  );

  res.status(200).json(productsWithPrices);
});

const verifyAndCommissionProductByAdmin  =asyncHandler(async (req,res)=>{
    const { commission } = req.body; commission
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isverify = true;
  product.commission = commission;

  await product.save();

  res.status(200).json({ message: "Product verified successfully", data: product });
});

const getAllProductsByAmdin = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort("-createdAt").populate("user");
    res.json(products);
  
    // const productsWithPrices = await Promise.all(
    //   products.map(async (product) => {
    //     const latestBid = await BiddingProduct.findOne({ product: product._id }).sort("-createdAt");
    //     const biddingPrice = latestBid ? latestBid.price : product.price;
    //     return {
    //       ...product._doc,
    //       biddingPrice, // Adding the price field
    //     };
    //   })
    // );
  
    // res.status(200).json(productsWithPrices);
  });
  
  const   deleteProductsByAmdin = asyncHandler(async (req, res) => {
    try {
      const { productIds } = req.body;
  
      if (!productIds || !Array.isArray(productIds)) {
        return res.status(400).json({ error: "productIds must be an array" });
      }
  
      const result = await Product.deleteMany({ _id: { $in: productIds } });
  
      res.status(200).json({ message: `${result.deletedCount} products deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  const updateVerify = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isVerify } = req.body;

 

  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isVerify = isVerify;
  const updatedProduct = await product.save();

res.status(200).json({ data: updatedProduct, message: "Verification status updated" });

});


// Update isExpired to true
const markProductAsExpired = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.isExpired) {
      product.isExpired = true;
      await product.save();
    }

    res.status(200).json({ message: "Product marked as expired" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




const test =asyncHandler(async (req,res)=>{
    res.send("test");
});

module.exports={
    createProduct,
    getAllProducts,
    getProduct,
    getAllSoldProducts,
    deleteProduct,
    updateProduct,
    getAllProductsOfUser,
    getWonProducts,
    verifyAndCommissionProductByAdmin,
    getAllProductsByAmdin,
    deleteProductsByAmdin,
    updateVerify,
    markProductAsExpired

}