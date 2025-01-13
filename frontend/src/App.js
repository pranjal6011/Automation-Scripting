import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './Components/ContentSection/LandingPage/LandingPage.js';
import DataProvisioning from './Components/ContentSection/DataProvisioning/DataProvisioning.js';
import Header from './Components/Header/Header.js';

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clearSession = useCallback(() => {
    localStorage.removeItem('credentials');
    localStorage.removeItem('loginTimestamp');
    setIsAuthenticated(false);
    alert('Session expired. Please log in again.');
  }, []);

  const scheduleLogout = useCallback(
    (timeout) => {
      setTimeout(() => {
        clearSession();
      }, timeout);
    },
    [clearSession]
  );

  useEffect(() => {
    const storedCredentials = localStorage.getItem('credentials');
    const loginTimestamp = localStorage.getItem('loginTimestamp');

    if (storedCredentials && loginTimestamp) {
      const timeElapsed = Date.now() - parseInt(loginTimestamp, 10);
      if (timeElapsed < SESSION_DURATION) {
        setIsAuthenticated(true);
        const remainingTime = SESSION_DURATION - timeElapsed;
        scheduleLogout(remainingTime);
      } else {
        clearSession();
      }
    }
  }, [scheduleLogout, clearSession]);

  const handleLogin = () => {
    localStorage.setItem('loginTimestamp', Date.now().toString());
    setIsAuthenticated(true);
    scheduleLogout(SESSION_DURATION);
  };

  return (
    <div className="App">
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      {isAuthenticated ? (
        <DataProvisioning />
      ) : (
        <LandingPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
