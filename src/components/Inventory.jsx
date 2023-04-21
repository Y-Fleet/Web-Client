import React, { useState } from 'react';
import Sidebar from '../components/SideMenu';

const InventoryManagement = () => {
    console.log('Rendering InventoryManagement component');
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', quantity: 10 },
    { id: 2, name: 'Item 2', quantity: 5 },
    { id: 3, name: 'Item 3', quantity: 20 },
  ]);

  const handleAddItem = () => {
    const newItem = { id: items.length + 1, name: 'New Item', quantity: 0 };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
  };

  return (
    <div>
      <h1>Inventory Management</h1>
      <Sidebar />
      <button onClick={handleAddItem}>Add Item</button>
      {items.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
          <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
          <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default InventoryManagement;
