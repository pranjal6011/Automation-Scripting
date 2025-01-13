import React, { useState } from 'react';
import './RemoteSources.css';
import API_BASE_URL from '../../../config';

const RemoteSource = () => {
  const [remoteSourceStatus, setRemoteSourceStatus] = useState([]);
  const [errorSources, setErrorSources] = useState([]);
  const [loadingRemoteSource, setLoadingRemoteSource] = useState(false);
  const [loadingCheckStatus, setLoadingCheckStatus] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRemoteSourceData, setSelectedRemoteSourceData] = useState(null);
  const storedCredentials = localStorage.getItem('credentials');
  const credentials = storedCredentials ? JSON.parse(storedCredentials) : {};

  const getRemoteSource = async () => {
    setRemoteSourceStatus([]);
    setErrorSources([]);
    setLoadingRemoteSource(true);

    try {
      if (!storedCredentials) {
        alert('No credentials found in localStorage.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/remote/get-remote-sources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credentials }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRemoteSourceStatus(data.remoteSourceResults || []);
      setErrorSources(data.errorResults || []);

    } catch (error) {
      console.error('Error fetching remote sources:', error);
      alert('Error fetching remote sources!');
    } finally {
      setLoadingRemoteSource(false);
    }
  };

  const handleRowClick = (sourceName) => {
    setSelectedSources((prevSelected) => {
      if (prevSelected.includes(sourceName)) {
        return prevSelected.filter((item) => item !== sourceName);
      } else {
        return [...prevSelected, sourceName];
      }
    });
  };

  const handleSelectAllChange = () => {
    setSelectAll((prevSelectAll) => {
      const newSelectAll = !prevSelectAll;
      if (newSelectAll) {
        const filteredSources = filteredRemoteSources.map((source) => source['REMOTE_SOURCE_NAME']);
        setSelectedSources(filteredSources);
      } else {
        setSelectedSources([]);
      }
      return newSelectAll;
    });
  };

  const handleSubmit = async () => {
    const storedCredentials = localStorage.getItem('credentials');
    if (!storedCredentials) {
      alert('No credentials found in localStorage.');
      return;
    }

    const credentials = JSON.parse(storedCredentials);

    setLoadingCheckStatus(true);

    try {
      const response = await fetch(`${API_BASE_URL}/remote/check_remote_sources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials,
          remote_sources: selectedSources,
        }),
      });

      if (!response.ok) {
        throw new Error('Error checking remote sources.');
      }

      const data = await response.json();
      if (data.remoteSourceResults) {
        setSelectedRemoteSourceData(data);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error checking remote sources:', error);
      alert('Error checking remote sources!');
      setShowModal(false);
    } finally {
      setLoadingCheckStatus(false);
    }
  };

  const filteredRemoteSources = remoteSourceStatus.filter((source) =>
    source['REMOTE_SOURCE_NAME'].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="section">
      <div className="button-container">
        <button onClick={getRemoteSource} disabled={loadingRemoteSource}>
          {loadingRemoteSource ? 'Displaying...' : 'Display Remote Source'}
        </button>
      </div>
      <hr />
      {remoteSourceStatus.length > 0 && (
        <div>
          <h4>Tenant: {credentials.host}</h4>
          <form>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by remote source name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                disabled={loadingCheckStatus}
              />
            </div>
            <div className="submit-container">
              <button type="button" onClick={handleSubmit} disabled={loadingCheckStatus}>
                {loadingCheckStatus ? 'Processing...' : 'Check Status'}
              </button>
            </div>
            <table className='remote-table'>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      disabled={loadingCheckStatus}
                    />
                  </th>
                  <th>Remote Sources</th>
                </tr>
              </thead>
              <tbody>
                {filteredRemoteSources.map((source, index) => (
                  <tr key={index} onClick={() => !loadingCheckStatus && handleRowClick(source['REMOTE_SOURCE_NAME'])}>
                    <td>
                      <input
                        type="checkbox"
                        id={`source-${index}`}
                        checked={selectedSources.includes(source['REMOTE_SOURCE_NAME'])}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!loadingCheckStatus) handleRowClick(source['REMOTE_SOURCE_NAME']);
                        }}
                        disabled={loadingCheckStatus}
                      />
                    </td>
                    <td>{source['REMOTE_SOURCE_NAME']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </div>
      )}
      <hr />
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

      {showModal && selectedRemoteSourceData && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h4>Remote Sources Status</h4>
            <table>
              <thead>
                <tr>
                  <th>Remote Source</th>
                  <th>Status</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {selectedRemoteSourceData.remoteSourceResults.map((source, index) => {
                  // Find the error for each source by matching its name
                  const error = selectedRemoteSourceData.errorResults.find(
                    (err) => err['Remote Source'] === source['Remote Source']
                  );
                  return (
                    <tr key={index}>
                      <td>{source['Remote Source']}</td>
                      <td>{source.Status}</td>
                      <td className="error-text">
                        {source.Status === 'Not Working' && error ? (
                          <p style={{ color: 'red' }}>
                            {error.Error || 'No error information'}
                          </p>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
  
export default RemoteSource;
