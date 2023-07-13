import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import LoginPage from "./loginPage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const Table = () => {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedLoggedIn === "true") {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {

    fetchData();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/delete/${itemId}`
      );
      fetchData();
      console.log(response.data.done);
      toast.success(`The post with ID '${itemId} has been deleted.'`);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error(error);
    }
    console.log(itemId);
  };

  return (
    <>
      <div className="container admin-container">
        {isLoggedIn ? (
          Object.keys(items).length === 0 ? (
            <div>
              <h1>Posts</h1>
              <h2>loading ...</h2>
            </div>
          ) : (
            <div className="table-container">
              <h1>Posts</h1>
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
                      <th>Scraped At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id}>
                        <td>{item.yitle}</td>
                        <td>{item.category}</td>
                        <td>{item.localisation}</td>
                        <td>{item.type}</td>
                        <td>{item.price === 0 ? "Not Specified" : item.price}</td>
                        <td>{item.platform}</td>
                        <td>{item.scraped_at}</td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="secondary"
                              id={`dropdown-${item._id}`}
                            ></Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => handleDelete(item._id)}
                              >
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
                <ToastContainer />
              </div>
            </div>
          )
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </div>
    </>
  );
};

export default Table;
