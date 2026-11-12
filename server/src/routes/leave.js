const express=require("express");
const router=express.Router();
const {getMyBalance,applyLeave,getMyLeaves,cancelLeave,reviewLeave,getTeamLeaves,getAllLeaves}=require("../controllers/leave");
const protect=require("../middleware/auth");
const authorize=require("../middleware/role");

router.get("/balance",protect,getMyBalance);
router.get("/my",protect,authorize("employee","manager"),getMyLeaves);
router.post("/",protect,authorize("employee","manager"),applyLeave);
router.patch("/:id/cancel",protect,cancelLeave);
router.get("/team",protect,authorize("manager"),getTeamLeaves);
router.get("/",protect,authorize("admin"),getAllLeaves);
router.patch("/:id/review",protect,authorize("manager","admin"),reviewLeave);
module.exports=router;