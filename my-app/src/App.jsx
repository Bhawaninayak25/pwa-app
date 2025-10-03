import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./home";
import About from "./about";
import User from "./Users";
import { useEffect, useState } from "react";
import Header from "./Header";
import Form from "./Form";
 

// गलत: import db from './indexedDB';
import { savePendingForm, getPendingForms, deletePendingForm } from "./indexedDB";



function App() {
  return (
    <div className="App">
      <Router>
        <Navbar bg="primary" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={Link} to="/">
              goback
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/Users">
                Users
              </Nav.Link>
                <Nav.Link as={Link} to="/Form">
                Form
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        {/* Define routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/Users" element={<User />} />
          <Route path="/Form" element={<Form />} />
        </Routes>
      </Router>
    </div>
  );
}
 


 

export default App;
