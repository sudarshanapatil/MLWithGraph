import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Switch, Route, Link, BrowserRouter as Router } from 'react-router-dom'

import Home from './component/Home'
import Login from './component/Login'
import Register from './component/Register'
import ContentBased from './component/Contentbased'
import Collaborative from './component/CollaborativeFiltering'
import AddRecipe from './component/AddRecipe'
import RateRecipe from './component/RateRecipe'
import RecipeLevel from './component/RecipesWithSkill'


const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/content" component={ContentBased} />
      <Route exact path="/collaboration" component={Collaborative} />
      <Route exact path="/addRecipe" component={AddRecipe} />
      <Route exact path="/rateRecipe" component={RateRecipe} />
      <Route exact path="/recipelevel" component={RecipeLevel} />
    </Switch>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
