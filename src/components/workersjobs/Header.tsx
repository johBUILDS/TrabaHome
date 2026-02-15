import React from 'react';
import { BellIcon } from 'lucide-react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1280px] mx-auto w-full px-6 py-4 flex justify-between items-center">
        {/* Logo container width matches sidebar width for alignment */}
        <div className="w-[260px] flex items-center cursor-pointer" onClick={onLogoClick}>
          <img 
            src="/assets/Logo.png"
            alt="TrabaHome"
            className="h-8 w-auto"
          />
        </div>
        
        <div className="flex-1 flex justify-end">
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all relative">
            <BellIcon className="w-6 h-6" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;