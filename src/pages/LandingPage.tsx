// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white rounded-[40px] shadow-sm p-12 text-center border border-gray-100">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/assets/Logo.png"
              alt="TrabaHome"
              className="h-12 w-auto mb-4"
            />
            <p className="text-[#0B3B68] text-lg mt-1 opacity-80 max-w-md">
              Connect skilled workers with homeowners who need quality service
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 my-8 w-full"></div>

          {/* Role Selection Text */}
          <h2 className="text-2xl font-bold text-[#0B3B68] mb-10">
            What brings you here?
          </h2>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Homeowner Card */}
            <div
              className="p-8 border-2 border-gray-100 rounded-3xl cursor-pointer transition-all duration-300 hover:border-[#00AF91] hover:shadow-md group"
              onClick={() => navigate("/login")}
            >
              <div className="mb-4">
                <div className="w-16 h-16 bg-[#F0F9F6] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-[#00AF91]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v7a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-7-4m0 0l-2-3m2 3v7a1 1 0 001 1h12a1 1 0 001-1v-7m0 0l2-3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0B3B68] mb-2 group-hover:text-[#00AF91]">
                I'm a Homeowner
              </h3>
              <p className="text-gray-500 text-xs mb-4">
                Find trusted workers to handle your home projects
              </p>
              <div className="inline-block px-6 py-2.5 bg-[#0B3B68] text-white text-sm font-bold rounded-xl transition-colors">
                Find Workers
              </div>
            </div>

            {/* Worker Card */}
            <div
              className="p-8 border-2 border-gray-100 rounded-3xl cursor-pointer transition-all duration-300 hover:border-[#00AF91] hover:shadow-md group"
              onClick={() => navigate("/worker-signup")}
            >
              <div className="mb-4">
                <div className="w-16 h-16 bg-[#F0F9F6] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-[#00AF91]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0B3B68] mb-2 group-hover:text-[#00AF91]">
                I'm a Worker
              </h3>
              <p className="text-gray-500 text-xs mb-4">
                Get hired for jobs and grow your business
              </p>
              <div className="inline-block px-6 py-2.5 bg-[#EEEEEE] text-[#0B3B68] text-sm font-bold rounded-xl hover:bg-[#0B3B68] hover:text-white transition-colors">
                Find Work
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-gray-400 text-[10px] font-semibold mt-10 uppercase tracking-wider">
            Building better communities together
          </p>
        </div>
      </div>
    </div>
  );
}

