import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useToken } from '../hooks/MemoryJwtToken';

function PrivateRoute() {
  const { token } = useToken();
  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/Login" />;
  }
}
export default PrivateRoute;
