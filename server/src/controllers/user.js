const User=require("../models/User");
const {createBalancesForUser}=require("../utils/calculateLeaveDays");
const createUser=async(req,res,next)=>{
    try{
        const{name,email,password,role,department,manager,joiningDate}=req.body;
        if(!name || !email || !password || !role){
            return res.status(400).json({success:false, message:"Name,email,password,role are required"});
        }
        if(!email.includes("@")){
            return res.status(400).json({success:false, message:"Enter a valid email id"});
        }
        if(password.length < 6){
            return res.status(400).json({success:false, message:"Password length must be 6 characters"});
        }
        if((!["employee", "manager", "admin"].includes(role))){
            return res.status(400).json({success:false, message:"Role must be employee, manager or admin"});
        }
        const emailExists=await User.findOne({email:email.toLowerCase()});
        if(emailExists){
            return res.status(409).json({success:false, message:"Email already exists"});
        }
        if(manager){
            const managerUser=await User.findById(manager);
            if(!managerUser || managerUser.role === "employee"){
                return res.status(400).json({success:false, message:"Manager is not available"});
            }
        }
        const user=await User.create({
            name,
            email,
            password,
            role,
            department,
            manager: manager||null,
            joiningDate,
        });
        await createBalancesForUser(user._id,new Date().getFullYear());
        //removing the password before sending
        const userData=user.toObject();
        delete userData.password;
        res.status(201).json({success:true, message:"User created", data: userData});
    }
    catch(error){
        next(error);
    }
};

const getUsers= async(req,res,next)=>{
    try{
        const{search,role,department,page=1,limit=10}=req.query;
        const filter={};
        if(search){
            filter.$or=[
                {name:{$regex:search, $options:"i"}},
                {email:{$regex:search, $options:"i"}},
            ];
        }
        if(role)
            filter.role=role;
        if (department) 
            filter.department = { $regex: department, $options: "i" };
        const pageNumber=Number(page);
        const limitNumber=Number(limit);
        const total=await User.countDocuments(filter);
        const users= await User.find(filter).populate("manager","name email").sort({createdAt: -1}).skip((pageNumber -1)* limitNumber).limit(limitNumber);
        res.status(200).json({success:true, message:"User fetched", data: {users,page:pageNumber, totalPages:Math.ceil(total/limitNumber),total}});
    }
    catch(error){
        next(error);
    }
};

const getUserById = async (req,res,next)=>{
    try{
        const user=await User.findById(req.params.id).populate("manager","name email");
        if(!user){
            return res.status(404).json({success:false, message:"User not found"});
        }
        res.status(200).json({success:true, message:"User fetched", data:user});
    }
    catch(error){
        next(error);
    }
};

const updateUser=async(req,res,next)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        const{name,email,role,department,manager,joiningDate}=req.body;
        if(email && email.toLowerCase() !== user.email){
            const emailExists=await User.findOne({email:email.toLowerCase()});  
            if(emailExists){
                return res.status(409).json({success:false,message:"Email already exists"});
            }  
            user.email=email;    
        }
        if(name)
            user.name=name;
        if(role){
            if(!["employee","manager","admin"].includes(role)){
                return res.status(400).json({success:false,message:"Invalid role"});
            }
            user.role=role;
        }
        if(department !== undefined)
            user.department=department;
        if(joiningDate !== undefined)
            user.joiningDate=joiningDate;
        if(manager !== undefined){
            if(manager === user._id.toString()){
                return res.status(400).json({success:false,message:"User cant be own manager"});
            }
            if(manager){
                const managerUser=await User.findById(manager);
                if(!managerUser || managerUser.role === "employee"){
                    return res.status(400).json({success:false,message:"Manager is not valid"});
                }
            }
            user.manager=manager || null;
        }
        await user.save();
        res.status(200).json({success:true, message:"User updated", data:user});
    }
    catch(error){
        next(error);
    }
};

const updateUserStatus=async(req,res,next)=>{
    try{
        const{isActive}=req.body;
        if(typeof isActive !== "boolean"){
            return res.status(400).json({success:false,message:"isActive must be true or false"});
        }
        if(req.params.id === req.user._id.toString() && isActive === false){
            return res.status(400).json({success:false,message:"You cannot deactivate"});
        }
        const user=await User.findByIdAndUpdate(req.params.id,{isActive},{new:true});
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        const text=isActive ? "activated" : "deactivated";
        res.status(200).json({success:true,message:"User "+text, data:user});
    }
    catch(error){
        next(error);
    }
};

const getMyTeam=async(req,res,next)=>{
    try{
        const team=await User.find({manager:req.user._id,isActive:true}).select("-password");
        res.status(200).json({success:true,message:"Team fetched",data:team});
    }
    catch(error){
        next(error);
    }
};

module.exports={createUser,getUsers,getUserById,updateUser,updateUserStatus,getMyTeam};