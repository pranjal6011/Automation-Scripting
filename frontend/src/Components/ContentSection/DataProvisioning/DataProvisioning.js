import React, { useState } from 'react';
import LandingPage from '../LandingPage/LandingPage';
import './DataProvisioning.css';
import Navbar from '../../Navbar/Navbar';
import SourceTable from '../SourceTable/SourceTable';
import VirtualTable from '../VirtualTable/VirtualTable';
import RemoteSource from '../RemoteSource/RemoteSource';
import PSECertificate from '../PSECertificate/PSECertificate';

const DataProvisioning = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('credentials')
  );
  const [activeTab, setActiveTab] = useState('remoteSource');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <div className="main-content">
        <Navbar activeTab={activeTab} onTabClick={handleTabClick} />
        <div className="content">
          {activeTab === 'remoteSource' && <RemoteSource />}
          {activeTab === 'pseCertificate' && <PSECertificate />}
          {activeTab === 'sourceTable' && <SourceTable />}
          {activeTab === 'virtualTable' && <VirtualTable />}
        </div>
      </div>
    </div>
  );
};

export default DataProvisioning;