import React, { Component } from 'react'
import Collaborative from './component/CollaborativeFiltering'
import Contentbased from './component/Contentbased'
import Login from './component/Login'
import Home from './component/Home'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import {
  Button,
  ButtonToolbar,
  Container,
  Row,
  Carousel,
  Col
} from 'react-bootstrap'
import './App.css'
class App extends Component {
  constructor () {
    super()
    this.state = {
      render: ''
    }
  }

  render () {
    return (
      <Container>
        <Row>
          <div class='titlebar'>Recipe Recommendation System</div>
        </Row>
        <Link to='/'>Home</Link>
        <Switch>
          <Route path='/content'>
            <Contentbased />
          </Route>
          <Route path='/collaborative'>
            <Collaborative />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/home'>
            <Home />
          </Route>
        </Switch>
        <Login />
      </Container>
    )
  }
}

export default App
