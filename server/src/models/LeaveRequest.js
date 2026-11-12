const mongoose=require("mongoose");
const leaveRequestSchema= new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true,"Applicant is mandatory"],
        },
        leaveType:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "LeaveType",
            required: [true,"Leave type is mandatory"],
        },
        fromDate:{
            type: Date,
            required: [true,"Start date is mandatory"],
        },
        toDate:{
            type: Date,
            required: [true,"End date is mandatory"],
        },
        days:{
            type: Number,
            required: [true,"Number of leave days is mandatory"],
            min: [0.5,"Leave days must be atleast half day"],
        },
        isHalfDay:{
            type: Boolean,
            default: false,
        },
        reason:{
            type: String,
            required: [true,"Leave reason is mandatory"],
            minlength: [10,"Reason must contain atleast 5 characters"],
            trim: true,
        },
        status:{
            type: String,
            enum: ["pending", "approved", "rejected", "cancelled"],
            default:"pending",
            required: true,
            trim: true,
        },
        reviewedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        reviewComment:{
            type: String,
            trim: true,
            default: "",
        },
        reviewedAt:{
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);
const LeaveRequest= mongoose.model("LeaveRequest",leaveRequestSchema);
module.exports=LeaveRequest;