const express = require("express");
const asyncHandler =require("express-async-handler");
const router = express.Router();
const jwt =require ("jsonwebtoken");
const User = require("../models/userModel"); 
const bcrypt= require('bcryptjs');


const generateToken=(id)=>{
    return jwt.sign({id} , process.env.JWT_SECRET, {expiresIn :"1d"});
}

const registerUser =asyncHandler(async (req,res)=>{
  const {name ,email ,password}=req.body;

  if (!email ||!name || !password){
    res.status(400);
    throw new Error ("please fill in all required fields");
  }
  const userExists=await User.findOne({email});
  if (userExists){
    res.status(400);
    throw new Error ("email is already in use");
  }


  
  const user =await User.create ({
    name,
    email,
    password,
  });

  const token =generateToken(user._id);
  res.cookie("token",token,{
    path:"/",
    httpOnly:true,
    expires:new Date(Date.now()+1000*86400),
    sameSite:"none",
    secure:"true",
  });

if (user){
  const {_id,name,email,role}  =user;
  res.status(201).json({_id,name,email,role});
}else {
    res.status(400);
    throw new Error ("Invalid user data");
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
    const { _id, name, email, role } = user;
    res.status(201).json({ _id, name, email, role,token });
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
    const {_id,name,email,role}  =user;
    res.status(201).json({_id,name,email,role});
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
};