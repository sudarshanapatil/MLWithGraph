const express = require('express')
const morgan = require('morgan')
const bluebird = require('bluebird')
const neo4j = require('neo4j-driver')
const rn = require('random-number');
const options = {
  min: 8000
  , max: 100000
  , integer: true
}
try {
  var driver = neo4j.driver(
    'bolt://localhost:11008',
    neo4j.auth.basic('neo4j', 'sudri@123'),
    {
    }
  )
  console.log('Connected to neo4j')
} catch (error) {

  console.log("Error", error)

}

var mysql = require('mysql')

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sudri@123',
  database: 'mtech_project'
})

const db = bluebird.promisifyAll(con)

con.connect(function (err) {
  if (err) {
  } else console.log('Connected to mysql! ')
})

const cors = require('cors')
const session = driver.session()
const session2 = driver.session()
const app = express()
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/login', (req, res) => {
  let { name, password } = req.body
  console.log('in login', req.body)
  let query = `SELECT password FROM user where name='${name}'`
  db.queryAsync(query)
    .then(function (data) {
      console.log(data, "===")
      if (data[0].password === password) {
        res.send({ code: 200, msg: `Login successful!` })
      } else {
        res.send({ code: 400, msg: `Unauthorized User` })
      }
    })
    .catch(err => {
      console.log(err)
    })
})
app.post('/register', (req, res) => {
  let userName = req.body.name
  let password = req.body.password
  console.log('in register', req.body)
  let query = `insert into user (name,password) values ('${userName}',"${password}")`
  db.queryAsync(query)
    .then(function (rows) {
      console.log(rows)
      res.send({ code: 200, msg: 'successfully inserted!' })
    })
    .catch(err => {
      console.log(err)
    })
})
app.post('/raterecipes', (req, res) => {
  //TODO:jwttoken implemetion need to be added

  let recipeId = req.body.recipeId
  let rating = req.body.rating
  let userName = 'Prajkta'
  console.log(recipeId, 'recipeId', rating, userName)
  console.log('rateRecipes', recipeId)
  let query2 = `MATCH (a:Person),(b:Recipe)
  WHERE a.name = '${userName}' AND b.id = '${recipeId}'
  Merge (a)-[r:Rated ]->(b)
  set  r.rating=${rating}`

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
    let assignNewSimilarity = `MATCH (p1:Person)-[x:Rated]->(m:Recipe)<-[y:Rated]-(p2:Person)
    WITH  SUM(x.rating * y.rating) AS xyDotProduct,
          SQRT(REDUCE(xDot = 0.0, a IN COLLECT(x.rating) | xDot + a^2)) AS xLength,
          SQRT(REDUCE(yDot = 0.0, b IN COLLECT(y.rating) | yDot + b^2)) AS yLength,
          p1, p2
    MERGE (p1)-[s:SIMILARITY]-(p2)
    SET   s.similarity = xyDotProduct / (xLength * yLength)`
    res.send({ code: 200, message: 'Successfully saved' })
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.get('/getallingredients', (req, res) => {
  console.log('in getallingredients')
  let query = `MATCH (n:Ingredient) RETURN n`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    console.log(result, 'data')
    let ingredients = result.records.map(i => {
      return i['_fields'][0].properties.name
    })
    ingredients = ingredients.sort()
    res.send(ingredients)
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.post('/getauthorRecipes', (req, res) => {
  console.log('in getallingredients')
  let authorName = req.body.authorName;
  let query = `MATCH (p1:Author {name:${authorName}})-[s:WROTE]-(p2:Recipe) return p2.name,p2.description`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    console.log(result, 'data')
    let ingredients = result.records.map(i => {
      return i['_fields'][0].properties.name
    })
    ingredients = ingredients.sort()
    res.send(ingredients)
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.get('/getallrecipes', (req, res) => {
  console.log('in getallrecipes')
  let modifiedQ = `MATCH (r:Recipe)
  WHERE (r)-[:CONTAINS_INGREDIENT]->()
  RETURN r.name AS recipe,r.id as id, 
         [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
         AS ingredients`
  const resultPromise = session.run(modifiedQ)
  resultPromise.then(result => {
    console.log(result.records.length)
    let ingredients = result.records.map(i => {
      return {
        recipeName: i['_fields'][0],
        id: i['_fields'][1],
        ingredients: i['_fields'][2]

      }
    })
    ingredients = ingredients.sort()
    res.send(ingredients)
  })
  resultPromise.catch(err => {
    console.log(err, 'here err')
  })
})

app.post('/getrecipes', (req, res) => {
  console.log('in getrecipes', req.body)
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
      let recipes = result.records.map(i => {
        return {
          recipe: i['_fields'][0],
          ingredients: i['_fields'][1],
          score: i['_fields'][1].length
        }
      })

      recipes = recipes.sort(function (a, b) {
        let keyA = a.score,
          keyB = b.score
        if (keyA < keyB) return -1
        if (keyA > keyB) return 1
        return 0
      })
      res.send(recipes)
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

app.post('/getrecipelevel', (req, res) => {
  let level = req.body.skillLevel
  let query = `MATCH (n:Recipe{ skillLevel: '${level}' }) RETURN n limit 20`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    let finalData = result.records.map(recipe => {
      let data = recipe['_fields'][0].properties;
      return {
        name: data.name,
        desc: data.description,
        cookingTime: data.cookingTime.low,
        skillLevel: data.skillLevel
      }
    })
    res.send(finalData)
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.post('/getwrittenrecipe', (req, res) => {
  console.log("hete")
  let authorName = req.body.authorName
  console.log(authorName, "authorName")
  let query = `MATCH (n { name: '${authorName}' })-[r:WROTE]->(m) return m`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    console.log(result, "res");
    let finalData = result.records.map(recipe => {
      console.log(recipe['_fields'][0].properties, "data")
      return recipe['_fields'][0].properties
    })
    res.send(finalData)
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.post('/addrecipe', (req, res) => {
  let {
    recipeName,
    selected,
    authorName,
    preparationTime,
    cookingTime,
    skillLevel,
    description,
    procedure
  } = req.body
  console.log(
    recipeName,
    selected,
    authorName,
    preparationTime,
    cookingTime,
    skillLevel,
    description,
    procedure,
    'level'
  )
  let recipeId = rn(options)
  let ingredientslist = "'" + selected.join("','") + "'"
  console.log(ingredientslist)
  let query1 = `MERGE (${recipeName}:Recipe {id: ${recipeId}})
  SET ${recipeName}.cookingTime = ${cookingTime},
      ${recipeName}.preparationTime = ${preparationTime},
      ${recipeName}.name = '${recipeName}',
      ${recipeName}.description =  '${description}',
      ${recipeName}.procedure =  '${procedure}',
      ${recipeName}.skillLevel = ' ${skillLevel}';`
  let query2 = `WITH  [${ingredientslist}] AS ingredients
      MATCH (${recipeName}:Recipe {id:${recipeId}})
      FOREACH (ingredient IN ingredients |
       MERGE (i:Ingredient {name: ingredient})
       MERGE (${recipeName})-[:CONTAINS_INGREDIENT]->(i)
     );`
  let query3 = `WITH [' ${authorName}'] AS author
   MATCH (${recipeName}:Recipe {id:${recipeId}})
   MERGE (a:Author {name:"${authorName}"})  
   MERGE (a)-[:WROTE]->(${recipeName});`
  let query4 = `MATCH (n { name: '${authorName}' }) - [r: WROTE] -> (m) return m`
  // const resultPromise1 = session.run(query1)
  // resultPromise1.then(result => {
  //   const resultPromise2 = session.run(query2)
  //   resultPromise2.then(result => {
  //     const resultPromise3 = session.run(query3)
  //     resultPromise3.then(result => {
  //       const resultPromise4 = session.run(query4)
  //       resultPromise4.then(result => {
  //         let finalData = result.records.map(recipe => {
  //           console.log(recipe['_fields'][0].properties, "data")
  //           return recipe['_fields'][0].properties
  //         })
  //         console.log("successfully added recipe")
  //         res.send({ code: 200, authorRecipes: finalData })
  //         // res.send(finalData)
  //       })
  //     })
  //   })
  // })
  const resultPromise1 = session.run(query1)
  resultPromise1.then(result =>
    session.run(query2)
  )
    .then(() =>
      session.run(query3)
    )
    .then(result =>
      session.run(query4)
    )
    .then(result => {
      let finalData = result.records.map(recipe => {
        console.log(recipe['_fields'][0].properties, "data")
        return recipe['_fields'][0].properties
      })
      console.log("successfully added recipe")
      res.send({ code: 200, authorRecipes: finalData })
      // res.send(finalData)
    })







})

app.get('/getall', (req, res) => {
  const nodeName = `Recipe`
  let query = `MATCH (r:Recipe) WHERE (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "chilli"}) 
  RETURN r.name AS recipe, 
         [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
         AS ingredients`

  resultPromise.then(result => {
    res.send(result)
    // on application exit:
    driver.close()
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.get('/getdetailedrecipe', (req, res) => {
  console.log('in getdetailedrecipe')
  const nodeName = `Recipe`
  let query = `MATCH (r:Recipe) WHERE (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "chilli"}) 
  RETURN r.name AS recipe, 
         [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
         AS ingredients`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    console.log(result, 'data')
    res.send(result)
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.post('/getuserrecommendation', (req, res) => {
  console.log('in getuserrecommendation ', req.body.userName)
  let userName = req.body.userName;
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
    console.log(result, 'data of recommendation')
    let recipes = result.records.map(i => {
      return i['_fields'][0]
    })
    res.send(recipes)
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.post('/getsimilaruser', (req, res) => {
  let userName = req.body.userName
  console.log('in getsimilaruser')
  let query = `MATCH    (p1:Person {name:'${userName}'})-[s:SIMILARITY]-(p2:Person)
  WITH     p2, s.similarity AS sim
  ORDER BY sim DESC
  LIMIT    5
  RETURN   p2.name AS Neighbor, sim AS Similarity`
  const resultPromise = session.run(query)
  resultPromise.then(result => {
    let userList = result.records.map(i => {
      return { name: i['_fields'][0], similarity: i['_fields'][1].toFixed(2) }
    })
    res.send(userList)
  })
  resultPromise.catch(err => {
    console.log(err)
  })
})

app.post('/getuserrating', (req, res) => {
  console.log('in get user rating')
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
          } else {
            obj[userName].push({
              recipeName,
              userRating
            })
          }
        })
      })
      userRating.catch(err => {
        console.log(err)
      })
    })
  })
})

// Starting server
const port = 1337
app.listen(port)
console.log('Server Started on port : ' + port)
