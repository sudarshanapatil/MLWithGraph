import React, { Component } from 'react'
import { Container,Row,Col } from 'react-bootstrap'
import '../styles/RecipeLevel.css'
class RecipesWithSkill extends Component {
  constructor () {
    super()
    this.state={
      recomRecipes:[]
    }
  }

  componentDidMount(){
    fetch('http://localhost:1337/getrecipelevel', {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({
      //   userName: 'Spruha'
      // })
    })
      .then(res => res.json())
      .then(recomRecipes => {
        console.log(recomRecipes, 'recipeData')
        this.setState({ recomRecipes })
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
      <Container className='recipeLevelContainer' fluid> 
        <Row className='recipeLevelTitle'>
         Check Your Time And Prepare Recipes
        </Row>
        <Row id='recomm-recipes-list'>
          {(this.state.recomRecipes.length!=0)&&this.state.recomRecipes.map(recipe => {
            return <div className='recomm-recipe-each'>{recipe.name}</div>
          })}
        </Row>
        {/* <Row> */}
          {/* <Col>Easy to prepare
          </Col> 
          <Col>
          </Col> */}
        {/* </Row> */}
      </Container>
    )
  }
}
export default RecipesWithSkill
