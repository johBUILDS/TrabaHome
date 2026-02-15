import React from 'react';
import type { NavItemProps } from '../../types/Worker.types.ts';

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick} 
    className={`flex items-center gap-4 px-8 py-3.5 cursor-pointer transition-all border-l-[4px] mb-1
      ${active 
        ? 'bg-[#F0F9F6] text-[#00A651] border-[#024a5e]' 
        : 'text-gray-400 hover:bg-gray-50 border-transparent'}`}
  >
    <div className={`w-5 h-5 flex items-center justify-center ${active ? 'text-[#00A651]' : 'text-gray-400'}`}>
        {icon}
    </div>
    <span className={`font-bold text-sm ${active ? 'text-gray-700' : 'text-gray-500'}`}>{label}</span>
  </div>
);

export default NavItem;