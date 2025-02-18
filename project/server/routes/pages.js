const express=require("express");
const userController=require("../controllers/userController");
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("login");
})

router.get("/register",(req,res)=>{
    res.render("register");
})

router.get("/profile",(req,res)=>{
    res.render("profile");
})

router.get("/home",(req,res)=>{
    res.render("home");
})

module.exports=router;