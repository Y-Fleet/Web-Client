import React from 'react';
import Sidebar from '../components/SideMenu';

const Dashboard = () => {
  const inventoryLevel = 100; // Replace with actual inventory level
  const incomingShipments = 5; // Replace with actual incoming shipment count
  const outgoingShipments = 2; // Replace with actual outgoing shipment count
  const currentOrders = 10; // Replace with actual current order count
  
  return (
    <div>
      <Sidebar />
      <h1>Warehouse Dashboard</h1>
      <div>
        <h2>Inventory</h2>
        <p>Current Inventory Level: {inventoryLevel}</p>
      </div>
      <div>
        <h2>Shipments</h2>
        <p>Incoming Shipments: {incomingShipments}</p>
        <p>Outgoing Shipments: {outgoingShipments}</p>
      </div>
      <div>
        <h2>Orders</h2>
        <p>Current Orders: {currentOrders}</p>
      </div>
    </div>
  );
};

export default Dashboard;
