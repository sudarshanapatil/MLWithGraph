import React, { Component } from 'react'
import '../App.css'
import { Modal, Button } from 'react-bootstrap'
class RateRecipe extends Component {
  constructor () {
    super()
    this.state = {
      recipes: [],
      setShow: false,
      show: false
    }
  }

  handleClose = () => {
    this.setState({ show: false })
  }
  handleShow = () => {
    this.setState({ show: true })
  }
  showModal = () => {
    console.log("in modal")
    this.handleShow()}
  componentDidMount () {
    fetch('http://localhost:1337/getallrecipes')
      .then(res => res.json())
      .then(recipes => this.setState({ recipes }))
      .catch(err => {
        console.log(err)
        this.setState({
          recipes: []
        })
      })
  }

  render () {
    return (
      <div className='add-recipe-container'>
        {this.state.recipes.map(recipe => (
          <Button
            className='add-recipe-ingredient'
            onClick={() => this.showModal()}
          >
            {recipe}
          </Button>
        ))}
        <Modal show={this.state.show} onHide={()=>this.handleClose()} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Rate Recipe:</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Button variant='secondary' onClick={()=>this.handleClose()}>
              *
            </Button>
            <Button variant='secondary' onClick={()=>this.handleClose()}>
              * *
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={()=>this.handleClose()}>
              Close
            </Button>
            <Button variant='primary' onClick={()=>this.handleClose()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
export default RateRecipe
