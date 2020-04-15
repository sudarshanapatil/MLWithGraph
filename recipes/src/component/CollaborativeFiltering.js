import React, { Component } from 'react'
import '../App.css'

import { Card, ButtonToolbar, Button, ListGroup } from 'react-bootstrap'
let userArr = [
  'Jagrutee',
  'Vishakha',
  'Shweta',
  'Prajakta',
  'Pradnya'
]
const baseUrl = 'http://localhost:1337/'

class Collaborative extends Component {
  constructor() {
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

  getRecipe(ingredients) {
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

  getSimilarUser(userName) {
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

  getRecom(userName, similarUser) {
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

  render() {
    // if (this.state.recomRecipes.length > 0)
    //   this.setState({ title: <p>Recommended Recipes for </p> })
    return (
      <div>
        <p class='sectionTitle'>Users List</p>
        <div id='user-list'>
          <ButtonToolbar>
            {userArr.map(key => (
              <Button variant='info' onClick={() => this.getSimilarUser(key)}>
                {key}
              </Button>
            ))}
          </ButtonToolbar>
        </div>
        <div id='middle-container'>
          <div class='similarTitle'>
            <p>Most similar Users for {this.state.currentUser}</p>

          </div>
          <table>
            <tr>
              {this.state.similarUser.map(row => (
                <th>
                  {row.name} =>({row.similarity})
                </th>
              ))}
            </tr>
          </table>
        </div>
        <div id='recomm-recipes-list'>
          <div class='recomTitle'>

            <p>Recommended Recipes for {this.state.currentUser}</p>
          </div>
          {this.state.title}
          <ListGroup>
            {this.state.recomRecipes.map(i => (
              <ListGroup.Item>{i}</ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <div></div>
      </div>
    )
  }
}

export default Collaborative
