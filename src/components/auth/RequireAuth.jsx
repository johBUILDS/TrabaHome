import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isWorkerAuthenticated } from '../../utils/workerAuth.ts';

export default function RequireAuth() {
  const location = useLocation();

  if (!isWorkerAuthenticated()) {
    return <Navigate to="/worker-login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
