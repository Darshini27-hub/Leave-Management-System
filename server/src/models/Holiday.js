const mongoose=require("mongoose");
const holidaySchema=new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true,"Holiday name is mandatory"],
            trim: true,
        },
        date:{
            type: Date,
            required: [true,"Date is mandatory"],
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);
const Holiday=mongoose.model("Holiday", holidaySchema);
module.exports=Holiday;