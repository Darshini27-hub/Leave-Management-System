require("dotenv").config();
const mongoose=require("mongoose");
const User=require("../models/User");
const LeaveType=require("../models/LeaveType");
const LeaveBalance=require("../models/LeaveBalance");
const LeaveRequest=require("../models/LeaveRequest");
const Holiday=require("../models/Holiday");
const {createBalancesForUser}=require("../utils/calculateLeaveDays");

const seedData=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected. Clearing old data...");

        await User.deleteMany();
        await LeaveType.deleteMany();
        await LeaveBalance.deleteMany();
        await LeaveRequest.deleteMany();
        await Holiday.deleteMany();

        await LeaveType.create([
            {name:"Casual Leave",yearlyDays:12},
            {name:"Sick Leave",yearlyDays:10},
            {name:"Earned Leave",yearlyDays:15},
        ]);

        const admin=await User.create({name:"Admin User",email:"admin@company.com",password:"admin123",role:"admin"});
        const manager=await User.create({name:"Priya Manager",email:"manager@company.com",password:"manager123",role:"manager",department:"IT"});
        const ravi=await User.create({name:"Ravi Employee",email:"ravi@company.com",password:"employee123",role:"employee",department:"IT",manager:manager._id});
        const anitha=await User.create({name:"Anitha Employee",email:"anitha@company.com",password:"employee123",role:"employee",department:"IT",manager:manager._id});

        const year=new Date().getFullYear();
        for(const user of [admin,manager,ravi,anitha]){
            await createBalancesForUser(user._id,year);
        }

        await Holiday.create([
            {name:"Republic Day",date:new Date(Date.UTC(year,0,26))},
            {name:"Independence Day",date:new Date(Date.UTC(year,7,15))},
            {name:"Gandhi Jayanti",date:new Date(Date.UTC(year,9,2))},
            {name:"Diwali",date:new Date(Date.UTC(year,10,8))},
            {name:"Christmas",date:new Date(Date.UTC(year,11,25))},
        ]);

        console.log("Seed done!");
        console.log("admin@company.com / admin123");
        console.log("manager@company.com / manager123");
        console.log("ravi@company.com / employee123");
        console.log("anitha@company.com / employee123");
    }
    catch(error){
        console.log("Seed error:",error.message);
    }
    process.exit();
};

seedData();