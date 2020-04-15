import React, { Component } from 'react'
import '../App.css'
import { Modal, Button ,Container,Row} from 'react-bootstrap'
import '../styles/RateRecipe.css'
class RateRecipe extends Component {
  constructor () {
    super()
    this.state = {
      recipes: [],
      setShow: false,
      show: false,
      recipeId: '',
      rating: ''
    }
  }

  saveRating = (recipeId, rating) => {
    console.log('in save rating ', recipeId)
    fetch('http://localhost:1337/raterecipes', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipeId, rating })
    })
      .then(res => res.json())
      .then(recipes => {
        this.handleClose()
      })
      .catch(err => {
        console.log(err)
        this.setState({
          recipes: []
        })
      })
  }

  handleClose = () => {
    console.log('in close')
    this.setState({ show: false })
  }

  handleShow = recipeId => {
    this.setState({ show: true, recipeId })
  }

  showModal = recipeId => {
    console.log('in modal', recipeId)
    this.handleShow(recipeId)
  }
  
  componentDidMount () {
    fetch('http://localhost:1337/getallrecipes')
      .then(res => res.json())
      .then(recipes => {
        let recipesData = recipes.map(key => {
          return key.recipeName
        })
        console.log(recipes, 'API data')
        this.setState({ recipes })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          recipes: []
        })
      })
  }

  render () {
    return (
      <Container className='rateRecipeContainer' fluid>
        <Row className='rateRecipeTitle'>
             Rate Following Recipes And Earn POINTS!!
        </Row>
      <Row className='add-recipe-container'>
        {this.state.recipes.map(recipe => (
          <Button
            className='recipeRate'
            onClick={() => this.showModal(recipe.id)}
          >
            {recipe.recipeName}
          </Button>
        ))}
        <Modal
          show={this.state.show}
          onHide={() => this.handleClose()}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Rate Recipe:</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button
              variant='secondary'
              onClick={() => this.saveRating(this.state.recipeId, 1)}
            >
              1
            </Button>
            <Button
              variant='secondary'
              onClick={() => this.saveRating(this.state.recipeId, 2)}
            >
              2
            </Button>
            <Button
              variant='secondary'
              onClick={() => this.saveRating(this.state.recipeId, 3)}
            >
              3
            </Button>
            <Button
              variant='secondary'
              onClick={() => this.saveRating(this.state.recipeId, 4)}
            >
              4
            </Button>
            <Button
              variant='secondary'
              onClick={() => this.saveRating(this.state.recipeId, 5)}
            >
              5
            </Button>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant='secondary' onClick={() => this.handleClose()}>
              Close
            </Button>
            <Button variant='primary' onClick={() => this.saveRating(this.state.recipeId)}>
              Save Changes
            </Button>
          </Modal.Footer> */}
        </Modal>
      </Row>
      </Container>
    )
  }
}
export default RateRecipe
