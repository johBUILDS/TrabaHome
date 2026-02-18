import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isHomeownerAuthenticated } from '../../utils/homeownerAuth.ts';

export default function HomeownerGuestOnlyRoute() {
  if (isHomeownerAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
