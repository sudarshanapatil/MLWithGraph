var express = require('express');
var request = require('request');
var app = express();

var txUrl = "http://localhost:7474/db/data/transaction/commit";

app.get('/', function (req, res) {
  res.send('<h2>This is a demo of neo4j, a graph database</h2>');
});


app.get('/data', function (req, res) {

});

app.post('/data', function (req, res) {

});
var neo4j = require('neo4j');
try {
  
  var db = new neo4j.GraphDatabase('http://localhost:7474');
} catch (error) {
  console.log(error)
}

var node = db.createNode({hello: 'world'});     // instantaneous, but...
node.save(function (err, node) {    // ...this is what actually persists.
    if (err) {
        console.error('Error saving new node to database:', err);
    } else {
        console.log('Node saved to database with id:', node.id);
    }
});