const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const userSchema= new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true,"Name is mandatory"],
            trim: true,
        },
        email:{
            type: String,
            required: [true,"Email is mandatory"],
            trim: true,
            unique: true,
            lowercase: true,
        },
        password:{
            type: String,
            required: [true,"Password is mandatory"],
            trim: true,
            select: false,
        },
        role:{
            type: String,
            required: true,
            enum: ["employee","manager","admin"],
            default: "employee",
        },
        department:{
            type: String,
            trim: true,
            default: null,
        },
        manager:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        joiningDate:{
            type: Date,
            default: Date.now,
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
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,10);
});
userSchema.methods.matchPassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
};
const User=mongoose.model("User", userSchema);
module.exports=User;