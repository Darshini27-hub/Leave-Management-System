const express=require("express");
const router=express.Router();
const{createUser,getUsers,getUserById,updateUser,updateUserStatus,getMyTeam}=require("../controllers/user");
const protect=require("../middleware/auth");
const authorize=require("../middleware/role");

router.get("/my-team",protect,authorize("manager","admin"),getMyTeam);
router.post("/",protect,authorize("admin"),createUser);
router.get("/",protect,authorize("admin"),getUsers);
router.get("/:id",protect,authorize("admin"),getUserById);
router.put("/:id",protect,authorize("admin"),updateUser);
router.patch("/:id/status",protect,authorize("admin"),updateUserStatus);

module.exports=router;