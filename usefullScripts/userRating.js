const neo4j = require('neo4j-driver')
// Neo4j credentials
const driver = neo4j.driver(
  'bolt://localhost:11008',
  neo4j.auth.basic('neo4j', 'sudri@123')
)
const session = driver.session()
const userArr = [
  //'Madhav',
  // 'Priya',
  // 'Sukrut',
  // 'Arnav',
  // 'Gaurav',
  // 'Nirav',
  //'Radhya',
  //'Stuti',
  // 'Akshaya',
  // 'Manas',
  //'Mrinal',
  //'Madhura',
  // 'Keshav',
  // 'Nritya',
  // 'Prisha',
  // 'Pratyusha',
  // 'Mohan',
  // 'Mihika',
  // 'Nikhil',
  // 'Girisha',
  // 'Mithila',
  // 'Janak',
  // 'Jidnyasa',
  // 'Aadnya',
  // 'Sneha',
  // 'Smruti',
  // 'Samiksha',
  // 'Spruha',
  // 'Titiksha',
  // 'Umesh',
  // 'Vidit',
  // 'Prasanna',
  // 'Ramesh',
  // 'Sarvesh',
  // 'Parth',
  'Vineet',
  // 'Anshul',
  // 'Praful',
  // 'Aakash',
  // 'Ninad',
  // 'Ninant'

]
addUser = async userArr => {
  for (let user of userArr) {
    await createUser(user)
    let recipes = await findRecipe()
    console.log(recipes)
    for (let i in recipes)
      await rateRecipe(recipes[i], user, i)
  }
}

addUser(userArr)

async function createUser(eachUser) {
  let query = `merge (${eachUser}:Person {name: '${eachUser}'}) RETURN ${eachUser}`
  console.log(query)
  try {
    await session.run(query)
  } catch (error) {
  }
}

async function findRecipe() {
  console.log("in find recipe")
  // let getRecipeQ = `MATCH (n:Recipe) RETURN n limit 5`;
  let getRecipeQ = `MATCH (r:Recipe)
     WHERE (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "almond"})
    RETURN r.name AS recipe, 
    [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] limit 9`
  try {
    let result = await session.run(getRecipeQ)
    console.log(result)
    let data = result.records.map((i) => {
      console.log(i['_fields'][0])
      return i['_fields'][0]
    })
    return data;
  } catch (error) {

  }
}

function rateRecipe(recipeName, userName, count) {
  console.log(recipeName, userName)
  let relationQ = `MATCH (a:Person),(b:Recipe)
  WHERE a.name = '${userName}' AND b.name = '${recipeName}'
  CREATE (a)-[r:Rated { rating:${++count} }]->(b)
  RETURN type(r), r.name`
  try {
    let res = session.run(relationQ)
    return res;
  } catch (error) {

  }
}
