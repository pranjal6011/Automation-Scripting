import React from 'react';
import logo from '../../images/logo.png';
import './Header.css';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('credentials'); // Clear credentials
    setIsAuthenticated(false); // Update authentication state
  };

  return (
    <div className="header">
      <img src={logo} alt="SAP Logo" className="logo" />
      <h2>HANA Cloud Data Provisioning</h2>
      {isAuthenticated && ( // Conditional rendering of the logout button
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;