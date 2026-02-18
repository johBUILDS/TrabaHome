import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Homeowner Pages
import LandingPage from "./pages/LandingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import Home from "./pages/Home.tsx";
import SearchResult from "./pages/SearchResult.tsx"; 
import WorkerList from "./pages/WorkerList.tsx";      
import FullMap from "./pages/FullMap.tsx";            
import WorkerProfile from "./pages/WorkerProfile.tsx";
import ViewRequests from "./pages/ViewRequests.tsx";

// Worker Pages
import WorkerLoginPage from "./workerpages/WorkerLoginPage.tsx";
import HomeWorker from "./workerpages/HomeWorker.tsx";
import WorkersJobs from "./workerpages/WorkersJobs.tsx"; 
import WorkerOwnProfile from "./workerpages/WorkerOwnProfile.tsx"; 
import WorkerSignup from "./workerpages/WorkerSignup.tsx";
import SubmissionSuccess from "./pages/SubmissionSuccess.tsx"
import GuestOnlyRoute from "./components/auth/GuestOnlyRoute.jsx";
import RequireAuth from "./components/auth/RequireAuth.jsx";
import HomeownerGuestOnlyRoute from "./components/auth/HomeownerGuestOnlyRoute.jsx";
import RequireHomeownerAuth from "./components/auth/RequireHomeownerAuth.jsx";

// Admin Pages (Aligned with your actual file names in the sidebar)
import AdminDashboard from "./adminPages/Admin-Dashboard.jsx"; // Added the dash
import AdminHomeowners from "./adminPages/Admin-Homeowners.jsx";
import AdminWorkers from "./adminPages/Admin-Workers.jsx";
import AdminRequest from "./adminPages/Admin-Request.jsx";
import AdminSmslogs from "./adminPages/Admin-Smslogs.jsx";

// CRITICAL: Commented out because Admin-Profile.jsx is missing in your screenshot
// import AdminProfile from "./Admin Pages/Admin-Profile"; 

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Homeowner Auth Routes */}
        <Route element={<HomeownerGuestOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route element={<GuestOnlyRoute />}>
          <Route path="/worker-login" element={<WorkerLoginPage />} />
          <Route path="/worker-signup" element={<WorkerSignup />} />
        </Route>

        {/* Homeowner Routes */}
        <Route element={<RequireHomeownerAuth />}>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchResult />} /> 
          <Route path="/list" element={<WorkerList />} />      
          <Route path="/map" element={<FullMap />} />          
          <Route path="/profile/:id" element={<WorkerProfile />} />
          <Route path="/my-requests" element={<ViewRequests />} />
        </Route>

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

