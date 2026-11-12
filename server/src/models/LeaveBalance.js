const mongoose=require("mongoose");
const leaveBalanceSchema= new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true,"User is mandatory"],
        },
        leaveType:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "LeaveType",
            required: [true,"Leave type is mandatory"],
        },
        year:{
            type: Number,
            required: [true,"Leave year is mandatory"],
        },
        total:{
            type: Number,
            required: [true,"Total allocated days are mandatory"],
            min: [0,"total days cannot be negative"],
        },
        used:{
            type: Number,
            default: 0,
            min: [0,"Days already used cannot be negative"],
        },
    },
    {
        timestamps: true,
    }
);
leaveBalanceSchema.index(
    {user: 1, leaveType: 1, year: 1},
    {unique: true}
);
const LeaveBalance=mongoose.model("LeaveBalance",leaveBalanceSchema);
module.exports=LeaveBalance;