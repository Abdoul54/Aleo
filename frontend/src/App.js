import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import './App.css';
import Landing from "./components/Landing";
import Search from "./components/Search";
import DataPage from "./components/dashboard/data";
import Table from "./components/dashboard/table";
import { AiFillHome } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';



function App() {
	return (
		<Router>
			<Navbar  className="navbar bg-body-tertiary" sticky="top" >
				<Container fluid>
					<Navbar.Toggle aria-controls="navbarScroll" />
					<Navbar.Collapse id="navbarScroll">
						<Nav className="nav nav-pills ms-auto" aria-current="page" navbarScroll>
						<Nav.Item className="nav-item">
						<img
                            src="/pictures/AleoLogo.png"                            
							className="logo-img"
                            alt="..."
                            style={{"objectFit":"cover"}}
                            fluid
                        />
							</Nav.Item>
							<Nav.Item className="nav-item">
								<Link to="/search" className="nav-link">
									<div className="search-icon">
										<BsSearch />
									</div>
									Search
								</Link>
							</Nav.Item>
							<Nav.Item>
								<Link to="/" className="nav-link">
									<div className="home-icon">
										<AiFillHome />
									</div>
									Home
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
					<Route path="/admin" element={<DataPage />} />
					<Route path="/admin/posts" element={<Table />} />
				</Routes>
			</Container>
		</Router>
	);
}

export default App;
