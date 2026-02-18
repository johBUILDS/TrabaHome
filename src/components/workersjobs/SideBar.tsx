import React from 'react';
import { BriefcaseIcon, HammerIcon, LayoutDashboardIcon, UserIcon } from 'lucide-react';
import NavItem from './NavItem.tsx';

const WORKER_DASHBOARD_ROUTE = '/home-worker';
const WORKER_PROFILE_ROUTE = '/worker-own-profile';

interface SidebarProps {
  location: {
    pathname: string;
  };
  navigate: (path: string) => void;
  workerName?: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ location, navigate, workerName = 'Worker', onLogout }) => {
  return (
    <aside className="w-[260px] sticky top-[88px] h-[calc(100vh-112px)] bg-white flex flex-col rounded-2xl shadow-sm border border-gray-100 shrink-0">
      <div className="p-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Menu</p>
      </div>

      <nav className="flex-1">
        <NavItem
          icon={<LayoutDashboardIcon className="w-5 h-5" />}
          label="Dashboard"
          active={location.pathname === WORKER_DASHBOARD_ROUTE}
          onClick={() => navigate(WORKER_DASHBOARD_ROUTE)}
        />
        <NavItem
          icon={<BriefcaseIcon className="w-5 h-5" />}
          label="Jobs"
          active={location.pathname === '/worker-jobs'}
          onClick={() => navigate('/worker-jobs')}
        />
        <NavItem
          icon={<UserIcon className="w-5 h-5" />}
          label="Profile"
          active={location.pathname === WORKER_PROFILE_ROUTE}
          onClick={() => navigate(WORKER_PROFILE_ROUTE)}
        />
      </nav>

      <div className="p-5 mt-auto border-t border-gray-50 text-left">
        <div
          onClick={() => navigate(WORKER_PROFILE_ROUTE)}
          className="bg-white border border-gray-100 rounded-xl p-3 mb-3 flex items-center gap-3 shadow-sm cursor-pointer hover:border-[#00A651] transition-all group"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden shrink-0 relative">
            <img src="https://i.pravatar.cc/150?u=berto" alt="Worker" className="w-full h-full object-cover" />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#0085FF] border-2 border-white rounded-full flex items-center justify-center">
              <span className="text-[7px] text-white font-bold">OK</span>
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#00A651]">{workerName}</p>
            <span className="text-[8px] bg-[#EBF7F3] text-[#00A651] px-1.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
              <HammerIcon className="w-2 h-2" /> Carpenter
            </span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full py-2 border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
