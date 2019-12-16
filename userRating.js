const neo4j = require('neo4j-driver').v1
// Neo4j credentials
const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'sudri@123')
)

const session = driver.session()
const userArr = [
  'Shweta',
  'Jagrutee',
  'Nilesh',
  'Akshay',
  'Abhishek',
  'Sudarshana'
]

addUser = userArr => {
  userArr.map(eachUser => {
    let query = `merge (${eachUser}:Person {name: '${eachUser}'}) RETURN ${eachUser}`
    console.log(query)
    const resultPromise = session.run(query)
    resultPromise.then(result => {
      //Get recipe Data
      let getRecipeQ = 'MATCH (n:Recipe) RETURN n '
      const recipeData = session.run(getRecipeQ)
      recipeData.then(data => {
        let recipes = data.records.map(i => {
          //console.log(i['_fields'][0].properties.name, eachUser)
          let recipeName = i['_fields'][0].properties.name;
          let userName=eachUser
          let relationQ = `MATCH (a:Person),(b:Recipe)
          WHERE a.name = '${userName}' AND b.name = '${recipeName}'
          CREATE (a)-[r:Rated { rating:5 }]->(b)
          RETURN type(r), r.name`
          const recipeData = session.run(relationQ)
          recipeData.then((res)=>{
            console.log(res)

          })
          recipeData.catch((err)=>{
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
addUser(userArr)
//Add user nodes
