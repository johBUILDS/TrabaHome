import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Home, ClipboardList, MessageSquare, User, Bell, Search, ChevronDown, X, Hammer } from 'lucide-react';

const AdminSmslogs = () => {
  const navigate = useNavigate();
  // Set active tab to 'SMS Logs' for this page
  const [activeTab, setActiveTab] = useState('SMS Logs');
  const [selectedLog, setSelectedLog] = useState(null);

  // --- Filtering States ---
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterService, setFilterService] = useState('All');
  const [searchRecipient, setSearchRecipient] = useState('');
  const [searchRequestId, setSearchRequestId] = useState('');
  const [dateRange, setDateRange] = useState('All');

  // Sample Data for the Table
  const smsLogs = [
    { id: 'TH-1001', recipient: 'Jirah Lim', service: 'Carpenter', phone: '+63 *** *** 6767', type: 'New Service Request', status: 'Sent', time: '02/18/26 10:45 AM', provider: 'Twilio', smsId: 'SMS-000123' },
    { id: 'TH-1004', recipient: 'Skusta Clee', service: 'Gardener', phone: '+63 *** *** 6969', type: 'New Service Request', status: 'Failed', time: '02/18/26 11:00 AM', provider: 'Twilio', failedAt: '02/18/26 • 10:50 AM', attempts: 1, errorReason: 'Invalid number', errorCode: '21614' },
    { id: 'TH-1007', recipient: 'Hev Abi', service: 'Cleaner', phone: '+63 *** *** 5632', type: 'New Service Request', status: 'Queued', time: '02/18/26 1:00 PM', provider: 'Twilio', attempts: 0 },
    { id: 'TH-1002', recipient: 'Jirah Lim', service: 'Carpenter', phone: '+63 *** *** 6767', type: 'New Service Request', status: 'Sent', time: '02/18/26 10:45 AM', provider: 'Twilio', smsId: 'SMS-000124' },
    { id: 'TH-1003', recipient: 'John Doe', service: 'Plumber', phone: '+63 *** *** 1234', type: 'New Service Request', status: 'Sent', time: '02/18/26 10:45 AM', provider: 'Twilio', smsId: 'SMS-000125' },
    { id: 'TH-1005', recipient: 'Jane Smith', service: 'Electrician', phone: '+63 *** *** 4321', type: 'New Service Request', status: 'Sent', time: '02/18/26 10:45 AM', provider: 'Twilio', smsId: 'SMS-000126' },
  ];

  // --- FIXED STATS (Based on full data, ignored by filters) ---
  const globalStats = {
    sent: smsLogs.filter(l => l.status === 'Sent').length,
    failed: smsLogs.filter(l => l.status === 'Failed').length,
    queued: smsLogs.filter(l => l.status === 'Queued').length,
    total: smsLogs.length
  };

  // --- Filter Logic (Only affects the table) ---
  const filteredLogs = smsLogs.filter(log => {
    const matchStatus = filterStatus === 'All' || log.status === filterStatus;
    const matchService = filterService === 'All' || log.service === filterService;
    const matchRecipient = log.recipient.toLowerCase().includes(searchRecipient.toLowerCase());
    const matchId = log.id.toLowerCase().includes(searchRequestId.toLowerCase());
    return matchStatus && matchService && matchRecipient && matchId;
  });

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
    } else if (label === 'Workers') {
      navigate('/admin-workers');
    } else if (label === 'Profile') {
      navigate('/admin-profile');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F5F2] overflow-hidden relative">
      {/* Top Bar */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/Logo.png" 
            alt="TrabaHome" 
            className="h-12 w-auto" 
          />
        </div>
        <motion.div whileHover={{ rotate: 15 }}>
          <Bell className="text-slate-800 cursor-pointer" size={24} />
        </motion.div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Animated Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="p-8 pr-2"
        > 
          <aside className="w-64 h-full bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between p-6">
            <nav className="space-y-1">
              <SidebarItem 
                icon={<LayoutDashboard size={18} />} 
                label="Dashboard" 
                active={activeTab === 'Dashboard'} 
                onClick={() => handleNavigation('Dashboard')}
              />
              <SidebarItem 
                icon={<Users size={18} />} 
                label="Workers" 
                active={activeTab === 'Workers'} 
                onClick={() => handleNavigation('Workers')}
              />
              <SidebarItem 
                icon={<Home size={18} />} 
                label="Homeowners" 
                active={activeTab === 'Homeowners'} 
                onClick={() => handleNavigation('Homeowners')}
              />
              <SidebarItem 
                icon={<ClipboardList size={18} />} 
                label="Requests" 
                active={activeTab === 'Requests'} 
                onClick={() => handleNavigation('Requests')}
              />
              <SidebarItem 
                icon={<MessageSquare size={18} />} 
                label="SMS Logs" 
                active={activeTab === 'SMS Logs'} 
                onClick={() => handleNavigation('SMS Logs')}
              />
              <SidebarItem 
                icon={<User size={18} />} 
                label="Profile" 
                active={activeTab === 'Profile'} 
                onClick={() => handleNavigation('Profile')}
              />
            </nav>

            <div className="pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                <div className="w-10 h-10 bg-white shadow-inner rounded-full flex items-center justify-center">
                  <User className="text-slate-400" size={20} />
                </div>
                <span className="font-bold text-slate-800 text-sm">Admin</span>
              </div>
              <button className="w-full py-2 px-4 border border-gray-200 rounded-full text-slate-500 text-xs font-semibold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                Logout
              </button>
            </div>
          </aside>
        </motion.div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-10 pl-6">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50 min-h-full">
                <h1 className="text-3xl font-black text-slate-800 mb-1">SMS Logs</h1>
                <p className="text-slate-500 font-medium mb-8 text-sm">Track SMS delivery status and troubleshoot failures.</p>
                
                {/* Stats Grid - Now LOCKED to total data */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <StatCard label="Sent Today" value={globalStats.sent} color="text-green-500" />
                  <StatCard label="Failed Today" value={globalStats.failed} color="text-red-500" />
                  <StatCard label="Queued" value={globalStats.queued} color="text-orange-400" />
                  <StatCard label="Total Today" value={globalStats.total} color="text-blue-500" />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-3 gap-6 mb-8 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Date Range:</label>
                    <div className="relative">
                      <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-4 appearance-none text-slate-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="All">All Time</option>
                        <option value="Today">Today (02/18/26)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 text-slate-400" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Status:</label>
                    <div className="relative">
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-4 appearance-none text-slate-600 text-sm font-medium focus:outline-none"
                      >
                        <option value="All">All</option>
                        <option value="Sent">Sent</option>
                        <option value="Failed">Failed</option>
                        <option value="Queued">Queued</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 text-slate-400" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Service Type:</label>
                    <div className="relative">
                      <select 
                        value={filterService}
                        onChange={(e) => setFilterService(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-4 appearance-none text-slate-600 text-sm font-medium focus:outline-none"
                      >
                        <option value="All">All</option>
                        <option value="Carpenter">Carpenter</option>
                        <option value="Gardener">Gardener</option>
                        <option value="Cleaner">Cleaner</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Electrician">Electrician</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 text-slate-400" size={16} />
                    </div>
                  </div>
                </div>

                {/* Search Row */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Recipient:</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchRecipient}
                        onChange={(e) => setSearchRecipient(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none" 
                      />
                      <Search className="absolute right-3 top-2.5 text-slate-300" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Request ID:</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchRequestId}
                        onChange={(e) => setSearchRequestId(e.target.value)}
                        placeholder="Ex: TH-1001"
                        className="w-full border border-gray-200 rounded-lg py-2 px-4 text-sm focus:outline-none" 
                      />
                      <Search className="absolute right-3 top-2.5 text-slate-300" size={16} />
                    </div>
                  </div>
                </div>

                {/* SMS Logs Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Date & Time', 'Recipient', 'Request ID', 'Service', 'Phone #', 'Message Type', 'Status', 'Actions'].map((head) => (
                          <th key={head} className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{head}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, index) => (
                          <tr key={index} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-4 text-[11px] font-bold text-slate-600 leading-tight w-24">{log.time}</td>
                            <td className="py-4 text-xs font-bold text-slate-700">{log.recipient}</td>
                            <td className="py-4 text-xs font-bold text-slate-500">{log.id}</td>
                            <td className="py-4 text-xs font-bold text-slate-600">{log.service}</td>
                            <td className="py-4 text-xs font-medium text-slate-500">{log.phone}</td>
                            <td className="py-4 text-[10px] font-bold text-slate-400 w-24 uppercase">{log.type}</td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                log.status === 'Sent' ? 'bg-green-100 text-green-600' : 
                                log.status === 'Failed' ? 'bg-red-100 text-red-500' : 
                                'bg-orange-100 text-orange-500'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="py-4">
                              <button 
                                onClick={() => setSelectedLog(log)}
                                className="px-4 py-1 border border-blue-600 text-blue-600 text-[10px] font-bold rounded-md hover:bg-blue-600 hover:text-white transition-all"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="py-10 text-center text-slate-400 font-bold italic text-sm">
                            No logs found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
        </main>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-800">SMS Log Details</h2>
                <X 
                  className="text-slate-400 cursor-pointer hover:text-slate-600" 
                  size={20} 
                  onClick={() => setSelectedLog(null)}
                />
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
                {/* Message Info Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Message Info</h3>
                  <div className="space-y-2.5">
                    <DetailRow label="Request ID:" value={selectedLog.id} />
                    <DetailRow label="SMS Type:" value={selectedLog.type} />
                    <div className="flex items-center text-xs">
                      <span className="w-28 text-slate-400 font-medium">Recipient:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                           <User className="text-white" size={14} />
                        </div>
                        <span className="font-bold text-slate-700">{selectedLog.recipient}</span>
                        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded flex items-center gap-1 text-[9px] font-bold">
                          <Hammer size={10} /> {selectedLog.service}
                        </span>
                      </div>
                    </div>
                    <DetailRow label="Phone:" value={selectedLog.phone} />
                    <DetailRow 
                      label={selectedLog.status === 'Sent' ? "Sent At:" : selectedLog.status === 'Queued' ? "Queued At:" : "Failed At:"} 
                      value={selectedLog.time} 
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Message Content Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Message Content</h3>
                  <div className="bg-gray-50 rounded-xl p-4 text-[11px] leading-relaxed text-slate-600 italic font-medium">
                    Hi {selectedLog.recipient}, you have a new {selectedLog.service} job request in Mangaldan, Pangasinan. Schedule: Feb 20, 2026 • 2:00 PM Request ID: {selectedLog.id}. Please check your TrabaHome account for details.
                  </div>
                </div>

                {/* Status Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center text-xs">
                    <span className="w-28 text-slate-400 font-medium">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedLog.status === 'Sent' ? 'bg-green-100 text-green-600' : 
                      selectedLog.status === 'Failed' ? 'bg-red-100 text-red-500' : 
                      'bg-orange-100 text-orange-500'
                    }`}>
                      {selectedLog.status}
                    </span>
                  </div>
                  <DetailRow label="Provider:" value={selectedLog.provider} />
                  
                  {selectedLog.status === 'Sent' && (
                    <DetailRow label="SMS ID:" value={selectedLog.smsId} />
                  )}

                  {selectedLog.status === 'Queued' && (
                    <>
                      <DetailRow label="SMS ID:" value="-" />
                      <DetailRow label="Attempts:" value="0" />
                      <DetailRow label="Last attempt:" value="-" />
                      <p className="text-[11px] text-slate-500 italic mt-2">Waiting to be sent by provider.</p>
                    </>
                  )}

                  {selectedLog.status === 'Failed' && (
                    <>
                      <DetailRow label="Failed at:" value={selectedLog.failedAt} />
                      <DetailRow label="Attempts:" value={selectedLog.attempts} />
                      <div className="flex items-center text-xs">
                        <span className="w-28 text-slate-400 font-medium">Error reason:</span>
                        <span className="bg-gray-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{selectedLog.errorReason}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className="w-28 text-slate-400 font-medium">Error code:</span>
                        <span className="bg-gray-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">{selectedLog.errorCode}</span>
                      </div>
                      <DetailRow label="Provider response:" value="" />
                    </>
                  )}
                </div>

                {selectedLog.status === 'Failed' && (
                  <button className="text-blue-500 text-[10px] font-bold hover:underline pt-2">
                    Copy Error Details
                  </button>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-0 flex justify-center mt-auto">
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="w-32 py-2 border border-gray-200 rounded-full text-slate-600 font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal Helper Components
const DetailRow = ({ label, value }) => (
  <div className="flex items-center text-xs">
    <span className="w-28 text-slate-400 font-medium">{label}</span>
    <span className="font-bold text-slate-700">{value || '-'}</span>
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
    <p className={`text-[11px] font-bold mb-1 ${color}`}>{label}</p>
    <p className={`text-3xl font-black ${color.replace('500', '600')}`}>{value}</p>
  </div>
);

// Reusable Sidebar Component
const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    onClick={onClick} 
    className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${
    active 
    ? 'bg-blue-50 text-blue-600 border-l-[6px] border-blue-600' 
    : 'text-slate-400 hover:bg-gray-50 hover:text-slate-600'
  }`}>
    <span>{icon}</span>
    <span className="text-[13px] font-bold">{label}</span>
  </motion.div>
);

export default AdminSmslogs;