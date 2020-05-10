const neo4j = require('neo4j-driver')
// Neo4j credentials
const driver = neo4j.driver(
  'bolt://localhost:11002',
  neo4j.auth.basic('neo4j', 'sudri@123')
)
const session = driver.session()
const userArr1 = [
  'Shweta',
  'Jagrutee',
  'Nilesh',
  'Akshay',
  'Abhishek',
  'Sudarshana'
]
const userArr = [
  'Madhav',
  'Priya',
  'Sukrut',
  'Arnav',
  'Gaurav',
  'Nirav',
  'Radhya',
  'Stuti',
  'Akshaya',
  'Manas',
  'Mrinal',
  'Madhura',
  'Keshav',
  'Nritya',
  'Prisha',
  'Pratyusha',
  'Mohan',
  'Mihika',
  'Nikhil',
  'Girisha',
  'Mithila',
  'Janak',
  'Jidnyasa',
  'Aadnya',
  'Sneha',
  'Smruti',
  'Samiksha',
  'Spruha',
  'Titiksha',
  'Umesh',
  'Vidit',
  'Prasanna',
  'Ramesh',
  'Sarvesh',
  'Parth',
  'Vineet',
  'Anshul',
  'Praful',
  'Aakash',
  'Ninad',
  'Ninant'

]
addUser = userArr => {
  userArr.map((eachUser,key) => {
    console.log(key,"key")
    let query = `merge (${eachUser}:Person {name: '${eachUser}'}) RETURN ${eachUser}`
    console.log(query)
    const resultPromise = session.run(query)
    resultPromise.then(result => {
      //Get recipe Data
      // let count;
      // if(key>20)
      //  count=parseInt(key)-20
      //  else
      //  count=15
      let getRecipeQ = `MATCH (n:Recipe) RETURN n limit 8` 
      const recipeData = session.run(getRecipeQ)
      recipeData.then(data => {
        // console.log(data,"recipes")
        let count = key
        let recipes = data.records.map(i => {
          //console.log(i,"i")
          console.log(i['_fields'][0].properties.name, eachUser)
          if (count >= 10) count = 3
          let recipeName = i['_fields'][0].properties.name
          let userName = eachUser
          let relationQ = `MATCH (a:Person),(b:Recipe)
          WHERE a.name = '${userName}' AND b.name = '${recipeName}'
          CREATE (a)-[r:Rated { rating:${++count} }]->(b)
          RETURN type(r), r.name`
          const recipeData = session.run(relationQ)
          recipeData.then(res => {
           // console.log(res)
          })
          recipeData.catch(err => {
            console.log(err)
          })
        })
     })
    })
    resultPromise.catch(err => {
      console.log(err)
    })
  })
}
//addUser(userArr)
//Add user nodes

findSimilarity = () => {
  let relationS = `match  (p1:Person {name:'Nilesh'})-[r1:RATED]->(m:Recipe)<-[r2:RATED]-(p2:Person {name:'Sudarshana'})
  RETURN m.name AS Recipe, r1.rating AS NileshRate, r2.rating AS SudduRate`
  const recipeData = session.run(relationS)
  recipeData.then(res => {
    console.log(res)
  })
  recipeData.catch(err => {
    console.log(err)
  })
}

assignSimilarity = () => {
  let query = `MATCH (p1:Person)-[x:Rated]->(m:Recipe)<-[y:Rated]-(p2:Person)
  WITH  SUM(x.rating * y.rating) AS xyDotProduct,
        SQRT(REDUCE(xDot = 0.0, a IN COLLECT(x.rating) | xDot + a^2)) AS xLength,
        SQRT(REDUCE(yDot = 0.0, b IN COLLECT(y.rating) | yDot + b^2)) AS yLength,
        p1, p2
  MERGE (p1)-[s:SIMILARITY]-(p2)
  SET   s.similarity = xyDotProduct / (xLength * yLength)`
}

insertInDb=()=>{
 let query=`CREATE INDEX ON :Recipe(id);
 CREATE INDEX ON :Ingredient(name);
 CREATE INDEX ON :Keyword(name);
 CREATE INDEX ON :DietType(name);
 CREATE INDEX ON :Author(name);
 CREATE INDEX ON :Collection(name);
 :params jsonFile => "https://raw.githubusercontent.com/mneedham/bbcgoodfood/master/stream_all.json";
 CALL apoc.load.json($jsonFile) YIELD value
 WITH value.page.article.id AS id,
        value.page.title AS title,
        value.page.article.description AS description,
        value.page.recipe.cooking_time AS cookingTime,
        value.page.recipe.prep_time AS preparationTime,
        value.page.recipe.skill_level AS skillLevel
 MERGE (r:Recipe {id: id})
 SET r.cookingTime = cookingTime,
     r.preparationTime = preparationTime,
     r.name = title,
     r.description = description,
     r.skillLevel = skillLevel;
 CALL apoc.load.json($jsonFile) YIELD value
 WITH value.page.article.id AS id,
        value.page.article.author AS author
 MERGE (a:Author {name: author})
 WITH a,id
 MATCH (r:Recipe {id:id})
 MERGE (a)-[:WROTE]->(r);
 CALL apoc.load.json($jsonFile) YIELD value
 WITH value.page.article.id AS id,
        value.page.recipe.ingredients AS ingredients
 MATCH (r:Recipe {id:id})
 FOREACH (ingredient IN ingredients |
   MERGE (i:Ingredient {name: ingredient})
   MERGE (r)-[:CONTAINS_INGREDIENT]->(i)
 );
 CALL apoc.load.json($jsonFile) YIELD value
 WITH value.page.article.id AS id,
        value.page.recipe.keywords AS keywords
 MATCH (r:Recipe {id:id})
 FOREACH (keyword IN keywords |
   MERGE (k:Keyword {name: keyword})
   MERGE (r)-[:KEYWORD]->(k)
 );
 CALL apoc.load.json($jsonFile) YIELD value
 WITH value.page.article.id AS id,
        value.page.recipe.diet_types AS dietTypes
 MATCH (r:Recipe {id:id})
 FOREACH (dietType IN dietTypes |
   MERGE (d:DietType {name: dietType})
   MERGE (r)-[:DIET_TYPE]->(d)
 );
 CALL apoc.load.json($jsonFile) YIELD value
 WITH value.page.article.id AS id,
        value.page.recipe.collections AS collections
 MATCH (r:Recipe {id:id})
 FOREACH (collection IN collections |
   MERGE (c:Collection {name: collection})
   MERGE (r)-[:COLLECTION]->(c)
 );`

 const recipeData = session.run(query)
  recipeData.then(res => {
    console.log(res)
  })
  recipeData.catch(err => {
    console.log(err)
  })
}

insertInDb()
//findSimilarity()
