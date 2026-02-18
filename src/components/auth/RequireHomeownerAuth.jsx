import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isHomeownerAuthenticated } from '../../utils/homeownerAuth.ts';

export default function RequireHomeownerAuth() {
  const location = useLocation();

  if (!isHomeownerAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
