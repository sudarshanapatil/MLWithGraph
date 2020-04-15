import React, { Component } from 'react'
// import Collaborative from './component/CollaborativeFiltering'
// import Contentbased from './component/Contentbased'
import Login from './component/Login'
// import Home from './component/Home'
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
  }

  render () {
    return (
      <Container>
        {/* <Router> */}
          {/* <Row>
            <div class='titlebar'>Recipe Recommendation System</div>
          </Row> */}
          {/* <Link to='/'>Login</Link> */}
          {/* <Link to='/home'>Home</Link> */}
        {/* <Switch> */}
          {/* <Route path='/content'>
            <Contentbased />
          </Route>
          <Route path='/collaborative'>
            <Collaborative />
          </Route>
          <Route path='/home'>
            <Home />
          </Route> */}
          {/* <Route path='/login'>
            <Login />
          </Route> */}
          {/* <Route path='/'> */}
            <Login />
          {/* </Route>
        </Switch>
        </Router> */}
      </Container>
    )
  }
}

export default App
