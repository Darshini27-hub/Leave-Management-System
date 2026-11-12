const LeaveRequest=require("../models/LeaveRequest");
const LeaveType=require("../models/LeaveType");
const LeaveBalance=require("../models/LeaveBalance");
const Holiday=require("../models/Holiday");
const User=require("../models/User");
const{getToday,calculateLeaveDays,createBalancesForUser,getBalanceList}=require("../utils/calculateLeaveDays");

const getMyBalance=async(req,res,next)=>{
    try{
        const year=new Date().getFullYear();
        const balances=await getBalanceList(req.user._id,year);
        res.status(200).json({success:true,message:"Balance fetched",data:balances});
    }
    catch(error){
        next(error);
    }
};

const applyLeave=async(req,res,next)=>{
    try{
        const{leaveType,fromDate,toDate,reason,isHalfDay}=req.body;
        if(!leaveType || !fromDate || !toDate || !reason){
            return res.status(400).json({success:false,message:"Leavetype,data nad reason are required"});
        }
        if(reason.trim().length < 10){
            return res.status(400).json({success:false,message:"Reason must be atleast 10 characters"});
        }
        const from=new Date(fromDate);
        const to=new Date(toDate);
        if(isNaN(from) || isNaN(to)){
            return res.status(400).json({success:false,message:"Enter valid dates"});
        }
        if(from>to){
            return res.status(400).json({success:false,message:"From date connot be after to date"});
        }
        if(from<getToday()){
            return res.status(400).json({success:false,message:"Cant apply leave for past date"});
        }
        if(from.getUTCFullYear() !== to.getUTCFullYear()){
            return res.status(400).json({success:false,message:"Leave must be withinone calendaryear"});
        }
        if(isHalfDay && from.getTime() !== to.getTime()){
            return res.status(400).json({success:false,message:"Half day is allowed only for single date"});
        }
        const type=await LeaveType.findById(leaveType);
        if(!type || !type.isActive){
            return res.status(404).json({success:false,message:"Leave type not found"});
        }
        const holidays=await Holiday.find({date:{$gte:from,$lte:to}});
        const days=calculateLeaveDays(from,to,holidays,isHalfDay);
        if(days===0){
            return res.status(400).json({success:false,message:"Selected dates are weekend or holidays"});
        }
        const year=from.getUTCFullYear();
        await createBalancesForUser(req.user._id,year);
        const balance=await LeaveBalance.findOne({user:req.user._id,leaveType,year});
        if(!balance){
            return res.status(400).json({success:false,message:"Leave balance not found"});
        }
        const remaining=balance.total-balance.used;
        if(days>remaining){
            return res.status(400).json({success:false,message:"Insufficient leave balance.You have "+remaining+" days left"});
        }
        const overlap=await LeaveRequest.findOne({user:req.user._id,status:{$in:["pending","approved"]},fromDate:{$lte:to},toDate:{$gte:from}});
        if(overlap){
            return res.status(409).json({success:false,message:"You already leave on these dates"});
        }
        const leave=await LeaveRequest.create({user:req.user._id,leaveType,fromDate:from,toDate:to,days,isHalfDay:isHalfDay ? true : false,reason});
        res.status(201).json({success:true,message:"Leave applied",data:leave});
    }
    catch(error){
        next(error);
    }
};

const getMyLeaves=async(req,res,next)=>{
    try{
        const{status,page=1,limit=10}=req.query;
        const filter={user:req.user._id};
        if(status)
            filter.status=status;
        const pageNumber=Number(page);
        const limitNumber=Number(limit);
        const total=await LeaveRequest.countDocuments(filter);
        const leaves=await LeaveRequest.find(filter).populate("leaveType","name").sort({createdAt:-1}).skip((pageNumber-1)*limitNumber).limit(limitNumber);
        res.status(200).json({success:true,message:"Leave fetched",data:{leaves,page:pageNumber,totalPages:Math.ceil(total/limitNumber),total}})
    }
    catch(error){
        next(error);
    }
};

const cancelLeave = async(req,res,next)=>{
    try{
        const leave=await LeaveRequest.findById(req.params.id);
        if(!leave){
            return res.status(404).json({success:false,message:"Leave not found"});
        }
        if(leave.user.toString() !== req.user._id.toString()){
            return res.status(403).json({success:false,message:"You can cancel only your own leave"});
        }
        if(leave.status==="pending"){
            leave.status="cancelled";
        }
        else if(leave.status==="approved"){
            if(leave.fromDate<= getToday()){
                return res.status(400).json({success:false,message:"This leave has already started cannot cancel"});
            }
            leave.status="cancelled";
            const year=leave.fromDate.getUTCFullYear();
            await LeaveBalance.findOneAndUpdate({user:leave.user,leaveType:leave.leaveType,year},{$inc:{used:-leave.days}});
        }
        else{
            return res.status(400).json({success:false,message:"A "+leave.status+" leave cannot be cancelled"});
        }
        await leave.save();
        res.status(200).json({success:true,message:"Leave cancelled",data:leave});
    }
    catch(error){
        next(error);
    }
};

const reviewLeave=async(req,res,next)=>{
    try{
        const{status,comment}=req.body;
        if(status !== "approved" && status !== "rejected"){
            return res.status(400).json({success:false,message:"Status must be approved or rejected"})
        }
        if(status==="rejected" && (!comment || !comment.trim())){
            return res.status(400).json({success:false,message:"Comment is required when rejecting"});
        }
        const leave=await LeaveRequest.findById(req.params.id).populate("user");
        if(!leave){
            return res.status(404).json({success:false,message:"Leave not found"});
        }
        if(leave.user._id.toString()=== req.user._id.toString()){
            return res.status(403).json({success:false,message:"You cannot approve or reject your own leave"});
        }
        if(req.user.role==="manager"){
            const leaveUserManager=leave.user.manager ? leave.user.manager.toString() : null;
            if(leaveUserManager !== req.user._id.toString()){
                return res.status(403).json({success:false,message:"This employee is not your team"});
            }
        }
        if(leave.status !== "pending"){
            return res.status(400).json({success:false,message:"Only pending request can be reviewed"});
        }
        if(status==="approved"){
            const year=leave.fromDate.getUTCFullYear();
            await createBalancesForUser(leave.user._id,year);
            const balance=await LeaveBalance.findOne({user:leave.user._id,leaveType:leave.leaveType,year});
            if(!balance || balance.total-balance.used < leave.days){
                return res.status(400).json({success:false,message:"Employee does not have enough balance"});
            }
            await LeaveBalance.findOneAndUpdate({_id:balance._id},{$inc:{used:leave.days}});
        }
        leave.status=status;
        leave.reviewedBy=req.user._id;
        leave.reviewComment=comment || "";
        leave.reviewedAt=new Date();
        await leave.save();
        res.status(200).json({success:true,message:"Leave "+status,data: leave});
    }
    catch(error){
        next(error);
    }
};

const getTeamLeaves=async(req,res,next)=>{
    try{
        const{status,page=1,limit=10}=req.query;
        //finds team members
        const team=await User.find({manager:req.user._id}).select("_id");
        const teamIds=team.map((member)=>member._id);
        const filter={user:{$in:teamIds}};
        if(status)
            filter.status=status
        const pageNumber=Number(page);
        const limitNumber=Number(limit);
        const total=await LeaveRequest.countDocuments(filter);
        const leaves=await LeaveRequest.find(filter).populate("user","name email department").populate("leaveType","name").sort({createdAt:-1}).skip((pageNumber-1)*limitNumber).limit(limitNumber);
        res.status(200).json({success:true,message:"Team leaves fetched",data:{leaves,page:pageNumber,totalPages:Math.ceil(total/limitNumber),total}});
    }
    catch(error){
        next(error);
    }
};

const getAllLeaves=async(req,res,next)=>{
    try{
        const{status,page=1,limit=10}=req.query;
        const filter={};
        if(status)
            filter.status=status;
        const pageNumber=Number(page);
        const limitNumber=Number(limit);
        const total=await LeaveRequest.countDocuments(filter);
        const leaves=await LeaveRequest.find(filter).populate("user","name email department").populate("leaveType","name").sort({createdAt:-1}).skip((pageNumber -1)*limitNumber).limit(limitNumber);
        res.status(200).json({success:true,message:"All leaves fetched",data:{leaves,page:pageNumber,totalPages:Math.ceil(total/limitNumber),total}});
    }
    catch(error){
        next(error);
    }
}
module.exports={getMyBalance,applyLeave,getMyLeaves,cancelLeave,reviewLeave,getTeamLeaves,getAllLeaves};