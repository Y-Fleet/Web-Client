import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToken } from '../hooks/MemoryJwtToken';
import '../Style/WarehouseDashboard.css';
import Sidebar from '../components/SideMenu';

const WarehouseDashboard = () => {
  const [warehouse, setWarehouse] = useState(null);
  const { warehouseId } = useParams();
  const { token } = useToken();
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [selectedAddItem, setSelectedAddItem] = useState(null);
  const [items, setItems] = useState([]);
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStock, setNewStock] = useState('');

  // Fetch data for warehouse
  useEffect(() => {
    const fetchWarehouse = async () => {
      const response = await fetch(`http://localhost:8080/InfoWarehouse?id=${warehouseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setWarehouse(data.warehouse);
    };

    const fetchItems = async () => {
      const response = await fetch(`http://localhost:8080/GetItem'`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setItems(data.items);
    };
    fetchItems();
    fetchWarehouse();
  }, []);

  const handleAddItemClick = () => {
    setAddItemModalOpen(true);
  };

  const handleAddItemClose = () => {
    setAddItemModalOpen(false);
  };

  const handleAddItemChange = (event) => {
    const { name, value } = event.target;
    setSelectedAddItem({
      ...selectedAddItem,
      [name]: value,
    });
  };


  const handleAddStockSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:8080/InfoWarehouse/${warehouseId}/addStock`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id: selectedItem.itemId, quantity: parseInt(newStock) }),
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    setSelectedItem(prevState => ({
        ...
        prevState,
        quantity: data.item.quantity
        }));
        setNewStock('');
        setAddStockModalOpen(false);
        };
  

  const handleAddItemSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:8080/InfoWarehouse/${warehouseId}/addItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ item_id: selectedAddItem.itemId, quantity: parseInt(selectedAddItem.quantity) }),
    });

    const data = await response.json();
    setWarehouse(prevState => {
      const updatedInventory = prevState.inventory.map(item =>
        item.itemId === data.item.itemId ? data.item : item
      );
      return {
        ...prevState,
        inventory: updatedInventory,
      };
    });

    setSelectedAddItem(null);
    setAddItemModalOpen(false);
  };

  const handleAddStockClick = (item) => {
    setSelectedItem(item);
    setNewStock('');
    setAddStockModalOpen(true);
  };

  const handleAddStockClose = () => {
    setSelectedItem(null);
    setNewStock('');
    setAddStockModalOpen(false);
  };

  const handleNewStockChange = (event) => {
    setNewStock(event.target.value);
  };

  if (!warehouse) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container">
      <Sidebar />
      <h1 className="heading">{warehouse.name}</h1>
      <p className="address">{warehouse.address}</p>
      <p>{warehouse.latitude}, {warehouse.longitude}></p>
  <button onClick={handleAddItemClick}>Add Item</button>
  {addItemModalOpen && (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleAddItemSubmit}>
          <label>
            Select Item:
            <select
              className="input"
              name="itemId"
              value={selectedAddItem?.itemId || ''}
              onChange={handleAddItemChange}
            >
              <option value="">Select an item</option>
              {items.map(item => (
                <option key={item.itemId} value={item.itemId}>
                  {item.name} - {item.desc}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={selectedAddItem?.quantity || ''}
              onChange={handleAddItemChange}
            />
          </label>
          <br />
          <button type="submit">Add Item</button>
          <button onClick={handleAddItemClose}>Close</button>
        </form>
      </div>
    </div>
  )}
  <div className="inventory">
    <h2>Inventory</h2>
    <ul>
      {warehouse.inventory.map(item => (
        <li key={item.itemId}>
          <span>{item.name} - {item.desc} ({item.quantity} {item.kg}kg)</span>
          <button onClick={() => handleAddStockClick(item)}>Add Stock</button>
        </li>
      ))}
    </ul>
  </div>
  {addStockModalOpen && (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleAddStockSubmit}>
          <h3>Add Stock for {selectedItem?.name}</h3>
          <label>
            New Stock:
            <input
              type="number"
              value={newStock}
              onChange={handleNewStockChange}
            />
          </label>
          <br />
          <button type="submit">Add Stock</button>
          <button onClick={handleAddStockClose}>Close</button>
        </form>
      </div>
    </div>
  )}
</div>

);
};

export default WarehouseDashboard;