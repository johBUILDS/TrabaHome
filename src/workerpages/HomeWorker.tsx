import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  BriefcaseIcon,
  HammerIcon,
  LayoutDashboardIcon,
  UserIcon
} from 'lucide-react';
import NavItem from '../components/requestpages/NavItem.tsx';
import RequestCard from '../components/requestpages/RequestCard.tsx';
import RequestDetailsModal from '../components/requestpages/RequestsModal.tsx';
import { mockRequests, statsData } from '../constants/mockData.tsx';
import type { Request } from '../types/Worker.types.ts';
import { clearWorkerSession, getWorkerSession } from '../utils/workerAuth.ts';

const WORKER_DASHBOARD_ROUTE = '/home-worker';
const WORKER_PROFILE_ROUTE = '/worker-own-profile';

const HomeWorker: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workerSession = getWorkerSession();
  const workerName = workerSession?.worker?.firstName
    ? String(workerSession.worker.firstName)
    : 'Worker';

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const handleViewDetails = (request: Request): void => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  const handleLogout = (): void => {
    clearWorkerSession();
    navigate('/worker-login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans flex flex-col items-center overflow-x-hidden relative">
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full px-6 py-4 flex justify-between items-center">
          <div className="w-[260px] flex items-center cursor-pointer" onClick={() => navigate(WORKER_DASHBOARD_ROUTE)}>
            <img
              src="/assets/Logo.png"
              alt="TrabaHome"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex-1 flex justify-end">
            <button
              className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all relative"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1280px] flex gap-6 items-start p-6">
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

          <div className="p-5 mt-auto border-t border-gray-50">
            <div
              onClick={() => navigate(WORKER_PROFILE_ROUTE)}
              className="bg-white border border-gray-100 rounded-xl p-3 mb-3 flex items-center gap-3 shadow-sm cursor-pointer hover:border-[#00A651] transition-all group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden shrink-0">
                  <img src="https://i.pravatar.cc/150?u=berto" alt="Worker" className="w-full h-full object-cover" />
                </div>
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
              onClick={handleLogout}
              className="w-full py-2 border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex justify-between items-start mb-8 px-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome, {workerName}</h1>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-[#00A651] rounded-full relative flex items-center px-0.5">
                  <div className="w-3 h-3 bg-white rounded-full ml-auto shadow-sm" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  Status: <span className="text-[#00A651] font-bold">Online</span>
                </span>
              </div>
            </div>
          </header>

          <section className="mb-10">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
              Performance Overview
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {statsData.map((stat, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-sm text-center border border-gray-50 flex flex-col items-center">
                  <div className="mb-2">{stat.icon}</div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
              Pending Request
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {mockRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      <RequestDetailsModal
        isOpen={showModal}
        onClose={handleCloseModal}
        request={selectedRequest}
      />
    </div>
  );
};

export default HomeWorker;
