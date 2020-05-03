const neo4j = require('neo4j-driver').v1;
const cheerio = require('cheerio')
const dataset = require('./train.json')
var request = require('request');
var driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'sudri@123')
)
const session = driver.session();

createIngredientNode = () => {
  const nodeName = 'Ingredient'
  let ingredients = dataset[0].ingredients
  let query = `CREATE`
  let counterId = 1;
  for (let i in ingredients) {
    let identifier = ingredients[i].replace(/\s/g, '')
    console.log(typeof i, i, (ingredients.length - 1))
    if (parseInt(i) === (ingredients.length - 1)) {
      query = query + `(${identifier}:${nodeName} { name: '${ingredients[i]}', image: 'tobeadd',id:${counterId} })`
    }
    else {
      query = query + `(${identifier}:${nodeName} { name: '${ingredients[i]}', image: 'tobeadd',id:${counterId} }),`
    }
    counterId++
  }

  console.log(query)
  const resultPromise = session.run(query);
  resultPromise.then(result => {
    session.close();
    console.log(result, "data")
    // on application exit:
    driver.close();
  });
  resultPromise.catch((err) => {
    console.log(err)
  })

}

createRecipeNode = () => {
  console.log("in create recipe")
  const nodeName = `Recipe`
  let query = `CREATE (PaneerLazeez:${nodeName} { name: 'PaneerLazeez', image: 'tobeadd',id:1,procedure:'tobeadd',rating:0 })`
  const resultPromise = session.run(query);
  resultPromise.then(result => {
    session.close();
    console.log(result, "data")
    // on application exit:
    driver.close();
  });
  resultPromise.catch((err) => {
    console.log(err)
  })
}

createRelationship = () => {
  console.log("in create relationship")
  const nodeName = `Recipe`
  let query = `MATCH (PaneerLazeez:Recipe),(garlic:Ingredient)
   CREATE (PaneerLazeez)-[r:Includes]->(garlic)
  RETURN type(r)`
  const resultPromise = session.run(query);
  resultPromise.then(result => {
    session.close();
    console.log(result, "data")
    // on application exit:
    driver.close();
  });
  resultPromise.catch((err) => {
    console.log(err)
  })

}

getRecipe = () => {
  console.log("in get data")
  const nodeName = `Recipe`
  let query = `MATCH (Recipe { name: 'PaneerLazeez' })--(Ingredient)
RETURN Ingredient.name`
  const resultPromise = session.run(query);
  resultPromise.then(result => {
    session.close();
    console.log(result, "data")
    // on application exit:
    driver.close();
  });
  resultPromise.catch((err) => {
    console.log(err)
  })
}
//createRecipeNode()
//createIngredientNode()
//createRelationship()
getRecipe()




// request('https://food.ndtv.com/recipe-almond-white-chocolate-gujiya-953477',
//   function (error, response, html) {
//     if (!error && response.statusCode == 200) {
//       //console.log(html);
//       var $ = cheerio.load(html);
//       let data = $('script').get();
//       console.log(data, "*******")
//     }
//   });

`MERGE (PaneerLazeez:Recipe {id: 19898})
 SET PaneerLazeez.cookingTime = 8966,
     PaneerLazeez.preparationTime = 676,
     PaneerLazeez.name = 'PaneerLazeez',
     PaneerLazeez.description = "test",
     PaneerLazeez.skillLevel = 'Easy';
   WITH ['as','dsd'] AS ingredients
   MATCH (PaneerLazeez:Recipe {id:19898})
   FOREACH (ingredient IN ingredients |
    MERGE (i:Ingredient {name: ingredient})
    MERGE (PaneerLazeez)-[:CONTAINS_INGREDIENT]->(i)
  );
  WITH ['sudarshana'] AS author
  MATCH (PaneerLazeez:Recipe {id:19898})
  MERGE (a:Author {name: "sudarshana"})  
  MERGE (a)-[:WROTE]->(PaneerLazeez)`