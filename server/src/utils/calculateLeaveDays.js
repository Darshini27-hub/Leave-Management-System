const LeaveType=require("../models/LeaveType");
const LeaveBalance=require("../models/LeaveBalance");
//today's date at 00:00 (UTC), used to compare with leave dates
const getToday=()=>{
    const today=new Date();
    today.setUTCHours(0,0,0,0);
    return today;
};
//counts working days between two dates (skip Saturday,Sunday & holidays)
const calculateLeaveDays=(fromDate,toDate,holidays,isHalfDay)=>{
    //changes holiday dates to string
    const holidayList=holidays.map((h)=> new Date(h.date).toISOString().split("T")[0]);
    let count=0;
    const current=new Date(fromDate);
    const end=new Date(toDate);
    while(current<=end){
        const day=current.getUTCDay();
        const dateString=current.toISOString().split("T")[0];
        if(day !== 0 && day !== 6 && !holidayList.includes(dateString)){
            count=count+1;
        }
        current.setUTCDate(current.getUTCDate()+1);
    }
    //half day counts as 0.5 when it is only one working daya
    if(isHalfDay && count>0){
        return 0.5;
    }
    return count;
};
//creates a balance for every active leave type
const createBalancesForUser=async(userId,year)=>{
    const leaveTypes=await LeaveType.find({isActive:true});
    for(const type of leaveTypes){
        const exists=await LeaveBalance.findOne({user:userId,leaveType:type._id,year});
        if(!exists){
            await LeaveBalance.create({
                user:userId,
                leaveType:type._id,
                year,
                total:type.yearlyDays,
            });
        }
    }
};
//return the balance user list for one year
const getBalanceList=async(userId,year)=>{
    await createBalancesForUser(userId,year);
    const balances=await LeaveBalance.find({user:userId,year}).populate("leaveType","name yearlyDays isActive");
    return balances.filter((b)=>b.leaveType && b.leaveType.isActive).map((b)=>({
        _id:b._id,
        leaveType:b.leaveType,
        total:b.total,
        used:b.used,
        remaining:b.total-b.used,
    }));
};
module.exports={getToday,calculateLeaveDays,createBalancesForUser,getBalanceList};