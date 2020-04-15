import React, { Component } from 'react'
import '../App.css'
import '../styles/Login.css'
import { Button, Form } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
class Login extends Component {
  constructor () {
    super()
  }
  render () {
    return (
      <div className='login-body'>
        <div className='login-section'>
          Recipe Recommendation System
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

            <Button variant='warning' type='submit'>
              <Link to='/home'>Login</Link>
            </Button>

            <Button variant='info' type='submit'>
              <Link to='/register'>Register</Link>
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}
export default Login
