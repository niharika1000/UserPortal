const Pool = require('pg').Pool;
const Yup = require("yup");
const pool = new Pool({
  user: 'niharika',
  host: '127.0.0.1',
  database: 'User',
  password: 'abcd1234',
  port: 5432,
});

const linkSchema = Yup.object({
  body: Yup.object().shape({
    Username: Yup.string().min(8).required(),
    Password: Yup.string().min(8).max(32).matches(/^[^\s]*$/,"Password should not contain whitespace").required(),
    Email: Yup.string().email("E-mail address not valid").required(),
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

const createUser = (validate(linkSchema) ,( request, response) => {
      const {Username,Password,Email,Gender,ProfilePic} = request.body;
      pool.query(`select * from public."UINFO" where "Username"= $1`,[Username], (error, results)=>
    {   
      if (results.rows.length==0){ 
        pool.query(`INSERT INTO public."UINFO"("Username", "Password", "Email", "Gender", "ProfilePic")
        VALUES ($1, $2, $3, $4, $5);`, [ Username,Password,Email,Gender,ProfilePic],(error,results)=>
        { if (error) {throw error}  console.log("Account created succesfully") })
      }
      else { console.log("Username already exists"); response.redirect('./signin.html'); } 
      response.status(200); 
    });
  }
  

const user = ('/api/signin', (request, response) => {
  const {Username,Password}=request.body;
    pool.query('select * from public."UINFO" where "Username"=$1 and "Password"=$2',[Username,Password],(error, results) => {
      if (error) {throw error}
      if (results.rows.length==1){
        response.redirect('profile.html');
      }
      response.status(200);
      
  });
  });
  const userprofile = ('/api/profile/:Username', (request, response) => {
    const para= request.params.Username;
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