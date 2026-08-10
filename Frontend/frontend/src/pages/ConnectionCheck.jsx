import { useEffect, useState } from 'react';

function ConnectionCheck() {
  const [backendStatus, setBackendStatus] = useState('Checking connection...');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/test')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setBackendStatus(data.message);
      })
      .catch((error) => {
        console.error("Connection Error:", error);
        setBackendStatus("Failed to connect.");
      });
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '20px' }}>
      <h2>API Health Check</h2>
      <p>Django Status: <strong>{backendStatus}</strong></p>
    </div>
  );
}

export default ConnectionCheck;