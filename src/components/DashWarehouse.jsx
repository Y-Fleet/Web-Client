import React, { useState, useEffect } from 'react';
import { useToken } from '../hooks/MemoryJwtToken';
import { useNavigate } from 'react-router-dom';
import '../Style/DashWarehouse.css';
import Sidebar from '../components/SideMenu';

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const { token } = useToken();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();


 const navigateToWarehouseManagement = (warehouseId) => {
  navigate(`/Warehouse/${warehouseId}`);
};

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch('http://localhost:8080/WarehouseDash', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        const data = await response.json();
        setWarehouses(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };
    fetchWarehouses();
  }, []);

  const handleWarehouseSelect = (id) => {
    const warehouse = warehouses.find((warehouse) => warehouse.id === id);
    setSelectedWarehouse(warehouse);
  };

  

  return (
    <div className="warehouse-list-wrapper">
      <Sidebar />
      <div className="warehouse-list">
        <h2>List of Warehouses in France</h2>
        <button onClick={handleShowCreateForm}>Create Warehouse</button>
        <div className="warehouse-container">
          <div className="warehouse-card-container">
            {warehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className={`warehouse-card ${
                  selectedWarehouse?.id === warehouse.id ? 'selected' : ''
                }`}
                onClick={() => handleWarehouseSelect(warehouse.id)}
              >
                <h3>{warehouse.name}</h3>
                <p>{warehouse.address}</p>
              </div>
            ))}
          </div>
          {selectedWarehouse && (
            <div className="warehouse-details">
              <h2>{selectedWarehouse.name}</h2>
              <p>{selectedWarehouse.address}</p>
              <p>
                Latitude: {selectedWarehouse.latitude}, Longitude:{' '}
                {selectedWarehouse.longitude}
              </p>
              <p>Upcoming Delivery</p>
              <p>Upcoming Sending</p>
              <button onClick={() => navigateToWarehouseManagement(selectedWarehouse.id)}>
                Go to the warehouse management page
              </button>

              {selectedWarehouse.inventory && selectedWarehouse.inventory.length > 0 ? (
                <div className="warehouse-inventory">
                  <h3>Inventory</h3>
                  <ul>
                    {selectedWarehouse.inventory.map((item, index) => (
                      <li key={index}>
                        {item.itemId}: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No inventory data available.</p>
              )}
            </div>
          )}
        </div>
      </div>
      {showCreateForm && (
        <div className="create-warehouse-overlay">
          <CreateWarehouseForm onClose={handleCloseCreateForm} />
        </div>
      )}
    </div>
  );
};

const CreateWarehouseForm = ({ onClose }) => {
  return (
    <div className="create-warehouse-form">
      <h2>Create Warehouse</h2>
      
      <button className="close-button" onClick={onClose}>Close</button>
      <form>
        <input placeholder="Name" type="text" id="name" name="name" required />

        <input  placeholder="Street Address" type="text" id="street" name="street" required />

        <input placeholder="City" type="text" id="city" name="city" required />

        <input placeholder="Zip Code" type="text" id="zip" name="zip" required />
        <button type="submit">Create Warehouse</button>
      </form>
    </div>
  );
};



export default WarehouseList;
