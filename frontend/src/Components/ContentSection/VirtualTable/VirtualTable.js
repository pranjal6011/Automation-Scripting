import React, { useState } from 'react';
import API_BASE_URL from '../../../config';

const VirtualTable = () => {
  const [virtualTableStatus, setVirtualTableStatus] = useState(null);
  const [virtualTableDetails, setVirtualTableDetails] = useState([]);
  const [loadingVirtualTable, setLoadingVirtualTable] = useState(false);

  const checkVirtualTable = async () => {
    setVirtualTableStatus(null);
    setLoadingVirtualTable(true);

    try {
      const response = await fetch(`${API_BASE_URL}/target/create-virtual-table`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setVirtualTableStatus(data.message || 'Virtual Table created successfully in Primary Tenant.');
      setVirtualTableDetails(data.details || []);
    } catch (error) {
      setVirtualTableStatus('Error creating virtual table.');
      console.error('Error creating virtual table:', error.message || error);
    } finally {
      setLoadingVirtualTable(false);
    }
  };

  return (
    <div className="section">
      <div className="button-container">
        <button onClick={checkVirtualTable} disabled={loadingVirtualTable}>
          {loadingVirtualTable ? 'Creating...' : 'Create Virtual Table'}
        </button>
      </div>
      <hr/>
      {virtualTableStatus && <p><b>Status: </b>{virtualTableStatus}</p>}
      <hr/>
      {virtualTableDetails.length > 0 && (
        <div className='details'>
          <h4>Execution History:</h4>
          <ul>
            {virtualTableDetails.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      )}
      <hr/>
    </div>
  );
};

export default VirtualTable;
