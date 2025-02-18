const mysql=require("mysql2");     //  to communicate to mysql server
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const { promisify }=require("util");//decode the token veriable

//Mysql connection
const con=mysql.createConnection({
    connectionLimit:10,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    port: process.env.DB_PORT
});

exports.register=(req, res) => {
    console.log( req.body); // Debugging line
    const {name,email,password,confirm_password}=req.body;  //object destructring
    console.log(email);
    con.query("select email from users where email=?",[email],
        async (err,result)=>{
        if(err){
            confirm.log(err);
        }
        if(result.length>0){
            return res.render('register',{msg:"Email id alraedy taken",msg_type:"error"});
        }else if(password!==confirm_password){
            return res.render('register',{msg:"password does't match",msg_type:"error"})
        }
        let hashedpassword=await bcrypt.hash(password,8);
       // console.log(hashedpassword);
       sql="insert into users set ?";
       con.query(sql,{name:name,email:email,password:hashedpassword},(error,result)=>{
         if(error){
            console.log(error);
         }else{
            console.log(result);
            return res.render("register",{msg:"user Registration Success!",msg_type:"good"});
         }
       })
    });
}

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if email or password is empty
      if (!email || !password) {
        return res.status(400).render("login", {
          msg: "Please enter your email and password",
          msg_type: "error",
        });
      }
  
      // Check if the user exists in the database
      con.query("SELECT * FROM users WHERE email = ?", [email], async (error, result) => {
        if (error) {
          console.error("Database error:", error);
          return res.status(500).send("Internal Server Error");
        }
  
        // If user not found
        if (result.length === 0) {
          return res.status(401).render("login", {
            msg: "User not registered",
            msg_type: "error",
          });
        }
  
        // Compare the password with hashed password
        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch) {
          return res.status(401).render("login", {
            msg: "Wrong password",
            msg_type: "error",
          });
        }else{
         // res.send("Good")
           // // Login successful
        // return res.render("home", { msg: "Login Successful!", msg_type: "good" });
        const id=result[0].id;
        const token=jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
        console.log("the token is"+ token);
        const cookieOption={
          expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
          httponly:true,
        };
        res.cookie("lax",token,cookieOption);
        res.status(200).redirect("/home")
        } });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Internal Server Error");
    }
  };
  


exports.isLoggedIn=async (req,res,next) =>{
  //console.log(req.cookies);
  
  if(req.cookies.lax){
        try{
          const decode=await promisify(jwt.verify)(
            req.cookies.lax,
            process.env.JWT_SECRET
          );
          console.log(decode);
          con.query("select * from users where id=?",[decode.id],(error,results)=>{
            if (error || results.length === 0) {
              return next(); // Proceed without setting user data
            }
            req.user=results[0];
           // console.log(res.user);
            return next();
          });
        }catch(error){
          console.log(error);
          return next();
        }
  }else{
    next();
  }
};


exports.logout = async (req, res) => {
  res.clearCookie("lax");
  res.status(200).redirect("/");
};



