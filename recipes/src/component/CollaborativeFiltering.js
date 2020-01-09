import React, { Component } from 'react'
import '../App.css'
import Navbar from './Navbar'
import {
  Card,
  ButtonToolbar,
  Button,
  ListGroup,
  Container
} from 'react-bootstrap'
let userArr = [
  'Jagrutee',
  'Sudarshana',
  'Shweta',
  'Vishakha',
  'Prajakta',
  'Pradnya'
]
const baseUrl = 'http://localhost:1337/'

class Collaborative extends Component {
  constructor () {
    super()
    this.state = {
      similarUser: [],
      recipes: [],
      selected: [],
      recomRecipes: [],
      title: '',
      currentUser: ''
    }
  }

  getRecipe (ingredients) {
    if (ingredients.length === 0) {
      this.setState({
        recipes: []
      })
    } else {
      fetch('http://localhost:1337/getrecipes', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredients
        })
      })
        .then(res => res.json())
        .then(recipes => this.setState({ recipes }))
        .catch(err => {
          console.log(err)
          this.setState({
            recipes: []
          })
        })
    }
  }

  getSimilarUser (userName) {
    this.setState({ currentUser: userName })
    fetch(`${baseUrl}getsimilaruser`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName
      })
    })
      .then(res => res.json())
      .then(similarUser => {
        console.log(similarUser, 'similarUser')
        this.getRecom(userName, similarUser)
        // fetch(`${baseUrl}getuserrating`, {
        //   method: 'post',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     userName
        //   })
        // }).then(res => {
        //   console.log('res: ', res)
        // })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          recomRecipes: []
        })
      })
  }

  getRecom (userName, similarUser) {
    fetch('http://localhost:1337/getuserrecommendation', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName
      })
    })
      .then(res => res.json())
      .then(recomRecipes => {
        console.log(recomRecipes, 'recipeData')
        this.setState({ recomRecipes, similarUser })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          recomRecipes: []
        })
      })
  }

  render () {
    return (
      <div>
        <Navbar />
        <p class='sectionTitle'>Recommended Recipes For You!</p>

        <div id='recomm-recipes-list'>
          <div className='recomm-recipe-each'>Pavbhaji</div>
          <div className='recomm-recipe-each'>Chole</div>
          <div className='recomm-recipe-each'>Chole</div>
          <div className='recomm-recipe-each'>Chole</div>
        </div>
      </div>
    )
  }
}

export default Collaborative
