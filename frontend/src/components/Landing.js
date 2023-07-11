import React from "react";
import { Carousel } from "react-bootstrap";
import "./style/Landing.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer bg-light">
      <div className="container text-center">
        <div className="row">
          <div className="col-md-6">
            <h4>Subscribe to our newsletter</h4>
            <p>Stay updated with the latest news and offers.</p>
          </div>
          <div className="col-md-6">
            <form>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Enter your email" />
                <button className="btn btn-primary" type="submit">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
        <p className="mt-4">&copy; {new Date().getFullYear()} Aleo. All rights reserved.</p>
      </div>
    </footer>
  );
};

const NumberInfoSection = ({ title, number, description }) => {
  return (
    <div className="number-info">
      <div className="number-info-inner">
        <span className="number-info-number">{number}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

const ImageTextSection = () => {
  return (
    <div className="image-text-section">
      <div className="image-text-section-content">
        <div className="image-text-section-image">
          <img src="/pictures/car.jpg" alt="Vehicle" />
        </div>
        <div className="image-text-section-text">
          <h2>Vehicles</h2>
          <p>Explore our wide range of vehicles for sale.</p>
          <Link to="/search" className="nav-link me-2">
            <button type="button" className="Go">
              Discover
            </button>
          </Link>
        </div>
      </div>
      <div className="image-text-section-content">
        <div className="image-text-section-image">
          <img src="/pictures/house.jpg" alt="property" />
        </div>
        <div className="image-text-section-text">
          <h2>Properties</h2>
          <p>Discover properties available for sale or rent.</p>
          <Link to="/search" className="nav-link me-2">
            <button type="button" className="Go">
              Discover
            </button>
          </Link>
        </div>
      </div>
      <div className="image-text-section-content">
        <div className="image-text-section-image">
          <img src="/pictures/work.jpg" alt="job" />
        </div>
        <div className="image-text-section-text">
          <h2>Jobs</h2>
          <p>Find exciting job opportunities.</p>
          <Link to="/search" className="nav-link me-2">
            <button type="button" className="Go">
              Discover
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "600px", "object-fit": "cover" }}
            src="/pictures/job.jpeg"
            alt="Slider 1"
          />
          <Carousel.Caption className="caption">
            <h3>Job Offers</h3>
            <p>Find exciting job opportunities.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "600px", "object-fit": "cover" }}
            src="/pictures/properties.jpeg"
            alt="Slider 2"
          />
          <Carousel.Caption className="caption">
            <h3>Properties</h3>
            <p>Discover properties available for sale or rent.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "600px", "object-fit": "cover" }}
            src="/pictures/vehicle.jpeg"
            alt="Slider 3"
          />
          <Carousel.Caption className="caption">
            <h3>Vehicles</h3>
            <p>Explore our wide range of vehicles for sale.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <div className="container">
        <div className="number-info-sections">
          <div className="number-info-center">
            <NumberInfoSection
              title="Total Posts"
              number="+20,000"
              description="Explore thousands of posts from various sources."
            />
            <NumberInfoSection
              title="New Posts Today"
              number="+4,000"
              description="Discover fresh posts added today and stay up-to-date."
            />
            <NumberInfoSection
              title="Number of Source apps"
              number="+20"
              description="Get posts from multiple apps to access a diverse range of content."
            />
          </div>
        </div>
          <ImageTextSection/>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
