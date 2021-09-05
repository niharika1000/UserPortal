const express = require('express');
const path=require('path');
const app = express();
const port = 3000;


app.use(express.json());
app.get('/', (request, response) => {
    response.json({ info: 'Welcome to Digital School' });
  });

const db = require('./Database.js');

app.post('/api/RegisterUser', db.createUser);
app.post('/api/signin', db.user);
app.get('/api/profile/:Username', db.userprofile);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
  });