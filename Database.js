const Pool = require('pg').Pool;
const express = require('express');
const app = express();
const url= require('url');
const jwt = require("jsonwebtoken");
app.use(express.json());

const bcrypt = require('bcrypt');
const saltRounds = 10;

const pool = new Pool({
  user: 'niharika',
  host: '127.0.0.1',
  database: 'User',
  password: 'abcd1234',
  port: 5432,
});

const createUser = (request, response) => {
      console.log(request);
      Body=request.body;
      const {Username,Password,Email,Gender,ProfilePic} = Body;

      if(Username.length<8){ response.status(401).send("Username length must be greater than 8"); return; }
      if( (/\s/g).test(Username)){ response.status(401).send("Username must not have a space and any special characters"); return; } 
      if( (/\s/g).test(Password)){ response.status(401).send("Password must not have a space or a special character"); return; }
      if(  Password.length<8 || Password.length>32){ response.status(401).send("Password length must be greater than 8 and less than 32"); return; }
      if(! (/^[\w]*@[a-zA-Z]*\.[a-z]*$/g).test(Email)){ response.status(401).send("Invalid Email"); return; }
      if(! (/^male$|^female$|^others$/gi).test(Gender)){ response.status(401).send("Gender be male, female, or others"); return; } 
      
      const Passhash = bcrypt.hashSync(Password,saltRounds);

      pool.query(`select * from public."USER" where "Email"= $1`,[Email], (error, results)=>
    {  
      if (results.rows.length==0){ 
        pool.query(`INSERT INTO public."USER"(
          "Username", "Password", "Email", "Gender", "ProfilePic")
          VALUES ($1, $2, $3, $4, $5);`, [ Username,Passhash,Email,Gender,ProfilePic],(error,results)=>
        { if (error) {throw error}  response.json({ message:"Account created succesfully"}); })
      }
      else { return response.json({ message:"User already exists"}); }
    });
  };
  

const user = ((request, response) => {
  console.log(request.body);
  const {Email,Password}=request.body;
      pool.query('select * from public."USER" where "Email"=$1',[Email],(error, results) => {
      if (error) {throw error}
      console.log(results.rows[0]);
      if (results.rows.length==1)
      { if(bcrypt.compareSync(Password,results.rows[0].Password)){
          const token = jwt.sign(
          { "UserId": results.rows[0].UserId, "Email": Email },
          "Sherlock",
          {
            "expiresIn": "1h",
          });
          pool.query('UPDATE public."USER" SET "Token"=$1 WHERE "UserId"=$2;',[token,results.rows[0].UserId],(error, results) => 
          {if (error) {throw error} });
        return response.status(200).json({ message: "You logged in successfully", Token: token , UserId: results.rows[0].UserId }); 
      }
        else { response.status(400).json({ message:"Password is wrong"} ); } // 400 for bad request.
      }
      else 
      { return response.json({ message: "User not registered. You need to create an account. "});}
    }); 
      
  });
const userprofile = ( (request, response) => {
    const ID= request.params.id;
    pool.query(`select "Username","Email","Gender","ProfilePic" from public."USER" where "UserId"=$1`,[ID],(error, results) => {
      if (error) { throw error}
      response.status(200).json(results.rows);
    });
  });

const logoutuser = ( (request, response) => {
    //console.log(request);
    const ID= request.params.id;
    pool.query(`UPDATE public."USER"
    SET "Token"=''
    WHERE "UserId"=$1;`,[ID],(error, results) => 
    { if (error) {throw error} 
        response.status(200).json({ message:"You logged out"});}); 
    });

module.exports = { 
    createUser,
    user,
    userprofile,
    logoutuser
    };