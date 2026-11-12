const mongoose=require("mongoose");
const leaveTypeSchema= new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true,"Leave type name is mandatory"],
            unique: true,
            trim: true,
        },
        yearlyDays:{
            type: Number,
            required: [true, "Yearly leave days is mandatory"],
            min: [0,"Yearly days can't be negative"],
            trim: true,
        },
        isActive:{
            type: Boolean,
            default: true,
        },
        // createdAt:{
        //     type: Date,
        //     default: Date.now,
        // },
        // updatedAt:{
        //     type: Date,
        //     default: Date.now,
        // },
    },
    {
        timestamps: true,
    }
);

const Leavetype= mongoose.model("LeaveType", leaveTypeSchema);
module.exports=Leavetype;