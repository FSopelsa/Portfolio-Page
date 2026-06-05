import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RentCarForm from './RentCarForm';
import RentedCarsOverview from './RentedCarsOverview';
import HomePage from './HomePage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rent" element={<RentCarForm />} />
        <Route path="/admin" element={<RentedCarsOverview />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;