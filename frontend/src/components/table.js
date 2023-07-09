import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const Table = () => {
  const [Results, setResults] = useState([{
    "_id":1,
    "Title": "Something good",
    "Category": "The Goodies",
    "type": "Meth",
    "Price": 100000,
    "localisation": "Earth",
    "platform": "Threads",
    "link": "https://www.threads.net"
  }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts`);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (itemId) => {
    console.log(itemId);
    // Define your logic for edit action
    // e.g., navigate to edit page or show an edit form
  };

  const handleDelete = (itemId) => {
    console.log(itemId);
    // Define your logic for delete action
    // e.g., show a confirmation dialog and delete the item
  };

  return (Object.keys(Results).length === 0 ? 
    <h2>loading ...</h2>
   : 
    <div className="table-container">
      <div className="table-wrapper">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Localization</th>
              <th>Type</th>
              <th>Price</th>
              <th>Platform</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Results.map((item) => (
              <tr key={item._id}>
                <td>{item.Title}</td>
                <td>{item.Category}</td>
                <td>{item.localisation}</td>
                <td>{item.type}</td>
                <td>{item.Price}</td>
                <td>{item.platform}</td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id={`dropdown-${item._id}`}>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleEdit(item._id)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(item._id)}>
                        Delete
                      </Dropdown.Item>
                      <Dropdown.Item
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Link
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default Table;
