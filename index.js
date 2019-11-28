
const express = require('express')
const morgan = require('morgan')
const neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(
  'bolt://localhost:11002',
  neo4j.auth.basic('neo4j', 'sudri@123')
)
console.log("Connected to neo4j")
const session = driver.session();

const app = express()
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/getall', (req, res) => {
  console.log("in get data")
  const nodeName = `Recipe`
  let query = `MATCH (r:Recipe) WHERE (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "chilli"}) 
  RETURN r.name AS recipe, 
         [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
         AS ingredients`
  const resultPromise = session.run(query);
  resultPromise.then(result => {
    session.close();
    console.log(result, "data")
    res.send(result)
    // on application exit:
    driver.close();
  });
  resultPromise.catch((err) => {
    console.log(err)
  })
})

app.post('/getrecipes', (req, res) => {
  console.log("in get data", req.body)
  let ingredients = req.body.ingredients;
  
  let finalQ = ingredients.map((i, index) => {
    if (index === 0)
      return `WHERE (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "${ingredients[0]}"})`
    else
      return `AND   (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "${i}"})`
  })

  finalQ=finalQ.join(" ")
  try {
    let query = `MATCH (r:Recipe) ${finalQ}
         RETURN r.name AS recipe, 
         [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
         AS ingredients`
    console.log(query," : Query on database")
    const resultPromise = session.run(query);
    resultPromise.then(result => {
      session.close();
      let recipes = result.records.map(i => {
        return i["_fields"][0]
      })
      console.log(recipes, " : data")
      res.send(recipes)
      driver.close();
    });
    resultPromise.catch((err) => {
      console.log(err)
      res.send(err)
    })
  } catch (err) {
    console.log("Error : ", err)
    res.send(err)
  }

})
// Starting server
const port = 1337
app.listen(port)
console.log("Server Started on port : " + port)