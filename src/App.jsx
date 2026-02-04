import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import WorkerLoginPage from "./pages/WorkerLoginPage";
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
        
        {/* Homeowner Home Route */}
        <Route path="Home" element={<Home />} />

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

        {/* Fallback: Redirect to landing page if path doesn't exist to avoid blank screen */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}