import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./style/Search.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FiFilter, FiXCircle } from 'react-icons/fi';
import { GiPositionMarker } from 'react-icons/gi';
import { BiCategoryAlt } from 'react-icons/bi';
const API_BASE_URL = "http://localhost:5000/api";


function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchOption, setSearchOption] = useState("Vehicle");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [localizationFilter, setLocalizationFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const searchPosts = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/search/${searchOption}/${searchQuery}?minPrice=${minPrice}&maxPrice=${maxPrice}&type=${typeFilter}&localisation=${localizationFilter}`
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

    const handleMinPriceChange = (event) => {
        setMinPrice(event.target.value);
    };

    const handleMaxPriceChange = (event) => {
        setMaxPrice(event.target.value);
    };

    const handleTypeFilterChange = (event) => {
        setTypeFilter(event.target.value);
    };

    const handleLocalizationFilterChange = (event) => {
        setLocalizationFilter(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        searchPosts();
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="search-area">
            <Form onSubmit={handleSearchSubmit} className="d-flex">
                <div className="d-flex align-items-center" sticky="top">
                    <Form.Control
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        placeholder="Search..."
                        className="me-2"
                    />
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
                    {showFilters && (
                        <>
                            <Form.Control
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={handleMinPriceChange}
                                className="me-2"
                                min={1}
                            />
                            <Form.Control
                                type="number"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={handleMaxPriceChange}
                                className="me-2"
                                min={1}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Type"
                                value={typeFilter}
                                onChange={handleTypeFilterChange}
                                className="me-2"
                            />
                            <Form.Control
                                type="text"
                                placeholder="Localization"
                                value={localizationFilter}
                                onChange={handleLocalizationFilterChange}
                                className="me-2"
                            />
                        </>

                    )}
                </div>

                <Button
                    type="submit"
                    variant="outline-success"
                    className="btn btn-success btn-lg btn-block search"
                >
                    Search
                </Button>
                <div
                    variant="outline-primary"
                    className={showFilters ? "active" : "icon"}
                    onClick={toggleFilters}
                >
                    {showFilters ? <FiXCircle /> : <FiFilter />}
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
                            width={300}
                            height={300}
                        />
                        <div className="card-body">
                            <div className="title">
                                <h5 className="card-title">{post.title}</h5>
                            </div>
                            <p className="card-text price">
                                {post.price === 0 ? "Not Specified" : post.price + " DHs"}
                            </p>
                            <p className="card-text local">
                                <GiPositionMarker className="position" />
                                {post.localisation}</p>
                            <p className="card-text type">
                                <BiCategoryAlt className="category"/>
                                {post.type}
                            </p>
                        </div>
                        <div className="mt-auto">
                            <Button
                                href="https://www.avito.ma"
                                target="_blank"
                                rel="noreferrer"
                                variant="outline-primary"
                                className="btn btn-primary btn-lg btn-block btn1"
                                disabled
                            >
                                {post.platform}
                            </Button>

                            <Button
                                href={post.link}
                                target="_blank"
                                rel="noreferrer"
                                variant="outline-primary"
                                className="btn btn-primary btn-lg btn-block btn2"
                            >
                                Visit Link
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;
