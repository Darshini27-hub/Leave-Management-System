const Holiday=require("../models/Holiday");
const addHoliday=async(req,res,next)=>{
    try{
        const{name,date}=req.body;
        if(!name || !date){
            return res.status(400).json({success:false,message:"Holiday name and date are required"});
        }
        if(isNaN(new Date(date))){
            return res.status(400).json({success:false,message:"Enter a valid date"});
        }
        const exists=await Holiday.findOne({date:new Date(date)});
        if(exists){
            return res.status(409).json({success:false,message:"holiday already exists"});
        }
        const holiday=await Holiday.create({name,date:new Date(date)});
        res.status(201).json({success:true,message:"Holiday added",data:holiday});
    }
    catch(error){
        next(error);
    }
};

const getHolidays=async(req,res,next)=>{
    try{
        const filter={};
        if(req.query.year){
            const year=Number(req.query.year);
            filter.date={$gte:new Date(Date.UTC(year,0,1)),$lte:new Date(Date.UTC(year,11,31))};
        }
        const holidays=await Holiday.find(filter).sort({date:1});
        res.status(200).json({success:true,message:"Holidays fetched",data:holidays});
    }
    catch(error){
        next(error);
    }
};

const deleteHoliday=async(req,res,next)=>{
    try{
        const holiday=await Holiday.findByIdAndDelete(req.params.id);
        if(!holiday){
            return res.status(404).json({success:false,message:"Holiday not found"});
        }
        res.status(200).json({success:true,message:"Holiday removed"});
    }
    catch(error){
        next(error);
    }
};

module.exports={addHoliday,getHolidays,deleteHoliday};