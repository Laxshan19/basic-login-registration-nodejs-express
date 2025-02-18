const express=require("express");
const mysql=require("mysql2");
const app=express();//craete express object
require('dotenv').config();  // Load environment variables(.env)
const path=require('path');
const hbs=require("hbs");
const cookieParser=require("cookie-parser");


//Middleware to parse form and JSON data
//express.urlencoded() and express.json() are before your route definitions
app.use(express.urlencoded({extended:false}));


app.use(cookieParser());  //Use cookieParser BEFORE routes so cookies are available
/* cookieParser middleware is being used after defining the routes in app.js. Because of this,
 the cookies are not available in your route handlers, including isLoggedIn.  */


// Router (After middleware)
app.use('/',require("./server/routes/pages"));
app.use('/auth',require("./server/routes/auth"));


//Mysql connection
const con=mysql.createConnection({
    connectionLimit:10,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    port: process.env.DB_PORT
});

con.connect((err)=>{
    if (err) {
        console.error("❌ Database connection failed: ", err);
    } else {
        console.log("✅ Database connected successfully!");
    }
})





// Set up static files and view engine
//console.log(__dirname);
const location=path.join(__dirname,"./public");
app.use(express.static(location));
app.set('view engine','hbs');  //tell to express , i gonna use hbs handle bar

const partialPath = path.join(__dirname, "./views/partials"); 
hbs.registerPartials(partialPath);

// Start the server
const port = process.env.port||5000;  //server port
app.listen(8000,()=>{
    console.log("server is running at http://localhost:8000/");
})