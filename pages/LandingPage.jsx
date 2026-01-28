import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B3B68] to-[#154875] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00AF91]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-[#00AF91]">Traba</span>
              <span className="text-[#0B3B68]">Home</span>
            </h1>
            <p className="text-gray-600 text-lg mt-3">
              Connect skilled workers with homeowners who need quality service
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-8"></div>

          {/* Role Selection Text */}
          <h2 className="text-2xl font-bold text-[#0B3B68] mb-10">
            What brings you here?
          </h2>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Homeowner Card */}
            <div
              className="p-8 border-2 border-gray-200 rounded-2xl cursor-pointer transition-all duration-300 hover:border-[#00AF91] hover:shadow-lg hover:scale-105 group"
              onClick={() => navigate("/login")}
            >
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00AF91] to-[#00BFA5] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-3m0 0l7-4 7 4M5 9v7a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-7-4m0 0l-2-3m2 3v7a1 1 0 001 1h12a1 1 0 001-1v-7m0 0l2-3"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0B3B68] mb-2 group-hover:text-[#00AF91]">
                I'm a Homeowner
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Find trusted workers to handle your home projects
              </p>
              <div className="inline-block px-6 py-2 bg-[#00AF91] text-white font-semibold rounded-lg group-hover:bg-[#0B3B68] transition-colors">
                Find Workers
              </div>
            </div>

            {/* Worker Card */}
            <div
              className="p-8 border-2 border-gray-200 rounded-2xl cursor-pointer transition-all duration-300 hover:border-[#FFD700] hover:shadow-lg hover:scale-105 group"
              onClick={() => navigate("/HomeWorker")}
            >
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0B3B68] mb-2 group-hover:text-[#FFD700]">
                I'm a Worker
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Get hired for jobs and grow your business
              </p>
              <div className="inline-block px-6 py-2 bg-[#FFD700] text-[#0B3B68] font-semibold rounded-lg group-hover:bg-[#0B3B68] group-hover:text-[#FFD700] transition-colors">
                Find Work
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-gray-500 text-sm mt-10">
            Join thousands of homeowners and workers building better communities
          </p>
        </div>
      </div>
    </div>
  );
}
