import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import WorkerLoginPage from "./pages/WorkerLoginPage";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import LoginOtp from "./pages/LoginOtp";
import Home from "./pages/Home";
import SearchResult from "./pages/SearchResult"; 
import WorkerList from "./pages/WorkerList";      
import FullMap from "./pages/FullMap";            
import WorkerProfile from "./pages/WorkerProfile";
import ViewRequests from "./pages/ViewRequests";

// Worker Pages - Ensure folder name "workerpages" matches your file tree exactly
import HomeWorker from "./workerpages/HomeWorker";
import WorkersJobs from "./workerpages/WorkersJobs"; 
import WorkerOwnProfile from "./workerpages/WorkerOwnProfile"; 
import WorkerSignup from "./workerpages/WorkerSignup";

// Admin Pages
import AdminDashboard from "./Admin Pages/Admin-Dashboard";
import AdminHomeowners from "./Admin Pages/Admin-Homeowners";
import AdminWorkers from "./Admin Pages/Admin-Workers";
import AdminRequest from "./Admin Pages/Admin-Request";
import AdminSmslogs from "./Admin Pages/Admin-Smslogs";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page - Role Selection */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Homeowner Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Worker Auth Routes */}
        <Route path="/worker-login" element={<WorkerLoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/homeowner" element={<ResetPassword forcedRole="homeowner" />} />
        <Route path="/reset-password/worker" element={<ResetPassword forcedRole="worker" />} />
        <Route path="/verify-email/homeowner" element={<VerifyEmail forcedRole="homeowner" />} />
        <Route path="/verify-email/worker" element={<VerifyEmail forcedRole="worker" />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login-otp/homeowner" element={<LoginOtp forcedRole="homeowner" />} />
        <Route path="/login-otp/worker" element={<LoginOtp forcedRole="worker" />} />
        <Route path="/login-otp" element={<LoginOtp />} />
        
        {/* Homeowner Home Route */}
        <Route path="/home" element={<Home />} />

        {/* Worker Dashboard/Home Route */}
        <Route path="/HomeWorker" element={<HomeWorker />} />
        {/* Worker Signup Route */}
        <Route path="/worker-signup" element={<WorkerSignup />} />

        {/* Route for WorkersJobs */}
        <Route path="/worker-jobs" element={<WorkersJobs />} />

        {/* Route for Worker's own Profile */}
        <Route path="/worker-profile" element={<WorkerOwnProfile />} />

        {/* Search & Navigation Routes */}
        <Route path="/search" element={<SearchResult />} /> 
        <Route path="/list" element={<WorkerList />} />      
        <Route path="/map" element={<FullMap />} />          
        
        {/* Profile Route (Homeowner viewing a worker) */}
        <Route path="/profile/:id" element={<WorkerProfile />} />

        {/* Requests Route */}
        <Route path="/my-requests" element={<ViewRequests />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-homeowners" element={<AdminHomeowners />} />
        <Route path="/admin-workers" element={<AdminWorkers />} />
        <Route path="/admin-requests" element={<AdminRequest />} />
        <Route path="/admin-smslogs" element={<AdminSmslogs />} />

        {/* Fallback: Redirect to landing page if path doesn't exist to avoid blank screen */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
