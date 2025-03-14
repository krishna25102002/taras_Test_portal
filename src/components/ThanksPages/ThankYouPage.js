import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const styles = {
    thankYouPage: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      textAlign: 'center',
    },
    thankYouMessage: {
      backgroundColor: '#fff',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
      color: '#007bff',
      marginBottom: '20px',
    },
    paragraph: {
      color: '#6c757d',
      marginBottom: '30px',
    },
    button: {
      fontSize: '18px',
      padding: '10px 30px',
    },
  };

  return (
    <div style={styles.thankYouPage}>
      <div style={styles.thankYouMessage}>
        <h1 style={styles.heading}>Thank You for Attending the Test!</h1>
        <p style={styles.paragraph}>
          We appreciate your time and effort. We will get back to you with the results soon.
        </p>
        <Button style={styles.button} variant="primary" onClick={handleGoHome}>
          Go Back to Home
        </Button>
      </div>
    </div>
  );
};

export default ThankYouPage;
