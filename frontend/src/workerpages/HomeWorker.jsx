import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboardIcon, BriefcaseIcon, UserIcon, 
  UsersIcon, CheckSquareIcon, CheckCircleIcon, StarIcon, 
  MapPinIcon, HammerIcon, BellIcon, CalendarIcon 
} from '../Icons';

const NavItem = ({ icon, label, active = false, onClick }) => (
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

const HomeWorker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const stats = [
    { label: 'Pending Request', value: 4, icon: <UsersIcon className="w-7 h-7 text-[#FFB800]" /> },
    { label: 'Accepted Jobs', value: 3, icon: <CheckSquareIcon className="w-7 h-7 text-[#0085FF]" /> },
    { label: 'Completed Jobs', value: 10, icon: <CheckCircleIcon className="w-7 h-7 text-[#00A651]" /> },
    { label: 'Average Rating', value: 4.9, icon: <StarIcon className="w-7 h-7 text-[#FFB800]" /> },
  ];

  const requests = Array(4).fill({
    name: 'Homeowner',
    location: 'Mangaldan, Pangasinan',
    needs: 'Carpenter',
    schedule: 'Not Specified',
    time: 'Jan 14, 3:00 PM',
    description: 'Sira pinto koooooo'
  });

  const handleViewDetails = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans flex flex-col items-center overflow-x-hidden relative">
      
      {/* HEADER BAR - Logo positioned relative to sidebar */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full px-6 py-4 flex justify-between items-center">
          <div className="w-[260px] flex items-center cursor-pointer" onClick={() => navigate('/HomeWorker')}>
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

      <div className="w-full max-w-[1280px] flex gap-6 items-start p-6">
        
        {/* STICKY SIDEBAR */}
        <aside className="w-[260px] sticky top-[88px] h-[calc(100vh-112px)] bg-white flex flex-col rounded-2xl shadow-sm border border-gray-100 shrink-0">
          <div className="p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Menu</p>
          </div>
          
          <nav className="flex-1">
            <NavItem icon={<LayoutDashboardIcon className="w-5 h-5" />} label="Dashboard" active={location.pathname === '/HomeWorker'} onClick={() => navigate('/HomeWorker')} />
            <NavItem icon={<BriefcaseIcon className="w-5 h-5" />} label="Jobs" active={location.pathname === '/worker-jobs'} onClick={() => navigate('/worker-jobs')} />
            <NavItem icon={<UserIcon className="w-5 h-5" />} label="Profile" active={location.pathname === '/worker-profile'} onClick={() => navigate('/worker-profile')} />
          </nav>

          <div className="p-5 mt-auto border-t border-gray-50">
            <div 
              onClick={() => navigate('/worker-profile')}
              className="bg-white border border-gray-100 rounded-xl p-3 mb-3 flex items-center gap-3 shadow-sm cursor-pointer hover:border-[#00A651] transition-all group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden shrink-0">
                  <img src="https://i.pravatar.cc/150?u=berto" alt="Worker" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#0085FF] border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">✓</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#00A651]">Mang Berto</p>
                <span className="text-[8px] bg-[#EBF7F3] text-[#00A651] px-1.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <HammerIcon className="w-2 h-2" /> Carpenter
                </span>
              </div>
            </div>
            <button className="w-full py-2 border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider">Logout</button>
          </div>
        </aside>

        {/* MAIN CONTENT Area */}
        <main className="flex-1">
          <header className="flex justify-between items-start mb-8 px-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome, Mang Berto 👋</h1>
              <div className="flex items-center gap-2">
                 <div className="w-8 h-4 bg-[#00A651] rounded-full relative flex items-center px-0.5">
                    <div className="w-3 h-3 bg-white rounded-full ml-auto shadow-sm"></div>
                 </div>
                 <span className="text-xs font-medium text-gray-500">Status: <span className="text-[#00A651] font-bold">Online</span> ●</span>
              </div>
            </div>
          </header>

          {/* Performance Overview */}
          <section className="mb-10">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Performance Overview</h2>
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-xl shadow-sm text-center border border-gray-50 flex flex-col items-center">
                  <div className="mb-2">{stat.icon}</div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pending Request */}
          <section>
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Pending Request</h2>
            <div className="grid grid-cols-2 gap-6">
              {requests.map((req, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                  <button 
                    onClick={() => handleViewDetails(req)}
                    className="absolute top-5 right-6 text-[#0085FF] text-[10px] font-bold hover:underline"
                  >
                    View Details →
                  </button>
                  
                  <div className="flex gap-3 mb-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full overflow-hidden shrink-0">
                      <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-gray-900 text-sm">Homeowner</h3>
                            <span className="bg-[#FFB800] text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Pending</span>
                        </div>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3 text-[#0085FF]" /> {req.location}
                        </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-400 uppercase">Needs:</span>
                      <span className="bg-[#DDEBFF] text-[#0057FF] px-3 py-1 rounded text-[10px] font-bold italic flex items-center gap-1">
                        <HammerIcon className="w-3 h-3" /> {req.needs}
                      </span>
                    </div>
                    <div className="text-gray-400 space-y-1">
                      <p>Preferred Schedule: <span className="italic text-gray-500 font-bold">Not Specified</span></p>
                      <p className="flex items-center gap-1">
                         <CalendarIcon className="w-3.5 h-3.5" /> Request sent: {req.time}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-2 border border-[#FF4D4D] text-[#FF4D4D] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">
                      Decline
                    </button>
                    <button className="py-2 bg-[#00A651] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 shadow-md">
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* REQUEST DETAILS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200 text-left">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 z-10">✕</button>
            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-lg"><BriefcaseIcon className="w-5 h-5 text-gray-600" /></div>
              <h2 className="text-lg font-bold text-gray-900">Request Details</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-pink-100 rounded-full overflow-hidden shrink-0"><img src="https://i.pravatar.cc/150?u=10" alt="Homeowner" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">Homeowner</h3>
                    <span className="bg-[#FFB800] text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">Pending</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPinIcon className="w-3 h-3 text-[#0085FF]" /> {selectedRequest?.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase">Needs:</span>
                <span className="bg-[#DDEBFF] text-[#0057FF] px-3 py-1.5 rounded-md text-[11px] font-bold italic flex items-center gap-1.5"><HammerIcon className="w-3.5 h-3.5" /> {selectedRequest?.needs}</span>
              </div>
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-900 mb-2">Problem Description</h4>
                <div className="bg-gray-50 rounded-xl p-4 min-h-[100px]"><p className="text-sm text-gray-600 italic">"{selectedRequest?.description}"</p></div>
              </div>
              <div className="space-y-2 mb-8 text-xs text-gray-500">
                <p>Preferred Schedule: <span className="italic font-bold text-gray-700">Not Specified</span></p>
                <p className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-gray-400" /> Request sent: {selectedRequest?.time}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button className="py-3 border border-[#FF4D4D] text-[#FF4D4D] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">Decline</button>
                <button className="py-3 bg-[#00A651] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-600 shadow-lg">Accept</button>
              </div>
              <div className="flex items-center gap-2 justify-center py-2 text-center">
                <span className="text-[10px] text-gray-400">🔒 After you accept, both can see contact details.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeWorker;