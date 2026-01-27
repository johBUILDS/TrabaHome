import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import SearchResult from "./pages/SearchResult"; 
import WorkerList from "./pages/WorkerList";      
import FullMap from "./pages/FullMap";            
import WorkerProfile from "./pages/WorkerProfile";
import ViewRequests from "./pages/ViewRequests";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<Home />} />
        
        {/* Search & Navigation Routes */}
        <Route path="/search" element={<SearchResult />} /> 
        <Route path="/list" element={<WorkerList />} />      
        <Route path="/map" element={<FullMap />} />          
        
        {/* Profile Route */}
        <Route path="/profile/:id" element={<WorkerProfile />} />

        {/* 2. Add the Requests Route */}
        <Route path="/my-requests" element={<ViewRequests />} />
      </Routes>
    </Router>
  );
}