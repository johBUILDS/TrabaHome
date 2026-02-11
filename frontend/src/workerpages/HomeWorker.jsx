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
  
  // --- MODAL STATES ---
  const [selectedJob, setSelectedJob] = useState(null); 
  const [showDeclineReasonModal, setShowDeclineReasonModal] = useState(false);
  const [showAcceptConfirmModal, setShowAcceptConfirmModal] = useState(false);
  
  const [declineReason, setDeclineReason] = useState("");

  const declineReasons = [
    "Fully booked on the requested date",
    "Schedule conflict",
    "Location is outside my service area",
    "Job is outside my expertise",
    "Required tools/materials not available",
    "Short notice / urgent request",
    "Personal or emergency reason",
    "Other (state reason)"
  ];

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

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans flex flex-col items-center overflow-x-hidden relative">
      
      {/* HEADER BAR */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full px-6 py-4 flex justify-between items-center text-left">
          {/* LOGO NAVIGATE IMAGE */}
          <div className="w-[260px] cursor-pointer" onClick={() => navigate('/HomeWorker')}>
            <img 
              src="/assets/Logo.png" 
              alt="TrabaHome" 
              className="h-8 w-auto object-contain"
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
        {/* SIDEBAR */}
        <aside className="w-[260px] sticky top-[88px] h-[calc(100vh-112px)] bg-white flex flex-col rounded-2xl shadow-sm border border-gray-100 shrink-0">
          <div className="p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Main Menu</p>
          </div>
          <nav className="flex-1 text-left">
            <NavItem icon={<LayoutDashboardIcon className="w-5 h-5" />} label="Dashboard" active={location.pathname === '/HomeWorker'} onClick={() => navigate('/HomeWorker')} />
            <NavItem icon={<BriefcaseIcon className="w-5 h-5" />} label="Jobs" active={location.pathname === '/worker-jobs'} onClick={() => navigate('/worker-jobs')} />
            <NavItem icon={<UserIcon className="w-5 h-5" />} label="Profile" active={location.pathname === '/worker-profile'} onClick={() => navigate('/worker-profile')} />
          </nav>
          <div className="p-5 mt-auto border-t border-gray-50 text-left">
            <div onClick={() => navigate('/worker-profile')} className="bg-white border border-gray-100 rounded-xl p-3 mb-3 flex items-center gap-3 shadow-sm cursor-pointer hover:border-[#00A651] transition-all group">
              <div className="relative shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=berto" alt="Worker" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#0085FF] border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">✓</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#00A651]">Mang Berto</p>
                <span className="text-[8px] bg-[#EBF7F3] text-[#00A651] px-1.5 py-0.5 rounded-full flex items-center gap-1 font-bold italic w-fit">
                  <HammerIcon className="w-2 h-2" /> Carpenter
                </span>
              </div>
            </div>
            <button className="w-full py-2 border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider">Logout</button>
          </div>
        </aside>

        {/* MAIN CONTENT Area */}
        <main className="flex-1 text-left">
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

          <section>
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Pending Request</h2>
            <div className="grid grid-cols-2 gap-6">
              {requests.map((req, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative text-left">
                  <button onClick={() => setSelectedJob(req)} className="absolute top-5 right-6 text-[#0085FF] text-[10px] font-bold hover:underline">
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
                      <p className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" /> Request sent: {req.time}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { setSelectedJob(req); setShowDeclineReasonModal(true); }} className="py-2 border border-[#FF4D4D] text-[#FF4D4D] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">
                      Decline
                    </button>
                    <button onClick={() => { setSelectedJob(req); setShowAcceptConfirmModal(true); }} className="py-2 bg-[#00A651] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 shadow-md">
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* --- VIEW DETAILS MODAL --- */}
      {selectedJob && !showDeclineReasonModal && !showAcceptConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[440px] shadow-2xl relative overflow-hidden text-left flex flex-col max-h-[90vh]">
            <header className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-gray-800">
                <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                <h2 className="font-bold text-lg">Request Details</h2>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </header>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-pink-100 rounded-full overflow-hidden shrink-0">
                    <img src="https://i.pravatar.cc/150?u=10" alt="Homeowner" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-[16px] font-black text-gray-900 tracking-tight">Homeowner</h3>
                    <span className="bg-[#FFB800] text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">Pending</span>
                  </div>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <MapPinIcon className="w-3 h-3 text-[#0085FF]" /> {selectedJob.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Needs:</span>
                <span className="bg-[#DDEBFF] text-[#0057FF] px-4 py-1.5 rounded-lg text-[12px] font-black italic flex items-center gap-2">
                    <HammerIcon className="w-4 h-4" /> {selectedJob.needs}
                </span>
              </div>

              <div className="mb-8">
                <h4 className="text-[12px] font-bold text-gray-900 mb-3 tracking-tight">Problem Description</h4>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 min-h-[110px]">
                    <p className="text-[13px] text-gray-600 italic leading-relaxed">"{selectedJob.description}"</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowDeclineReasonModal(true)}
                  className="py-3.5 border border-[#FF4D4D] text-[#FF4D4D] rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                >
                  Decline
                </button>
                <button 
                  onClick={() => setShowAcceptConfirmModal(true)}
                  className="py-3.5 bg-[#00A651] text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
                >
                  Accept Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRM ACCEPT MODAL --- */}
      {showAcceptConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl relative overflow-hidden text-left border border-gray-100 animate-in fade-in zoom-in duration-200">
            <header className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                 <div className="text-green-500 font-bold text-xl">✅</div>
                 <h2 className="font-bold text-gray-900 text-lg">Accept this request?</h2>
              </div>
              <button onClick={() => setShowAcceptConfirmModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </header>
            
            <div className="p-8">
              <p className="text-[11px] text-gray-500 leading-relaxed mb-6 font-medium">
                By accepting, you agree to fulfill the homeowner's request. This job will be moved to your 'In Progress' list.
              </p>

              <div className="flex gap-4">
                <button 
                    onClick={() => navigate('/worker-jobs', { state: { activeTab: 'In Progress' } })}
                    className="flex-1 py-3.5 bg-[#00A651] text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-green-600 transition-all"
                >
                    Accept Job
                </button>
                <button 
                    onClick={() => setShowAcceptConfirmModal(false)} 
                    className="flex-1 py-3.5 border border-gray-200 text-gray-400 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                    Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DECLINE MODAL --- */}
      {showDeclineReasonModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl relative overflow-hidden text-left border border-gray-100 animate-in fade-in zoom-in duration-200">
            <header className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                 <div className="text-yellow-500 font-bold text-xl">⚠️</div>
                 <h2 className="font-bold text-gray-900 text-lg">Decline this request?</h2>
              </div>
              <button 
                onClick={() => { setShowDeclineReasonModal(false); setDeclineReason(""); }} 
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </header>
            
            <div className="p-8">
              <p className="text-[11px] text-gray-500 leading-relaxed mb-6 font-medium">
                This will notify the homeowner and remove their request from your list.
              </p>

              <div className="mb-8">
                <h4 className="text-[12px] font-bold text-gray-800 mb-4 tracking-tight uppercase">Why are you declining?</h4>
                <div className="space-y-3">
                    {declineReasons.map((reason, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="radio" 
                                name="declineReason" 
                                value={reason}
                                checked={declineReason === reason}
                                onChange={(e) => setDeclineReason(e.target.value)}
                                className="w-4 h-4 accent-[#D93F3F]"
                            />
                            <span className="text-[12px] text-gray-600 font-medium group-hover:text-gray-900">{reason}</span>
                        </label>
                    ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                    onClick={() => navigate('/worker-jobs', { state: { activeTab: 'Declined' } })}
                    disabled={!declineReason}
                    className={`flex-1 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                      declineReason ? 'bg-[#D93F3F] text-white shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Decline
                </button>
                <button 
                    onClick={() => { setShowDeclineReasonModal(false); setDeclineReason(""); }} 
                    className="flex-1 py-3.5 border border-[#00A651] text-[#00A651] rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-green-50 transition-all"
                >
                    Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeWorker;