const LeaveType=require("../models/LeaveType");
const {createBalancesForUser}=require("../utils/calculateLeaveDays");
const createLeaveType=async(req,res,next)=>{
    try{
        const{name,yearlyDays}=req.body;
        if(!name || yearlyDays===undefined || isNaN(yearlyDays) || Number(yearlyDays) < 0){
            return res.status(400).json({success:false,message:"Name and yearlyDays are required"});
        }
        const exists=await LeaveType.findOne({name:name.trim()});
        if(exists){
            return res.status(409).json({success:false,message:"Leave type already exists"});
        }
        const leaveType=await LeaveType.create({name,yearlyDays});
        res.status(201).json({success:true,message:"Leave type created", data:leaveType});
    }
    catch(error){
        next(error);
    }
};

const getLeaveTypes=async(req,res,next)=>{
    try{
        const filter={isActive:true};
        if(req.user.role === "admin" && req.query.all === "true"){
            delete filter.isActive;
        }
        const leaveTypes=await LeaveType.find(filter).sort({name:1});
        res.status(200).json({success:true,message:"Leave types fetched",data:leaveTypes});
    }
    catch(error){
        next(error);
    }
};

const updateLeaveType=async(req,res,next)=>{
    try{
        const{name,yearlyDays}=req.body;
        const leaveType=await LeaveType.findById(req.params.id);
        if(!leaveType){
            return res.status(404).json({success:false,message:"Leave type not found"});
        }
        if(name)
            leaveType.name=name;
        if(yearlyDays !== undefined){
            if(isNaN(yearlyDays) || Number(yearlyDays) < 0){
                return res.status(400).json({success:false,message:"Yearly days must be more than 0 or 0"});
            }
            leaveType.yearlyDays=yearlyDays;
        }
        await leaveType.save();
        res.status(200).json({success:true,message:"Leave type updated", data:leaveType});
    }
    catch(error){
        next(error);
    }
};

const updateLeaveTypeStatus=async(req,res,next)=>{
    try{
        const{isActive}=req.body;
        if(typeof isActive !== "boolean"){
            return res.status(400).json({success:false,message:"isActive must be true or false"});
        }
        const leaveType=await LeaveType.findByIdAndUpdate(req.params.id,{isActive},{new:true});
        if(!leaveType){
            return res.status(404).json({success:false,message:"Leave type not found"});
        }
        res.status(200).json({success:true,message:"Leave type status updated", data:leaveType});
    }
    catch(error){
        next(error);
    }
};

module.exports={createLeaveType,getLeaveTypes,updateLeaveType,updateLeaveTypeStatus};