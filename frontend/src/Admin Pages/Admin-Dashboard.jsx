import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Home, ClipboardList, MessageSquare, User, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState('Dashboard'); 

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
    }
  };

  const stats = [
    { label: "Total Workers", value: "58", icon: <Users className="text-blue-500" size={20} /> },
    { label: "Pending Verifications", value: "4", icon: <ClipboardList className="text-blue-900" size={20} /> },
    { label: "Pending Request", value: "4", icon: <Home className="text-green-600" size={20} /> },
    { label: "Average Rating", value: "4.5", icon: <span className="text-yellow-400 text-xl">â˜…</span> },
    { label: "SMS Failures Today", value: "4", icon: <MessageSquare className="text-red-500" size={20} /> },
  ];

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F5F2] overflow-hidden">
      {/* Top Bar */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/Logo.png" 
            alt="TrabaHome" 
            className="h-12 w-auto mb-4" 
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
        <motion.main 
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto p-10 pl-6"
        >
          <motion.h1 variants={itemVars} className="text-3xl font-black text-slate-800 mb-2">
            Welcome, Admin
          </motion.h1>
          
          <motion.h2 variants={itemVars} className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-8 mt-6">
            Platform's Activity Summary
          </motion.h2>
          
          <motion.div variants={containerVars} className="grid grid-cols-5 gap-4 mb-12">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVars}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center"
              >
                <div className="mb-4">{stat.icon}</div>
                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* UPGRADED BAR CHART SECTION */}
          <motion.div variants={itemVars} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Request Per Day</h3>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Last 7 Days</span>
            </div>
            
            <div className="h-64 flex items-end justify-between px-6 relative border-b border-gray-100 border-dashed">
                {[2, 5, 4, 6, 7, 4, 5].map((val, i) => (
                  <div key={i} className="flex flex-col items-center w-full group relative">
                    {/* Hover Value Tooltip */}
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: -5 }}
                      className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded md mb-2 z-10 pointer-events-none"
                    >
                      {val} Requests
                    </motion.span>

                    <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: `${val * 22}px` }}
                     transition={{ 
                        delay: 0.2 + (i * 0.1), 
                        duration: 1, 
                        ease: [0.4, 0, 0.2, 1] // Professional cubic-bezier easing
                     }}
                     whileHover={{ scaleX: 1.1 }}
                     // Added Gradient and shadow for professional look
                     className="relative w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg shadow-md group-hover:from-blue-700 group-hover:to-blue-500 transition-all cursor-pointer"
                    >
                      {/* Glossy overlay effect */}
                      <div className="absolute inset-0 bg-white/10 w-1/2 rounded-t-lg"></div>
                    </motion.div>
                    
                    <span className="text-[10px] text-slate-400 mt-4 font-bold uppercase transition-colors group-hover:text-slate-800">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

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

export default AdminDashboard;

