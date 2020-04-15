import React, { Component } from 'react'
import '../App.css'
import { Button, Form } from 'react-bootstrap'

import { Link } from 'react-router-dom'
class Register extends Component {
  constructor () {
    super()
  }
  render () {
    return (
      <div className='register-body'>
        <div className='register-section'>
          <Form>
            <Form.Group controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control type='email' placeholder='Enter email' />
            </Form.Group>

            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Password' />
            </Form.Group>
            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type='password' placeholder='Password' />
            </Form.Group>
            <Form.Group controlId='formBasicCheckbox'>
              <Form.Check type='checkbox' label='Check me out' />
            </Form.Group>
            <Button variant='primary' type='submit'>
              <Link to='/home'>Register</Link>
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}
export default Register
