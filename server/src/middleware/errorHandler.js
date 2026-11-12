const errorHandler=(err,req,res,next)=>{
    console.log(err);
    let statusCode= err.statusCode || 500;
    let message= err.message || "Server error";
    if(err.code === 11000)
    {
        statusCode=409;
        message="This value already exists";
    }
    if(err.name === "CastError")
    {
        statusCode=400;
        message="Invalid id";
    }
    if(err.name==="ValidationError")
    {
        statusCode=400;
    }
    res.status(statusCode).json({success: false, message});
};
module.exports=errorHandler;