const neo4j = require('neo4j-driver').v1
// Neo4j credentials
const driver = neo4j.driver(
  'bolt://localhost:7687',
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
const userArr = ['Jagrutee']
addUser = userArr => {
  userArr.map(eachUser => {
    let query = `merge (${eachUser}:Person {name: '${eachUser}'}) RETURN ${eachUser}`
    console.log(query)
    const resultPromise = session.run(query)
    resultPromise.then(result => {
      //Get recipe Data
      let getRecipeQ = 'MATCH (n:Recipe) RETURN n limit 15'
      const recipeData = session.run(getRecipeQ)
      recipeData.then(data => {
        let count = 6
        let recipes = data.records.map(i => {
          //console.log(i['_fields'][0].properties.name, eachUser)
          if (count >= 10) count = 1
          let recipeName = i['_fields'][0].properties.name
          let userName = eachUser
          let relationQ = `MATCH (a:Person),(b:Recipe)
          WHERE a.name = '${userName}' AND b.name = '${recipeName}'
          CREATE (a)-[r:Rated { rating:${++count} }]->(b)
          RETURN type(r), r.name`
          const recipeData = session.run(relationQ)
          recipeData.then(res => {
            console.log(res)
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
addUser(userArr)
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
//findSimilarity()
