// router/router.js

let userModel = require('../models/user')
let recipeModel=require('../models/recipe')
module.exports = function (app) {
  app.use('/user', userModel)
  app.use('/recipe', recipeModel)
  app.get('/', function (req, res, next) {
    res.status(200).send("YOU'VE REACHED THE BASE URL OF YOUR API")
  })
  app.use('*', function (req, res, next) {
    res.status(404).json({ err: 'Path' + req.originalUrl + ' does not exist' })
  })
}
