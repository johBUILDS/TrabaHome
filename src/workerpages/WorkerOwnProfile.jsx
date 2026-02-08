import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboardIcon, BriefcaseIcon, UserIcon, 
  HammerIcon, BellIcon, LockIcon 
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

const WorkerOwnProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for editing and uploads
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Mang Berto",
    profession: "Carpenter",
    location: "Mangaldan, Pangasinan",
    bio: "",
    phone: "",
    email: "",
    facebook: "",
    images: [null, null, null]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...profile.images];
        newImages[index] = reader.result;
        setProfile(prev => ({ ...prev, images: newImages }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans flex flex-col items-center overflow-x-hidden text-left relative">
      
      {/* HEADER BAR - Consistent with WorkerHome and WorkerProfile */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full px-6 py-4 flex justify-between items-center">
          <div 
            className="w-[260px] flex items-center cursor-pointer" 
            onClick={() => navigate('/HomeWorker')}
          >
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
        
        {/* SIDEBAR - Sticky position adjusted for header */}
        <aside className="w-[260px] sticky top-[88px] h-[calc(100vh-112px)] bg-white flex flex-col rounded-2xl shadow-sm border border-gray-100 shrink-0">
          <div className="p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Settings</p>
          </div>
          
          <nav className="flex-1">
            <NavItem icon={<LayoutDashboardIcon className="w-5 h-5" />} label="Dashboard" active={location.pathname === '/HomeWorker'} onClick={() => navigate('/HomeWorker')} />
            <NavItem icon={<BriefcaseIcon className="w-5 h-5" />} label="Jobs" active={location.pathname === '/worker-jobs'} onClick={() => navigate('/worker-jobs')} />
            <NavItem icon={<UserIcon className="w-5 h-5" />} label="Profile" active={location.pathname === '/worker-profile'} onClick={() => navigate('/worker-profile')} />
          </nav>

          <div className="p-5 mt-auto border-t border-gray-50">
            <div className="bg-white border border-gray-100 rounded-xl p-3 mb-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden shrink-0 relative">
                <img src="https://i.pravatar.cc/150?u=berto" alt="Worker" className="w-full h-full object-cover" />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#0085FF] border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">✓</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">Mang Berto</p>
                <span className="text-[8px] bg-[#EBF7F3] text-[#00A651] px-1.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <HammerIcon className="w-2 h-2" /> Carpenter
                </span>
              </div>
            </div>
            <button className="w-full py-2 border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider">Logout</button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-[800px]">
          <header className="flex justify-between items-center mb-8 px-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          </header>

          {/* PROFILE TOP CARD */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-100 rounded-full overflow-hidden shrink-0 ring-4 ring-[#F0F9F6]">
              <img src="https://i.pravatar.cc/150?u=berto" alt="Mang Berto" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
                <div className="w-4 h-4 bg-[#0085FF] rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">✓</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="bg-[#EBF7F3] text-[#00A651] px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <HammerIcon className="w-3 h-3" /> {profile.profession}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                  <span className="text-yellow-400 text-sm">★</span> 
                  <span className="font-bold text-gray-700">4.8</span> | 20 Ratings 
                  <button className="text-[#0085FF] hover:underline ml-1"> (See Reviews)</button>
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNT VERIFICATION */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Account Verification</h3>
            <div className="border border-gray-100 rounded-xl p-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#EBF7F3] rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-[#00A651]" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">Verified</span>
                </div>
                <button className="text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
              
              <div className="space-y-4 pl-11">
                {[
                  { label: "Valid ID" },
                  { label: "Barangay Clearance" },
                  { label: "Proof of Work" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-4 h-4 bg-[#00A651] rounded-full flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                      {item.label}
                    </div>
                    <span className="text-[#00A651] font-bold text-sm">✓</span>
                  </div>
                ))}
                <p className="text-[10px] text-gray-400 pt-2 italic">Approved on: Jan 18, 2026</p>
                <p className="text-[10px] text-gray-500 font-medium">
                  Need to update a document? <button className="text-[#0085FF] hover:underline">Contact support.</button>
                </p>
              </div>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-gray-800">Basic Info</h3>
              <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-md hover:bg-gray-50 uppercase tracking-tighter">
                {isEditing ? 'save' : 'edit'}
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Full name</label>
                <input name="fullName" disabled={!isEditing} value={profile.fullName} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg h-11 text-sm focus:outline-none focus:border-[#00A651] disabled:cursor-default" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Profession</label>
                <div className="relative">
                  <input name="profession" disabled={!isEditing} value={profile.profession} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg h-11 text-sm focus:outline-none focus:border-[#00A651] disabled:cursor-default" />
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Location</label>
                <input name="location" disabled={!isEditing} value={profile.location} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg h-11 text-sm focus:outline-none focus:border-[#00A651]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Bio</label>
                <textarea name="bio" disabled={!isEditing} value={profile.bio} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg h-24 text-sm resize-none focus:outline-none focus:border-[#00A651]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Proof of Work</label>
                <div className="flex gap-4">
                  {profile.images.map((img, idx) => (
                    <label key={idx} className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors">
                      {img ? <img src={img} className="w-full h-full object-cover" alt={`Proof ${idx}`} /> : <span className="text-gray-300 text-2xl">+</span>}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(idx, e)} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-gray-800">Contact Information</h3>
              <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-md hover:bg-gray-50 uppercase tracking-tighter">
                {isEditing ? 'save' : 'edit'}
              </button>
            </div>
            <div className="space-y-6">
              {["phone", "email", "facebook"].map((field) => (
                <div key={field}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">{field === "phone" ? "Phone Number" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <div className="relative">
                    <input name={field} disabled={!isEditing} value={profile[field]} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg h-11 text-sm focus:outline-none" />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 text-gray-400 pt-2">
                <LockIcon className="w-3.5 h-3.5" />
                <p className="text-[10px] font-medium italic">Your contact details are only shared after you accept a request.</p>
              </div>
            </div> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerOwnProfile;