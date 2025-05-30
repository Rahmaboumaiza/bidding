const express = require("express");
const asyncHandler =require("express-async-handler");
const router = express.Router();
const jwt =require ("jsonwebtoken");
const User = require("../models/userModel"); 
const bcrypt= require('bcryptjs');
const cloudinary=require("cloudinary");

const Product = require('../models/productModel');

const generateToken=(id)=>{
    return jwt.sign({id} , process.env.JWT_SECRET, {expiresIn :"1d"});
}

// const registerUser =asyncHandler(async (req,res)=>{
//   const {name ,email ,password}=req.body;

//   if (!email ||!name || !password){
//     res.status(400);
//     throw new Error ("please fill in all required fields");
//   }
//   const userExists=await User.findOne({email});
//   if (userExists){
//     res.status(400);
//     throw new Error ("email is already in use");
//   }


  
//   const user =await User.create ({
//     name,
//     email,
//     password,
//   });

//   const token =generateToken(user._id);
//   res.cookie("token",token,{
//     path:"/",
//     httpOnly:true,
//     expires:new Date(Date.now()+1000*86400),
//     sameSite:"none",
//     secure:"true",
//   });

// if (user){
//   const {_id,name,email,photo,role}  =user;
//   res.status(201).json({_id,name,email,photo,role});
// }else {
//     res.status(400);
//     throw new Error ("Invalid user data");
// }
// });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;


  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fileds");
  }

  const userExits = await User.findOne({ email });
  if (userExits) {
    res.status(400);
    throw new Error("Email is already exit");
  }

   // 👇 log file to see what you're receiving
    console.log("📦 req.file:", req.file);

  // Image upload handling (like in createProduct)
  let fileData = {};
  if (req.file) {
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bidding/userProfile",
        resource_type: "image",
      });
       fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        public_id: uploadedFile.public_id,
      };
    } catch (error) {
    console.error("❌ Cloudinary error:", error);
    res.status(500);
    throw new Error("Image could not be uploaded");
  }
}
  const user = await User.create({
    name,
    email,
    password,
    image: fileData,
  });

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, image, role } = user;
    res.status(201).json({ _id, name, email,image, token, role });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});



const loginUser =asyncHandler(async (req,res)=>{
  const {email,password}=req.body;

  if (!email|| !password){
    res.status(400);
    throw new Error ("please add email and password");
  }
  const user =await User.findOne({email});
  if (!user){
    res.status(400);
    throw new Error ("user not found ,please signup");
  }

  const passwordIsCorrect =await bcrypt.compare(password,user.password);

 
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: false, // Change to true in production
    });

 if (user && passwordIsCorrect) {
    const { _id, name, email,photo, role } = user;
    res.status(201).json({ _id, name, email,photo, role,token });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }

});



const loginStatus =asyncHandler(async (req,res)=>{
  const token =req.cookies.token;
  if(!token){
    return res.json(false);
  }

  const verified =jwt.verify(token,process.env.JWT_SECRET);
  if (verified){
    return res.json(true);
  }
});


const logoutUser =asyncHandler(async (req,res)=>{
  res.cookie("token","",{
    path:"/",
    httpOnly:true,
    expires:new Date(0),
    sameSite:"none",
    secure:true,
  });
  return res.status(200).json({message:"successfully logged out"});
});  


const loginAsSeller =asyncHandler(async (req,res)=>{
  const {email,password}=req.body;

  if (!email|| !password){
    res.status(400);
    throw new Error ("please add email and password");
  }
  const user =await User.findOne({email});
  if (!user){
    res.status(400);
    throw new Error ("user not found ,please signup");
  }

  const passwordIsCorrect =await bcrypt.compare(password,user.password);
  if (!passwordIsCorrect){
    res.status(400);
    throw new Error ("invalid password");
  }

  //if password is correct update the role to seller here user must be register
  user.role="seller";
  await user.save();

  const token =generateToken(user._id);
  res.cookie("token",token,{
    path:"/",
    httpOnly:true,
    expires:new Date(Date.now()+1000*86400),
    sameSite:"none",
    secure:"true",
  });

  if (user && passwordIsCorrect){
    const {_id,name,email,photo,role}  =user;
    res.status(201).json({_id,name,email,photo,role});
  }else {
      res.status(400);
      throw new Error ("Invalid user data");
  }

});

const getUser =asyncHandler(async (req,res)=>{
 const user =await User.findById(req.user._id).select("-password");
 res.status(200).json(user);
}); 



const getuserBalance=asyncHandler(async (req,res)=>{
 const user =await User.findById(req.user._id);

  if (!user){
  res.status(404);
  throw new Error ("User not found");
  }

  res.status(200).json({
    Balance :user.Balance,
    });

});

const getAllUser =asyncHandler(async (req,res)=>{
 const userList =await User.find({});

 if (!userList.length){
  return res.status(404).json({message : "no user found!"});
 }
 res.status(200).json(userList);
}); 


const estimateIncome =asyncHandler(async (req,res)=>{
 try{
  const admin =await User.findOne({role:"admin"});
  if (!admin){
    return res.status(404).json({message:"no user found!"})
  }
  const commissionBalance =admin.commissionBalance;
  res.status(200).json({commissionBalance});
 }catch (error){
  res.status(500).json({error:"Internal server error"});
 }
}); 




const addFavorite = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Add to favorites (prevents duplicates)
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favorites: productId } },
      { new: true }
    );

    res.status(200).json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const removeFavorite = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: req.params.productId } },
      { new: true }
    );
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getFavorites = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title price image'); // Only populate needed fields
    
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const getTopSellers = async (req, res) => {
  try {
    const sellers = await Product.aggregate([
      { $match: { isSoldout: true } }, // Only sold products
      {
        $group: {
          _id: '$user', // Group by seller (user ID)
          totalSales: { $sum: '$price' },
          totalProducts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users', // The name of your users collection (check exact name in DB)
          localField: '_id',
          foreignField: '_id',
          as: 'seller',
        },
      },
      { $unwind: '$seller' },
      {
        $project: {
          _id: 0,
          id: '$seller._id',
          name: '$seller.name',
          profile: '$seller.profile',
          totalSales: 1,
          totalProducts: 1,
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }, // Return top 5 sellers
    ]);

    res.json(sellers);
  } catch (error) {
    console.error('Error fetching top sellers:', error);
    res.status(500).json({ message: 'Server error fetching top sellers' });
  }
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user._id); // ✅ Use logged-in user ID

    if (!user) return res.status(404).json({ message: "User not found" });
  console.log("Updating user:", req.user._id, name, email);
    user.name = name || user.name;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};


module.exports={
    registerUser,
    loginUser,
    loginStatus,
    logoutUser,
    loginAsSeller,
    getUser,
    getuserBalance,
    getAllUser,
    estimateIncome,
    addFavorite,
    removeFavorite,
    getFavorites,
    getTopSellers,
    updateUser,
};