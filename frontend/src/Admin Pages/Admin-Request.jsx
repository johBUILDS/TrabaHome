import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Home, ClipboardList, MessageSquare, 
  User, Bell, Search, ChevronDown, RotateCcw, Filter, X, Hammer, ChevronLeft, ChevronRight, Star 
} from 'lucide-react';

const AdminRequest = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Requests');
  const [statusFilter, setStatusFilter] = useState('Pending');
  
  // --- SEARCH & FILTER STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');
  const [reasonFilter, setReasonFilter] = useState('All Reasons');

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  // State for Modal
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleNavigation = (label) => {
    setActiveTab(label);
    const routes = {
      'Dashboard': '/admin-dashboard',
      'Homeowners': '/admin-homeowners',
      'Requests': '/admin-requests',
      'SMS Logs': '/admin-smslogs',
      'Workers': '/admin-workers',
      'Profile': '/admin-profile'
    };
    if (routes[label]) navigate(routes[label]);
  };

  const requestGroups = [
    {
      homeowner: "Myrna Reyes",
      role: "Homeowner",
      count: 3,
      requests: [
        { id: "TH-1020", status: "Pending", service: "Carpenter", location: "Calasiao, Pangasinan", date: "January 28, 2026", time: "10:48 AM", description: "I need a carpenter that can fix my door.", worker: "Batumbakal Vicente Reyes", workerStatus: "Worker 1/3", rating: "5.0 (1 review)", reason: "Short notice / urgent request", cancelDetail: "Worker is too far" },
        { id: "TH-1023", status: "Ongoing", service: "Plumber", location: "Bandaong, Pangasinan", date: "January 30, 2026", time: "10:59 AM", description: "Leaking pipe in the kitchen.", worker: "Kyan Miel", workerStatus: "Worker 2/3", rating: "5.0 (1 review)", reason: "Schedule conflict" },
        { id: "TH-1024", status: "Completed", service: "Gardener", location: "Arenasbina, Pangasinan", date: "January 30, 2026", time: "5:08 PM", description: "Lawn mowing and hedge trimming.", worker: "Daniel Cruz", workerStatus: "Worker 3/3", rating: "5.0 (1 review)", reason: "Job is outside my expertise" },
      ]
    },
    {
      homeowner: "Cristiana Berdin",
      role: "Homeowner",
      count: 2,
      requests: [
        { id: "TH-1021", status: "Cancelled", service: "Carpenter", location: "Calasiao, Pangasinan", date: "January 28, 2026", time: "10:51 AM", description: "Cabinet repair.", worker: "Nick Aquino", workerStatus: "Worker 1/2", rating: "5.0 (1 review)", reason: "Personal or emergency reason" },
        { id: "TH-1025", status: "Declined", service: "Plumber", location: "Bandaong, Pangasinan", date: "January 30, 2026", time: "3:18 PM", description: "Toilet flush issues.", worker: "Lloyd Lopez", workerStatus: "Worker 2/2", rating: "5.0 (1 review)", reason: "Other (state reason)" },
      ]
    }
  ];

  // --- REAL-TIME COUNT LOGIC ---
  const counts = useMemo(() => {
    const stats = { Pending: 0, Ongoing: 0, Completed: 0, Cancelled: 0, Declined: 0 };
    requestGroups.forEach(group => {
      group.requests.forEach(req => {
        if (stats[req.status] !== undefined) stats[req.status]++;
      });
    });
    return stats;
  }, [requestGroups]);

  // --- UPDATED FILTERING & PAGINATION LOGIC ---
  const allFilteredFlat = useMemo(() => {
    let list = [];
    requestGroups.forEach(group => {
      group.requests.forEach(req => {
        const matchesStatus = req.status === statusFilter;
        const matchesSearch = req.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesService = serviceFilter === 'All Services' || req.service === serviceFilter;
        const matchesLocation = locationFilter === 'All Locations' || req.location.includes(locationFilter);
        const matchesDate = dateFilter === 'All Dates' || req.date.includes(dateFilter);
        const matchesRating = ratingFilter === 'All Ratings' || (statusFilter === 'Completed' && req.rating.startsWith(ratingFilter));
        const matchesReason = reasonFilter === 'All Reasons' || ((statusFilter === 'Cancelled' || statusFilter === 'Declined') && req.reason === reasonFilter);

        if (matchesStatus && matchesSearch && matchesService && matchesLocation && matchesDate && matchesRating && matchesReason) {
          list.push({ ...req, homeowner: group.homeowner, role: group.role });
        }
      });
    });
    return list;
  }, [searchQuery, serviceFilter, locationFilter, dateFilter, ratingFilter, reasonFilter, statusFilter]);

  // Pagination Calculations
  const totalPages = Math.ceil(allFilteredFlat.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedItems = allFilteredFlat.slice(startIndex, startIndex + rowsPerPage);

  const filteredGroups = paginatedItems.reduce((acc, current) => {
    const group = acc.find(g => g.homeowner === current.homeowner);
    if (group) {
      group.requests.push(current);
      group.count++;
    } else {
      acc.push({ homeowner: current.homeowner, role: current.role, count: 1, requests: [current] });
    }
    return acc;
  }, []);

  const handleReset = () => {
    setSearchQuery('');
    setServiceFilter('All Services');
    setLocationFilter('All Locations');
    setDateFilter('All Dates');
    setRatingFilter('All Ratings');
    setReasonFilter('All Reasons');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F5F2] overflow-hidden font-sans">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/assets/Logo.png" alt="TrabaHome" className="h-10 w-auto" />
        </div>
        <motion.div whileHover={{ rotate: 15 }}>
          <Bell className="text-slate-800 cursor-pointer" size={24} />
        </motion.div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-8 pr-2"> 
          <aside className="w-64 h-full bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between p-6">
            <nav className="space-y-1">
              {['Dashboard', 'Workers', 'Homeowners', 'Requests', 'SMS Logs', 'Profile'].map((item) => (
                <SidebarItem 
                  key={item}
                  icon={getIcon(item)} 
                  label={item} 
                  active={activeTab === item} 
                  onClick={() => handleNavigation(item)}
                />
              ))}
            </nav>
            <div className="pt-6 border-t border-gray-50">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3 border border-gray-100">
                <div className="w-10 h-10 bg-white shadow-inner rounded-full flex items-center justify-center">
                  <User className="text-slate-400" size={20} />
                </div>
                <span className="font-bold text-slate-800 text-sm">Admin</span>
              </div>
              <button className="w-full py-2 px-4 border border-gray-200 rounded-full text-slate-500 text-xs font-semibold hover:bg-red-50 hover:text-red-500 transition-all">Logout</button>
            </div>
          </aside>
        </motion.div>

        <main className="flex-1 overflow-y-auto p-10 pl-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-black text-slate-800 mb-2">Requests</h1>
            <p className="text-slate-500 font-medium mb-8">Track service requests from Pending to Completed.</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {['Pending', 'Ongoing', 'Completed', 'Cancelled', 'Declined'].map((label) => (
                <button
                  key={label}
                  onClick={() => {
                      setStatusFilter(label);
                      handleReset(); 
                  }}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    statusFilter === label 
                    ? (label === 'Ongoing' ? 'bg-[#D9F99D] text-slate-800 shadow-md' : 
                       label === 'Completed' ? 'bg-[#BCF1CA] text-slate-800 shadow-md' : 
                       label === 'Cancelled' ? 'bg-[#FECACA] text-slate-800 shadow-md' : 
                       label === 'Declined' ? 'bg-[#FEE2E2] text-[#991B1B] shadow-md border-red-200' : 
                       'bg-[#F9D949] text-slate-800 shadow-md') 
                    : 'bg-white text-slate-400 border border-gray-100'
                  }`}
                >
                  {label} <span className="text-[10px] opacity-60 font-medium">{counts[label]}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search request ID" 
                  value={searchQuery}
                  onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none shadow-sm" 
                />
              </div>
              
              <select 
                value={serviceFilter} 
                onChange={(e) => {setServiceFilter(e.target.value); setCurrentPage(1);}}
                className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-slate-700 shadow-sm outline-none"
              >
                <option>All Services</option>
                <option>Carpenter</option>
                <option>Plumber</option>
                <option>Gardener</option>
              </select>

              <select 
                value={locationFilter} 
                onChange={(e) => {setLocationFilter(e.target.value); setCurrentPage(1);}}
                className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-slate-700 shadow-sm outline-none"
              >
                <option>All Locations</option>
                <option>Calasiao</option>
                <option>Bandaong</option>
                <option>Arenasbina</option>
              </select>

              <select 
                value={dateFilter} 
                onChange={(e) => {setDateFilter(e.target.value); setCurrentPage(1);}}
                className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-slate-700 shadow-sm outline-none"
              >
                <option>All Dates</option>
                <option>January 28</option>
                <option>January 30</option>
              </select>

              {statusFilter === 'Completed' && (
                <select 
                    value={ratingFilter} 
                    onChange={(e) => {setRatingFilter(e.target.value); setCurrentPage(1);}}
                    className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-slate-700 shadow-sm outline-none"
                >
                    <option>All Ratings</option>
                    <option value="5.0">5 Stars</option>
                    <option value="4.0">4 Stars</option>
                    <option value="3.0">3 Stars</option>
                </select>
              )}

              {(statusFilter === 'Cancelled' || statusFilter === 'Declined') && (
                <select 
                    value={reasonFilter} 
                    onChange={(e) => {setReasonFilter(e.target.value); setCurrentPage(1);}}
                    className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-slate-700 shadow-sm outline-none max-w-[150px]"
                >
                    <option>All Reasons</option>
                    <option>Short notice / urgent request</option>
                    <option>Schedule conflict</option>
                    <option>Job is outside my expertise</option>
                    <option>Personal or emergency reason</option>
                    <option>Other (state reason)</option>
                </select>
              )}
              
              <button 
                onClick={handleReset}
                className="p-2.5 bg-white border border-gray-100 rounded-xl text-slate-500 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <RotateCcw size={18} />
              </button>
              
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0A3D62] text-white rounded-xl text-sm font-bold shadow-md"><Filter size={16} /> Filter</button>
            </div>

            <div className={`grid ${statusFilter === 'Completed' || statusFilter === 'Cancelled' || statusFilter === 'Declined' ? 'grid-cols-7' : 'grid-cols-6'} px-8 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest`}>
              <div>{statusFilter === 'Pending' ? 'Homeowner/Student' : 'Homeowner/Worker'}</div>
              <div>Request ID</div>
              <div>Service Type</div>
              <div>Location</div>
              <div>{statusFilter === 'Ongoing' ? 'Accepted On' : statusFilter === 'Completed' ? 'Completed On' : statusFilter === 'Cancelled' ? 'Cancelled On' : statusFilter === 'Declined' ? 'Declined On' : 'Requested On'}</div>
              {statusFilter === 'Completed' && <div>Ratings</div>}
              {(statusFilter === 'Cancelled' || statusFilter === 'Declined') && <div>Reason</div>}
              <div className="text-center">Actions</div>
            </div>

            <div className="space-y-6 mb-10">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, idx) => (
                  <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50">
                    <div className="bg-[#FAF9F6] px-8 py-4 flex items-center gap-4 border-b border-gray-50">
                      <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center text-pink-500"><User size={20} /></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800">{group.homeowner}</h3>
                          <span className="bg-gray-200 text-[10px] px-2 py-0.5 rounded text-slate-600 font-bold uppercase">{group.role}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{group.count} services displayed</p>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {group.requests.map((req) => (
                        <div key={req.id} className={`grid ${statusFilter === 'Completed' || statusFilter === 'Cancelled' || statusFilter === 'Declined' ? 'grid-cols-7' : 'grid-cols-6'} items-center px-8 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors`}>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <img src={`https://ui-avatars.com/api/?name=${req.worker}&background=random`} className="w-5 h-5 rounded-full" alt="worker" />
                              <span className="text-[11px] truncate text-slate-800">{req.worker} <span className="text-blue-500">●</span></span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-medium ml-7 uppercase tracking-tighter">{req.workerStatus}</span>
                          </div>
                          <div className="text-slate-400 font-mono text-[12px]">{req.id}</div>
                          <div className="text-slate-500 font-medium">{req.service}</div>
                          <div className="text-slate-400 font-medium text-[12px]">{req.location}</div>
                          <div className="text-slate-500 text-xs">
                             <div>{req.date}</div>
                             <div className="text-[10px] text-slate-300">{req.time}</div>
                          </div>
                          {statusFilter === 'Completed' && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                               <Star size={12} className="fill-[#F9D949] text-[#F9D949]" /> {req.rating}
                            </div>
                          )}
                          {(statusFilter === 'Cancelled' || statusFilter === 'Declined') && (
                            <div className="text-[11px] text-slate-500 font-medium truncate pr-2">{req.reason}</div>
                          )}
                          <div className="flex justify-center">
                            <button 
                              onClick={() => setSelectedRequest({...req, homeowner: group.homeowner, status: statusFilter})}
                              className="px-4 py-1.5 border border-blue-400 text-blue-500 rounded-lg text-[11px] font-bold hover:bg-blue-50"
                            >
                              View Request
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                  <p className="text-slate-400 font-bold">No requests found matching your criteria.</p>
                  <button onClick={handleReset} className="text-blue-500 text-sm font-bold mt-2 underline">Clear all filters</button>
                </div>
              )}
            </div>

            {/* --- FUNCTIONAL PAGINATION SECTION --- */}
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                Rows per page: 
                <select 
                  value={rowsPerPage} 
                  onChange={(e) => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}}
                  className="text-slate-800 outline-none bg-transparent cursor-pointer font-black"
                >
                  <option value={5}>5</option>
                  <option value={12}>12</option>
                  <option value={25}>25</option>
                </select>
                <ChevronDown size={14} />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-1 ${currentPage === 1 ? 'text-slate-200' : 'text-slate-800'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i + 1} 
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                        currentPage === i + 1 ? 'bg-gray-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(totalPages)}
                    className="text-slate-400 text-xs font-bold px-2 hover:text-slate-800"
                  >
                    last
                  </button>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-1 ${currentPage === totalPages ? 'text-slate-200' : 'text-slate-800'}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="text-slate-400 text-sm font-bold">
                  {allFilteredFlat.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + rowsPerPage, allFilteredFlat.length)} of {allFilteredFlat.length}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 pb-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-black text-slate-800">
                    {selectedRequest.status} Request Details
                  </h2>
                  <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-slate-400 text-sm font-medium">
                    {selectedRequest.status === 'Completed' ? 'Completed on:' : 
                     selectedRequest.status === 'Cancelled' ? 'Cancelled on:' : 
                     selectedRequest.status === 'Declined' ? 'Declined on:' :
                     selectedRequest.status === 'Ongoing' ? 'Accepted on:' : 'Requested on:'} 
                    <span className="text-slate-600"> February 18, 2026, 12:00 PM</span>
                  </p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    selectedRequest.status === 'Ongoing' ? 'bg-[#D9F99D] text-green-800' : 
                    selectedRequest.status === 'Completed' ? 'bg-[#BCF1CA] text-green-800' : 
                    selectedRequest.status === 'Cancelled' ? 'bg-[#FECACA] text-red-800' : 
                    selectedRequest.status === 'Declined' ? 'bg-[#FEE2E2] text-red-800' :
                    'bg-[#F9D949] text-slate-800'
                  }`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <p className="text-slate-800 font-bold text-sm">Request ID: {selectedRequest.id}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500"><User size={24} /></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{selectedRequest.homeowner}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase">Homeowner</p>
                  </div>
                  <div className="ml-auto bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold">
                    <Hammer size={14} /> {selectedRequest.service}
                  </div>
                </div>

                <div className="space-y-4">
                  <section>
                    <h4 className="font-black text-slate-800 mb-2">What do you need help with?</h4>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-slate-600 italic text-sm">
                      "{selectedRequest.description}"
                    </div>
                  </section>

                  <section className="border-t border-gray-50 pt-4">
                    <h4 className="font-black text-slate-800 mb-1">Preferred Schedule</h4>
                    <p className="text-slate-500 text-sm font-medium">February 21, 2026 • 12:30 PM</p>
                  </section>

                  <section className="border-t border-gray-50 pt-4">
                    <h4 className="font-black text-slate-800 mb-1">Location</h4>
                    <p className="text-slate-500 text-sm font-medium">Mangaldan, Pangasinan</p>
                  </section>

                  <section className="border-t border-gray-50 pt-4">
                    <h4 className="font-black text-slate-800 mb-3">
                      {selectedRequest.status === 'Pending' ? 'Target Worker' : 'Assigned Worker'}
                    </h4>
                    <div className="flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500"><User size={20} /></div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-slate-800 text-sm">{selectedRequest.worker || "Batumbakal Vicente Reyes"}</p>
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</div>
                        </div>
                        <div className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold inline-block">{selectedRequest.service}</div>
                      </div>
                    </div>
                  </section>

                  {selectedRequest.status === 'Declined' && (
                    <section className="border-t border-gray-50 pt-4">
                      <h4 className="font-black text-slate-800 mb-1">Declined Details</h4>
                      <div className="space-y-1 text-sm font-medium text-slate-500">
                        <p>Declined by: <span className="text-slate-800">Worker</span></p>
                        <p>Reason: <span className="text-slate-800">{selectedRequest.reason}</span></p>
                      </div>
                    </section>
                  )}

                  {selectedRequest.status === 'Cancelled' && (
                    <section className="border-t border-gray-50 pt-4">
                      <h4 className="font-black text-slate-800 mb-1">Cancellation</h4>
                      <div className="space-y-1 text-sm font-medium text-slate-500 mb-3">
                        <p>Cancelled by: <span className="text-slate-800">Homeowner</span></p>
                        <p>Reason: <span className="text-slate-800">{selectedRequest.reason}</span></p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-slate-600 italic text-sm">
                        "{selectedRequest.cancelDetail || "No further details provided."}"
                      </div>
                    </section>
                  )}

                  {selectedRequest.status === 'Completed' && (
                    <>
                      <section className="border-t border-gray-50 pt-4">
                        <h4 className="font-black text-slate-800 mb-1">Completion</h4>
                        <div className="space-y-1 text-sm font-medium text-slate-500">
                          <p>Marked completed by: <span className="text-slate-800">Homeowner</span></p>
                          <p>Completion time: <span className="text-slate-800">4 days after acceptance</span></p>
                          <p>Accepted: <span className="text-slate-800">Feb 18</span></p>
                          <p>Completed: <span className="text-slate-800">Feb 22</span></p>
                        </div>
                      </section>
                      <section className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-black text-slate-800">Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star size={16} className="fill-[#F9D949] text-[#F9D949]" />
                            <span className="text-sm font-bold text-slate-800">4.5 / 5</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 italic">"Very professional and fast, did a great job. Would hire again in the future."</p>
                      </section>
                    </>
                  )}

                  <div className="flex flex-col gap-4 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-800 min-w-[60px]">Status:</span>
                      <span className={`px-4 py-1.5 rounded-lg text-[11px] font-bold border ${
                        selectedRequest.status === 'Cancelled' || selectedRequest.status === 'Declined' ? 'bg-red-50 text-red-600 border-red-100' :
                        selectedRequest.status === 'Ongoing' || selectedRequest.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                        'bg-gray-100 text-slate-500 border-gray-200'
                      }`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  </div>

                  <section className="pt-4 border-t border-gray-50">
                    <h4 className="font-black text-slate-800 mb-2">Admin Note (Internal)</h4>
                    <textarea 
                      placeholder="Add an internal note for admins..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button className="px-6 py-2 border border-gray-200 rounded-xl text-slate-500 text-xs font-bold hover:bg-gray-50">Clear</button>
                      <button className="px-6 py-2 bg-[#0A3D62] text-white rounded-xl text-xs font-bold shadow-md">Save</button>
                    </div>
                  </section>
                </div>

                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="w-full py-4 border border-gray-200 rounded-2xl text-slate-800 font-black text-lg hover:bg-gray-50 transition-all mt-4 mb-2"
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

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <motion.div 
    whileHover={{ x: 5 }} onClick={onClick} 
    className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600 border-l-[6px] border-blue-600' : 'text-slate-400 hover:bg-gray-50'}`}
  >
    <span>{icon}</span><span className="text-[13px] font-bold">{label}</span>
  </motion.div>
);

const getIcon = (label) => {
  const icons = {
    Dashboard: <LayoutDashboard size={18} />, Workers: <Users size={18} />,
    Homeowners: <Home size={18} />, Requests: <ClipboardList size={18} />,
    'SMS Logs': <MessageSquare size={18} />, Profile: <User size={18} />
  };
  return icons[label];
};

export default AdminRequest;