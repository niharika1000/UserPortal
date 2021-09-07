const Pool = require('pg').Pool;
const Yup = require("yup");
const express = require('express');
const app = express();
const url= require('url');
app.use(express.urlencoded({ extended: false }));
const jwt = require("jsonwebtoken");

const config = process.env;


const bcrypt = require('bcrypt');
const saltRounds = 10;

const pool = new Pool({
  user: 'niharika',
  host: '127.0.0.1',
  database: 'User',
  password: 'abcd1234',
  port: 5432,
});

const linkSchema = Yup.object({
  body: Yup.object().shape({
    Username: Yup.string().min(8),
    Password: Yup.string().min(8).max(32).matches(/^[^\s]*$/,"Password should not contain whitespace"),
    Email: Yup.string().email("E-mail address not valid"),
    Gender:Yup.string(),
    ProfilePic:Yup.object()
  })
  });
const validate = (schema) => async (request,response,next) => 
{ console.log("hello");
  try {
    await schema.validate(
      { body: request.body });
    return next();
  } catch (err) {
    return response.status(500).json({ type: err.name, message: err.message });
  }
}; 

const createUser = (validate(linkSchema),(request, response) => {
      console.log(request.body);
      Body=request.body;
      //linkSchema.validate(Body);
      const {Username,Password,Email,Gender,ProfilePic} = Body;

      if(Username.length<8){ response.status(401).send("Username length must be greater than 8"); return; }
      if( (/\s/g).test(Username)){ response.status(401).send("Username must not have a space and any special characters"); return; } 
      if( (/\s/g).test(Password)){ response.status(401).send("Password must not have a space or a special character"); return; }
      if(  Password.length<8 || Password.length>32){ response.status(401).send("Password length must be greater than 8 and less than 32"); return; }
      if(! (/^[\w]*@[a-zA-Z]*\.[a-z]*$/g).test(Email)){ response.status(401).send("Invalid Email"); return; }
      if(! (/^male$|^female$|^others$/gi).test(Gender)){ response.status(401).send("Gender be male, female, or others"); return; } 
      
      const Passhash = bcrypt.hashSync(Password,saltRounds);
      console.log(Passhash);

      pool.query(`select * from public."UINFO" where "Email"= $1`,[Email], (error, results)=>
    {  
      if (results.rows.length==0){ 
        pool.query(`INSERT INTO public."UINFO"("Username", "Password", "Email", "Gender", "ProfilePic")
        VALUES ($1, $2, $3, $4, $5);`, [ Username,Passhash,Email,Gender,ProfilePic],(error,results)=>
        { if (error) {throw error}  response.send("Account created succesfully") })
      }
      else { response.send("Username already exists"); }
      response.status(200); 
    });
  });
  

const user = ((request, response) => {
  const {Email,Password}=request.body;
  //const Passhash = bcrypt.hashSync(Password,saltRounds);
  //console.log(Passhash1);
  //result = bcrypt.compareSync(Password,Passhash2);
  //bcrypt.compare(Password, Passhash)
    pool.query('select * from public."UINFO" where "Email"=$1',[Email],(error, results) => {
      if (error) {throw error}
      //console.log(results.rows[0].Email);
      if (results.rows.length==1 && bcrypt.compareSync(Password,results.rows[0].Password)){

       /* const token = jwt.sign(
          { user_id: user._id, Email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  */
        // save user token

        response.redirect(url.format({
          pathname:'http://localhost:3000/profile',
          query:{
                  "Email":results.rows[0].Email }
        }));
      }
      else{ response.redirect('http://localhost:3000/login'); }

      }); 
      response.status(200);
      
  });
  const userprofile = ( (request, response) => {
    const { Password , Email}= request.query;
    pool.query(`select * from public."UINFO" where "Email"=$1`,[Email],(error, results) => {
      if (error) { throw error}
      if(bcrypt.compareSync(Password,results.rows[0].Password))
      response.status(200).json(results.rows);
    });
  });

 module.exports = { 
    createUser,
    user,
    userprofile
    };