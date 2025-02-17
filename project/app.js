const express=require("express");
const mysql=require("mysql2");
const app=express();//craete express object
require('dotenv').config();  // Load environment variables(.env)
const path=require('path');
const hbs=require("hbs");

//router
const routes=require("./server/routes/users");
app.use('/',routes);

//Mysql connection
const con=mysql.createPool({
    connectionLimit:10,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    port: process.env.DB_PORT
});

con.getConnection((err,connection)=>{
    if (err) {
        console.error("❌ Database connection failed: ", err);
    } else {
        console.log("✅ Database connected successfully!");
        connection.release(); // Release the connection back to the pool
    }
})

//console.log(__dirname);
const location=path.join(__dirname,"./public");
app.use(express.static(location));
app.set('view engine','hbs');  //tell to express , i gonna use hbs handle bar

const partialPath = path.join(__dirname, "./views/partials"); 
hbs.registerPartials(partialPath);


const port = process.env.port||5000;  //server port
app.listen(8000,()=>{
    console.log("server is running at http://localhost:8000/");
})