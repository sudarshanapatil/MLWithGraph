import React, { Component } from 'react'
import '../App.css'
import {
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap'
import Navbar from './Navbar'
import '../styles/Contentbased.css'
class Contentbased extends Component {
  constructor () {
    super()
    this.state = {
      ingredients: [],
      recipes: [],
      selected: []
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

  componentDidMount () {
    fetch('http://localhost:1337/getallingredients')
      .then(res => res.json())
      .then(ingredients => this.setState({ ingredients }))
      .catch(err => {
        console.log(err)
        this.setState({
          ingredients: []
        })
      })
  }

  moveToSelected (ingredient) {
    let selected = [...this.state.selected, ingredient].sort()
    this.getRecipe(selected)
    this.setState({
      selected
    })
  }

  removefromSelected (i) {
    let selected = this.state.selected
    selected.splice(i, 1)
    this.getRecipe(selected)
    this.setState({
      selected
    })
  }

  remainingIngredient () {
    const { selected, ingredients } = this.state
    let i = 0
    return ingredients.filter(ingredient => {
      if (ingredient === selected[i]) {
        i++
        return false
      }
      return true
    })
  }

  render () {
    return (
      <Container fluid>
        <Row>
          {/* <Navbar/> */}
          <Col sm={3} class='ingredient-container'>
            {/* <div id='ingredient-container'> */}
              <h4 id='ingredient-heading'>Select your ingredients</h4>
              <div id='selected-list'>
                {this.state.selected.map((selected, i) => (
                  <div class='selected ingredient'>
                    {selected}
                    <span
                      class='floating-button'
                      onClick={() => this.removefromSelected(i)}
                    >
                      &times;
                    </span>
                  </div>
                ))}
              {/* </div> */}
              <div id='ingredients-list'>
                {this.remainingIngredient().map(ingredient => (
                  <div class='not-selected ingredient'>
                    {ingredient}
                    <span
                      class='floating-button'
                      onClick={() => this.moveToSelected(ingredient)}
                    >
                      +
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col sm={9}>
            <Row className='titleContentbased'>
              Following are dishes which you can prepare with selected
              ingredients:
            </Row>
            {/* <Row className='recipe-container'> */}
              {this.state.recipes.map(recipe => (
                <Row className='recipe'>
                  <h3>{recipe.recipe}</h3>
                  <Row className='recipe-detail'>
                  Ingredients: {recipe.ingredients.join(', ')}
                  </Row>
                  {/* <button class="btn btn-primary">How to Make</button> */}
                </Row>
              ))}
            {/* </Row> */}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Contentbased
