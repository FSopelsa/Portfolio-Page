import React, { useEffect, useState } from 'react';
import './RentedCarsOverview.css';

const RentedCarsOverview = () => {
  const [rentedCars, setRentedCars] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRentedCars = async () => {
      try {
        const response = await fetch('/api/rented-cars');
        if (!response.ok) {
          throw new Error('Failed to fetch rented cars');
        }
        const data = await response.json();
        setRentedCars(data);
        const revenue = data.reduce((acc, car) => acc + car.revenue, 0);
        setTotalRevenue(revenue);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRentedCars();
  }, []);

  return (
    <div className="rented-cars-overview">
      <h2>Rented Cars Overview</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Driver Name</th>
            <th>Car</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {rentedCars.map((car) => (
            <tr key={car.id}>
              <td>{car.driverName}</td>
              <td>{car.car}</td>
              <td>{car.fromDate}</td>
              <td>{car.toDate}</td>
              <td>{car.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Revenue: {totalRevenue} SEK</p>
    </div>
  );
};

export default RentedCarsOverview;