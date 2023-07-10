import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Your Web App. All rights reserved.</p>
    </footer>
  );
};

const Landing = () => {
  return (
    <div className="landing-page">
      <Header />
      <h1>Welcome to the Web App!</h1>
      <div className="categories">
        <Link to="/vehicles" className="category">
          <h2>Vehicles</h2>
          <img src='../public/pictures/vehicle.jpeg' alt="Vehicle" />
          <p>Explore our wide range of vehicles for sale.</p>
        </Link>
        <Link to="/properties" className="category">
          <h2>Properties</h2>
          <img src='/public/pictures/properties.jpeg' alt="Properties" />
          <p>Discover properties available for sale or rent.</p>
        </Link>
        <Link to="/jobs" className="category">
          <h2>Job Offers</h2>
          <img src='/public/pictures/job.jpeg' alt="Job" />
          <p>Find exciting job opportunities.</p>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;