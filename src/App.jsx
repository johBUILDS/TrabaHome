import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Homeowner Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import SearchResult from "./pages/SearchResult"; 
import WorkerList from "./pages/WorkerList";      
import FullMap from "./pages/FullMap";            
import WorkerProfile from "./pages/WorkerProfile";
import ViewRequests from "./pages/ViewRequests";

// Worker Pages
import WorkerLoginPage from "./pages/WorkerLoginPage";
import HomeWorker from "./workerpages/HomeWorker";
import WorkersJobs from "./workerpages/WorkersJobs"; 
import WorkerOwnProfile from "./workerpages/WorkerOwnProfile"; 
import WorkerSignup from "./workerpages/WorkerSignup";
import SubmissionSuccess from "./pages/SubmissionSuccess"
import GuestOnlyRoute from "./components/auth/GuestOnlyRoute";
import RequireAuth from "./components/auth/RequireAuth";

// Admin Pages (Aligned with your actual file names in the sidebar)
import AdminDashboard from "./adminPages/Admin-Dashboard"; // Added the dash
import AdminHomeowners from "./adminPages/Admin-Homeowners";
import AdminWorkers from "./adminPages/Admin-Workers";
import AdminRequest from "./adminPages/Admin-Request";
import AdminSmslogs from "./adminPages/Admin-Smslogs";

// CRITICAL: Commented out because Admin-Profile.jsx is missing in your screenshot
// import AdminProfile from "./Admin Pages/Admin-Profile"; 

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<GuestOnlyRoute />}>
          <Route path="/worker-login" element={<WorkerLoginPage />} />
          <Route path="/worker-signup" element={<WorkerSignup />} />
        </Route>

        {/* Homeowner Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchResult />} /> 
        <Route path="/list" element={<WorkerList />} />      
        <Route path="/map" element={<FullMap />} />          
        <Route path="/profile/:id" element={<WorkerProfile />} />
        <Route path="/my-requests" element={<ViewRequests />} />

        {/* Worker Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/home-worker" element={<HomeWorker />} />
          <Route path="/HomeWorker" element={<Navigate to="/home-worker" replace />} />
          <Route path="/worker-jobs" element={<WorkersJobs />} />
          <Route path="/worker-own-profile" element={<WorkerOwnProfile />} />
          <Route path="/worker-profile" element={<Navigate to="/worker-own-profile" replace />} />
        </Route>
        <Route path="/submission-success" element={<SubmissionSuccess />} />


        {/* Admin Routes */}        
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-homeowners" element={<AdminHomeowners />} />
        <Route path="/admin-workers" element={<AdminWorkers />} />
        <Route path="/admin-requests" element={<AdminRequest />} />
        <Route path="/admin-smslogs" element={<AdminSmslogs />} />
        
        {/* Commented out until Admin-Profile.jsx is created */}
        {/* <Route path="/admin-profile" element={<AdminProfile />} /> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
