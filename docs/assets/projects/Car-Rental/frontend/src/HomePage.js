import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>Welcome to Felix Car Rental</h1>
      <div className="button-container">
        <button onClick={() => navigate('/rent')}>Rent a Car</button>
        <button onClick={() => navigate('/admin')}>Admin Overview</button>
      </div>
    </div>
  );
};

export default HomePage;