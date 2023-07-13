import React, { useState } from 'react';
import './loginPage.css'
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password123') {
      onLogin();
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-form">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            type="text"
            placeholder="Username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};


export default LoginPage;