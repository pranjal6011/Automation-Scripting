import React from 'react';
import logo from '../../images/logo.png';
import './Header.css';

const Header = () => (
  <div className="header">
    <img src={logo} alt="SAP Logo" className="logo" />
    <h2>Data Provisioning</h2>
  </div>
);

export default Header;
