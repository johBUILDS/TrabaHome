import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0B3B68] h-48 mt-0 relative overflow-hidden flex items-center justify-center">
      <p className="text-white/60 text-sm">© 2026 TrabaHome. All rights reserved.</p>
      
      {/* Decorative Blobs from original design */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00AF91] opacity-20 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#009FC7] opacity-20 rounded-full blur-2xl"></div>
    </footer>
  );
}