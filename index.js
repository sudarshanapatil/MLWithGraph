const express = require('express')
const morgan = require('morgan')
// const bluebird = require('bluebird')
const neo4j = require('neo4j-driver')
const rn = require('random-number');
const options = {
  min: 8000
  , max: 100000
  , integer: true
}

// const DB_URL = 'bolt://localhost:11008';
// const DB_userName = 'neo4j';
// const DB_pwd = 'sudri@123';
const DB_URL = `bolt://54.160.120.22:32854`;
const DB_userName = 'neo4j';
const DB_pwd = 'accounts-scale-mail';
const port = process.env.port ||  1337
try {
  var driver = neo4j.driver(
    DB_URL,
    neo4j.auth.basic(DB_userName, DB_pwd),
    {
    }
  )
  console.log('Connected to neo4j')
} catch (error) {
  console.log("Error", error)
}

// var mysql = require('mysql')

// var con = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Sudri@123',
//   database: 'mtech_project'
// })

// const db = bluebird.promisifyAll(con)

// con.connect(function (err) {
//   if (err) {
//   } else console.log('Connected to mysql! ')
// })

const cors = require('cors')
const session = driver.session()
const app = express()
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/login', async (req, res) => {
  let { name, password } = req.body
  console.log('in login', req.body)
  res.send({ code: 200, msg: `Login successful!` })
  // let query = `SELECT password FROM user where name='${name}'`;
  // try {
  //   let data = await db.queryAsync(query);
  //   if (data[0].password === password) {
  //     res.send({ code: 200, msg: `Login successful!` })
  //   } else {
  //     res.send({ code: 400, msg: `Unauthorized User` })
  //   }
  // } catch (error) {
  //   res.send({ code: 500, error })
  // }
})

app.post('/register', async (req, res) => {
  let userName = req.body.name
  let password = req.body.password
  res.send({ code: 200, msg: 'successfully inserted!' })
  // let query = `insert into user (name,password) values ('${userName}',"${password}")`;
  // try {
  //   // await db.queryAsync(query);
  //   res.send({ code: 200, msg: 'successfully inserted!' })
  // } catch (error) {
  //   res.send({ code: 500, error })
  // }
})

app.post('/raterecipes', async (req, res) => {
  //TODO:jwttoken implemetion need to be added
  console.log(req.body, "====")
  let { recipeId, rating, user } = req.body
  let query2 = `MATCH (a:Person),(b:Recipe)
  WHERE a.name = '${user}' AND b.id = '${recipeId}'
  Merge (a)-[r:Rated ]->(b)
  set  r.rating=${rating}`
  let assignNewSimilarity = `MATCH (p1:Person)-[x:Rated]->(m:Recipe)<-[y:Rated]-(p2:Person)
  WITH  SUM(x.rating * y.rating) AS xyDotProduct,
        SQRT(REDUCE(xDot = 0.0, a IN COLLECT(x.rating) | xDot + a^2)) AS xLength,
        SQRT(REDUCE(yDot = 0.0, b IN COLLECT(y.rating) | yDot + b^2)) AS yLength,
        p1, p2
  MERGE (p1)-[s:SIMILARITY]-(p2)
  SET   s.similarity = xyDotProduct / (xLength * yLength)`;
  try {
    await session.run(query2)
    await session.run(assignNewSimilarity)
    res.send({ code: 200, message: 'Successfully saved' })
  } catch (error) {
    res.send({ code: 500, error })
  }
})

app.get('/getallingredients', async (req, res) => {
  console.log('in getallingredients')
  let query = `MATCH (n:Ingredient) RETURN n`;
  try {
    let result = await session.run(query)
    let ingredients = result.records.map(i => {
      return i['_fields'][0].properties.name
    })
    ingredients = ingredients.sort()
    res.send(ingredients)
  } catch (error) {
    res.send({ code: 500, error })
  }
})



app.get('/getallrecipes', async (req, res) => {
  console.log('in getallrecipes')
  let modifiedQ = `MATCH (r:Recipe)
  WHERE (r)-[:CONTAINS_INGREDIENT]->()
  RETURN r.name AS recipe,r.id as id, 
         [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
         AS ingredients`
  try {
    let result = await session.run(modifiedQ)
    let ingredients = result.records.map(i => {
      return {
        recipeName: i['_fields'][0],
        id: i['_fields'][1],
        ingredients: i['_fields'][2]
      }
    })
    ingredients = ingredients.sort()
    res.send(ingredients)
  } catch (error) {
    res.send({ code: 500, error })
  }
})

app.post('/getrecipes', async (req, res) => {
  console.log('in getrecipes', req.body)
  let { ingredients } = req.body
  let finalQ = ingredients.map((i, index) => {
    if (index === 0)
      return `WHERE (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "${ingredients[0]}"})`
    else return `AND   (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "${i}"})`
  })

  finalQ = finalQ.join(' ')
  let query = `MATCH (r:Recipe) ${finalQ}
  RETURN r.name AS recipe, 
  [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] 
  AS ingredients`
  try {
    console.log(query, ' : Query on database')
    let result = await session.run(query)
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

  } catch (err) {
    console.log('Error : ', err)
    res.send({ code: 500, error })
  }
})

app.post('/getrecipelevel', async (req, res) => {
  let level = req.body.skillLevel
  let query = `MATCH (n:Recipe{ skillLevel: '${level}' }) RETURN n limit 20`
  try {
    let result = await session.run(query)
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
  } catch (error) {
    res.send({ code: 500, error })
  }
})

app.post('/getwrittenrecipe', async (req, res) => {
  let { authorName } = req.body;
  console.log(authorName, "authorName")
  let query = `MATCH (n { name: '${authorName}' })-[r:WROTE]->(m) return m`;
  try {
    const result = await session.run(query)
    let finalData = result.records.map(recipe => {
      console.log(recipe['_fields'][0].properties, "data")
      return recipe['_fields'][0].properties
    })
    res.send(finalData)
  } catch (error) {
    console.log(err)
    res.send({ code: 500, error })
  }
})

app.post('/addrecipe', async (req, res) => {
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

  try {
    await session.run(query1)
    await session.run(query2)
    await session.run(query3)
    let result = await session.run(query4)
    let finalData = result.records.map(recipe => {
      // console.log(recipe['_fields'][0].properties, "data")
      return recipe['_fields'][0].properties
    })
    console.log("successfully added recipe")
    res.send({ code: 200, authorRecipes: finalData })
  } catch (error) {
    res.send({ code: 500, error })
  }
})

app.post('/getuserrecommendation', async (req, res) => {
  let { userName } = req.body;
  let query = `MATCH (b:Person)-[r:Rated]->(m:Recipe), 
  (b)-[s:SIMILARITY]-(a:Person {name:'${userName}'})
  WHERE    NOT((a)-[:Rated]->(m))
  WITH     m, s.similarity AS similarity, r.rating AS rating
  ORDER BY m.name, similarity DESC
  WITH     m.name AS recipe, COLLECT(rating)[0..3] AS ratings
  WITH     recipe, REDUCE(s = 0, i IN ratings | s + i)*1.0 / LENGTH(ratings) AS reco
  ORDER BY reco DESC
  RETURN   recipe AS Recipe, reco AS Recommendation`
  try {
    const result = await session.run(query)
    let recipes = result.records.map(i => {
      return i['_fields'][0]
    })
    res.send(recipes)
  } catch (error) {
    res.send({ code: 500, error })
  }
})

app.post('/getsimilaruser', async (req, res) => {
  let { userName } = req.body
  console.log('in getsimilaruser')
  let query = `MATCH    (p1:Person {name:'${userName}'})-[s:SIMILARITY]-(p2:Person)
  WITH     p2, s.similarity AS sim
  ORDER BY sim DESC
  LIMIT    5
  RETURN   p2.name AS Neighbor, sim AS Similarity`;
  try {
    let result = await session.run(query)
    let userList = result.records.map(i => {
      return { name: i['_fields'][0], similarity: i['_fields'][1].toFixed(2) }
    })
    res.send(userList)
  } catch (error) {
    res.send({ code: 500, error })
  }
})
// Starting server

app.listen(port)
console.log('Server Started on port : ' + port)
