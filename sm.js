const express = require('express')
const morgan = require('morgan')
const bluebird = require('bluebird')
const neo4j = require('neo4j-driver')
var driver = neo4j.driver(
  // 'bolt://localhost:11002',
  // neo4j.auth.basic('neo4j', 'sudri@123'),
  'bolt://hobby-mnebmdhpafecgbkeffhkbnel.dbs.graphenedb.com:24787',
  neo4j.auth.basic('admin', 'b.07RUt0fH9MFy.7t8a3ZTSyt16rq9y'),
  {
    //Cloud DB
    //url:bolt://hobby-mnebmdhpafecgbkeffhkbnel.dbs.graphenedb.com:24787
    //password:b.07RUt0fH9MFy.7t8a3ZTSyt16rq9y
    //user:admin
     maxConnectionLifetime: 60 * 60 * 1000, // 1 hour
    maxConnectionPoolSize: 300,
  }
)
console.log('Connected to neo4j')
const cors = require('cors')
const session = driver.session()
const session2 = driver.session()
const app = express()
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/dataimport', (req, res) => {
  let userName = req.body.userName
  console.log('in login', req.body)
  let query1='MATCH (n1)-[r]->(n2) RETURN r, n1, n2 LIMIT 25'
  const resultPromise = session.run(query1)
  resultPromise.then(result => {
    //session.close()
   
    // ingredien = ingredients.sort()
    res.send({ code: 200, message: 'Successfully saved' })
    // on application exit:
    //driver.close()
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})
app.post('/raterecipes', (req, res) => {
  //TODO:jwttoken implemetion need to be added
  let recipeId = req.body.recipeId
  let rating = req.body.rating
  let userName = 'Sudarshana'
  console.log('rateRecipes', recipeId)
  let query2 = `MATCH (a:Person),(b:Recipe)
  WHERE a.name = '${userName}' AND b.id = '${recipeId}'
  Merge (a)-[r:Rated { rating:${rating} }]->(b)
  RETURN type(r), r.name`

  let query = `MATCH (n { id: '${recipeId}' })
  SET n.skillLevel = 'Most Difficult'
  RETURN n`
  const resultPromise = session.run(query2)
  resultPromise.then(result => {
    //session.close()
    let ingredients = result.records.map(i => {
      console.log(i['_fields'][0], 'data')
      return i['_fields'][0]
    })
    // ingredients = ingredients.sort()
    res.send({ code: 200, message: 'Successfully saved' })
    // on application exit:
    //driver.close()
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})


// Starting server
const port = 1337
app.listen(port)
console.log('Server Started on port : ' + port)
