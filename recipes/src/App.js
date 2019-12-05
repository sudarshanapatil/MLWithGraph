import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Container, Row, Col, Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap'
class App extends Component {
  constructor() {
    super()
    this.state = {
      ingredients: [],
      recipes: []
    }

  }

  addIngredient = (data) => {
    console.log(data)
    let ingredientsArr = []
    ingredientsArr.push(data)
    fetch('http://localhost:1337/getrecipes', {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ingredients: ingredientsArr
      })
    })
      .then(res => res.json())
      .then((data) => {
        //console.log(data,"recipes info")
        this.setState({ recipes: data })
        console.log(this.state.recipes)
      })
      .catch(console.log)
  }

  UNSAFE_componentWillMount() {
    fetch('http://localhost:1337/getallingredients')
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        this.setState({ ingredients: data })
      })
      .catch(console.log)

  }
  render() {
    return (
      //<div className="App">
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">Recipe Recommendation System</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-info">Search</Button>
            </Form>
          </Navbar>
          <Row>
            {"Ingredients List"}
            {}
          </Row>
          {
            this.state.ingredients.map((element, i) =>
              <Row>
                <Col>
                  <p className="textIngredient">{element}</p>
                </Col>
                <Col>
                  <input
                    name="isGoing"
                    type="checkbox" onClick={() => this.addIngredient(element)} />
                </Col>
                
              </Row>
            )
          }
          <Row>
            Recommemded Recipes
          </Row>
          {
            this.state.recipes.map((element) =>
              <Row>
                {element}
              </Row>
            )
          }
        </Container>

     // </div>
    );
  }
}

export default App;
