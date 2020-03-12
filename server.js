// server.js
const express = require('express');
const app = express();

const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//let router = express.Router();
const mysql = require('mysql')
const bluebird =require('bluebird')
const con = mysql.createConnection({
  host: 'localhost',
  user: 'fgadmin',
  password: 'sudri@123',
  database:'mtech_project'
})
con.connect(function (err) {
  if (err) throw err
  console.log('Connected to mysql! ')
})
const db = bluebird.promisifyAll(con)
module.exports = db
let port=1337
const router = require('./router/router')(app);
app.listen(port, function() {
  console.log("Server is running on port", port);
});
//console.log(db,"db connect")
//module.exports.hi="hey"



