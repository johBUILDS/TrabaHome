import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Home, ClipboardList, 
  MessageSquare, User, Bell, Search, ChevronLeft, ChevronRight, X, MapPin, Mail, Phone, Ban, ChevronDown, AlertTriangle, Clock, Calendar, CheckCircle2, ArrowRight, Check
} from 'lucide-react';

const AdminHomeowners = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Homeowners');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [selectedHomeowner, setSelectedHomeowner] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  
  // STATES FOR SUSPENSION & REINSTATEMENT
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [showReinstateConfirm, setShowReinstateConfirm] = useState(false);
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDetails, setSuspendDetails] = useState(""); 
  const [reinstateNote, setReinstateNote] = useState(""); 

  const suspensionReasons = [
    "Spam / Fake Service Requests",
    "Frequent Cancellations",
    "No-show / Unreachable",
    "Harassment / Abusive Behavior",
    "Inappropriate / Prohibited Requests",
    "Misleading Request Information",
    "Suspected Fraud / Scam Attempts",
    "Other"
  ];

  const [homeowners, setHomeowners] = useState([
    { 
        id: 1, 
        name: 'Myrna Reyes', 
        location: 'Banaoang, Mangaldan, Pangasinan', 
        requests: 4, 
        joinedOn: 'January 20, 2026 10:46 AM', 
        email: 'myrna.reyes@email.com', 
        phone: '+63 9672232334', 
        status: 'Active',
        stats: { total: 14, pending: 2, ongoing: 2, completed: 8, cancelled: 2 },
        history: [
            { id: 101, service: 'Plumber', worker: 'Vincent Reyes', date: 'February 12, 2026 10:00 PM', status: 'Cancelled' },
            { id: 102, service: 'Carpenter', worker: 'Mang Kanor', date: 'February 12, 2026 5:00 PM', status: 'Pending' },
            { id: 103, service: 'Cleaner', worker: 'Aling Nene', date: 'February 10, 2026 2:00 PM', status: 'Completed' }
        ]
    },
    { id: 2, name: 'Juan Dela Cruz', location: 'Dagupan City, Pangasinan', requests: 2, joinedOn: 'January 21, 2026 09:15 AM', email: 'juan.dc@email.com', phone: '09987654321', status: 'Active', stats: { total: 2, pending: 0, ongoing: 0, completed: 2, cancelled: 0 }, history: [] },
    { 
        id: 3, 
        name: 'Maria Santos', 
        location: 'Calasiao, Pangasinan', 
        requests: 1, 
        joinedOn: 'January 15, 2026 02:30 PM', 
        email: 'maria.s@email.com', 
        phone: '09112233445', 
        status: 'Suspended', 
        stats: { total: 1, pending: 0, ongoing: 0, completed: 0, cancelled: 1 }, 
        suspensionData: {
            reason: "Spam / Fake Service Requests",
            details: "High volume of requests created with similar descriptions, sent to multiple workers, creating unnecessary load in the Pending/Accepted queue.",
            date: "January 20, 2026, 10:46 AM",
            admin: "Admin"
        },
        history: [] 
    },
  ]);

  const handleNavigation = (label) => {
    setActiveTab(label);
     if (label === 'Dashboard') {
      navigate('/admin-dashboard'); 
    } else if (label === 'Homeowners') {
      navigate('/admin-homeowners'); 
    } else if (label === 'Requests') {
      navigate('/admin-requests'); 
    } else if (label === 'SMS Logs') {
      navigate('/admin-smslogs'); 
    }
    else if (label === 'Workers') { 
      navigate('/admin-workers'); 
    } else if (label === 'Profile') {
      navigate('/admin-profile');
    }
  };
  const handleConfirmSuspend = () => {
    if (!suspendReason || !suspendDetails) return;
    setHomeowners(prev => prev.map(h => h.id === selectedHomeowner.id ? { 
        ...h, 
        status: 'Suspended',
        suspensionData: {
            reason: suspendReason,
            details: suspendDetails,
            date: new Date().toLocaleString(),
            admin: "Admin"
        }
    } : h));
    setSelectedHomeowner(null);
    setShowSuspendConfirm(false);
    setSuspendReason("");
    setSuspendDetails("");
    setStatusFilter('Suspended');
  };

  const handleConfirmReinstate = () => {
    if (!reinstateNote) return;
    setHomeowners(prev => prev.map(h => h.id === selectedHomeowner.id ? { ...h, status: 'Active', suspensionData: null } : h));
    setSelectedHomeowner(null);
    setShowReinstateConfirm(false);
    setReinstateNote("");
    setStatusFilter('Active');
  };

  // ACCURATE SEARCH AND FILTER LOGIC
  const filteredHomeowners = homeowners.filter(h => {
    const matchesStatus = h.status === statusFilter;
    const matchesSearch = 
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col h-screen bg-[#F8F5F2] overflow-hidden font-sans text-slate-900">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 z-20 shadow-sm shrink-0">
        <img src="/assets/Logo.png" alt="TrabaHome" className="h-12 w-auto" />
        <motion.div whileHover={{ rotate: 15 }} className="bg-gray-50 p-2 rounded-full cursor-pointer text-slate-800">
          <Bell size={24} />
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
                  onClick={() => handleNavigation(label)} 
                />
              ))}
            </nav>
            <div className="pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400">
                    <User size={20} />
                </div>
                <span className="font-bold text-gray-700 text-sm">Admin</span>
              </div>
              <button className="w-full py-2 border border-gray-200 rounded-full text-gray-500 text-xs font-semibold hover:bg-red-50 hover:text-red-500 transition-all">
                Logout
              </button>
            </div>
          </aside>
        </motion.div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-10 pl-6">
            <div className="mb-6">
                <h1 className="text-[32px] font-black text-gray-900 leading-tight">Homeowners</h1>
                <p className="text-gray-500 text-sm font-medium mt-1">Monitor homeowner accounts and service activity.</p>
            </div>

            <div className="flex flex-col gap-6 mb-8">
                <div className="flex justify-end">
                    <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input 
                          type="text" 
                          placeholder="Search by name" 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-11 pr-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-50" 
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    {['Active', 'Suspended'].map((status) => (
                        <button 
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight flex items-center gap-6 transition-all shadow-sm border ${
                                statusFilter === status ? 'bg-[#E3F2FD] border-blue-100 text-gray-800' : 'bg-white border-transparent text-gray-400'
                            }`}
                        >
                            {status} <span className="text-blue-500">{homeowners.filter(h => h.status === status).length}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* List Header */}
            <div className="grid grid-cols-5 px-10 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                <div>Homeowner</div>
                <div className="text-center">Location</div>
                <div className="text-center">Requests</div>
                <div className="text-center">Joined On</div>
                <div className="text-right">Actions</div>
            </div>

            {/* Homeowner Rows */}
            <div className="space-y-3 mb-8">
                {filteredHomeowners.length > 0 ? (
                  filteredHomeowners.map((homeowner) => (
                      <motion.div 
                          key={homeowner.id}
                          whileHover={{ y: -2 }}
                          className="grid grid-cols-5 items-center px-10 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all"
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-[#FFB7D5] rounded-full border-2 border-white flex items-center justify-center overflow-hidden">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${homeowner.id}`} alt="avatar" />
                              </div>
                              <span className="text-xs font-black text-gray-800">{homeowner.name}</span>
                          </div>
                          <div className="text-[10px] font-bold text-gray-500 text-center leading-tight">{homeowner.location}</div>
                          <div className="text-xs font-black text-gray-800 text-center">{homeowner.requests}</div>
                          <div className="text-[9px] font-black text-gray-500 uppercase text-center">{homeowner.joinedOn}</div>
                          <div className="text-right">
                              <button 
                                onClick={() => {
                                  setSelectedHomeowner(homeowner);
                                  setShowSuspendConfirm(false);
                                  setShowReinstateConfirm(false);
                                }}
                                className="px-5 py-1.5 border border-blue-500 text-blue-500 rounded-full text-[9px] font-black uppercase tracking-tight hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                              >
                                  View Profile
                              </button>
                          </div>
                      </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 text-sm font-bold">No homeowners found matching your search.</div>
                )}
            </div>
        </main>
      </div>

      {/* Main Profile Modal */}
      <AnimatePresence mode="wait">
        {selectedHomeowner && !showSuspendConfirm && !showReinstateConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedHomeowner(null)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="p-6 border-b border-gray-50 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-black text-slate-800">
                        {selectedHomeowner.status === 'Suspended' ? 'Suspended Homeowner Account' : 'Homeowner Profile Details'}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400">
                        {selectedHomeowner.status === 'Suspended' ? `Suspended on: ${selectedHomeowner.suspensionData?.date}` : `Joined on: ${selectedHomeowner.joinedOn}`}
                    </p>
                </div>
                <button onClick={() => setSelectedHomeowner(null)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-all"><X size={18} /></button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-[#FFB7D5] rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedHomeowner.id}`} alt="avatar" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-slate-800">{selectedHomeowner.name}</h2>
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase ${selectedHomeowner.status === 'Suspended' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                                {selectedHomeowner.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 mt-0.5">
                            <MapPin size={12} />
                            <span className="text-[11px] font-bold">{selectedHomeowner.location}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mb-8">
                    <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-slate-600">{selectedHomeowner.email}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-slate-600">{selectedHomeowner.phone}</span>
                    </div>
                </div>

                {selectedHomeowner.status === 'Suspended' && (
                    <div className="bg-[#FFF3E0] rounded-2xl p-6 mb-8 border border-orange-100">
                        <h4 className="text-sm font-black text-[#E65100] mb-3">Suspended</h4>
                        <div className="space-y-2">
                            <p className="text-[11px] text-slate-700">
                                <span className="font-black">Reason: </span> {selectedHomeowner.suspensionData?.reason}
                            </p>
                            <p className="text-[11px] text-slate-700 leading-relaxed">
                                <span className="font-black">Details: </span> {selectedHomeowner.suspensionData?.details}
                            </p>
                            <p className="text-[11px] text-slate-700">
                                <span className="font-black">Suspended by: </span> {selectedHomeowner.suspensionData?.admin}
                            </p>
                            <p className="text-[11px] text-slate-700">
                                <span className="font-black">Date: </span> {selectedHomeowner.suspensionData?.date}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-5 gap-2 mb-8">
                    <StatBox label="Total" value={selectedHomeowner.stats.total} color="bg-[#1D4E89]" textColor="text-white" />
                    <StatBox label="Pending" value={selectedHomeowner.stats.pending} color="bg-[#FFF9C4]" textColor="text-yellow-700" />
                    <StatBox label="Ongoing" value={selectedHomeowner.stats.ongoing} color="bg-[#E8F5E9]" textColor="text-green-700" />
                    <StatBox label="Completed" value={selectedHomeowner.stats.completed} color="bg-[#C8E6C9]" textColor="text-green-800" />
                    <StatBox label="Cancelled" value={selectedHomeowner.stats.cancelled} color="bg-[#FFCDD2]" textColor="text-red-700" />
                </div>

                <div className="mb-6">
                    <h4 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-wider">Recent Service Requests</h4>
                    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase">
                                    <th className="px-4 py-3">Service</th>
                                    <th className="px-4 py-3">Worker</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {selectedHomeowner.history.map((req) => (
                                    <tr key={req.id} className="text-[11px] font-bold text-slate-600">
                                        <td className="px-4 py-3">{req.service}</td>
                                        <td className="px-4 py-3">{req.worker}</td>
                                        <td className="px-4 py-3">
                                            <span className={`${
                                                req.status === 'Completed' ? 'text-green-500' : 
                                                req.status === 'Cancelled' ? 'text-red-500' : 'text-yellow-600'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400">{req.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button className="flex items-center gap-1 text-[11px] font-black text-blue-500 mt-4 uppercase">
                        View all requests <ArrowRight size={14} />
                    </button>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-4">
                <button onClick={() => setSelectedHomeowner(null)} className="flex-1 py-3 border border-gray-200 rounded-full text-[11px] font-black uppercase text-gray-500 hover:bg-gray-50 transition-all">Close</button>
                {selectedHomeowner.status === 'Suspended' ? (
                    <button 
                        onClick={() => setShowReinstateConfirm(true)} 
                        className="flex-1 py-3 bg-[#66BB6A] text-white rounded-full text-[11px] font-black uppercase hover:bg-green-600 transition-all shadow-md"
                    >
                        Reinstate Homeowner
                    </button>
                ) : (
                    <button 
                        onClick={() => setShowSuspendConfirm(true)} 
                        className="flex-1 py-3 border-2 border-[#D32F2F] text-[#D32F2F] rounded-full text-[11px] font-black uppercase hover:bg-red-50 transition-all"
                    >
                        Suspend Homeowner
                    </button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* REINSTATE MODAL */}
        {showReinstateConfirm && selectedHomeowner && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReinstateConfirm(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 flex items-center gap-3 border-b border-gray-50">
                <div className="flex-1">
                    <h2 className="text-base font-black text-slate-800">Reinstate Homeowner Account</h2>
                    <p className="text-[10px] font-bold text-gray-400">This will re-enable the homeowner account to submit new service requests.</p>
                </div>
                <button onClick={() => setShowReinstateConfirm(false)} className="p-1 text-gray-300 hover:bg-gray-50 rounded-full transition-all"><X size={18} /></button>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-[#FFB7D5] rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedHomeowner.id}`} alt="avatar" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-slate-800">{selectedHomeowner.name}</h3>
                            <span className="px-2 py-0.5 bg-orange-50 text-orange-500 text-[9px] font-black rounded-full uppercase">Suspended</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Homeowner</p>
                        <div className="flex items-center gap-1 text-blue-500 mt-0.5">
                            <MapPin size={10} />
                            <span className="text-[10px] font-black">{selectedHomeowner.location}</span>
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <label className="text-[11px] font-black text-slate-800 block mb-2">Admin Note</label>
                    <textarea 
                        value={reinstateNote}
                        onChange={(e) => setReinstateNote(e.target.value)}
                        placeholder="Reason for reinstatement (e.g., reviewed and cleared, issue resolved)."
                        className="w-full h-28 bg-white border border-gray-200 rounded-xl p-4 text-xs font-bold text-slate-700 placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    />
                    <p className="text-[10px] font-bold text-gray-400 mt-2">This will notify the homeowner that their account has been reinstated.</p>
                </div>
                <div className="bg-[#E3F2FD] rounded-2xl p-5 mb-8 border border-blue-100">
                    <h4 className="text-[11px] font-black text-[#1565C0] mb-3 uppercase tracking-wider">What happens next:</h4>
                    <ul className="space-y-2">
                        <li className="flex gap-2 text-[10px] font-bold text-[#0D47A1]">
                            <Check size={14} className="shrink-0" />
                            <span>Homeowner status becomes <span className="font-black">Active</span></span>
                        </li>
                        <li className="flex gap-2 text-[10px] font-bold text-[#0D47A1]">
                            <Check size={14} className="shrink-0" />
                            <span>Homeowner can create new service requests</span>
                        </li>
                    </ul>
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex gap-4">
                <button onClick={() => setShowReinstateConfirm(false)} className="flex-1 py-3 bg-white border border-gray-200 rounded-full text-[11px] font-black uppercase text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
                <button 
                    disabled={!reinstateNote} 
                    onClick={handleConfirmReinstate} 
                    className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase transition-all shadow-sm ${
                        reinstateNote ? 'bg-[#66BB6A] text-white hover:bg-green-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Confirm Reinstatement
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* SUSPENSION MODAL */}
        {showSuspendConfirm && selectedHomeowner && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSuspendConfirm(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 flex items-center gap-3 border-b border-gray-50">
                <AlertTriangle className="text-[#D32F2F]" size={24} />
                <div className="flex-1">
                    <h2 className="text-base font-black text-slate-800">Suspend Homeowner's Account</h2>
                    <p className="text-[10px] font-bold text-gray-400">This will temporarily restrict the homeowner from requesting new services.</p>
                </div>
                <button onClick={() => setShowSuspendConfirm(false)} className="p-1 text-gray-300 hover:bg-gray-50 rounded-full transition-all"><X size={18} /></button>
              </div>
              <div className="p-8 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-[#FFB7D5] rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedHomeowner.id}`} alt="avatar" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-slate-800">{selectedHomeowner.name}</h3>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[9px] font-black rounded-full uppercase">Active</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Homeowner</p>
                    </div>
                </div>
                <div className="relative mb-6">
                    <label className="text-[11px] font-black text-slate-800 block mb-2">Reason for Suspension <span className="text-red-500">*</span></label>
                    <div onClick={() => setShowReasonDropdown(!showReasonDropdown)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer">
                        <span className="text-xs font-bold text-slate-800">{suspendReason || "Select a reason"}</span>
                        <ChevronDown size={16} />
                    </div>
                    <AnimatePresence>
                        {showReasonDropdown && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute z-[70] top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl py-2 w-full max-h-48 overflow-y-auto">
                                {suspensionReasons.map((reason) => (
                                    <div key={reason} onClick={() => { setSuspendReason(reason); setShowReasonDropdown(false); }} className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-gray-50 cursor-pointer">{reason}</div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="mb-6">
                    <label className="text-[11px] font-black text-slate-800 block mb-2">Additional Details (Required)</label>
                    <textarea 
                        value={suspendDetails} 
                        onChange={(e) => setSuspendDetails(e.target.value)} 
                        placeholder="Describe the issue or concern (e.g., repeated cancellations, no-show incidents, spam/fake requests)."
                        className="w-full h-28 border rounded-xl p-4 text-xs font-bold" 
                    />
                </div>
                <div className="bg-[#FFF3E0] rounded-2xl p-5 mb-8">
                    <h4 className="text-[11px] font-black text-[#E65100] mb-3 uppercase tracking-wider">What happens when suspended:</h4>
                    <ul className="space-y-2">
                        <li className="flex gap-2 text-[10px] font-bold text-[#BF360C]">
                            <Check size={14} className="shrink-0" />
                            <span>Homeowner can still view past requests, but cannot create new ones</span>
                        </li>
                    </ul>
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex gap-4">
                <button onClick={() => setShowSuspendConfirm(false)} className="flex-1 py-3 bg-white border border-gray-200 rounded-full text-[11px] font-black uppercase text-gray-500">Cancel</button>
                <button onClick={handleConfirmSuspend} className="flex-1 py-3 bg-[#B71C1C] text-white rounded-full text-[11px] font-black uppercase">Confirm Suspension</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <motion.div onClick={onClick} whileHover={{ x: 5 }} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600 border-l-[6px] border-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>{icon}<span className="text-[13px] font-bold">{label}</span></motion.div>
);

const StatBox = ({ label, value, color, textColor }) => (
    <div className={`p-3 rounded-xl ${color} flex flex-col items-center justify-center shadow-sm`}>
        <span className={`text-lg font-black ${textColor}`}>{value}</span>
        <span className={`text-[9px] font-black uppercase tracking-tight ${textColor} opacity-80`}>{label}</span>
    </div>
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

export default AdminHomeowners;