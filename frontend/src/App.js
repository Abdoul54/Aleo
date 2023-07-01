import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Landing from "./Landing";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import './App.css';
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
			<Search setPosts={setPosts} />
			<div
				className="card"

			>
				{posts.map((post) => (
					<div className="card" key={post._id}>
						<img
							src={post.image}
							className="card-img-top"
							alt="..."
							fluid
							width={300} height={300}
						/>
						<div className="card-body">
							<h4 className="card-title">{post.Title}</h4>
							<p className="card-text">{post.localisation}</p>
							<p className="card-text">{post.type}</p>
							<p className="card-text">{post.Price} DHs</p>
							<p className="card-text">{post.platform}</p>
							<a
								href={post.link}
								target="_blank"
								rel="noreferrer"
								className="btn btn-primary"
							>
								Visit Link
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function Search(props) {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchOption, setSearchOption] = useState("Vehicle");

	const searchPosts = async () => {
		try {
			const response = await axios.get(
				`${API_BASE_URL}/search/${searchOption}/${searchQuery}`
			);
			setSearchResults(response.data);
		} catch (error) {
			console.error("Error searching posts:", error);
		}
	};

	const handleSearchInputChange = (event) => {
		setSearchQuery(event.target.value);
	};
	const handleSearchOptionChange = (event) => {
		setSearchOption(event.target.value);
	};

	const handleSearchSubmit = (event) => {
		event.preventDefault();
		props.setPosts([]);
		searchPosts();
	};
	return (
		<div>
			<Form
				onSubmit={handleSearchSubmit}
				className="d-flex"
			>
				<div className="d-flex align-items-center" sticky="top">
					<Form.Control
						as="select"
						type="select"
						value={searchOption}
						onChange={handleSearchOptionChange}
						className="me-2"
					>
						<option value="Vehicle">Vehicle</option>
						<option value="Property">Property</option>
						<option value="Job">Job</option>
					</Form.Control>
					<Form.Control
						type="text"
						value={searchQuery}
						onChange={handleSearchInputChange}
						placeholder="Search..."
						className="me-2"
					/>
					<Button type="submit" variant="outline-success">
						Search
					</Button>
				</div>
			</Form>
			<div className="card">
				{searchResults.map((post) => (
					<div key={post._id}>
						<img
							src={post.image}
							className="card-img-top"
							alt="..."
							fluid
							width={300} height={300}
						/>
						<div className="card-body">
							<h4 className="card-title">{post.Title}</h4>
							<p className="card-text">{post.localisation}</p>
							<p className="card-text">{post.type}</p>
							<p className="card-text">
								{post.Price === 0 ? "Not Defined" : post.Price + " DHs"}
							</p>
							<p className="card-text">{post.platform}</p>
							<div className="mt-auto">
								<a
									href={post.link}
									target="_blank"
									rel="noreferrer"
									className="btn btn-primary text-center"
								>
									Visit Link
								</a>
							</div>
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
			<Navbar expand="lg" className="bg-body-tertiary" sticky="top">
				<Container fluid>
					<Navbar.Toggle aria-controls="navbarScroll" />
					<Navbar.Collapse id="navbarScroll">
						<Nav
							className="me-auto my-2 my-lg-0"
							navbarScroll
						>
							<Nav.Item>
								<Link to="/" className="nav-link">
									Home
								</Link>
							</Nav.Item>
							<Nav.Item>
								<Link to="/home" className="nav-link">
									Posts
								</Link>
							</Nav.Item>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<Container fluid>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/home" element={<Home />} />
				</Routes>
			</Container>
		</Router>
	);
}

export default App;
