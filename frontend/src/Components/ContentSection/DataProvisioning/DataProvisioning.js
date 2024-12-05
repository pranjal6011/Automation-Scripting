import React, { useState } from 'react';
import './DataProvisioning.css';
import Header from '../../Header/Header';
import Navbar from '../../Navbar/Navbar';
import SourceTable from '../SourceTable/SourceTable';
import VirtualTable from '../VirtualTable/VirtualTable';
import RemoteSource from '../RemoteSource/RemoteSource';
import PSECertificate from '../PSECertificate/PSECertificate';

const DataProvisioning = () => {
  const [activeTab, setActiveTab] = useState('sourceTable');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <Header />
      <div className="main-content">
        <Navbar activeTab={activeTab} onTabClick={handleTabClick} />
        <div className="content">
          {activeTab === 'sourceTable' && <SourceTable />}
          {activeTab === 'virtualTable' && <VirtualTable />}
          {activeTab === 'remoteSource' && <RemoteSource />}
          {activeTab === 'pseCertificate' && <PSECertificate />}
        </div>
      </div>
    </div>
  );
};

export default DataProvisioning;
