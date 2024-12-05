import React, { useState } from 'react';
import './SourceTable.css';

const SourceTable = () => {
  const [sourceStatus, setSourceStatus] = useState(null);
  const [sourceDetails, setSourceDetails] = useState([]);
  const [loadingSource, setLoadingSource] = useState(false);

  const checkSource = async () => {
    setSourceStatus(null);
    setSourceDetails([]);
    setLoadingSource(true);

    try {
      const response = await fetch('http://localhost:5000/source/create-source-table');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSourceStatus(data.message || 'Operation completed.');
      setSourceDetails(data.details || []);
    } catch (error) {
      setSourceStatus('Error creating source table.');
      console.error('Error during source creation:', error.message || error);
    } finally {
      setLoadingSource(false);
    }
  };

  return (
    <div className="section">
      <div className="button-container">
        <button onClick={checkSource} disabled={loadingSource}>
          {loadingSource ? 'Creating...' : 'Create Source Table'}
        </button>
      </div>
      <hr/>
      {sourceStatus && <p><b>Status: </b>{sourceStatus}</p>}
      <hr/>
      {sourceDetails.length > 0 && (
        <div className='details'>
          <h4>Execution History:</h4>
          <ul>
            {sourceDetails.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      )}
      <hr/>
    </div>
  );
};

export default SourceTable;
