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
      // <div className='backgroundImage'></div>
      <Container className='homeContainer' fluid>
        
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
            <Link to='/recipelevel'>Recipes with different Skills</Link>
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
                src={require('../images/carousel3.jpg')}
                alt='First slide'
              />
              <Carousel.Caption>
                <h3>John Gunther</h3>
                <p>
                All happiness depends on a leisurely breakfast
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className='img-carousel'
                src={require('../images/carousel2.jpg')}
                alt='First slide'
              />
              <Carousel.Caption>
                <h3>Paul Prudhomme</h3>
                <p>
                You don't need a silver fork to eat good food.
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
                <h3>Barbara Johnson</h3>
                <p>A balanced diet is a cookie in each hand.</p>
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
