import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboardIcon, BriefcaseIcon, UserIcon, 
  MapPinIcon, HammerIcon, BellIcon, CalendarIcon, LockIcon 
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

const WorkersJobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedJob, setSelectedJob] = useState(null); 
  const [selectedDeclineJob, setSelectedDeclineJob] = useState(null); 
  const [selectedAcceptJob, setSelectedAcceptJob] = useState(null); // State for Accept Confirmation
  const [declineReason, setDeclineReason] = useState("");

  const tabs = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled', 'Declined'];
  
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

  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      name: 'Homeowner', 
      location: 'Mangaldan, Pangasinan', 
      needs: 'Carpenter', 
      time: 'Jan 14, 3:00 PM', 
      completionTime: 'Jan 17, 7:30 PM',
      description: 'Sira pinto koooooo', 
      status: 'Pending',
      email: 'homeowner@gmail.com',
      facebook: 'Home Owner',
      phone: '09123445566',
      hasReview: false
    },
    { 
      id: 2, 
      name: 'Homeowner', 
      location: 'Mangaldan, Pangasinan', 
      needs: 'Carpenter', 
      time: 'Jan 14, 5:00 PM', 
      description: 'Change of plans, sorry!', 
      status: 'Cancelled',
      cancelledReason: 'Found Another Worker.',
      email: 'homeowner2@gmail.com',
      facebook: 'Home Owner II',
      phone: '09120001122',
    },
    { 
      id: 3, 
      name: 'Homeowner', 
      location: 'Mangaldan, Pangasinan', 
      needs: 'Carpenter', 
      time: 'Jan 14, 3:00 PM', 
      completionTime: 'Jan 17, 7:30 PM',
      description: 'Done with the cabinet fix.', 
      status: 'Completed',
      email: 'homeowner3@gmail.com',
      facebook: 'Home Owner III',
      phone: '09112233445',
      hasReview: false 
    },
    { 
        id: 4, 
        name: 'Homeowner', 
        location: 'Mangaldan, Pangasinan', 
        needs: 'Carpenter', 
        time: 'Jan 14, 3:00 PM', 
        completionTime: 'Jan 17, 7:30 PM',
        description: 'Fixed the wooden stairs.', 
        status: 'Completed',
        hasReview: true,
        rating: 4.5,
        reviewDate: 'Jan 19, 2026',
        reviewText: "Excellent work! The stairs are solid now and Mang Berto was very polite. Highly recommended.",
        email: 'homeowner4@gmail.com',
        facebook: 'Home Owner IV',
        phone: '09129988776',
    },
    { 
        id: 5, 
        name: 'Homeowner', 
        location: 'Mangaldan, Pangasinan', 
        needs: 'Carpenter', 
        time: 'Jan 14, 5:00 PM', 
        status: 'In Progress',
        email: 'homeowner5@gmail.com',
        facebook: 'Home Owner V',
        phone: '09123456789',
        acceptedTime: 'Jan 14, 5:00 PM'
    },
    { 
        id: 6, 
        name: 'Homeowner', 
        location: 'Mangaldan, Pangasinan', 
        needs: 'Carpenter', 
        time: 'Jan 17, 8:00 PM', 
        status: 'Declined',
        declineReason: 'Fully booked on the requested date',
    }
  ]);

  const handleAcceptJob = (id) => {
    setJobs(prevJobs => 
      prevJobs.map(job => job.id === id ? { ...job, status: 'In Progress' } : job)
    );
    setSelectedJob(null);
    setSelectedAcceptJob(null); // Close confirmation
    setActiveTab('In Progress');
  };

  const handleDeclineSubmit = () => {
    setJobs(prevJobs => 
        prevJobs.map(job => 
            job.id === selectedDeclineJob.id 
            ? { ...job, status: 'Declined', declineReason: declineReason } 
            : job
        )
    );
    setSelectedDeclineJob(null);
    setDeclineReason("");
    setActiveTab('Declined');
  };

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'All') return true;
    return job.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans flex flex-col items-center overflow-x-hidden relative text-left">
      
      {/* HEADER BAR - Logo positioned relative to sidebar */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full px-6 py-4 flex justify-between items-center">
          {/* Logo container width matches sidebar width for alignment */}
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
        
        {/* SIDEBAR */}
        <aside className="w-[260px] sticky top-[88px] h-[calc(100vh-112px)] bg-white flex flex-col rounded-2xl shadow-sm border border-gray-100 shrink-0">
          <div className="p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Menu</p>
          </div>
          
          <nav className="flex-1">
            <NavItem icon={<LayoutDashboardIcon className="w-5 h-5" />} label="Dashboard" active={location.pathname === '/HomeWorker'} onClick={() => navigate('/HomeWorker')} />
            <NavItem icon={<BriefcaseIcon className="w-5 h-5" />} label="Jobs" active={location.pathname === '/worker-jobs'} onClick={() => navigate('/worker-jobs')} />
            <NavItem icon={<UserIcon className="w-5 h-5" />} label="Profile" active={location.pathname === '/worker-profile'} onClick={() => navigate('/worker-profile')} />
          </nav>

          <div className="p-5 mt-auto border-t border-gray-50 text-left">
            <div 
              onClick={() => navigate('/worker-profile')}
              className="bg-white border border-gray-100 rounded-xl p-3 mb-3 flex items-center gap-3 shadow-sm cursor-pointer hover:border-[#00A651] transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden shrink-0 relative">
                <img src="https://i.pravatar.cc/150?u=berto" alt="Worker" className="w-full h-full object-cover" />
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

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <header className="mb-8 px-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Jobs</h1>
          </header>

          <section className="mb-6 px-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-[#EBF7F3] text-[#00A651]' : 'text-gray-400'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          <section className="px-2 space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white p-7 rounded-2xl border border-gray-100 transition-all shadow-sm relative text-left">
                  <button onClick={() => setSelectedJob(job)} className="absolute top-6 right-8 text-[#0085FF] text-[10px] font-bold flex items-center gap-1 hover:underline">
                    View Details →
                  </button>
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full overflow-hidden shrink-0">
                      <img src={`https://i.pravatar.cc/150?u=${job.id + 20}`} alt="User" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-gray-900 text-base">{job.name}</h3>
                        <span className={`${
                          job.status === 'Pending' ? 'bg-[#D4A017] text-white' : 
                          job.status === 'Declined' ? 'bg-[#FF9999] text-white' : 
                          job.status === 'Cancelled' ? 'bg-[#FF4D4D] text-white' : 
                          job.status === 'In Progress' ? 'bg-[#A8E6CF] text-[#00A651]' :
                          'bg-[#A8E6CF] text-[#00A651]'
                        } text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                        <MapPinIcon className="w-3.5 h-3.5 text-[#0085FF]" /> {job.location}
                      </p>
                    </div>
                  </div>

                  {job.status === 'Pending' && (
                    <div className="flex items-start gap-2 text-gray-400 mb-4 pl-1">
                      <LockIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <p className="text-[10px] leading-tight font-medium italic">
                        After you accept, both of you will be able to see each other's contact details so you can coordinate directly.
                      </p>
                    </div>
                  )}

                  {job.status === 'In Progress' && (
                    <div className="flex items-start gap-2 text-gray-700 mb-4 pl-1">
                      <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center shrink-0">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                      <p className="text-[11px] font-medium italic">
                        Good news! You can now contact the homeowner. Click <span className="font-bold">'View Details'</span>.
                      </p>
                    </div>
                  )}

                  {job.status === 'Cancelled' && (
                    <p className="text-[11px] text-gray-700 font-bold mb-4 pl-1">
                      Reason: <span className="font-medium text-gray-600">{job.cancelledReason}</span>
                    </p>
                  )}

                  {job.status === 'Declined' && (
                    <p className="text-[11px] text-gray-700 font-bold mb-4 pl-1">
                      Your reason: <span className="font-medium text-gray-600">{job.declineReason}</span>
                    </p>
                  )}

                  {job.status === 'Completed' && (
                    <div className="mb-4 pl-1">
                      {job.hasReview ? (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="text-[11px] font-bold text-gray-700">{job.rating.toFixed(1)} Ratings</span>
                        </div>
                      ) : (
                        <p className="text-[12px] text-gray-400 font-medium italic">Hasn't left a review yet.</p>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Needs:</span>
                      <span className="bg-[#DDEBFF] text-[#0057FF] px-3.5 py-1 rounded text-[11px] font-bold italic flex items-center gap-1.5">
                        <HammerIcon className="w-3.5 h-3.5" /> {job.needs}
                      </span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Preferred Schedule: <span className="text-gray-500 font-medium italic lowercase">Not Specified</span></p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1.5 font-medium">
                         <CalendarIcon className="w-4 h-4 text-gray-200" /> 
                         {job.status === 'Completed' ? `Completed: ${job.completionTime}` : 
                          job.status === 'Cancelled' ? `Cancelled: ${job.time}` : 
                          job.status === 'In Progress' ? `Accepted: ${job.acceptedTime}` :
                          job.status === 'Declined' ? `Declined: ${job.time}` :
                          `Request sent: ${job.time}`}
                       </p>
                    </div>
                  </div>

                  {job.status === 'Pending' && (
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setSelectedDeclineJob(job)} className="px-10 py-2.5 border border-[#FF4D4D] text-[#FF4D4D] rounded-[8px] text-[11px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all">Decline</button>
                      <button onClick={() => setSelectedAcceptJob(job)} className="px-10 py-2.5 bg-[#00A651] text-white rounded-[8px] text-[11px] font-bold uppercase tracking-widest shadow-md hover:bg-green-600 transition-all">Accept</button>
                    </div>
                  )}

                  {job.status === 'In Progress' && (
                    <div className="flex items-center gap-2 text-blue-500 pl-1">
                      <span className="text-sm">✉️</span>
                      <p className="text-[11px] font-medium italic">Waiting for homeowner to confirm completion.</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest italic">No {activeTab.toLowerCase()} jobs found.</p>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* REQUEST DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[440px] shadow-2xl relative overflow-hidden text-left flex flex-col max-h-[90vh]">
            <header className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-gray-800">
                <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                <h2 className="font-bold text-base">Request Details</h2>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </header>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="flex gap-4 mb-6">
                <div className="w-14 h-14 bg-pink-100 rounded-full overflow-hidden shrink-0">
                  <img src={`https://i.pravatar.cc/150?u=${selectedJob.id + 20}`} alt="User" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-gray-900 text-lg">{selectedJob.name}</h3>
                    <span className={`${
                      selectedJob.status === 'Pending' ? 'bg-[#D4A017] text-white' : 
                      selectedJob.status === 'Cancelled' ? 'bg-[#FF9999] text-white' :
                      selectedJob.status === 'In Progress' ? 'bg-[#A8E6CF] text-[#00A651]' :
                      'bg-[#A8E6CF] text-[#00A651]'
                    } text-[9px] px-2.5 py-0.5 rounded font-bold uppercase`}>
                      {selectedJob.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#0085FF]" /> {selectedJob.location}
                  </p>
                </div>
              </div>

              {selectedJob.status === 'Cancelled' && (
                <p className="text-[11px] text-gray-700 font-bold mb-6">
                  Reason: <span className="font-medium text-gray-600">{selectedJob.cancelledReason}</span>
                </p>
              )}

              <div className="flex items-center gap-2 mb-6">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Needs:</span>
                <span className="bg-[#DDEBFF] text-[#0057FF] px-4 py-1 rounded text-[11px] font-bold italic flex items-center gap-1.5">
                  <HammerIcon className="w-3.5 h-3.5" /> {selectedJob.needs}
                </span>
              </div>

              {selectedJob.status !== 'Pending' && selectedJob.status !== 'Cancelled' && selectedJob.status !== 'Declined' && (
                <div className="mb-6">
                  <label className="text-[11px] font-bold text-gray-900 mb-2 block uppercase tracking-tight">Contact Information:</label>
                  <div className="space-y-1.5 pl-1">
                    <p className="text-[11px] text-gray-600 flex items-center gap-2 font-medium">
                      <span className="w-4">📧</span> {selectedJob.email}
                    </p>
                    <p className="text-[11px] text-gray-600 flex items-center gap-2 font-medium">
                      <span className="text-blue-600 w-4 font-bold">f</span> {selectedJob.facebook}
                    </p>
                    <p className="text-[11px] text-gray-600 flex items-center gap-2 font-medium">
                      <span className="w-4">📞</span> {selectedJob.phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="text-[11px] font-bold text-gray-900 mb-2 block uppercase tracking-tight">Problem Description</label>
                <div className="bg-[#F3F3F3] rounded-xl p-4 min-h-[100px] text-[12px] text-gray-600 font-medium leading-relaxed">
                  {selectedJob.description || "No description provided."}
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Preferred Schedule: <span className="text-gray-500 font-medium italic">Not Specified</span></p>
                <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 uppercase">
                  <CalendarIcon className="w-3.5 h-3.5" /> 
                  {selectedJob.status === 'Completed' ? `Completed: ${selectedJob.completionTime}` : 
                   selectedJob.status === 'Cancelled' ? `Cancelled: ${selectedJob.time}` :
                   `Request sent: ${selectedJob.time}`}
                </p>
              </div>

              {selectedJob.status === 'Completed' && selectedJob.hasReview && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <label className="text-[11px] font-bold text-gray-900 mb-4 block uppercase tracking-tighter">Review</label>
                  <div className="bg-[#F8F8F8] rounded-2xl p-5 border border-gray-50">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3 items-center">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-pink-100 shrink-0">
                                <img src={`https://i.pravatar.cc/150?u=${selectedJob.id + 20}`} alt="User" />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-bold text-gray-900 leading-none mb-1">{selectedJob.name}</h4>
                                <div className="flex text-yellow-400 text-[10px] items-center">
                                    {'★'.repeat(Math.floor(selectedJob.rating))}
                                    <span className="text-gray-400 ml-1.5 font-bold">{selectedJob.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">{selectedJob.reviewDate}</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-[11px] text-gray-600 leading-relaxed font-medium italic">
                          "{selectedJob.reviewText}"
                        </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedJob.status === 'Pending' && (
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <button onClick={() => { setSelectedJob(null); setSelectedDeclineJob(selectedJob); }} className="flex-1 py-3 border border-[#FF4D4D] text-[#FF4D4D] rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all">Decline</button>
                        <button onClick={() => setSelectedAcceptJob(selectedJob)} className="flex-1 py-3 bg-[#00A651] text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg transition-all">Accept</button>
                    </div>
                    <div className="flex items-start gap-2 text-gray-400">
                        <LockIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <p className="text-[10px] leading-tight font-medium italic">After you accept, both of you will be able to see each other's contact details so you can coordinate directly.</p>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACCEPT CONFIRMATION MODAL */}
      {selectedAcceptJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl p-8 text-center border border-gray-100">
             <div className="w-16 h-16 bg-[#F0F9F6] text-[#00A651] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
             <h2 className="font-bold text-gray-900 text-lg mb-2 tracking-tight">Accept this request?</h2>
             <p className="text-[12px] text-gray-500 mb-8 leading-relaxed font-medium">
               Once you accept, this job will move to your 'In Progress' list and you can begin communicating with the homeowner.
             </p>
             <div className="flex gap-3">
                <button onClick={() => handleAcceptJob(selectedAcceptJob.id)} className="flex-1 py-3 bg-[#00A651] text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-green-600 transition-colors">Confirm Accept</button>
                <button onClick={() => setSelectedAcceptJob(null)} className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Go Back</button>
             </div>
          </div>
        </div>
      )}

      {/* DECLINE CONFIRMATION MODAL */}
      {selectedDeclineJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl relative overflow-hidden text-left border border-gray-100">
            <header className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                 <div className="text-yellow-500 font-bold text-xl">⚠️</div>
                 <h2 className="font-bold text-gray-900 text-lg">Decline this request?</h2>
              </div>
              <button onClick={() => setSelectedDeclineJob(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </header>
            
            <div className="p-8">
              <p className="text-[11px] text-gray-500 leading-relaxed mb-6 font-medium">
                This will notify the homeowner and remove their request from your list. You won't be able to undo this.
              </p>

              <div className="mb-8">
                <h4 className="text-[12px] font-bold text-gray-800 mb-4">Why are you declining?</h4>
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
                    {declineReason === "Other (state reason)" && (
                        <input 
                            type="text" 
                            placeholder="Please specify..." 
                            className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-red-400"
                        />
                    )}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                    onClick={handleDeclineSubmit} 
                    disabled={!declineReason}
                    className={`flex-1 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${declineReason ? 'bg-[#D93F3F] text-white shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                    Decline
                </button>
                <button 
                    onClick={() => setSelectedDeclineJob(null)} 
                    className="flex-1 py-3.5 border border-[#00A651] text-[#00A651] rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-green-50"
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

export default WorkersJobs;