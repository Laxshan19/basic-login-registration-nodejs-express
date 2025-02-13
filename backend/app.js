const express=require("express");
const app=express();//craete express object

app.get("/",(req,res)=>{
    res.send("<h1>Hello</h1>")
})

app.listen(8080,()=>{
    console.log("server is running at http://localhost:8080/");
})