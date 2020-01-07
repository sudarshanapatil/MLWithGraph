import React, { Component } from 'react'
import '../App.css'

import { Button, Col, Form, Row, Container } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

class Login extends Component {
  constructor () {
    super()
  }

  render () {
    return (
      <Container>
        <Row>

        </Row>
        <Row>
          <Form>
            <Form.Group controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control type='email' placeholder='Enter email' />
              <Form.Text className='text-muted'>
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Password' />
            </Form.Group>
            <Form.Group controlId='formBasicCheckbox'>
              <Form.Check type='checkbox' label='Check me out' />
            </Form.Group>
            <Button variant='primary' type='submit'>
              Submit
            </Button>
            <Button variant='primary' type='submit' onClick={()=>this.showRegisterPage()}>
              <Link>Register</Link>
            </Button>
          </Form>
        </Row>
      </Container>
    )
  }
}
export default Login
