import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Landing from "./Landing";

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
      <h1>Home Page</h1>
      <ul>
        {posts.map((post) => (
          <a href={post.link} target="_blank" rel="noreferrer">
          <li key={post._id}>
            <h2>{post.Title}</h2>
            <p>{post.localisation}</p>
            <p>{post.type}</p>
            <p>{post.Price}</p>
            <p>{post.platform}</p>
          </li>
        </a>
        ))}
      </ul>
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
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {searchResults.map((post) => (
          <a href={post.link} target="_blank" rel="noreferrer">
            <li key={post._id}>
              <h2>{post.Title}</h2>
              <p>{post.localisation}</p>
              <p>{post.type}</p>
              <p>{post.Price}</p>
              <p>{post.platform}</p>
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/home">Posts</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
