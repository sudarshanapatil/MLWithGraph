import React, { Component } from 'react'
import '../App.css'
class AddRecipe extends Component {
  constructor () {
    super()
    this.state = {
      ingredients: []
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

  render () {
    return (
      <div className='add-recipe-container'>
        {this.state.ingredients.map(ingredient => (
          <div className='add-recipe-ingredient'>{ingredient}</div>
        ))}
      </div>
    )
  }
}
export default AddRecipe
