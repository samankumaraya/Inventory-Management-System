const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrpptjs");


// Generate Token
const generateToken = (id) => {
    return jwt.sign({id},  process.env.JWT_SECRET, {
        expiresIn: "1d"})
};


const registerUser = asyncHandler( async (req,res) => {
 const {name,email,password} = req.body 
 
 //Validation
 if(!name || !email || !password){
    res.status(400)
    throw new Error("Please fill all required fields")
 }
 if (password.length < 6){
    res.status(400)
    throw new Error("Password must be up to 6 characters")
 }

 // Check if your email already exists
 const userExists = await User.findOne({email})

 if (userExists){
    res.status(400)
    throw new Error("Email has already been used")
 }

 // Generate Token
   const token = generateToken(user._id);

   //send HTTP-only cookie
   res.cookie("token", token,{
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
   })
  

 //Create new user
 const user = await User.create({
    name,
    email,
    password,
 })

 if (user){
    const {_id,name,email, photo,phone, bio} = user
    res.status(201).json({
        _id,
        name,
        email, 
        photo,
        phone,
        bio,
        token,


    });
 } else {
    res.status(400)
    throw new Error("Invalid user data");
 }

});

// Login User
const  loginUser= asyncHandler(async (req,res) => 
{
    const {email, password} = req.body

    
    if(!email || !password) {
      res.status(400)
      throw new Error("Please add email and password");
    }

    const user = await User.findOne({email})

     
    if(!user) {
      res.status(400)
      throw new Error("Don't have account. Please sign up first");
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    
 // Generate Token
   const token = generateToken(user._id);

   //send HTTP-only cookie
   res.cookie("token", token,{
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
   });
  

    if(user && passwordIsCorrect){
      const {_id,name,email, photo,phone, bio} = user
    res.status(200).json({
        _id,
        name,
        email, 
        photo,
        phone,
        bio,
        token,
    });
    }else{
      res.status(400)
      throw new Error("Invalid email or password");
    }
    
});

//Logout User
const logout = asyncHandler (async (req,res) => {
   res.cookie("token", "",{
      path: "/",
      httpOnly: true,
      expires: new Date(0), // 1 day
      sameSite: "none",
      secure: true,
     });
     return res.status(200).json({message: "Successfully Logged Out"})
});

// Get User Data
const getUser = asyncHandler (async (req,res) => {
   const user = await User.findById(req.user._id);

   if (user) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
      });
    } else{
      res.status(400);
      throw new Error("User Not found")
    }
});

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
   const token = req.cookies.token;
   if (!token) {
     return res.json(false);
   }
   // Verify Token
   const verified = jwt.verify(token, process.env.JWT_SECRET);
   if (verified) {
     return res.json(true);
   }
   return res.json(false);
 });

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
};