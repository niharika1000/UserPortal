const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'niharika',
  host: '127.0.0.1',
  database: 'User',
  password: 'abcd1234',
  port: 5432,
});

const createUser = (request, response) => {
    const {EMP_ID,FIRST_NAME,LAST_NAME,JOINING_DATE,SALARY,DEPARTMENT} = request.body;
    console.log(request.body);
    pool.query( ``, 
      (error, results)=>{ if (error) {
        throw error
      } console.log(results)} ); 
      
      response.status(201).send(`User added`);
  };

const  user = (request, response) => {
    pool.query('', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(res);
      
  });
  };

  const redirect = (request, response) => {
    pool.query('', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows);
    });
  };

 module.exports = { 
    createUser,
    user,
    redirect
    };
