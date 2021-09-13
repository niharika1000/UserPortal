
const express = require('express');
const path=require('path');
const dotenv=require("dotenv").config;
const app = express();
const port = 3000;
//const router = express.Router();
const db = require('./Database.js');
//const cookie= require('cookie-parser');
//app.use(cookie());
app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

app.use(express.json({limit: '50mb'}));

const jwt = require("jsonwebtoken");
const authenticate = require("./middleware/auth");

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.get("/", (req, res) => {
  res.status(200).send("Welcome 🙌 to Yikes Technology ");
}); 

app.get('/login',function(req,res){
  res.sendFile(path.join(__dirname+'/views/signin.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/register',function(req,res){
  res.sendFile(path.join(__dirname+'/views/signup.html'));
});

app.get('/profile/:UserId', function(req,res){
  res.sendFile(path.join(__dirname+`/views/profile.html`));
});

//add the router
//app.use('/', router);

app.post('/api/register', db.createUser);
app.post('/api/login', db.user);
app.get('/api/profile/:UserId' , authenticate, db.userprofile);
app.put('/api/logout/:UserId' ,authenticate,  db.logoutuser );

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
  });