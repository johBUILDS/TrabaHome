import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isWorkerAuthenticated } from '../../utils/workerAuth.ts';

export default function GuestOnlyRoute() {
  if (isWorkerAuthenticated()) {
    return <Navigate to="/home-worker" replace />;
  }

  return <Outlet />;
}
