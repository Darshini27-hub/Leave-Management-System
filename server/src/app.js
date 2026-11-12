const express= require("express");
const cors= require("cors");
const morgan= require("morgan");
const errorHandler=require("./middleware/errorHandler");

const authRoutes= require("./routes/auth");
const userRoutes= require("./routes/user");
const leaveTypeRoutes= require("./routes/leaveType");
const leaveRoutes= require("./routes/leave");
const holidayRoutes= require("./routes/holiday");
const dashboardRoutes= require("./routes/dashboard");
const app= express();

app.use(express.json());
app.use(cors({origin:process.env.CLIENT_URL}));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leave-types", leaveTypeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/",(req,res)=>{
    res.json({success:true,message:"Leave Management API is running"});
});

app.use((req,res) => {
    res.status(404).json({success:false,message: "Route Not Found",});
});

app.use(errorHandler);

module.exports=app;