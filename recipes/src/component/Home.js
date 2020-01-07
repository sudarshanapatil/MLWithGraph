import React, { Component } from 'react'
import Collaborative from './CollaborativeFiltering'
import Contentbased from './Contentbased'
import Login from './Login'

import {
  Button,
  ButtonToolbar,
  Container,
  Row,
  Carousel,
  Col
} from 'react-bootstrap'
import '../App.css'
class Home extends Component {
  constructor () {
    super()
    this.state = {
      render: ''
    }
  }
  handleClick (type) {
    if (type === 'Content') {
      console.log('type', type)
      this.setState({ render: <Contentbased /> })
    } else if (type === 'Collaborative') {
      this.setState({ render: <Collaborative /> })
    } else {
      this.setState({ render: <Login /> })
    }
  }
  render () {
    console.log(this.state.render)
    return (
      <Container>
        <Row>
          <Col>
            <div class='titlebar'>Recipe Recommendation System</div>
          </Col>
          <Col>
            <ButtonToolbar>
              <Button
                variant='info'
                onClick={() => this.handleClick('Content')}
              >
                ContentBased Filetering
              </Button>
              <Button
                variant='info'
                onClick={() => this.handleClick('Collaborative')}
              >
                Collaborative Filetering
              </Button>
              <Button variant='info' onClick={() => this.handleClick('Login')}>
                Login
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        <Row>
          <Carousel>
            <Carousel.Item>
              <img
                class='d-block w-100'
                //src={require('./images/host.jpg')}
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
                className='d-block w-100'
                src='holder.js/800x400?text=Second slide&bg=282c34'
                alt='Third slide'
              />

              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className='d-block w-100'
                src='holder.js/800x400?text=Third slide&bg=20232a'
                alt='Third slide'
              />

              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>
                  Praesent commodo cursus magna, vel scelerisque nisl
                  consectetur.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Row>
        <Row>{this.state.render}</Row>
      </Container>
    )
  }
}

export default Home
