import React, { Component } from 'react'
import {
  Button,
  ButtonToolbar,
  Carousel,
  Container,
  Row,
  Col
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../App.css'
import '../styles/Home.css'
import Navbar from './Navbar'
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
      <Container fluid>
        <Row className='titlebar'>Recipe Recommendation System</Row>
        <Row>
          <Col className='home-button-each'>
            <Link to='/content'>Find Recipes Based On Ingredients</Link>
          </Col>
          <Col className='home-button-each'>
            <Link to='/collaboration'>
              Recommended Recipes For You From Us!!
            </Link>
          </Col>
          <Col className='home-button-each'>
            <Link to='/addRecipe'>Add Recipe</Link>
          </Col>
          <Col className='home-button-each'>
            <Link to='/rateRecipe'>Rate Racipe</Link>
          </Col>
        </Row>
        <Row className='home-caroulsel'>
          <Carousel>
            <Carousel.Item>
              <img
                className='img-carousel'
                src={require('../images/login.jpg')}
                alt='First slide'
              />
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className='img-carousel'
                src={require('../images/indianchat.jpg')}
                alt='Third slide'
              />
              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
          {this.state.render}
        </Row>
      </Container>
    )
  }
}

export default Home
