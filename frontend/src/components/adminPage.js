import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginPage from './loginPage';
import Table from './table';
import './style/adminPage.css'


const AdminPage = () => {
  const [scrapingResult, setScrapingResult] = useState('');
  const [deletionResult, setDeletionResult] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedLoggedIn === 'true') {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleScrape = async () => {
    try {
      const response = await axios.post('/api/admin/scrape');
      setScrapingResult(response.data.message);
    } catch (error) {
      console.error(error);
      setScrapingResult('Error occurred during data scraping');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post('/api/admin/delete');
      setDeletionResult(response.data.message);
    } catch (error) {
      console.error(error);
      setDeletionResult('Error occurred during data deletion');
    }
  };

  return (
    <div className="container admin-container">
      {isLoggedIn ? (
        <div>
          <h2 className="admin-title">Admin Page</h2>
          <div className="admin-buttons">
            <div>
              <button className="btn btn-primary" onClick={handleScrape}>
                Scrape Data
              </button>
              <p className="admin-result">{scrapingResult}</p>
            </div>
            <div>
              <button className="btn btn-danger delete" onClick={handleDelete}>
                Delete Data
              </button>
              <p className="admin-result">{deletionResult}</p>
            </div>
          </div>
          <Table />
        </div>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );

};

export default AdminPage;
