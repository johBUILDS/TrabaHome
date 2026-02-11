import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon } from "../Icons";

export default function Navbar() {
  const navigate = useNavigate();
  
  // States driven by data
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Check for user data on mount
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const token = localStorage.getItem("userToken"); // Or any key you use for auth

    if (savedName) {
      setUserName(savedName);
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <div className="w-full bg-[#F9F6F2] border-b border-gray-200/50 flex-shrink-0 sticky top-0 z-40 backdrop-blur-md">
      <header className="flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <img 
          src="/assets/Logo.png"
          alt="TrabaHome"
          className="h-8 w-auto cursor-pointer hover:opacity-80 transition-all active:scale-95"
          onClick={() => navigate('/home')}
        />

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/login')}
                className="text-[#0B3B68] font-bold text-[15px] hover:opacity-70 transition-opacity"
              >
                Sign up / Log in
              </button>
              <button className="border border-[#0B3B68] text-[#0B3B68] px-5 py-2 rounded-xl font-bold text-[15px] hover:bg-[#0B3B68] hover:text-white transition-all">
                Become a Worker
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 relative">
              {/* Notification Bell */}
              <div className="p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer active:scale-90 group">
                <BellIcon className="w-6 h-6 text-[#0B3B68] group-hover:rotate-12 transition-transform" />
              </div>

              {/* Profile Avatar & Dropdown */}
              <div className="relative">
                <div 
                  className="w-9 h-9 rounded-full overflow-hidden cursor-pointer border border-gray-200 shadow-sm hover:ring-2 hover:ring-[#0B3B68]/10 transition-all"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {/* Dynamic Avatar using user initials */}
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} 
                    alt="User" 
                    className="w-full h-full object-cover bg-pink-100"
                  />
                </div>

                {showDropdown && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                    <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} 
                        className="w-5 h-5 rounded-full" 
                        alt="" 
                      />
                      <span className="font-bold text-[#0B3B68] text-[13px] truncate">
                        {userName}
                      </span>
                    </div>
                    
                    <div className="flex flex-col text-gray-600">
                      <button className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors">
                        My Profile
                      </button>
                      <button className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors border-b border-gray-100">
                        My Requests
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-3 text-[13px] font-medium hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}