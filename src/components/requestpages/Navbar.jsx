import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon } from "../../Icons";
import { homeownerAPI } from "../../services/HomeownerApi.ts";
import { clearHomeownerSession } from "../../utils/homeownerAuth.ts";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      // Best-effort server logout; even if it fails, clear local session
      await homeownerAPI.logout().catch(() => {});
    } finally {
      clearHomeownerSession();
      navigate("/login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto bg-transparent">
      <img 
        src="/assets/Logo.png"
        alt="TrabaHome"
        className="h-8 w-auto cursor-pointer"
        onClick={() => navigate("/home")}
      />
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
          <BellIcon className="w-6 h-6 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-3 py-2 text-sm font-semibold text-white bg-[#0B3B68] rounded-full hover:bg-[#082d50] transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
}
