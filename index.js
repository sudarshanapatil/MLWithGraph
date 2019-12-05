
const express = require('express')
const morgan = require('morgan')
const neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(
  'bolt://localhost:11002',
  neo4j.auth.basic('neo4j', 'sudri@123')
)
console.log("Connected to neo4j")
const cors = require('cors')
const session = driver.session();

const app = express()
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/getallingredients', (req, res) => {
  console.log("in get data")
  let query = `MATCH (n:Ingredient) RETURN n limit 30`
  const resultPromise = session.run(query);
  resultPromise.then(result => {
    session.close();
    console.log(result, "data")
    let ingredients = result.records.map(i => {
      return i["_fields"][0].properties.name
    })
    ingredients=ingredients.sort()
    res.send(ingredients)
    // on application exit:
    driver.close();
  });
  resultPromise.catch((err) => {
    console.log(err)
  })
})

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

app.get('/getdetailedrecipe', (req, res) => {
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

  finalQ = finalQ.join(" ")
  try {
    let query = `MATCH (r:Recipe) ${finalQ}
         RETURN r.name AS recipe, 
         [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
         AS ingredients`
    console.log(query, " : Query on database")
    const resultPromise = session.run(query);
    resultPromise.then(result => {
      // console.log(result.records,"RecipesData================")
      session.close();
      let recipes = result.records.map(i => {

        return ({
          recipe: i["_fields"][0],
          ingredients: i["_fields"][1],
          score: i["_fields"][1].length
        })

        // console.log(i["_fields"])
        // return i["_fields"][0]
      })

      recipes = recipes.sort(function (a, b) {
        let keyA = a.score,
          keyB = b.score;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      //console.log(recipes, " : data")
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