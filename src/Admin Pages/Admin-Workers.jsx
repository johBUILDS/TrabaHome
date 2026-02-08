import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import { 
  LayoutDashboard, Users, Home, ClipboardList, 
  MessageSquare, User, Bell, X, MapPin, Mail, Phone, Search, AlertTriangle, Ban
} from 'lucide-react';

const AdminWorkers = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [activeTab, setActiveTab] = useState('Workers');
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [selectedWorker, setSelectedWorker] = useState(null); // State for Modal
  const [showRejectModal, setShowRejectModal] = useState(false); // State for second modal

  // Data moved to state to allow dynamic updates (Approve/Reject)
  const [workers, setWorkers] = useState([
    { id: 1, name: 'Batumbakal Vicente Reyes', skill: 'Mason', location: 'Calasiao, Pangasinan', submitted: 'January 20, 2026 10:45 AM', status: 'Pending', email: 'vicente.reyes@gmail.com', phone: '+63 9612232334' },
    { id: 2, name: 'Batumbakal Vicente Reyes', skill: 'Mason', location: 'Calasiao, Pangasinan', submitted: 'January 20, 2026 10:46 AM', status: 'Pending' },
    { id: 3, name: 'Batumbakal Vicente Reyes', skill: 'Mason', location: 'Calasiao, Pangasinan', submitted: 'January 20, 2026 10:47 AM', status: 'Pending' },
    { id: 4, name: 'John Doe', skill: 'Electrician', location: 'Dagupan City', submitted: 'Jan 15, 2026', status: 'Verified' },
  ]);

  // Logic to handle status transitions
  const updateWorkerStatus = (id, newStatus) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
    setSelectedWorker(null);
    setShowRejectModal(false);
  };

  const stats = [
    { label: 'Pending', count: workers.filter(w => w.status === 'Pending').length },
    { label: 'Verified', count: workers.filter(w => w.status === 'Verified').length },
    { label: 'Rejected', count: workers.filter(w => w.status === 'Rejected').length },
    { label: 'Suspended', count: workers.filter(w => w.status === 'Suspended').length },
  ];

  const filteredWorkers = workers.filter(worker => worker.status === filterStatus);

  // Function to handle sidebar clicks
  const handleNavigation = (label) => {
    setActiveTab(label);
    if (label === 'Dashboard') {
      navigate('/Admin-Dashboard'); // Navigates to Admin-Dashboard.jsx route
    } else if (label === 'Homeowners') {
      navigate('/Admin-Homeowners'); // Navigates to Admin-Homeowners.jsx route
    } else if (label === 'Requests') {
      navigate('/Admin-Requests'); // Navigates to Admin-Requests.jsx route
    } else if (label === 'SMS Logs') {
      navigate('/Admin-Smslogs'); // Navigates to Admin-Smslogs.jsx route
    }
    else if (label === 'workers') {
      navigate('/Admin-Workers'); // Navigates to Admin-Workers.jsx route
    }
  };
  

  return (
    <div className="flex flex-col h-screen bg-[#F8F5F2] overflow-hidden font-sans relative">
      {/* Top Bar */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 z-20 shadow-sm shrink-0">
        <img src="/assets/Logo.png" alt="TrabaHome" className="h-12 w-auto" />
        <motion.div whileHover={{ rotate: 15 }} className="bg-gray-50 p-2 rounded-full cursor-pointer">
          <Bell className="text-gray-800" size={24} />
        </motion.div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-8 pr-2 h-full"> 
          <aside className="w-64 h-full bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between p-6">
            <nav className="space-y-1">
              {['Dashboard', 'Workers', 'Homeowners', 'Requests', 'SMS Logs', 'Profile'].map((label) => (
                <SidebarItem 
                  key={label} 
                  label={label} 
                  active={activeTab === label} 
                  icon={getIcon(label)}
                  onClick={() => handleNavigation(label)} // Updated onClick
                />
              ))}
            </nav>
            <div className="pt-6 border-t border-gray-50 text-center">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center"><User className="text-gray-400" size={20} /></div>
                <span className="font-bold text-gray-700 text-sm">Admin</span>
              </div>
              <button className="w-full py-2 border border-gray-200 rounded-full text-gray-500 text-xs font-semibold hover:bg-red-50 hover:text-red-500 transition-all">Logout</button>
            </div>
          </aside>
        </motion.div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-10 pl-6">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Workers</h1>
            <p className="text-gray-500 text-sm font-medium">Verify new workers and monitor existing accounts.</p>
          </div>
          
          {/* Status Badges */}
          <div className="flex gap-4 mb-10">
            {stats.map((stat) => (
              <motion.div 
                key={stat.label}
                onClick={() => setFilterStatus(stat.label)}
                whileHover={{ y: -2 }}
                className={`cursor-pointer px-8 py-3 rounded-xl border-2 transition-all flex items-center justify-between min-w-[160px] 
                  ${filterStatus === stat.label ? 'bg-[#F3D991] border-[#Ebc36a] shadow-md' : 'bg-white border-transparent shadow-sm'}`}
              >
                <span className="text-[11px] font-black text-gray-800 uppercase">{stat.label}</span>
                <span className="text-sm font-black text-gray-900">{stat.count}</span>
              </motion.div>
            ))}
          </div>

          {/* Table */}
          <motion.div layout className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-6">Worker</th>
                  <th className="px-8 py-6">Skill</th>
                  <th className="px-8 py-6">Location</th>
                  <th className="px-8 py-6">Submitted</th>
                  <th className="px-8 py-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {filteredWorkers.map((worker) => (
                    <motion.tr key={worker.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50/50">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 rounded-full border border-blue-100 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`} alt="avatar" />
                          </div>
                          <span className="text-[11px] font-black text-gray-800 leading-tight">{worker.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-[11px] font-bold text-gray-500">{worker.skill}</td>
                      <td className="px-8 py-5 text-[11px] font-bold text-gray-500">{worker.location}</td>
                      <td className="px-8 py-5 text-[11px] font-bold text-gray-500">{worker.submitted}</td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedWorker(worker)}
                            className="border-2 border-blue-400 text-blue-500 px-5 py-1.5 rounded-full text-[10px] font-black hover:bg-blue-50 transition-all"
                          >
                            View Docs
                          </button>
                          {worker.status === 'Verified' && (
                            <button 
                              onClick={() => updateWorkerStatus(worker.id, 'Suspended')}
                              className="p-2 text-orange-400 hover:bg-orange-50 rounded-full transition-all"
                              title="Suspend Worker"
                            >
                              <Ban size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredWorkers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold text-xs uppercase">No {filterStatus} workers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </main>
      </div>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {selectedWorker && (
          <WorkerModal 
            worker={selectedWorker} 
            onClose={() => setSelectedWorker(null)} 
            onReject={() => setShowRejectModal(true)} // Opens second modal
            onApprove={() => updateWorkerStatus(selectedWorker.id, 'Verified')} // Updates to verified
            onSuspend={() => updateWorkerStatus(selectedWorker.id, 'Suspended')}
          />
        )}
      </AnimatePresence>

      {/* REJECTION REASON MODAL */}
      <AnimatePresence>
        {showRejectModal && (
          <RejectModal 
            worker={selectedWorker} 
            onClose={() => setShowRejectModal(false)} 
            onConfirmReject={() => updateWorkerStatus(selectedWorker.id, 'Rejected')} // Updates to rejected
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// REJECTION MODAL COMPONENT
const RejectModal = ({ worker, onClose, onConfirmReject }) => {
  const [reason, setReason] = useState("");

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-[500px] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-1.5 rounded-lg">
              <AlertTriangle className="text-red-500" size={20} fill="currentColor" fillOpacity={0.2} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Reject Worker Application</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
            You are about to reject this worker's application. Please provide a reason. 
          </p>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-800">
              Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <textarea 
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason here..."
              className="w-full h-32 p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all resize-none text-sm text-gray-700"
            />
          </div>
        </div>

        <div className="px-8 pb-8 pt-2 flex justify-center gap-3">
          <button onClick={onClose} className="px-10 py-2.5 border border-gray-300 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button 
            disabled={!reason.trim()}
            onClick={onConfirmReject}
            className="px-10 py-2.5 bg-[#B33A3A] text-white rounded-full text-sm font-bold hover:bg-[#962d2d] transition-colors shadow-md shadow-red-100 disabled:opacity-50"
          >
            Confirm Rejection
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// MODAL COMPONENT (MAIN DOCS VIEW)
const WorkerModal = ({ worker, onClose, onReject, onApprove, onSuspend }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
    >
      <div className="p-6 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-black text-gray-900">Review Worker Application</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Submitted on: {worker.submitted}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full border-2 border-blue-100 overflow-hidden shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`} alt="avatar" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-gray-900">{worker.name}</h3>
            <p className="text-sm font-bold text-gray-500">{worker.skill}</p>
            <div className="flex items-center gap-1 text-blue-500 font-bold text-xs">
              <MapPin size={14} /> <span>{worker.location}</span>
            </div>
            {worker.status !== 'Pending' && (
              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${
                worker.status === 'Verified' ? 'bg-green-100 text-green-600' : 
                worker.status === 'Suspended' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
              }`}>
                Current Status: {worker.status}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <Mail size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-600">{worker.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <Phone size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-600">{worker.phone || 'N/A'}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Uploaded ID Documents</h4>
          <p className="text-xs font-bold text-gray-500">ID Type : <span className="text-gray-800">Passport</span></p>
          <div className="grid grid-cols-2 gap-4">
            <IDCard label="Front of ID" />
            <IDCard label="Selfie with ID" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Identity Verification</h4>
             <span className="bg-blue-500 text-white text-[9px] px-2 py-0.5 rounded-md font-bold uppercase">AI-Assisted</span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">Information below was auto-extracted from the uploaded government ID.</p>
          
          <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gray-100/50 px-4 py-2 border-b border-gray-100 text-[10px] font-black text-gray-500 uppercase">Auto-Filled ID Details</div>
            <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-6">
              <DetailField label="ID Number" />
              <DetailField label="Surname" />
              <DetailField label="Given Name" />
              <DetailField label="Middle Name" />
              <DetailField label="Date of Birth" />
              <DetailField label="Nationality" />
              <DetailField label="Sex" />
              <DetailField label="Place of Birth" />
              {/* Dinagdag na mga missing fields dito */}
              <DetailField label="Date of Issue" />
              <DetailField label="Valid Until" />
              <DetailField label="Issuing Authority" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Proof of Work</h4>
          <p className="text-xs font-bold text-gray-400 italic">No Proof of Work submitted.</p>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 flex gap-4 bg-white">
        {worker.status === 'Pending' ? (
          <>
            <button onClick={onReject} className="flex-1 py-3 border-2 border-red-400 text-red-500 rounded-full font-black text-xs uppercase hover:bg-red-50 transition-all">Reject Application</button>
            <button onClick={onApprove} className="flex-1 py-3 bg-[#59B28D] text-white rounded-full font-black text-xs uppercase hover:bg-[#4a9a7a] shadow-lg shadow-green-100 transition-all">Approve Worker</button>
          </>
        ) : worker.status === 'Verified' ? (
          <button onClick={onSuspend} className="flex-1 py-3 bg-orange-500 text-white rounded-full font-black text-xs uppercase hover:bg-orange-600 transition-all">Suspend Account</button>
        ) : (
          <button onClick={onApprove} className="flex-1 py-3 bg-blue-500 text-white rounded-full font-black text-xs uppercase hover:bg-blue-600 transition-all">Re-Verify Worker</button>
        )}
      </div>
    </motion.div>
  </motion.div>
);

const IDCard = ({ label }) => (
  <div className="space-y-2 text-center">
    <div className="aspect-[16/10] bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group cursor-zoom-in">
        <img src="https://via.placeholder.com/300x180" alt="document" className="object-cover w-full h-full opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all">
           <Search className="text-white opacity-0 group-hover:opacity-100" />
        </div>
    </div>
    <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
  </div>
);

const DetailField = ({ label }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{label}</label>
    <div className="h-9 bg-white border border-gray-200 rounded-lg shadow-sm"></div>
  </div>
);

const SidebarItem = ({ icon, label, active, onClick }) => (
  <motion.div 
    onClick={onClick}
    whileHover={{ x: 5 }}
    className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active ? 'bg-blue-50 text-blue-600 border-l-[6px] border-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
    }`}
  >
    {icon}
    <span className="text-[13px] font-bold">{label}</span>
  </motion.div>
);

const getIcon = (label) => {
  switch(label) {
    case 'Dashboard': return <LayoutDashboard size={18} />;
    case 'Workers': return <Users size={18} />;
    case 'Homeowners': return <Home size={18} />;
    case 'Requests': return <ClipboardList size={18} />;
    case 'SMS Logs': return <MessageSquare size={18} />;
    default: return <User size={18} />;
  }
};

export default AdminWorkers;