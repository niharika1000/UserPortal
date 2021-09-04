const express = require('express');
const path=require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/',express.static(path.join(_dirname,'static')));


app.get('/', (request, response) => {
    response.json({ info: 'Welcome to Digital School' });
  });

const db = require('./Database.js');

app.post('/api/RegisterUser', db.createUser);
app.get('/api/UserProfile', db.user);
app.get('/api/signin', db.redirect);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
  });