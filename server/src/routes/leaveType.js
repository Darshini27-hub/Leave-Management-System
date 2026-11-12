const express=require("express");
const router=express.Router();
const{createLeaveType,getLeaveTypes,updateLeaveType,updateLeaveTypeStatus}=require("../controllers/leaveType");
const protect=require("../middleware/auth");
const authorize=require("../middleware/role");

router.post("/",protect,authorize("admin"),createLeaveType);
router.get("/",protect,getLeaveTypes);
router.put("/:id",protect,authorize("admin"),updateLeaveType);
router.patch("/:id/status",protect,authorize("admin"),updateLeaveTypeStatus);

module.exports=router;
