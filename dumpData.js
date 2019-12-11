const express = require('express')
const morgan = require('morgan')
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(
  'bolt://localhost:11002',
  neo4j.auth.basic('neo4j', 'sudri@123')
)
console.log("Connected to neo4j")
const cors = require('cors')
const session = driver.session();
let filePath=`C:\\Users\\320069346\\Documents\\sudsWorkspace\\nodejsWork\\learnings\\MLWithGraph\\allData.json`
let query2=`
WITH "https://raw.githubusercontent.com/mneedham/bbcgoodfood/master/stream_all.json" as url
CALL apoc.load.json(url) YIELD value
UNWIND value.item as data
return data.page`


const resultPromise = session.run(query2);
  resultPromise.then(result => {
    session.close();
    console.log(result, "data")
    // on application exit:
    driver.close();
  });
  resultPromise.catch((err) => {
    console.log(err)
  })