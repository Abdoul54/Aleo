import React, { useState, useEffect } from 'react';
import LoginPage from './loginPage';
import './style/adminPage.css'


const Dashboard = () => {
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

  return (
    <div className="container admin-container">
      {isLoggedIn ? (
        <data/>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );

};

export default DOMExceptionashboard;
