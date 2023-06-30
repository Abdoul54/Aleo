import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Landing from "./Landing";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const API_BASE_URL = "http://localhost:5000/api";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div>
      <h1 >Home Page</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(25rem, 1fr))', gap: '1rem' }}>
        {posts.map((post) => (
          <div className="card" key={post._id}>
            <div className="card-body">
              <h4 className="card-title">{post.Title}</h4>
              <p className="card-text">{post.localisation}</p>
              <p className="card-text">{post.type}</p>
              <p className="card-text">{post.Price} DHs</p>
              <p className="card-text">{post.platform}</p>
              <a href={post.link} target="_blank" rel="noreferrer" className="btn btn-primary">Visit Link</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    searchPosts();
  };
  return (
    <div>
      <h1>Search Page</h1>
      <Form onSubmit={handleSearchSubmit} className="d-flex" >
        <div className="d-flex align-items-center">
          <Form.Control
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search..."
            className="me-2"
          />
          <Button type="submit" variant="outline-success">Search</Button>
        </div>
      </Form>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(25rem, 1fr))', gap: '1rem' }}>
        {searchResults.map((post) => (
          <div className="card" key={post._id}>
            <div className="card-body">
              <h4 className="card-title">{post.Title}</h4>
              <p className="card-text">{post.localisation}</p>
              <p className="card-text">{post.type}</p>
              <p className="card-text">{post.Price} DHs</p>
              <p className="card-text">{post.platform}</p>
              <a href={post.link} target="_blank" rel="noreferrer" className="btn btn-primary">Visit Link</a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Item>
                <Link to="/" className="nav-link">Home</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/home" className="nav-link">Posts</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/search" className="nav-link">Search</Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Container>
    </Router>
  );
}


export default App;
