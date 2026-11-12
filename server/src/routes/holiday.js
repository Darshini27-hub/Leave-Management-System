const express=require("express");
const router=express.Router();
const{addHoliday,getHolidays,deleteHoliday}=require("../controllers/holiday");
const protect=require("../middleware/auth");
const authorize=require("../middleware/role");

router.post("/",protect,authorize("admin"),addHoliday);
router.get("/",protect,getHolidays);
router.delete("/:id",protect,authorize("admin"),deleteHoliday);
module.exports=router;