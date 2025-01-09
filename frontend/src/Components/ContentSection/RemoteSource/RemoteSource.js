import React, { useState } from 'react';
import './RemoteSources.css';
import API_BASE_URL from '../../../config';
const RemoteSource = () => {
  const [remoteSourceStatus, setRemoteSourceStatus] = useState([]);
  const [errorSources, setErrorSources] = useState([]);
  const [loadingRemoteSource, setLoadingRemoteSource] = useState(false);

  const checkRemoteSource = async () => {
    setRemoteSourceStatus([]);
    setErrorSources([]);
    setLoadingRemoteSource(true);

    try {
      const response = await fetch(`${API_BASE_URL}/remote/check-remote-sources`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRemoteSourceStatus(data.remoteSourceResults || []);
      setErrorSources(data.errorResults || []);
    } catch (error) {
      console.error('Error fetching remote sources:', error);
    } finally {
      setLoadingRemoteSource(false);
    }
  };

  return (
    <div className="section">
      <div className="button-container">
        <button onClick={checkRemoteSource} disabled={loadingRemoteSource}>
          {loadingRemoteSource ? 'Checking...' : 'Check Remote Source Status'}
        </button>
      </div>
      <hr/>
      {remoteSourceStatus.length > 0 && (
        <div>
          <h4>Remote Source Status (Primary Tenant):</h4>
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
      <hr/>
      {errorSources.length > 0 && (
        <div>
          <h4>Error in Remote Sources:</h4>
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
      <hr/>
    </div>
  );
};

export default RemoteSource;
