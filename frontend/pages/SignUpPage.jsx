import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    agreed: false
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    // Logic for registration
    navigate("/search");
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F5F0] flex items-center justify-center p-4 font-sans">
      {/* Main Card */}
      <div className="bg-white w-full max-w-[420px] rounded-[40px] shadow-sm p-10 flex flex-col items-center relative">
        
        {/* Back Navigation Arrow */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-10 left-10 text-[#219EBC] hover:opacity-70 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-4 mt-2">
          {/* Logo Icon and Text */}
          <div className="flex flex-col items-center">
             <div className="text-[#00BFA5] mb-[-8px]">
                <svg width="45" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
             </div>
             <h1 className="text-[32px] font-bold tracking-tight">
                <span className="text-[#00BFA5]">Traba</span>
                <span className="text-[#004A8C]">home</span>
             </h1>
          </div>
        </div>

        {/* Header Text */}
        <h2 className="text-[18px] font-bold text-[#004A8C] text-center leading-tight mb-1">
          Get Reliable Help for Your Home
        </h2>
        <p className="text-[#7D8A95] text-[10px] mb-8 text-center max-w-[280px] leading-normal">
          Find trusted local workers, book services easily, and keep your home well-maintained.
        </p>

        {/* Form Fields */}
        <form onSubmit={handleSignUp} className="w-full space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-gray-800 mb-1 ml-1">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-[#EBEBEB] border-none rounded-xl px-4 py-3 text-[14px] focus:ring-2 focus:ring-[#004A8C] outline-none placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-800 mb-1 ml-1">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full bg-[#EBEBEB] border-none rounded-xl px-4 py-3 text-[14px] focus:ring-2 focus:ring-[#004A8C] outline-none placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-800 mb-1 ml-1">Mobile Number</label>
            <input
              type="tel"
              placeholder="+639516452478"
              className="w-full bg-[#EBEBEB] border-none rounded-xl px-4 py-3 text-[14px] focus:ring-2 focus:ring-[#004A8C] outline-none placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-800 mb-1 ml-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#EBEBEB] border-none rounded-xl px-4 py-3 text-[14px] focus:ring-2 focus:ring-[#004A8C] outline-none placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-800 mb-1 ml-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-[#EBEBEB] border-none rounded-xl px-4 py-3 text-[14px] focus:ring-2 focus:ring-[#004A8C] outline-none placeholder-gray-400"
              required
            />
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-center gap-2 px-1 py-1">
            <input 
              type="checkbox" 
              id="terms" 
              className="w-4 h-4 rounded border-gray-300 text-[#004A8C] focus:ring-[#004A8C]" 
              required
            />
            <label htmlFor="terms" className="text-[11px] text-gray-700">
              I agree to the <span className="font-bold">Terms & Conditions</span>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full bg-[#004A8C] text-white py-3.5 rounded-xl font-bold text-[16px] hover:bg-[#003666] transition-all active:scale-[0.98] mt-2 shadow-sm"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect to Sign In */}
        <div className="mt-6 text-[12px] text-gray-500">
          Already have an account?{" "}
          <button 
            onClick={() => navigate('/login')} 
            className="font-bold text-gray-900 hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}