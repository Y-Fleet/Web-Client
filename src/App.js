// import './App.css';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Panel from './pages/Panel'
import PrivateRoute from './components/PrivateRoute'

import { TokenProvider, useToken } from './hooks/MemoryJwtToken';
import { useRefreshToken } from './hooks/UseRefreshToken';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import {Switch} from  'react-router';
import InventoryManagement from './components/DashWarehouse';
import ItemCRUDPage from './components/ItemCRUDPage';
import WarehouseDashboard from './components/WarehouseDashboard';
import FleetPage from './components/fleetDash';
import ShippingItineraryPage from './components/ShippingIte';
import Sidebar from './components/SideMenu';




function App() {
  return (
    <BrowserRouter>
      <TokenProvider>
        <AppRoutes />
      </TokenProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  useRefreshToken();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Shipping" element={<PrivateRoute />} >
        <Route index element={<ShippingItineraryPage />} />
      </Route>
      <Route path="/Warehouse/:warehouseId" element={<PrivateRoute />} >
        <Route index element={<WarehouseDashboard />} />
      </Route>
      <Route path="/Warehouse" element={<PrivateRoute />} >
        <Route index element={<InventoryManagement />} />
      </Route>
      <Route path="/Inventory" element={<PrivateRoute />} >
        <Route index element={<ItemCRUDPage />} />
      </Route>
      <Route path="/Panel" element={<PrivateRoute />} >
        <Route index element={<FleetPage />} />
      </Route>
    </Routes>
  );
}

export default App;
