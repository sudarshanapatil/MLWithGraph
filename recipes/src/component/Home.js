import React, { Component } from 'react'
import { Button, ButtonToolbar, Carousel } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../App.css'
class Home extends Component {
  constructor () {
    super()
    this.state = {
      render: ''
    }
  }

  render () {
    console.log(this.state.render)
    return (
      <div>
        <div class='titlebar'>Recipe Recommendation System</div>
        <div className='home-buttons'>
          {/* <ButtonToolbar> */}
          <div className='home-button-each'>
            <Link to='/content'>Find Recipes Based On Ingredients</Link>
          </div>
          <div className='home-button-each'>
            <Link to='/collaboration'>
              Recommended Recipes For You From Us!!
            </Link>
          </div>
          <div className='home-button-each'>
            <Link to='/addRecipe'>Add Recipe</Link>
          </div>
          {/* </ButtonToolbar> */}
        </div>
        <div>
          <Carousel>
            <Carousel.Item>
              <img 
              className='d-block w-100'
              src={require('../images/host.jpg')} alt='First slide' />
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className='d-block w-100'
                src={require('../images/recipe2.jpg')}
                alt='Third slide'
              />
              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
          {this.state.render}
        </div>
      </div>
    )
  }
}

export default Home
