import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Home, ClipboardList, 
  MessageSquare, User, Bell, X, MapPin, Mail, Phone, Search, AlertTriangle, Ban, ChevronDown, History, CheckCircle2, Star, Briefcase, Calendar, OctagonAlert, RefreshCcw
} from 'lucide-react';

const AdminWorkers = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Workers');
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showReinstateModal, setShowReinstateModal] = useState(false);
  
  // NEW STATES FOR SEARCH AND FILTERING
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const allSkills = ["Carpenter", "Cleaner", "General Repair", "Gardener", "Mason", "Electrician", "Plumber"];

  const [workers, setWorkers] = useState([
    { 
      id: 1, 
      name: 'Batumbakal Vicente Reyes', 
      skill: 'Mason', 
      location: 'Calasiao, Pangasinan', 
      submitted: 'January 20, 2026 10:45 AM', 
      status: 'Pending', 
      email: 'vicente.reyes@gmail.com', 
      phone: '+63 9612232334',
      isReapplication: true,
      previousRejection: {
        reason: "Incomplete or unclear documents",
        details: "We were unable to verify the application due to incomplete or unclear identification documents. You may reapply with clearer images.",
        date: "January 20, 2026, 10:48 AM",
        rejectedBy: "Admin"
      }
    },
    { 
        id: 5, 
        name: 'Batumbakal Vicente Reyes', 
        skill: 'Carpenter', 
        location: 'Banaoang, Mangaldan, Pangasinan', 
        submitted: 'January 20, 2026, 10:46 AM', 
        status: 'Suspended',
        email: 'vicente.reyes@gmail.com',
        phone: '+63 9612232334',
        suspensionDetails: {
            reason: "Inactivity for an extended period",
            details: "The worker has not accepted or responded to any service requests for an extended period, affecting service availability on the platform.",
            date: "January 20, 2026, 10:46 AM",
            suspendedBy: "Admin"
        }
    }
  ]);

  const updateWorkerStatus = (id, newStatus, additionalData = null) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === id) {
        let updatedWorker = { ...w, status: newStatus };
        if (newStatus === 'Verified') {
            updatedWorker.verifiedDate = new Date().toLocaleString();
            updatedWorker.suspensionDetails = null;
        }
        if (newStatus === 'Suspended') updatedWorker.suspensionDetails = additionalData;
        if (newStatus === 'Rejected') updatedWorker.previousRejection = additionalData;
        return updatedWorker;
      }
      return w;
    }));
    setSelectedWorker(null);
    setShowRejectModal(false);
    setShowSuspendModal(false);
    setShowReinstateModal(false);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const stats = [
    { label: 'Pending', count: workers.filter(w => w.status === 'Pending').length },
    { label: 'Verified', count: workers.filter(w => w.status === 'Verified').length },
    { label: 'Rejected', count: workers.filter(w => w.status === 'Rejected').length },
    { label: 'Suspended', count: workers.filter(w => w.status === 'Suspended').length },
  ];

  // UPDATED FILTERING LOGIC FOR SEARCH AND DROPDOWN
  const filteredWorkers = workers.filter(worker => {
    const matchesStatus = worker.status === filterStatus;
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = selectedSkills.length === 0 || selectedSkills.includes(worker.skill);
    return matchesStatus && matchesSearch && matchesSkill;
  });

  const handleNavigation = (label) => {
    setActiveTab(label);
    if (label === 'Dashboard') navigate('/admin-dashboard'); 
    else if (label === 'Homeowners') navigate('/admin-homeowners'); 
    else if (label === 'Requests') navigate('/admin-requests'); 
    else if (label === 'SMS Logs') navigate('/admin-smslogs'); 
    else if (label === 'Workers') navigate('/admin-workers'); 
    else if (label === 'Profile') navigate('/admin-profile');
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F5F2] overflow-hidden font-sans relative">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 z-20 shadow-sm shrink-0">
        <img src="/assets/Logo.png" alt="TrabaHome" className="h-12 w-auto" />
        <motion.div whileHover={{ rotate: 15 }} className="bg-gray-50 p-2 rounded-full cursor-pointer">
          <Bell className="text-gray-800" size={24} />
        </motion.div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-8 pr-2 h-full"> 
          <aside className="w-64 h-full bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between p-6">
            <nav className="space-y-1">
              {['Dashboard', 'Workers', 'Homeowners', 'Requests', 'SMS Logs', 'Profile'].map((label) => (
                <SidebarItem 
                  key={label} 
                  label={label} 
                  active={activeTab === label} 
                  icon={getIcon(label)}
                  onClick={() => handleNavigation(label)} 
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

        <main className="flex-1 overflow-y-auto p-10 pl-6">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Workers</h1>
            <p className="text-gray-500 text-sm font-medium">Verify new workers and monitor existing accounts.</p>
          </div>
          
          {/* SEARCH AND FILTER BAR */}
          <div className="flex justify-between items-center mb-10 gap-4">
            <div className="flex gap-4">
              {stats.map((stat) => (
                <motion.div 
                  key={stat.label}
                  onClick={() => setFilterStatus(stat.label)}
                  whileHover={{ y: -2 }}
                  className={`cursor-pointer px-8 py-3 rounded-xl border-2 transition-all flex items-center justify-between min-w-[140px] 
                    ${filterStatus === stat.label ? 'bg-[#F3D991] border-[#Ebc36a] shadow-md' : 'bg-white border-transparent shadow-sm'}`}
                >
                  <span className="text-[11px] font-black text-gray-800 uppercase">{stat.label}</span>
                  <span className="text-sm font-black text-gray-900 ml-4">{stat.count}</span>
                </motion.div>
              ))}
            </div>

            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#F3D991] transition-all text-sm font-medium"
                />
            </div>
          </div>

          <motion.div layout className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-visible">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-6">Worker</th>
                  
                  {/* SKILL DROPDOWN */}
                  <th className="px-8 py-6 relative">
                    <div 
                        className="flex items-center gap-1 cursor-pointer hover:text-gray-600 transition-colors"
                        onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                    >
                        Skill <ChevronDown size={14} className={showSkillDropdown ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </div>
                    
                    <AnimatePresence>
                        {showSkillDropdown && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-4 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4"
                        >
                            <div className="space-y-2 mb-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                type="checkbox" 
                                checked={selectedSkills.length === 0}
                                onChange={() => setSelectedSkills([])}
                                className="rounded border-gray-300 text-[#004A87] focus:ring-[#004A87]"
                                />
                                <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900">All skills</span>
                            </label>
                            {allSkills.map(skill => (
                                <label key={skill} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={selectedSkills.includes(skill)}
                                    onChange={() => toggleSkill(skill)}
                                    className="rounded border-gray-300 text-[#004A87] focus:ring-[#004A87]"
                                />
                                <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900">{skill}</span>
                                </label>
                            ))}
                            </div>
                            <button 
                            onClick={() => setShowSkillDropdown(false)}
                            className="w-full py-2 bg-[#004A87] text-white text-[11px] font-black rounded-xl hover:bg-[#003561] transition-colors uppercase"
                            >
                            Done
                            </button>
                        </motion.div>
                        )}
                    </AnimatePresence>
                  </th>

                  <th className="px-8 py-6">Location</th>
                  <th className="px-8 py-6 text-nowrap">{filterStatus === 'Suspended' ? 'Suspended On' : 'Submitted On'}</th>
                  <th className="px-8 py-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {filteredWorkers.map((worker) => (
                    <motion.tr key={worker.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50/50">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 rounded-full border border-blue-100 overflow-hidden shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`} alt="avatar" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-gray-800 leading-tight">{worker.name}</span>
                              {worker.status === 'Verified' && (
                                <CheckCircle2 size={12} className="text-blue-500 fill-blue-500/10" />
                              )}
                              {worker.isReapplication && (
                                <span className="bg-purple-100 text-purple-600 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                  Reapplication
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-[11px] font-bold text-gray-500">{worker.skill}</td>
                      <td className="px-8 py-5 text-[11px] font-bold text-gray-500">{worker.location}</td>
                      <td className="px-8 py-5 text-[11px] font-bold text-gray-500 text-nowrap">{worker.status === 'Suspended' ? worker.suspensionDetails?.date : worker.submitted}</td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button 
                            onClick={() => setSelectedWorker(worker)}
                            className={`border px-6 py-1 rounded-full text-[10px] font-black transition-all whitespace-nowrap ${
                                (worker.status === 'Verified' || worker.status === 'Suspended') ? 'border-gray-200 text-gray-500 hover:bg-gray-50' : 'border-blue-400 text-blue-500 hover:bg-blue-50'
                            }`}
                          >
                            {(worker.status === 'Verified' || worker.status === 'Suspended') ? 'View Profile' : 'View Docs'}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {selectedWorker && !showRejectModal && !showHistoryModal && !showSuspendModal && !showReinstateModal && (
          selectedWorker.status === 'Verified' ? (
            <VerifiedWorkerModal 
              worker={selectedWorker} 
              onClose={() => setSelectedWorker(null)} 
              onSuspend={() => setShowSuspendModal(true)}
            />
          ) : selectedWorker.status === 'Rejected' ? (
            <RejectedWorkerModal 
              worker={selectedWorker}
              onClose={() => setSelectedWorker(null)}
            />
          ) : selectedWorker.status === 'Suspended' ? (
            <SuspendedWorkerModal 
              worker={selectedWorker}
              onClose={() => setSelectedWorker(null)}
              onReinstate={() => setShowReinstateModal(true)}
            />
          ) : (
            <WorkerModal 
              worker={selectedWorker} 
              onClose={() => setSelectedWorker(null)} 
              onReject={() => setShowRejectModal(true)} 
              onApprove={() => updateWorkerStatus(selectedWorker.id, 'Verified')} 
              onSuspend={() => setShowSuspendModal(true)}
            />
          )
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReinstateModal && (
            <ReinstateModal 
                worker={selectedWorker}
                onClose={() => setShowReinstateModal(false)}
                onConfirm={() => updateWorkerStatus(selectedWorker.id, 'Verified')}
            />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuspendModal && (
          <SuspendModal 
            worker={selectedWorker} 
            onClose={() => setShowSuspendModal(false)} 
            onConfirm={(reason, details) => updateWorkerStatus(selectedWorker.id, 'Suspended', {
                reason,
                details,
                date: new Date().toLocaleString(),
                suspendedBy: 'Admin'
            })} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRejectModal && (
          <RejectModal 
            worker={selectedWorker} 
            onClose={() => setShowRejectModal(false)} 
            onConfirmReject={(reason, details) => updateWorkerStatus(selectedWorker.id, 'Rejected', {
              reason,
              details,
              date: new Date().toLocaleString(),
              rejectedBy: 'Admin'
            })} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistoryModal && (
          <HistoryModal 
            worker={selectedWorker}
            onClose={() => {
              setShowHistoryModal(false);
              setSelectedWorker(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- NEW MODALS BASED ON IMAGES ---

const SuspendedWorkerModal = ({ worker, onClose, onReinstate }) => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-gray-900">Suspended Worker Account</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Suspended on: {worker.suspensionDetails?.date}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
        </div>
  
        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6">
          <div className="flex items-center gap-5 p-1">
            <div className="w-16 h-16 bg-blue-50 rounded-full border-2 border-blue-100 overflow-hidden shrink-0">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`} alt="avatar" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-gray-900">{worker.name}</h3>
                  <span className="bg-[#FFEFE6] text-[#FF8A4C] text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Suspended</span>
              </div>
              <p className="text-sm font-bold text-gray-500">{worker.skill}</p>
              <div className="flex items-center gap-1 text-gray-400 font-bold text-[11px]">
                <MapPin size={12} /> <span>{worker.location}</span>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-2 border border-gray-100 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 bg-gray-50/50 p-3 border-r border-gray-100">
              <Mail size={14} className="text-gray-400" />
              <span className="text-[11px] font-bold text-gray-600 truncate">{worker.email}</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 p-3">
              <Phone size={14} className="text-gray-400" />
              <span className="text-[11px] font-bold text-gray-600">{worker.phone}</span>
            </div>
          </div>
  
          <div className="bg-[#FFF8F1] border border-[#FFE7D1] p-6 rounded-2xl space-y-3">
            <h4 className="text-[12px] font-black text-[#E87B35] uppercase tracking-widest">Suspended</h4>
            <p className="text-[11px] font-bold text-gray-600 leading-none">Reason: <span className="text-gray-900">{worker.suspensionDetails?.reason}</span></p>
            <p className="text-[11px] font-bold text-gray-500 leading-relaxed">Details: {worker.suspensionDetails?.details}</p>
            <div className="pt-3 border-t border-[#FFE7D1] flex justify-between items-center text-[9px] font-black text-gray-400 uppercase">
               <span>Suspended by: {worker.suspensionDetails?.suspendedBy}</span>
               <span>Date: {worker.suspensionDetails?.date}</span>
            </div>
          </div>
  
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Uploaded ID Documents</h4>
            <p className="text-[11px] font-bold text-gray-400">ID Type : <span className="text-gray-700">Passport</span></p>
            <div className="grid grid-cols-2 gap-4">
              <IDCard label="Front of ID" />
              <IDCard label="Selfie with ID" />
            </div>
          </div>
  
          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 flex justify-between items-center cursor-pointer">
             <div className="flex items-center gap-3">
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">Verified Identity Information</span>
             </div>
             <ChevronDown size={16} className="text-gray-400" />
          </div>
  
          <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Proof of Work</h4>
              <p className="text-[11px] font-bold text-gray-400">No Proof of Work submitted.</p>
          </div>
        </div>
  
        <div className="p-8 pt-0 flex gap-4 bg-white">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-full font-black text-xs uppercase text-gray-500 hover:bg-gray-50 transition-all">Close</button>
          <button onClick={onReinstate} className="flex-1 py-3 bg-[#59B28D] text-white rounded-full font-black text-xs uppercase hover:bg-[#4a9a7a] shadow-lg transition-all">Reinstate Worker</button>
        </div>
      </motion.div>
    </motion.div>
);

const ReinstateModal = ({ worker, onClose, onConfirm }) => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800">Reinstate Worker Account</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <div className="p-8 space-y-6">
            <p className="text-[11px] font-bold text-gray-500 -mt-4">This will restore the worker's ability to appear in search and accept jobs.</p>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`} alt="avatar" />
                </div>
                <div>
                    <h4 className="font-black text-gray-900 leading-none mb-1">{worker.name}</h4>
                    <span className="text-[10px] font-black text-[#FF8A4C] uppercase bg-orange-50 px-2 py-0.5 rounded-md">Suspended</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-700 uppercase">Admin Note</label>
                <textarea 
                    placeholder="Reason for reinstatement (e.g., reviewed and cleared, issue resolved)."
                    className="w-full h-24 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400 resize-none placeholder:text-gray-300 font-medium"
                />
                <p className="text-[10px] text-gray-400 font-bold">This will notify the worker that their account has been reinstated.</p>
            </div>

            <div className="bg-[#E6F7F0] border border-[#D1EFE3] p-5 rounded-xl space-y-3">
                <p className="text-[11px] font-black text-gray-700 uppercase tracking-tighter">What happens next:</p>
                <ul className="text-[11px] font-bold text-gray-600 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#59B28D]" /> Worker status becomes <span className="font-black">Verified</span></li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#59B28D]" /> Worker becomes visible to homeowners</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#59B28D]" /> Worker can accept new job requests</li>
                </ul>
            </div>
        </div>

        <div className="p-8 pt-0 flex gap-4">
            <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-full font-black text-xs uppercase text-gray-500 hover:bg-gray-50">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-3 bg-[#59B28D] text-white rounded-full font-black text-xs uppercase hover:bg-[#4a9a7a] shadow-lg">Confirm Reinstate</button>
        </div>
      </motion.div>
    </motion.div>
);

// --- OTHER MODAL COMPONENTS ---

const RejectedWorkerModal = ({ worker, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
    >
      <div className="p-8 pb-4 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-black text-gray-900">Rejected Worker Application</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rejected on: {worker.previousRejection?.date || worker.submitted}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6">
        <div className="flex items-center gap-5 p-1">
          <div className="w-16 h-16 bg-blue-50 rounded-full border-2 border-blue-100 overflow-hidden shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`} alt="avatar" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900">{worker.name}</h3>
                <span className="bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Rejected</span>
            </div>
            <p className="text-sm font-bold text-gray-500">{worker.skill}</p>
            <div className="flex items-center gap-1 text-gray-400 font-bold text-[11px]">
              <MapPin size={12} /> <span>{worker.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 bg-gray-50/50 p-3 border-r border-gray-100">
            <Mail size={14} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-600 truncate">{worker.email}</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50/50 p-3">
            <Phone size={14} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-600">{worker.phone}</span>
          </div>
        </div>

        <div className="bg-[#FFF5F5] border border-red-100 p-6 rounded-2xl space-y-3">
          <h4 className="text-[12px] font-black text-red-600 uppercase tracking-widest">Rejected</h4>
          <p className="text-[11px] font-bold text-gray-600 leading-none">Reason: <span className="text-gray-900">{worker.previousRejection?.reason}</span></p>
          <p className="text-[11px] font-bold text-gray-500 leading-relaxed italic">Details: "{worker.previousRejection?.details}"</p>
          <div className="pt-3 border-t border-red-100 flex justify-between items-center text-[9px] font-black text-gray-400 uppercase">
             <span>Rejected by: {worker.previousRejection?.rejectedBy || 'Admin'}</span>
             <span>Date: {worker.previousRejection?.date}</span>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Uploaded ID Documents</h4>
          <p className="text-[11px] font-bold text-gray-400">ID Type : <span className="text-gray-700">Passport</span></p>
          <div className="grid grid-cols-2 gap-4">
            <IDCard label="Front of ID" />
            <IDCard label="Selfie with ID" />
          </div>
        </div>

        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 flex justify-between items-center cursor-pointer">
           <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">Verified Identity Information</span>
           </div>
           <ChevronDown size={16} className="text-gray-400" />
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Proof of Work</h4>
            <p className="text-[11px] font-bold text-gray-400">No Proof of Work submitted.</p>
        </div>
      </div>

      <div className="p-8 pt-0 flex justify-end bg-white">
        <button onClick={onClose} className="px-12 py-3 border border-gray-200 rounded-full font-black text-xs uppercase text-gray-500 hover:bg-gray-50 transition-all">Close</button>
      </div>
    </motion.div>
  </motion.div>
);

const VerifiedWorkerModal = ({ worker, onClose, onSuspend }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
    >
      <div className="p-8 pb-4 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-black text-gray-900">Worker Profile Details</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified on: {worker.verifiedDate || worker.submitted}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6">
        <div className="flex items-center gap-5 p-1">
          <div className="w-16 h-16 bg-blue-50 rounded-full border-2 border-blue-100 overflow-hidden shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`} alt="avatar" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900">{worker.name}</h3>
                <span className="bg-green-100 text-green-600 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">Verified</span>
            </div>
            <p className="text-sm font-bold text-gray-500">{worker.skill}</p>
            <div className="flex items-center gap-1 text-gray-400 font-bold text-[11px]">
              <MapPin size={12} /> <span>{worker.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 bg-gray-50/50 p-3 border-r border-gray-100">
            <Mail size={14} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-600 truncate">{worker.email}</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50/50 p-3">
            <Phone size={14} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-600">{worker.phone}</span>
          </div>
        </div>
        
        <div className="h-px bg-gray-100 w-full" />

        <div className="space-y-4">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Uploaded ID Documents</h4>
          <p className="text-[11px] font-bold text-gray-400">ID Type : <span className="text-gray-700">Passport</span></p>
          <div className="grid grid-cols-2 gap-4">
            <IDCard label="Front of ID" />
            <IDCard label="Selfie with ID" />
          </div>
        </div>

        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 flex justify-between items-center cursor-pointer">
           <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">Verified Identity Information</span>
           </div>
           <ChevronDown size={16} className="text-gray-400" />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Performance & Activity</h4>
              <p className="text-[10px] text-gray-400 font-bold">Summary based on completed jobs and recent activity.</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
              <StatBox label="Jobs Completed" value={worker.stats?.completed || 12} />
              <StatBox label="Average Rating" value={worker.stats?.rating || '4.6'} />
              <StatBox label="Cancelled Jobs" value={worker.stats?.cancelled || 4} />
              <StatBox label="Last Active" value={worker.stats?.lastActive || 'Feb 18'} />
          </div>
        </div>
      </div>

      <div className="p-8 pt-0 flex gap-4 bg-white">
        <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-full font-black text-xs uppercase text-gray-500 hover:bg-gray-50 transition-all">Close</button>
        <button onClick={onSuspend} className="flex-1 py-3 border-2 border-[#D15F5F] text-[#D15F5F] rounded-full font-black text-xs uppercase hover:bg-red-50 transition-all">Suspend Worker</button>
      </div>
    </motion.div>
  </motion.div>
);

const SuspendModal = ({ worker, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState("Inactivity for an extended period");
  const [details, setDetails] = useState("");
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <OctagonAlert className="text-red-500" size={24} />
                <h3 className="text-lg font-black text-gray-800">Suspend Worker's Account</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>

        <div className="p-8 space-y-6">
            <p className="text-[11px] font-bold text-gray-500 -mt-4">This will temporarily restrict the worker from accepting new jobs.</p>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`} alt="avatar" />
                </div>
                <div>
                    <h4 className="font-black text-gray-900 leading-none mb-1">{worker.name}</h4>
                    <span className="text-[10px] font-black text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-md">Verified</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-700 uppercase">Reason for Suspension *</label>
                <div className="relative">
                    <select 
                        value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none appearance-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all font-medium"
                    >
                        <option>Inactivity for an extended period</option>
                        <option>Repeated job cancellations</option>
                        <option>Unresponsive to service requests</option>
                        <option>Violation of platform guidelines</option>
                        <option>Suspicious or unusual activity</option>
                        <option>User complaint under review</option>
                        <option>Administrative review</option>
                        <option>Other</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-700 uppercase">Additional Details (Required)</label>
                <textarea 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Describe the issue or concern (e.g., repeated cancellations, account review, reported inconsistency)."
                    className="w-full h-24 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 resize-none placeholder:text-gray-300 font-medium"
                />
            </div>

            <div className="bg-[#FFF8F0] border border-orange-100 p-5 rounded-xl space-y-3">
                <p className="text-[11px] font-black text-orange-700 uppercase tracking-tighter">What happens when suspended:</p>
                <ul className="text-[11px] font-bold text-orange-600 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-orange-400" /> Worker cannot accept new job requests</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-orange-400" /> Worker will not appear in search results</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-orange-400" /> Existing job history remains unchanged</li>
                </ul>
            </div>
            <p className="text-[10px] text-gray-400 font-bold text-center italic">The worker will be notified about this suspension.</p>
        </div>

        <div className="p-8 pt-0 flex gap-4">
            <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-full font-black text-xs uppercase text-gray-500 hover:bg-gray-50">Cancel</button>
            <button 
                onClick={() => onConfirm(selectedReason, details)} 
                className="flex-1 py-3 bg-[#BD3E3E] text-white rounded-full font-black text-xs uppercase hover:bg-red-800 shadow-lg"
            >
                Confirm Suspension
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatBox = ({ label, value }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm h-24">
        <span className="text-[18px] font-black text-gray-800">{value}</span>
        <span className="text-[8px] font-black text-gray-400 uppercase leading-tight mt-1">{label}</span>
    </div>
);

const HistoryModal = ({ worker, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
      className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <History className="text-blue-500" size={20} />
          <h3 className="text-lg font-bold text-gray-800">Rejection History</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-8">
        <div className="relative border-l-2 border-dashed border-gray-200 pl-6 space-y-8">
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-100" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Previous Rejection</span>
                <span className="text-[10px] font-bold text-gray-400">{worker.previousRejection?.date}</span>
              </div>
              <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl">
                <p className="text-xs font-black text-red-600 uppercase mb-1">Reason:</p>
                <p className="text-sm font-bold text-gray-800 mb-3">{worker.previousRejection?.reason}</p>
                <p className="text-xs font-black text-gray-400 uppercase mb-1">Details:</p>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{worker.previousRejection?.details}"</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-3 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-lg"
        >
          Close History
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const RejectModal = ({ worker, onClose, onConfirmReject }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");

  const reasons = [
    "Incomplete or unclear documents",
    "Unclear or low-quality ID images",
    "Required ID images were not fully submitted",
    "ID details did not match the application information",
    "Unable to verify identity based on submitted documents",
    "Submitted ID is invalid or expired",
    "Unsupported type of identification submitted",
    "Missing or incomplete application information",
    "Insufficient work details or proof provided",
    "Application could not be approved at this time",
    "Other"
  ];

  const isFormValid = selectedReason !== "" && details.trim().length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-[500px] rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={24} />
            <h3 className="text-lg font-bold text-gray-800">Reject Worker Application</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            You are about to reject this worker's application. Please provide a reason. The worker will be notified and may be allowed to resubmit.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
              Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all cursor-pointer font-medium"
              >
                <option value="" disabled>Select a reason</option>
                {reasons.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
              Additional Details (Required)
            </label>
            <textarea 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please briefly explain the issue to help the applicant understand what needs to be corrected."
              className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all resize-none text-sm text-gray-700 font-medium"
            />
          </div>
        </div>

        <div className="px-8 pb-8 flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 border border-gray-200 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!isFormValid}
            onClick={() => onConfirmReject(selectedReason, details)}
            className={`flex-1 py-3 rounded-full text-sm font-bold transition-all shadow-md ${
              isFormValid 
              ? 'bg-[#B33A3A] text-white hover:bg-[#962d2d]' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            Reject Application
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const WorkerModal = ({ worker, onClose, onReject, onApprove, onSuspend }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
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
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900">{worker.name}</h3>
                {worker.status === 'Verified' && (
                    <CheckCircle2 size={16} className="text-blue-500 fill-blue-500/10" />
                )}
            </div>
            <p className="text-sm font-bold text-gray-500">{worker.skill}</p>
            <div className="flex items-center gap-1 text-blue-500 font-bold text-xs">
              <MapPin size={14} /> <span>{worker.location}</span>
            </div>
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
              <DetailField label="Date of Issue" />
              <DetailField label="Valid Until" />
              <DetailField label="Issuing Authority" />
            </div>
          </div>
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