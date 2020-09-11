const neo4j = require('neo4j-driver')
// Neo4j credentials
const driver = neo4j.driver(
  'bolt://localhost:11008',
  neo4j.auth.basic('neo4j', 'sudri@123')
)
const session = driver.session()
const session2 = driver.session()
const userArr = [
  //  "Aarusha",
  //  "Aarvi", "Aashka","Aalyah","Arianna","Aaheli","Samvidha", "Sampada", "Saira",
  //  "Aashritha", "Davida", "Dayana","Dina","Devina","Samhitha","Samprithi",
  //  "Datini", "Dhara", "Deeptha", "Devyanka","Sriya","Tanirika","Tanirik","Tanusha","Tanush","Tanus","Tanu",
  "Devya", "Saeshashri", "Sanjuk", "Sat", "Sabra", "Tanya", "tishi"
  //  "Shreshta","Suvi","Turvi","Tisha","Tanishi",
  //  "Dhanyata","Toshi","Seemaa","Seem","Shichi","Shifa","Sheza","Shanvi"
]
addUser = async userArr => {

  let ingredientslist = "'maida','rava'"
  let query = `
  WITH  [${ingredientslist}] AS ingredients
  FOREACH (ingredient IN ingredients |
    MERGE (i:Ingredient {name: ingredient}));`
  try {
    await session.run(query)
  } catch (error) {
    console.log(error)
  }
  // for (let user of userArr) {
  //   await createUser(user)
  //   let recipes = await findRecipe()
  //   let fun = recipes.map(recipe => rateRecipe(recipe, user, 3))
  //   Promise.all(fun)
  // }
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
     WHERE (r)-[:CONTAINS_INGREDIENT]->(:Ingredient {name: "Granny Smith"})
    RETURN r.name AS recipe, 
    [(r)-[:CONTAINS_INGREDIENT]->(i) | i.name] limit 9`
  try {
    let result = await session.run(getRecipeQ)
    let data = result.records.map((i) => {
      return i['_fields'][0]
    })
    return data;
  } catch (error) {
    console.log(error)
  }
}

async function rateRecipe(recipeName, userName, count) {
  return new Promise((res, rej) => {
    console.log(recipeName, userName)
    let relationQ = `MATCH (a:Person),(b:Recipe)
    WHERE a.name = '${userName}' AND b.name = '${recipeName}'
    merge (a)-[r:Rated { rating:${++count} }]->(b)
    RETURN type(r), r.name`;
    session2.run(relationQ)
      .then(res => res)
      .catch(err => err)


  })

}
