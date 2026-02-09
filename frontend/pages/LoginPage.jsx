import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center p-6">
      
      {/* Main Container */}
      <div className="w-full max-w-[400px] bg-white rounded-[40px] shadow-sm p-10 flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-1 mb-4">
            {/* Simple SVG Logo implementation to match image */}
            <svg width="40" height="30" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 5L5 20H10V35H20V25H30V35H40V20H45L25 5Z" fill="#00AF91" stroke="#00AF91" strokeWidth="2"/>
                <path d="M15 12.5V5H20V8.75" stroke="#00AF91" strokeWidth="2"/>
            </svg>
            <h1 className="text-3xl font-bold text-[#00AF91]">
              Traba<span className="text-[#00AF91]">Home</span>
            </h1>
          </div>
          
          <h2 className="text-[#0B3B68] text-2xl font-bold text-center">Welcome Back!</h2>
          <p className="text-[#0B3B68] text-[10px] text-center mt-1 opacity-80">
            Sign in to manage your home services and active requests.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full bg-[#EEEEEE] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0B3B68] outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#EEEEEE] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0B3B68] outline-none placeholder:text-gray-400"
            />
            <div className="text-right mt-1">
              <button type="button" className="text-[10px] text-gray-500 font-semibold hover:text-[#0B3B68]">
                Forgot Password?
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] text-center font-bold">{error}</p>}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B3B68] text-white font-bold py-3 rounded-xl mt-4 hover:bg-[#082d50] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-gray-600 font-semibold">
            Don't have an account?{" "}
            <Link to="/signup" className="text-black font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}