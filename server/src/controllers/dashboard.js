const User=require("../models/User");
const LeaveRequest=require("../models/LeaveRequest");
const Holiday=require("../models/Holiday");
const {getToday,getBalanceList}=require("../utils/calculateLeaveDays");

const getDashboardStats=async(req,res,next)=>{
    try{
        const role=req.user.role;
        const today=getToday();
        const year=today.getUTCFullYear();
        const data={role};
        if(role==="admin"){
            data.totalEmployees=await User.countDocuments({isActive:true,role:{$ne:"admin"}});
            data.totalPending=await LeaveRequest.countDocuments({status:"pending"});
            const leaves=await LeaveRequest.find({status:"approved",fromDate:{$gte:new Date(Date.UTC(year,0,1)),$lte:new Date(Date.UTC(year,11,31))}});
            const monthNames=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const leavesPerMonth=monthNames.map((m)=>({month:m,count:0}));
            leaves.forEach((leave)=>{
                const monthIndex=leave.fromDate.getUTCMonth();
                leavesPerMonth[monthIndex].count=leavesPerMonth[monthIndex].count+1;
            });
            data.leavesPerMonth=leavesPerMonth;
        }
        else{
            data.balances=await getBalanceList(req.user._id,year);
            data.counts={
                pending:await LeaveRequest.countDocuments({user:req.user._id,status:"pending"}),
                approved:await LeaveRequest.countDocuments({user:req.user._id,status:"approved"}),
                rejected:await LeaveRequest.countDocuments({user:req.user._id,status:"rejected"}),
            };
            data.upcomingLeaves=await LeaveRequest.find({user:req.user._id,status:"approved",toDate:{$gte:today}}).populate("leaveType","name").sort({fromDate:1}).limit(5);
            data.holidays=await Holiday.find({date:{$gte:today}}).sort({date:1}).limit(10);
        }
        if(role==="manager"){
            const team=await User.find({manager:req.user._id}).select("_id");
            const teamIds=team.map((member)=>member._id);
            const nextWeek=new Date(today);
            nextWeek.setUTCDate(nextWeek.getUTCDate()+7);
            data.pendingApprovals=await LeaveRequest.countDocuments({
                user:{$in:teamIds},status:"pending"
            });
            data.onLeaveToday=await LeaveRequest.find({user:{$in:teamIds},status:"approved",fromDate:{$lte:today},toDate:{$gte:today}}).populate("user","name");
            data.onLeaveNext7Days=await LeaveRequest.find({user:{$in:teamIds},status:"approved",fromDate:{$gt:today,$lte:nextWeek}}).populate("user","name");
        }
        res.status(200).json({success:true,message:"Dashboard data fetched",data});
    }
    catch(error){
        next(error);
    }
};
module.exports=getDashboardStats;