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

        const admin=await User.create({name:"Admin User",email:"admin@company.com",password:"admin123",role:"admin",department:"Administration",joiningDate:new Date("2022-01-10")});
        const priya=await User.create({name:"Priya Manager",email:"priya@company.com",password:"manager123",role:"manager",department:"IT",joiningDate:new Date("2023-03-15")});
        const ravi=await User.create({name:"Ravi Employee",email:"ravi@company.com",password:"employee123",role:"employee",department:"Development",joiningDate:new Date("2024-06-01"),manager:priya._id});
        const anitha=await User.create({name:"Anitha Employee",email:"anitha@company.com",password:"employee123",role:"employee",department:"Testing",joiningDate:new Date("2025-01-20"),manager:priya._id});
        const suresh=await User.create({name:"Suresh Manager",email:"suresh@company.com",password:"manager123",role:"manager",department:"HR",joiningDate:new Date("2021-09-05")});
        const divya=await User.create({name:"Divya Employee",email:"divya@company.com",password:"employee123",role:"employee",department:"Finance",joiningDate:new Date("2023-11-12"),manager:suresh._id});
        const kaushi=await User.create({name:"Kaushi Employee",email:"kaushi@company.com",password:"employee123",role:"employee",department:"Marketing",joiningDate:new Date("2025-07-08"),manager:suresh._id});

        const year=new Date().getFullYear();
        for(const user of [admin,priya,ravi,anitha,suresh,divya,kaushi]){
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
        console.log("priya@company.com / manager123");
        console.log("ravi@company.com / employee123");
        console.log("anitha@company.com / employee123");
        console.log("suresh@company.com / manager123");
        console.log("divya@company.com / employee123");
        console.log("kaushi@company.com / employee123");
    }
    catch(error){
        console.log("Seed error:",error.message);
    }
    process.exit();
};

seedData();