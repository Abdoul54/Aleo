import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import './App.css';
import Landing from "./components/Landing";
import Search from "./components/Search";
import AdminPage from "./components/adminPage";
import { Button } from "react-bootstrap";
import Scrape from "./components/scraper";



function App() {
	return (
		<Router>
			<Navbar expand="lg" className="bg-body-tertiary" sticky="top">
				<Container fluid>
					<Navbar.Toggle aria-controls="navbarScroll" />
					<Navbar.Collapse id="navbarScroll">
						<Nav className="me-auto my-2 my-lg-0" navbarScroll>
							<Nav.Item>
								<Link to="/" className="nav-link">
									Home
								</Link>
							</Nav.Item>
							<Nav.Item>
								<Link to="/search" className="nav-link">
									Search
								</Link>
							</Nav.Item>
						</Nav>
						<Nav className="ms-auto" navbarScroll>
							<Nav.Item>
								<Link to="/admin" className="nav-link me-2">
									<Button type="button" className="btn btn-secondary">Login</Button>
								</Link>
							</Nav.Item>
						</Nav>
					</Navbar.Collapse>
				</Container>

			</Navbar>

			<Container fluid>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/search" element={<Search />} />
					<Route path="/admin" element={<AdminPage />} />
					<Route path="/admin/scrape" element={<Scrape />} />
				</Routes>
			</Container>
		</Router>
	);
}

export default App;
