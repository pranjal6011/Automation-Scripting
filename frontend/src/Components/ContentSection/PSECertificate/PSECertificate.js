import React, { useState } from 'react';
import './PSECertificate.css';
import API_BASE_URL from '../../../config';

const PSECertificate = () => {
  const [pseDetails, setPseDetails] = useState([]);
  const [errorPSE, setErrorPSE] = useState([]);
  const [loadingPSE, setLoadingPSE] = useState(false);

  const checkPSE = async () => {
    setPseDetails([]);
    setErrorPSE([]);
    setLoadingPSE(true);

    try {
      const response = await fetch(`${API_BASE_URL}/pse/check-pse-status`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPseDetails(data.results || []);
    } catch (error) {
      setErrorPSE(['Error fetching PSE data.']);
      console.error('Error fetching PSE data:', error);
    } finally {
      setLoadingPSE(false);
    }
  };

  return (
    <div className="section">
      <div className="button-container">
        <button onClick={checkPSE} disabled={loadingPSE}>
          {loadingPSE ? 'Checking...' : 'Check PSE Certificate Status'}
        </button>
      </div>
      <hr/>
      {errorPSE.length > 0 && (
        <div>
          <h4>Errors:</h4>
          <ul>
            {errorPSE.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {pseDetails.length > 0 && (
        <div>
          <h4>PSE Certificate Details (Primary Tenant):</h4>
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
      <hr/>
    </div>
  );
};

export default PSECertificate;
