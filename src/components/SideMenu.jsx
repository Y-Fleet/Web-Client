import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Style/Sidebar.css';

const Sidebar = () => {
  const [visible, setVisible] = useState(false);

  const toggleSidebar = () => {
    setVisible(!visible);
  };

  return (
    <div className={`sidebar ${visible ? 'visible' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <ul className="nav-list">
        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/Warehouse">Warehouse</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/Inventory">Inventory</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/shipping">Shipping</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/Fleet">Fleet</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/SeeShipping">SeeShipping</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/Drivers">Drivers</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/Login">Login</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
