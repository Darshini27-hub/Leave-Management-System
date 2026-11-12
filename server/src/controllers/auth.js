const User=require("../models/User");
const generateToken=require("../utils/generateToken");
const login=async(req,res,next)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({success:false, message:"Email and password are required"});
        }
        const user=await User.findOne({email: email.toLowerCase()}).select("+password");
        if(!user){
            return res.status(401).json({success:false, message:"Invalid email or password"});
        }
        const isMatch=await user.matchPassword(password);
        if(!isMatch){
            return res.status(401).json({success:false, message:"Invalid email or password"});
        }
        if(!user.isActive){
            return res.status(403).json({success:false, message:"Account has beeen deactivated"});
        }
        const token=generateToken(user._id);
        const userData={
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
        };
        res.status(200).json({success:true, message:"Login successfull", data: {token, user: userData}});
    }
    catch(error){
        next(error);
    }
};
const getMe=async(req,res,next)=>{
    try{
        const user=await User.findById(req.user._id).populate("manager","name email");
        res.status(200).json({success: true,message:"Profile fetched", data: user});
    }
    catch(error){
        next(error);
    }
};
const changePassword=async(req,res,next)=>{
    try{
        const{oldPassword,newPassword}=req.body;
        if(!oldPassword || !newPassword){
            return res.status(400).json({success:false, message:"Password is required"});
        }
        if(newPassword.length < 6){
            return res.status(400).json({success:false, message:"Password length must be 6 characters"});
        }
        const user=await User.findById(req.user._id).select("+password");
        const isMatch=await user.matchPassword(oldPassword);
        if(!isMatch){
            return res.status(400).json({success:false, message:"Password is wrong"});
        }
        user.password=newPassword;
        await user.save();
        res.status(200).json({success:true, message:"Password changed"});
    }
    catch(error){
        next(error);
    }
};
module.exports={login,getMe,changePassword};