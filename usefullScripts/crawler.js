let recipeUrls = [
  'https://www.bbcgoodfood.com/recipes/2303681/creamy-courgette-and-bacon-pasta-',
  'https://www.bbcgoodfood.com/recipes/creamy-tomato-courgette-prawn-pasta'
]
const axios = require('axios')
var fs = require('fs');
var cheerio = require('cheerio');
const neo4j = require('neo4j-driver');
// const driver = neo4j.driver(
//   'bolt://localhost:11008',
//   neo4j.auth.basic('neo4j', 'sudri@123'))
var request = require('request');
const json_beautifier = require('csvjson-json_beautifier');
console.log("Connected to neo4j")
const cors = require('cors')
let url = 'https://www.bbcgoodfood.com/recipes/2303681/creamy-courgette-and-bacon-pasta-'
axios.get(url)
  .then((response) => {
    // console.log(response.data)
    extractScripts(response.data)
  })
  .catch(err => { })

function extractScripts(data) {
  //console.log(data)
  var $ = cheerio.load(data);
  $('script').each(function (i, element) {
    let recipeData
    if ($(this)['0']['children']['0']) {
      if ($(this)['0']['children']['0']['data'].includes("recipe:{")) {
        recipeData = $(this)['0']['children']['0']['data']
        console.log(recipeData, "data to process")
        let startIndex = recipeData.indexOf('{article:')
        let lastIndex = recipeData.indexOf('}});')
        console.log(startIndex, lastIndex)
        let finalData = `${recipeData.substring(startIndex, lastIndex)}}`
        console.log(finalData)
        const json = json_beautifier(finalData, {});
        //console.log(json,typeof json)
        let obj = JSON.parse(json)
        console.log(json, typeof obj)
      }
    }
  });
}


const addRecipe = () => {
  let {
    recipeName,
    selected,
    autherName,
    preparationTime,
    cookingTime,
    skillLevel,
    description,
    procedure
  } = req.body
  console.log(
    recipeName,
    selected,
    autherName,
    preparationTime,
    cookingTime,
    skillLevel,
    description,
    procedure,
    'level'
  )
  let recipeId = 89676762
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
  let query3 = `WITH [' ${autherName}'] AS author
   MATCH (${recipeName}:Recipe {id:${recipeId}})
   MERGE (a:Author {name: " ${autherName}"})  
   MERGE (a)-[:WROTE]->(${recipeName});`

  console.log(query1, 'query1')
  console.log(query2, 'query2')
  console.log(query3, 'query3')
  const resultPromise1 = session.run(query1)
  resultPromise1.then(result => {
    const resultPromise2 = session.run(query2)
    resultPromise2.then(result => {
      const resultPromise3 = session.run(query3)
      res.send({ code: 200 })
    })
  })




}
//based on similarity of user interest
//add user nodes user->rates[recipe]