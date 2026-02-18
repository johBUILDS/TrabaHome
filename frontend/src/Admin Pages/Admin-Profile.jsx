import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Home, ClipboardList, MessageSquare, User, Bell, Edit3, MoreHorizontal, ChevronRight, Search, ChevronDown, X } from 'lucide-react';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [showAllActivity, setShowAllActivity] = useState(false);

  // --- NEW FUNCTIONALITY STATES ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'email' or 'password'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "admin@trabahome.com",
    phone: "+63 955 224 2378",
    role: "System Administrator"
  });

  const handleNavigation = (label) => {
    setActiveTab(label);
    if (label === 'Dashboard') navigate('/admin-dashboard');
    else if (label === 'Homeowners') navigate('/admin-homeowners');
    else if (label === 'Requests') navigate('/admin-requests');
    else if (label === 'SMS Logs') navigate('/admin-smslogs');
    else if (label === 'Workers') navigate('/admin-workers');
    else if (label === 'Profile') {
      setShowAllActivity(false);
      navigate('/admin-profile');
    }
  };

  const activities = [
    { date: 'Feb 18, 2026', time: '3:00 PM', action: 'Suspend worker', module: 'Workers', target: 'Ryan Noel' },
    { date: 'Feb 18, 2026', time: '3:00 PM', action: 'Reinstate homeowner', module: 'Homeowners', target: 'Myrna Reyes' },
    { date: 'Feb 18, 2026', time: '3:00 PM', action: 'Suspend homeowner', module: 'Homeowners', target: 'Felipe Estrada' },
    { date: 'Feb 18, 2026', time: '3:00 PM', action: 'Verified worker', module: 'Workers', target: 'Daniel Cruz' },
    { date: 'Feb 18, 2026', time: '3:00 PM', action: 'Viewed SMS log', module: 'SMS Logs', target: 'SMS-000123' },
  ];

  const extendedActivities = Array(3).fill(activities).flat();

  // --- FILTER LOGIC ---
  const filteredActivities = useMemo(() => {
    return extendedActivities.filter(item => {
      const matchesSearch = item.target.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.action.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = selectedModule === 'All' || item.module === selectedModule;
      return matchesSearch && matchesModule;
    });
  }, [searchQuery, selectedModule]);

  // --- EXPORT FUNCTIONALITY ---
  const handleExportCSV = () => {
    const headers = "Date,Time,Action,Module,Target\n";
    const csvContent = filteredActivities.map(a => `${a.date},${a.time},${a.action},${a.module},${a.target}`).join("\n");
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Admin_Activity_Log_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F5F2] overflow-hidden font-sans">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/assets/Logo.png" alt="TrabaHome" className="h-12 w-auto" />
        </div>
        <motion.div whileHover={{ rotate: 15 }}>
          <Bell className="text-slate-800 cursor-pointer" size={24} />
        </motion.div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-8 pr-2"> 
          <aside className="w-64 h-full bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between p-6">
            <nav className="space-y-1">
              <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => handleNavigation('Dashboard')} />
              <SidebarItem icon={<Users size={18} />} label="Workers" active={activeTab === 'Workers'} onClick={() => handleNavigation('Workers')} />
              <SidebarItem icon={<Home size={18} />} label="Homeowners" active={activeTab === 'Homeowners'} onClick={() => handleNavigation('Homeowners')} />
              <SidebarItem icon={<ClipboardList size={18} />} label="Requests" active={activeTab === 'Requests'} onClick={() => handleNavigation('Requests')} />
              <SidebarItem icon={<MessageSquare size={18} />} label="SMS Logs" active={activeTab === 'SMS Logs'} onClick={() => handleNavigation('SMS Logs')} />
              <SidebarItem icon={<User size={18} />} label="Profile" active={activeTab === 'Profile'} onClick={() => handleNavigation('Profile')} />
            </nav>

            <div className="pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                <div className="w-10 h-10 bg-white shadow-inner rounded-full flex items-center justify-center overflow-hidden">
                   <User className="text-slate-400" size={20} />
                </div>
                <span className="font-bold text-slate-800 text-sm">{adminData.name}</span>
              </div>
              <button className="w-full py-2 px-4 border border-gray-200 rounded-full text-slate-500 text-xs font-semibold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                Logout
              </button>
            </div>
          </aside>
        </motion.div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-10 pl-6">
          {!showAllActivity ? (
            /* --- ORIGINAL PROFILE VIEW --- */
            <div className="space-y-6">
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800">Profile</h1>
                <p className="text-slate-500 font-medium text-sm">Manage your account settings and security.</p>
              </div>

              <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-3 border-b border-gray-100 bg-white"><h3 className="font-bold text-slate-800 text-sm">Admin Info</h3></div>
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center"><User size={40} className="text-slate-500" /></div>
                    <div className="flex-1 space-y-4">
                      {isEditingProfile ? (
                        <div className="space-y-3 max-w-sm">
                          <input type="text" className="w-full border rounded-lg p-2 text-sm" value={adminData.name} onChange={(e) => setAdminData({...adminData, name: e.target.value})} placeholder="Name" />
                          <input type="text" className="w-full border rounded-lg p-2 text-sm" value={adminData.phone} onChange={(e) => setAdminData({...adminData, phone: e.target.value})} placeholder="Phone" />
                          <div className="flex gap-2">
                            <button onClick={() => setIsEditingProfile(false)} className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold">Save</button>
                            <button onClick={() => setIsEditingProfile(false)} className="bg-gray-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div><h2 className="text-xl font-bold text-slate-800">{adminData.name}</h2><p className="text-sm text-slate-400">{adminData.role}</p></div>
                          <div className="grid grid-cols-1 border-t border-gray-100 pt-4 space-y-2">
                            <p className="text-sm text-slate-600"><span className="text-slate-400 inline-block w-16">Email:</span> {adminData.email}</p>
                            <p className="text-sm text-slate-600"><span className="text-slate-400 inline-block w-16">Phone:</span> {adminData.phone}</p>
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                        <p className="text-[11px] text-slate-400 uppercase font-bold">Last Login: <span className="text-slate-600 normal-case">Feb 18, 2026 • 7:25 AM</span></p>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 uppercase font-bold">Account status:</span>
                          <span className="px-3 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-full">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isEditingProfile && (
                    <div className="flex justify-end mt-4">
                      <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-xs font-bold text-slate-600 hover:bg-gray-50 transition-colors"><Edit3 size={14} /> Edit Profile</button>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-3 border-b border-gray-100 bg-white"><h3 className="font-bold text-slate-800 text-sm">Account Security</h3></div>
                <div className="p-8 flex gap-4">
                  <button onClick={() => setActiveModal('email')} className="w-fit px-8 bg-[#0D4E8B] border border-[#155a9e] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0a3d6d] transition-colors shadow-sm">Change Email</button>
                  <button onClick={() => setActiveModal('password')} className="w-fit px-8 bg-[#0D4E8B] border border-[#155a9e] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0a3d6d] transition-colors shadow-sm">Change Password</button>
                </div>
              </section>

              {/* MODALS */}
              <AnimatePresence>
                {activeModal && (
                  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full relative">
                      <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Change {activeModal === 'email' ? 'Email Address' : 'Password'}</h3>
                      <div className="space-y-4">
                        <input type={activeModal === 'password' ? 'password' : 'email'} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder={activeModal === 'email' ? 'Enter new email' : 'Enter new password'} />
                        <button onClick={() => setActiveModal(null)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm">Confirm Change</button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-10">
                <div className="px-6 py-3 border-b border-gray-100 flex justify-between items-center bg-white">
                  <h3 className="font-bold text-slate-800 text-sm">Recent Activity</h3>
                  <MoreHorizontal className="text-slate-400 cursor-pointer" size={20} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <tr><th className="px-6 py-4">Date & Time</th><th className="px-6 py-4">Action</th><th className="px-6 py-4">Module</th><th className="px-6 py-4 text-right">Target</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {activities.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4"><p className="text-[12px] font-bold text-slate-700">{item.date}</p><p className="text-[10px] text-slate-400">{item.time}</p></td>
                          <td className="px-6 py-4 text-[12px] text-slate-600">{item.action}</td>
                          <td className="px-6 py-4 text-[12px] text-slate-600 font-medium">{item.module}</td>
                          <td className="px-6 py-4 text-[12px] text-slate-800 font-bold text-right">{item.target}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 border-t border-gray-50 flex justify-center">
                    <button onClick={() => setShowAllActivity(true)} className="flex items-center gap-1 text-[11px] font-bold text-blue-500 hover:underline">View all <ChevronRight size={14} /></button>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            /* --- DETAILED ACTIVITY LOGS VIEW --- */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                <span className="cursor-pointer hover:text-blue-500" onClick={() => setShowAllActivity(false)}>Profile</span>
                <ChevronRight size={10} />
                <span className="text-slate-600">Admin Activity Logs</span>
              </div>

              <div>
                <h1 className="text-3xl font-black text-slate-800">Admin Activity Logs</h1>
                <p className="text-slate-500 font-medium text-sm">Track admin actions for transparency and audit.</p>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-6 mt-6">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Date Range:</span>
                  <div className="relative group">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-xs text-slate-600 min-w-[180px] justify-between cursor-pointer">
                      01/01/26 - 02/18/26 <ChevronDown size={14} className="text-slate-400" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Module:</span>
                  <select 
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-xs text-slate-600 min-w-[120px] outline-none appearance-none cursor-pointer"
                  >
                    <option value="All">All Modules</option>
                    <option value="Workers">Workers</option>
                    <option value="Homeowners">Homeowners</option>
                    <option value="SMS Logs">SMS Logs</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                   <span className="text-[11px] font-bold text-slate-500 uppercase">Search:</span>
                   <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="name / target" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white border border-gray-200 pl-9 pr-4 py-2 rounded-lg text-xs w-64 focus:outline-none focus:ring-1 focus:ring-blue-400" 
                    />
                   </div>
                   <button onClick={handleExportCSV} className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-gray-50 transition-colors shadow-sm">Export CSV</button>
                </div>
              </div>

              {/* Full Logs Table Container */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-4">
                <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-bold text-slate-800 text-sm">Activity Logs</h3></div>
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-10 py-4">Date & Time</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Module</th>
                      <th className="px-10 py-4 text-right">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredActivities.length > 0 ? filteredActivities.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-10 py-4"><p className="text-[12px] font-bold text-slate-700">{item.date}</p><p className="text-[10px] text-slate-400">{item.time}</p></td>
                        <td className="px-6 py-4 text-[12px] text-slate-600">{item.action}</td>
                        <td className="px-6 py-4 text-[12px] text-slate-600 font-medium">{item.module}</td>
                        <td className="px-10 py-4 text-[12px] text-slate-800 font-bold text-right">{item.target}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="text-center py-10 text-slate-400 text-sm">No activities found matching your criteria.</td></tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-10 py-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <div className="flex items-center gap-2">Rows per page: 15 <ChevronDown size={12} /></div>
                  <div className="flex items-center gap-4">
                    <span className="cursor-pointer hover:text-slate-800">Previous</span>
                    <span className="w-6 h-6 flex items-center justify-center bg-slate-800 text-white rounded">1</span>
                    <span className="cursor-pointer hover:text-slate-800">2</span>
                    <span className="cursor-pointer hover:text-slate-800">3 ... 5</span>
                    <span className="cursor-pointer hover:text-slate-800">Last</span>
                    <span className="ml-4 text-slate-600">1-{filteredActivities.length} of {filteredActivities.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <motion.div whileHover={{ x: 5 }} onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600 border-l-[6px] border-blue-600' : 'text-slate-400 hover:bg-gray-50 hover:text-slate-600'}`}>
    <span>{icon}</span>
    <span className="text-[13px] font-bold">{label}</span>
  </motion.div>
);

export default AdminProfile;