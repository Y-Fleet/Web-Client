import React, { useState, useEffect } from 'react';
import '../Style/ShippingItineraryPage.css';
import { useToken } from '../hooks/MemoryJwtToken';
import Sidebar from '../components/SideMenu';

const ShippingItineraryPage = () => {
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const {token} = useToken();
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [shippingItems, setShippingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  useEffect(() => {
    fetchWarehouses();
    fetchItems()
  }, [origin]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/WarehouseDash', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setWarehouses(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setLoading(false);
    }
  };
  
  const fetchItems = async () => {
    setLoading(true);
    if (origin.id != undefined) {
      console.log(origin.id);
      try {
        const response = await fetch(`http://localhost:8080/InfoWarehouse?id=${origin.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        setItems(data.warehouse.inventory);
        console.log(data.warehouse.inventory);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Calculate distance and duration (for demonstration purposes only)
    const distance = Math.floor(Math.random() * 1000) + 1;
    const duration = Math.floor(distance / 60) + 1;
    
    // Update state with results
    setDistance(distance);
    setDuration(duration);
  };

  const handleNewProductChange = (event) => {
    setNewProduct(event.target.value);
  };

  const handleAddProduct = () => {
    if (newProduct !== '') {
      setProducts([...products, newProduct]);
      setNewProduct('');
    }
  };

  const handleOriginChange = (event) => {
    const selectedName = event.target.value;
    const selectedWarehouse = warehouses.find((warehouse) => warehouse.name === selectedName);
    setOrigin(selectedWarehouse);
  };

  const handleAddToShipping = (item) => {
    const quantity = selectedQuantities[item.infoItem.ID] || 1;
  
    if (quantity > 0 && quantity <= item.quantity) {
      setShippingItems((prevShippingItems) => {
        const existingItemIndex = prevShippingItems.findIndex(
          (shippingItem) => shippingItem.infoItem.ID === item.infoItem.ID
        );
  
        if (existingItemIndex !== -1) {
          return prevShippingItems.map((shippingItem, index) => {
            if (index === existingItemIndex) {
              return { ...shippingItem, quantity: shippingItem.quantity + quantity };
            }
            return shippingItem;
          });
        } else {
          return [...prevShippingItems, { ...item, quantity }];
        }
      });
    } else {
      alert('Invalid quantity. Please enter a valid quantity.');
    }
  };
  
  
  
  
  
  

  return (
  <div className="shipping-itinerary-page">
    <Sidebar />
    <form className="itinerary-form" onSubmit={handleSubmit}>
      <h2>Plan Shipping Itinerary</h2>
      <label>
        Origin:
        <select
          name="origin"
          value={origin.name}
          onChange={handleOriginChange}
          required
        >
          <option value="">Select origin warehouse</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.name}>{warehouse.name}</option>
          ))}
        </select>
      </label>
      <label>
        Destination:
        <select name="destination" value={destination} onChange={(event) => setDestination(event.target.value)} required>
          <option value="">Select destination warehouse</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.name}>{warehouse.name}</option>
          ))}
        </select>
      </label>
      <button type="submit">Calculate Distance and Duration</button>
    </form>

    {distance > 0 && duration > 0 && (
      <div className="itinerary-results">
        <h3>Itinerary</h3>
        <p>{origin.name} to {destination}</p>
        <p>Distance: {distance} miles</p>
        <p>Duration: {duration} hours</p>
        
        <div className="items-cards">
  {items && items.map((item, index) => (
    <div key={index} className="item-card">
      <h4>{item.infoItem.name}</h4>
      <p>Quantity: {item.quantity}</p>
      <p>Desc: {item.infoItem.desc}</p>
      <p>Kg: {item.infoItem.kg}</p>
      <input
        type="number"
        min="1"
        max={item.quantity}
        defaultValue="1"
        onChange={(event) => {
          const inputQuantity = parseInt(event.target.value);
          setSelectedQuantities((prevState) => ({
            ...prevState,
            [item.infoItem.ID]: inputQuantity,
          }));
        }}
      />
      <button onClick={() => handleAddToShipping(item)}>Add to Shipping</button>
    </div>
  ))}
</div>


  <div className="shipping-items">
  <h3>Shipping Items</h3>
  {shippingItems.map((item, index) => (
    <div key={index} className="item-card">
      <h4>{item.infoItem.name}</h4>
      <p>Quantity: {item.quantity}</p>
      <p>Desc: {item.infoItem.desc}</p>
      <p>Kg: {item.infoItem.kg}</p>
    </div>
  ))}
</div>

        <ul>
          {products.map((product, index) => (
            <li key={index}>{product}</li>
          ))}
        </ul>
       
        </div>
      )}
    </div>
  );
};

export default ShippingItineraryPage;