import React, { Component } from 'react'
import '../App.css'
import { Button, Form, Container, Row, Col,Image } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
function Navbar () {
  return (
    <div className='navbarContainer'>
      <div className='navbarBody'>
        <div className='clinicLogo'>
          PATILS DENTAL AVENUE
          {/* <Image src={require('./images/logo.png')} roundedCircle /> */}      
          </div>
        <Link to='/HomeAdmin'>
          <div className='navbarItem'>Home</div>
        </Link>
        <Link to='/Services'>
          <div className='navbarItem'>Select Your Ingredients</div>
        </Link>
        <Link to='/AboutUs'>
          <div className='navbarItem'>Recomendation</div>
        </Link>
        <Link to='/Services'>
          <div className='navbarItem'>Services</div>
        </Link>
        
        <Link to='/AboutUs'>
          <div className='navbarItem'>Contact Us</div>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
