const express=require("express");
const userController=require("../controller/userController");
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("index");
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