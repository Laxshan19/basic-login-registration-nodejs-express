const mysql=require("mysql2");     //  to communicate to mysql server
const bcrypt=require("bcryptjs");

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
        }
  
        // Login successful
        return res.render("home", { msg: "Login Successful!", msg_type: "good" });
      });
  
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Internal Server Error");
    }
  };
  





