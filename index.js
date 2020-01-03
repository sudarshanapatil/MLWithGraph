const express = require('express')
const morgan = require('morgan')
const neo4j = require('neo4j-driver').v1
var driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'sudri@123')
)
console.log('Connected to neo4j')
const cors = require('cors')
const session = driver.session()

const app = express()
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/getsimilaruser', (req, res) => {
  let userName = req.body.userName
  console.log('in get data')
  let query = `MATCH    (p1:Person {name:'${userName}'})-[s:SIMILARITY]-(p2:Person)
  WITH     p2, s.similarity AS sim
  ORDER BY sim DESC
  LIMIT    5
  RETURN   p2.name AS Neighbor, sim AS Similarity`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    //session.close()
    //console.log(result, "data")
    let userList = result.records.map(i => {
      return { name: i['_fields'][0], similarity: i['_fields'][1].toFixed(2) }
      //return i["_fields"][0].properties.name
    })
    //ingredients = ingredients.sort()
    res.send(userList)
    // on application exit:
    //driver.close()
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.post('/getuserrating', (req, res) => {
  let userNameArr = req.body.userNameArr
  let getRecipeQ = 'MATCH (n:Recipe) RETURN n limit 15'
  const recipeData = session.run(getRecipeQ)
  recipeData.then(data => {
    let obj = {}
    data.records.map(i => {
      let recipeName = i['_fields'][0].properties.name
      let getRecipeRatingQ = `MATCH (:Recipe {name: '${recipeName}'})-[r:Rated]-(b) RETURN r,b`
      const userRating = session.run(getRecipeRatingQ)
      userRating.then(userRatingData => {
        userRatingData.records.map(userData => {
          let userName = userData['_fields'][1].properties.name
          let userRating = userData['_fields'][0].properties.rating.low
          if (!obj[userName]) {
            obj[userName] = [
              {
                recipeName,
                userRating
              }
            ]
            //console.log(obj,"in if")
          } else {
            obj[userName].push({
              recipeName,
              userRating
            })
            // console.log(obj,"in else")
          }
        })
      })
    })
    //console.log(obj,"obj")
  })

 
})

app.get('/getallingredients', (req, res) => {
  console.log('in get data')
  let query = `MATCH (n:Ingredient) RETURN n limit 50`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    session.close()
    console.log(result, 'data')
    let ingredients = result.records.map(i => {
      return i['_fields'][0].properties.name
    })
    ingredients = ingredients.sort()
    res.send(ingredients)
    // on application exit:
    driver.close()
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.get('/getall', (req, res) => {
  console.log('in get data')
  const nodeName = `Recipe`
  let query = `MATCH (r:Recipe) WHERE (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "chilli"}) 
  RETURN r.name AS recipe, 
         [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
         AS ingredients`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    session.close()
    console.log(result, 'data')
    res.send(result)
    // on application exit:
    driver.close()
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.get('/getdetailedrecipe', (req, res) => {
  console.log('in get data')
  const nodeName = `Recipe`
  let query = `MATCH (r:Recipe) WHERE (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "chilli"}) 
  RETURN r.name AS recipe, 
         [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
         AS ingredients`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    session.close()
    console.log(result, 'data')
    res.send(result)
    // on application exit:
    driver.close()
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.post('/getuserrecommendation', (req, res) => {
  console.log('in get data')
  const nodeName = `Recipe`
  let userName = req.body.userName
  let query = `MATCH    (b:Person)-[r:Rated]->(m:Recipe), (b)-[s:SIMILARITY]-(a:Person {name:'${userName}'})
  WHERE    NOT((a)-[:Rated]->(m))
  WITH     m, s.similarity AS similarity, r.rating AS rating
  ORDER BY m.name, similarity DESC
  WITH     m.name AS recipe, COLLECT(rating)[0..3] AS ratings
  WITH     recipe, REDUCE(s = 0, i IN ratings | s + i)*1.0 / LENGTH(ratings) AS reco
  ORDER BY reco DESC
  RETURN   recipe AS Recipe, reco AS Recommendation`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    session.close()
    console.log(result, 'data of recommendation')
    let recipes = result.records.map(i => {
      return i['_fields'][0]
    })
    res.send(recipes)
    // on application exit:
    //driver.close()
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.post('/getrecipes', (req, res) => {
  console.log('in get data', req.body)
  let ingredients = req.body.ingredients

  let finalQ = ingredients.map((i, index) => {
    if (index === 0)
      return `WHERE (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "${ingredients[0]}"})`
    else return `AND   (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "${i}"})`
  })

  finalQ = finalQ.join(' ')
  try {
    let query = `MATCH (r:Recipe) ${finalQ}
         RETURN r.name AS recipe, 
         [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
         AS ingredients`
    console.log(query, ' : Query on database')
    const resultPromise = session.run(query)
    resultPromise.then(result => {
      // console.log(result.records,"RecipesData================")
      session.close()
      let recipes = result.records.map(i => {
        return {
          recipe: i['_fields'][0],
          ingredients: i['_fields'][1],
          score: i['_fields'][1].length
        }

        // console.log(i["_fields"])
        // return i["_fields"][0]
      })

      recipes = recipes.sort(function (a, b) {
        let keyA = a.score,
          keyB = b.score
        // Compare the 2 dates
        if (keyA < keyB) return -1
        if (keyA > keyB) return 1
        return 0
      })
      //console.log(recipes, " : data")
      res.send(recipes)
      driver.close()
    })
    resultPromise.catch(err => {
      console.log(err)
      res.send(err)
    })
  } catch (err) {
    console.log('Error : ', err)
    res.send(err)
  }
})

// Starting server
const port = 1337
app.listen(port)
console.log('Server Started on port : ' + port)
