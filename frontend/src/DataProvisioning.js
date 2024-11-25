import React, { useState } from 'react';
import './DataProvisioning.css';
import logo from './images/logo.png';
// import axios from 'axios';

const DataProvisioning = () => {
  const [activeTab, setActiveTab] = useState('source');
  const [sourceStatus, setSourceStatus] = useState(null);
  const [sourceDetails, setSourceDetails] = useState(null);
  const [remoteSourceStatus, setRemoteSourceStatus] = useState([]);
  const [errorSources, setErrorSources] = useState([]);
  const [virtualTableStatus, setVirtualTableStatus] = useState(null); // Added state for Virtual Table creation status
  const [virtualTableDetails, setVirtualTableDetails] = useState([]);  // New state for details
  const [loadingSource, setLoadingSource] = useState(false);
  const [loadingRemoteSource, setLoadingRemoteSource] = useState(false);
  const [loadingVirtualTable, setLoadingVirtualTable] = useState(false); // Added loading state for Virtual Table creation
  const [pseDetails, setpseDetails] = useState([]);  // New state for details
  const [errorRemote, setErrorRemote] = useState([]);
  const [errorPSE, setErrorPSE] = useState([]);
  const [loadingPSE, setLoadingPSE] = useState(false); // Added loading state for Virtual Table

  const checkSource = async () => {
    setSourceStatus(null); // Clear status
    setSourceDetails(null);
    setLoadingSource(true);

    try {
      const response = await fetch('http://localhost:5000/source/create-source-table');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Source created:', data);

      setSourceStatus(data.message || 'Operation completed.');
      setSourceDetails(data.details || []);
    } catch (error) {
      setSourceStatus('Error creating source table.');
      console.error('Error during source creation:', error.message || error);
    } finally {
      setLoadingSource(false);
    }
  };

  const checkVirtualTable = async () => {
    setVirtualTableStatus(null); // Clear virtual table status
    setLoadingVirtualTable(true);

    try {
      const response = await fetch('http://localhost:5000/target/create-virtual-table');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      setVirtualTableStatus(data.status || 'Virtual Table created successfully.');
      setVirtualTableDetails(data.details || []);  // assuming details are provided in response
    } catch (error) {
      setVirtualTableStatus('Error creating virtual table.');
      console.error('Error creating virtual table:', error.message || error);
    } finally {
      setLoadingVirtualTable(false);
    }
  };

  const checkRemoteSource = async () => {
    setRemoteSourceStatus([]); // Clear remote source status
    setErrorSources([]); // Clear error sources
    setLoadingRemoteSource(true);
    setErrorRemote([]);

    try {
      const response = await fetch('http://localhost:5000/remote/check-remote-sources');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRemoteSourceStatus(data.remoteSourceResults || []);
      setErrorSources(data.errorResults || []);
    } catch (error) {
      setErrorRemote(['Error fetching Remote Source Status.']);
      console.error('Error fetching remote sources:', error);
    } finally {
      setLoadingRemoteSource(false);
    }
  };

  const checkPSE = async () => {
    setpseDetails([]); // Clear previous details
    setErrorPSE([]); // Clear errors
    setLoadingPSE(true);

    try {
      const response = await fetch('http://localhost:5000/pse/check-pse-status');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setpseDetails(data.results || []); // Assuming 'results' is the key containing certificate data
    } catch (error) {
      console.error('Error fetching PSE status:', error.message || error);
      setErrorPSE(['Error fetching PSE data.']);
    } finally {
      setLoadingPSE(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="SAP Logo" className="logo" />
        <h2>Data Provisioning</h2>
      </div>

      <div className="main-content">
        <div className="nav">
          <button
            onClick={() => handleTabClick('source')}
            className={activeTab === 'source' ? 'active' : ''}
          >
            Source Table
          </button>
          <button
            onClick={() => handleTabClick('target')}
            className={activeTab === 'target' ? 'active' : ''}
          >
            Virtual Table
          </button>
          <button
            onClick={() => handleTabClick('remoteSource')}
            className={activeTab === 'remoteSource' ? 'active' : ''}
          >
            Remote Source Status
          </button>
          <button
            onClick={() => handleTabClick('pse')}
            className={activeTab === 'pse' ? 'active' : ''}
          >
            PSE Certificate Status
          </button>
        </div>

        <div className="content">
          {activeTab === 'source' && (
            <div className="section">
              <div className="button-container">
                <button onClick={checkSource} disabled={loadingSource}>
                  {loadingSource ? 'Creating...' : 'Create Source Table'}
                </button>
              </div>
              <br />
              <hr />
              <br />
              {sourceStatus && <p><b>Status: </b>{sourceStatus}</p>}
              <br />
              <hr />
              {sourceDetails && (
                <div>
                  <br />
                  <h3>Details:</h3>
                  <br />
                  <ul>
                    {sourceDetails.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
              <br />
              <hr />
            </div>
          )}

          {activeTab === 'target' && (
            <div className="section">
              <div className="button-container">
                <button onClick={checkVirtualTable} disabled={loadingVirtualTable}>
                  {loadingVirtualTable ? 'Creating...' : 'Create Virtual Table'}
                </button>
              </div>
              <br />
              <hr />
              <br />
              {virtualTableStatus && <p><b>Status: </b>{virtualTableStatus}</p>}
              <br />
              <hr />
              {virtualTableDetails.length > 0 && (
                <div>
                  <br />
                  <h3>Details:</h3>
                  <br />
                  <ul>
                    {virtualTableDetails.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
              <br />
              <hr />
            </div>
          )}

          {activeTab === 'remoteSource' && (
            <div className="section">
              <div className="button-container">
                <button onClick={checkRemoteSource} disabled={loadingRemoteSource}>
                  {loadingRemoteSource ? 'Checking...' : 'Check Remote Source Status'}
                </button>
              </div>
              <br />
              <hr />
              <br />
              {errorRemote.length > 0 && (
                <div>
                  <h3>Errors:</h3>
                  <ul>
                    {errorRemote.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              {remoteSourceStatus.length > 0 && (
                <div>
                  <h3>Remote Source Statuses:</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Remote Source</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {remoteSourceStatus.map((source, index) => (
                        <tr key={index}>
                          <td>{source['Remote Source']}</td>
                          <td>{source.Status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {errorSources.length > 0 && (
                <div>
                  <br />
                  <br />
                  <h3>Errors in Remote Sources:</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Remote Source</th>
                        <th>Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorSources.map((error, index) => (
                        <tr key={index}>
                          <td>{error['Remote Source']}</td>
                          <td>{error.Error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <br />
              <hr />
            </div>
          )}

          {activeTab === 'pse' && (
            <div className="section">
              <div className="button-container">
                <button onClick={checkPSE} disabled={loadingPSE}>
                  {loadingPSE ? 'Checking...' : 'Check PSE Certificate Status'}
                </button>
              </div>
              <br />
              <hr />
              <br />
              {errorPSE.length > 0 && (
                <div>
                  <h3>Errors:</h3>
                  <ul>
                    {errorPSE.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              {pseDetails.length > 0 && (
                <div>
                  <br />
                  <h3>PSE Certificate Details:</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>PSE Name</th>
                        <th>Certificate Name</th>
                        <th>Valid From</th>
                        <th>Valid Until</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pseDetails.map((certificate, index) => (
                        <tr key={index}>
                          <td>{certificate.PSE_NAME}</td>
                          <td>{certificate.CERTIFICATE_NAME}</td>
                          <td>{certificate.VALID_FROM}</td>
                          <td>{certificate.VALID_UNTIL}</td>
                          <td>{certificate.STATUS}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <br />
              <hr />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataProvisioning;
