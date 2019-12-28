import React, { Component } from 'react'
import Collaborative from './component/CollaborativeFiltering'
import Contentbased from './component/Contentbased'

import { Button, ButtonToolbar, Container, Row } from 'react-bootstrap'
import './App.css'
class App extends Component {
  constructor() {
    super()
    this.state = {
      render: ''
    }
  }
  handleClick(type) {
    if (type === 'content') {
      console.log('contentbased')
      this.setState({ render: <Contentbased /> })
    } else {
      this.setState({ render: <Collaborative /> })
    }
  }
  render() {
    console.log(this.state.render)
    return (
      <div>
        <Container>
          <Row></Row>
        </Container>

        <div class='titlebar'>
          Recipe Recommendation System
         
        </div>
        <ButtonToolbar>
            <Button variant='info' onClick={() => this.handleClick('content')}>
              ContentBased Filetering
            </Button>
            <Button
              variant='info'
              onClick={() => this.handleClick('collaborative')}>
              Collaborative Filetering
            </Button>
          </ButtonToolbar>

        {this.state.render}
      </div>
    )
  }
}

export default App
