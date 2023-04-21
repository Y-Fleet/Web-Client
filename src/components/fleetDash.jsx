import React, { useState, useEffect } from 'react';
import '../Style/FleetPage.css';
import { useToken } from '../hooks/MemoryJwtToken';
import Sidebar from '../components/SideMenu';

const FleetPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const {token} = useToken();
  const [warehouses, setWarehouses] = useState([]);


  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:8080/GetFleet',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data)
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };
  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };
  
  return (
    <div className="fleet-page">
      <Sidebar />
      <div className="vehicle-list">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`vehicle-card${selectedVehicle === vehicle ? ' selected' : ''}`}
            onClick={() => handleVehicleClick(vehicle)}
          >
            <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} />
            <h3>{`${vehicle.make} ${vehicle.model}`}</h3>
            <p>{`${vehicle.year} ${vehicle.license_plate_number}`}</p>
          </div>
        ))}
      </div>
      {selectedVehicle && (
        <div className="vehicle-info">
          <img src={selectedVehicle.imageUrl} alt={`${selectedVehicle.make} ${selectedVehicle.model}`} />
          <h2>{`${selectedVehicle.make} ${selectedVehicle.model}`}</h2>
          <p>{`${selectedVehicle.year} ${selectedVehicle.license_plate_number}`}</p>
          <p>VIN: {selectedVehicle.vehicle_id_number}</p>
          <p>Status: {selectedVehicle.status}</p>
          <h3>Fuel Consumption History</h3>
          {selectedVehicle.fuel_consumption.length > 0 ? (
            <ul>
              {selectedVehicle.fuel_consumption.map((entry, index) => (
                <li key={index}>
<p>Date: {new Date(entry.date.seconds * 1000).toLocaleDateString()}</p>                  <p> Distance Traveled: {entry.distance_traveled} Km</p>
              <p>Fuel Used: {entry.fuel_used} L</p>
              <p>Consumption: {entry.consumption} L per 100Km</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No fuel consumption data available.</p>
      )}
      <h3>Maintenance History</h3>
      {selectedVehicle.maintenance_history.length > 0 ? (
        <ul>
          {selectedVehicle.maintenance_history.map((entry, index) => (
            <li key={index}>
<p>Date: {new Date(entry.date.seconds * 1000).toLocaleDateString()}</p>              <p>Description: {entry.description}</p>
              <p>Cost: ${entry.cost}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No maintenance history available.</p>
      )}
      <h3>Assigned Driver</h3>
      {selectedVehicle.assigned_driver ? (
        <ul>
          <li>
            <p>ID: {selectedVehicle.assigned_driver.id}</p>
            <p>Certifications: {selectedVehicle.assigned_driver.certifications ? selectedVehicle.assigned_driver.certifications.join(', ') : 'None'}</p>          </li>
        </ul>
      ) : (
        <p>No driver assigned.</p>
      )}
    </div>
  )}
</div>

);
};

export default FleetPage;