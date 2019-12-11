const neo4j = require('neo4j-driver').v1
const cheerio = require('cheerio')
const dataset = require('./train.json')
var request = require('request')

//Neo4j credentials
var driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'sudri@123')
)
const session = driver.session()
const allData = require('./allData.js')
  let count = 1
allData.recipeData.map(i => {
  const recipeNodeName = `Recipe`const ingredientNodeName = `Ingredient`
  let recipeId = i.page.article.id
  let recipeName=i.page.title;
  let ingredients = i.page.recipe.ingredients
  recipeName = i.page.title.replace(/\s/g, '')
  recipeName = recipeName.replace(/[^a-zA-Z ]/g, '')
   
  let query = `merge (${recipeName}:${recipeNodeName} { name:'${i.page.title}',id:'${recipeId}'})`
  let resultPromise;
   resultPromise = session.run(query)
    resultPromise.then(result => {
      session.close()
      console.log(result, 'data')
      driver.close()
    })
    resultPromise.catch(err => {
      console.log(err)
    })
  let q ;

 ingredients = ingredients.filter(function(item, pos){
  return ingredients.indexOf(item)== pos; 
});

  ingredients.map((i, index) => {
     let ingredientName = i
      ingredientName = ingredientName.replace(/\s/g, '')
      ingredientName = ingredientName.replace(/[^a-zA-Z ]/g, '')

      //  let query = `MATCH (${recipeName}:Recipe),(${ingredientName}:Ingredient)
      //  CREATE (${recipeName})-[r:CONTAINS_INGREDIENT]->(${ingredientName})
      //  RETURN type(r)`

       
 resultPromise = session.run(query)
    resultPromise.then(result => {
      session.close()
      console.log(result, 'data')
      driver.close()
    })
    resultPromise.catch(err => {
      console.log(err)
    })
    if (index === 0) {
       q = `create (${ingredientName}:${ingredientNodeName} { name:'${
        ingredients[0]
      }',id:'${count}'})`
    } else {
     
      q =
        q +
        `, (${ingredientName}:${ingredientNodeName} { name:'${ingredientName}',id:'${++count}'})`
    }
    
  })

 resultPromise = session.run(q)
    resultPromise.then(result => {
      session.close()
      console.log(result, 'data')
      driver.close()
    })
    resultPromise.catch(err => {
      console.log(err)
    })
  console.log(q,"final query")
})

// let query = `merge (${recipeName}:${nodeName} { name:'${i.page.title}',id:'${recipeId}'})`
