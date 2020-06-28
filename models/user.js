
const db = require('../server.js')
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
router.post('/data', function (req, res) {
 res.status(200).send("received request at http://localhost:3000/businesses");
});

router.post('/login', function (req, res) {
  var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
  let query = 'SELECT * FROM user'
  db.queryAsync(query)
    .then(function (rows) {
      console.log(rows)
      
  res.status(200).send({token,msg:"login successfull!"});
    })
    .catch(err => {
      console.log(err)
    })
});

router.post('/register', function (req, res) {
  res.status(200).send("login successfull!");
 }); 
module.exports = router;