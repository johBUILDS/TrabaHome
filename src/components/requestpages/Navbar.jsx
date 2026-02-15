import React from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon } from "../../Icons";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto bg-transparent">
      <img 
        src="/assets/Logo.png"
        alt="TrabaHome"
        className="h-8 w-auto cursor-pointer"
        onClick={() => navigate("/home")}
      />
      <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
        <BellIcon className="w-6 h-6 text-gray-700" />
      </button>
    </header>
  );
}