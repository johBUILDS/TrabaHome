import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Briefcase,
  Hammer,
  LayoutDashboard,
  User
} from 'lucide-react';
import NavItem from '../components/requestpages/NavItem.tsx';
import ProfileHeader from '../components/requestpages/ProfileHeader.tsx';
import AccountVerification from '../components/workersInfo/AccountVerification.tsx';
import BasicInfoSection from '../components/workersInfo/BasicInfoSection.tsx';
import ContactInfoSection from '../components/workersInfo/ContactInfoSection.tsx';
import { initialProfile } from '../constants/profileData.ts';
import type { WorkerProfile } from '../types/Worker.types.ts';
import { clearWorkerSession, getWorkerSession } from '../utils/workerAuth.ts';

const WORKER_DASHBOARD_ROUTE = '/home-worker';
const WORKER_PROFILE_ROUTE = '/worker-own-profile';

const WorkerOwnProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workerSession = getWorkerSession();
  const workerName = workerSession?.worker?.firstName
    ? String(workerSession.worker.firstName)
    : 'Worker';

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<WorkerProfile>(initialProfile);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    setProfile((previousProfile) => ({ ...previousProfile, [name]: value }));
  };

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const nextImages = [...profile.images];
      nextImages[index] = reader.result as string;
      setProfile((previousProfile) => ({ ...previousProfile, images: nextImages }));
    };
    reader.readAsDataURL(file);
  };

  const handleToggleEdit = (): void => {
    setIsEditing((previousState) => !previousState);
  };

  const handleLogout = (): void => {
    clearWorkerSession();
    navigate('/worker-login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans flex flex-col items-center overflow-x-hidden text-left relative">
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full px-6 py-4 flex justify-between items-center">
          <div
            className="w-[260px] flex items-center cursor-pointer"
            onClick={() => navigate(WORKER_DASHBOARD_ROUTE)}
          >
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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Settings</p>
          </div>

          <nav className="flex-1">
            <NavItem
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
              active={location.pathname === WORKER_DASHBOARD_ROUTE}
              onClick={() => navigate(WORKER_DASHBOARD_ROUTE)}
            />
            <NavItem
              icon={<Briefcase className="w-5 h-5" />}
              label="Jobs"
              active={location.pathname === '/worker-jobs'}
              onClick={() => navigate('/worker-jobs')}
            />
            <NavItem
              icon={<User className="w-5 h-5" />}
              label="Profile"
              active={location.pathname === WORKER_PROFILE_ROUTE}
              onClick={() => navigate(WORKER_PROFILE_ROUTE)}
            />
          </nav>

          <div className="p-5 mt-auto border-t border-gray-50">
            <div className="bg-white border border-gray-100 rounded-xl p-3 mb-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden shrink-0 relative">
                <img src="https://i.pravatar.cc/150?u=berto" alt="Worker" className="w-full h-full object-cover" />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#0085FF] border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-[7px] text-white font-bold">OK</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">{workerName}</p>
                <span className="text-[8px] bg-[#EBF7F3] text-[#00A651] px-1.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <Hammer className="w-2 h-2" /> Carpenter
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

        <main className="flex-1 max-w-[800px]">
          <header className="flex justify-between items-center mb-8 px-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          </header>

          <ProfileHeader profile={profile} />

          <AccountVerification isExpanded />

          <BasicInfoSection
            profile={profile}
            isEditing={isEditing}
            onToggleEdit={handleToggleEdit}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
          />

          <ContactInfoSection
            profile={profile}
            isEditing={isEditing}
            onToggleEdit={handleToggleEdit}
            onInputChange={handleInputChange}
          />
        </main>
      </div>
    </div>
  );
};

export default WorkerOwnProfile;
