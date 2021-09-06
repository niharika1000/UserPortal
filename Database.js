const Pool = require('pg').Pool;
const Yup = require("yup");
const express = require('express');
const app = express();
const url= require('url');
app.use(express.urlencoded({ extended: false }));
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
      pool.query(`select * from public."UINFO" where "Username"= $1`,[Username], (error, results)=>
    {   
      if (results.rows.length==0){ 
        pool.query(`INSERT INTO public."UINFO"("Username", "Password", "Email", "Gender", "ProfilePic")
        VALUES ($1, $2, $3, $4, $5);`, [ Username,Password,Email,Gender,ProfilePic],(error,results)=>
        { if (error) {throw error}  response.send("Account created succesfully") })
      }
      else { response.send("Username already exists"); }
      response.status(200); 
    });
  });
  

const user = ((request, response) => {
  const {Username,Password}=request.body;
  console.log(Username, Password);
    pool.query('select * from public."UINFO" where "Username"=$1 and "Password"=$2',[Username,Password],(error, results) => {
      if (error) {throw error}
      if (results.rows.length==1){
        response.redirect(url.format({
          pathname:'http://localhost:3000/profile',
          query:{"Username": Username }
        }));
      }
      else{ response.redirect('http://localhost:3000/login'); }

      }); 
      response.status(200);
      
  });
  const userprofile = ( (request, response) => {
    //const para= request.params.Username;
    pool.query(`select * from public."UINFO" where "Username"=$1`,[para],(error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows);
    });
  });

 module.exports = { 
    createUser,
    user,
    userprofile
    };