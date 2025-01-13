import React from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, onTabClick }) => {
  const tabs = [
    { key: 'remoteSource', label: 'Remote Source Status' },
    { key: 'pseCertificate', label: 'PSE Certificate Status' },
    { key: 'sourceTable', label: 'Source Table' },
    { key: 'virtualTable', label: 'Virtual Table' },
  ];

  return (
    <div className="nav">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabClick(tab.key)}
          className={activeTab === tab.key ? 'active' : ''}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Navbar;
