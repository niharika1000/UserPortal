const express = require('express');
const path=require('path');
const app = express();
const port = 3000;
const router = express.Router();
const db = require('./Database.js');
app.use(express.urlencoded({ extended: false }));

router.get('/login',function(req,res){
  res.sendFile(path.join(__dirname+'/views/signin.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/profile',function(req,res){
  res.sendFile(path.join(__dirname+'/views/profile.html'));
});

router.get('/register',function(req,res){
  res.sendFile(path.join(__dirname+'/views/signup.html'));
});

//add the router
app.use('/', router);

app.post('/register', db.createUser);
app.post('/login', db.user);
app.get('/api/profile', db.userprofile);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
  });