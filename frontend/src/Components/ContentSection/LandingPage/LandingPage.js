import React, { useState, useRef, useEffect } from 'react';
import './LandingPage.css'; // Import the CSS file
import API_BASE_URL from '../../../config';

const LandingPage = ({ onLogin }) => {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const hostInputRef = useRef(null);

  useEffect(() => {
    if (hostInputRef.current) {
      hostInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!host || !port || !userId || !password) {
      setError('All fields are required.');
      return;
    }

    const credentials = { host, port, userId, password };

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      setLoading(false);

      if (response.ok && data.success) {
        localStorage.setItem('credentials', JSON.stringify(credentials));
        setError('');
        onLogin();
      } else {
        setError('Invalid credentials. Please try again!!');
        clearFieldsAndFocusHost();
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to validate credentials. Please try again.');
      console.error('Error validating credentials:', err);
      clearFieldsAndFocusHost();
    }
  };

  const clearFieldsAndFocusHost = () => {
    setHost('');
    setPort('');
    setUserId('');
    setPassword('');
    if (hostInputRef.current) {
      hostInputRef.current.focus();
    }
  };

  return (
    <div className="landing-page">
      <div className="form-container">
        <p>Enter The Tenant Details For LogIn</p>
        {error && <p className="error-message">{error}</p>}
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="host">Host</label>
            <input
              id="host"
              type="text"
              ref={hostInputRef}
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Enter Host"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="port">Port</label>
            <input
              id="port"
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="Enter Port"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>
          <button id="loginbutton" type="submit" disabled={loading}>
            {loading ? 'Logging In...' : 'Login'}
            {loading && <div className="loader"></div>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;