import React, { useState, useRef } from "react"; // Added useRef
import Navbar from "../components/Navbar";

export default function HomeownersProfile() {
  // --- EXISTING STATES ---
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  
  // --- NEW: MODAL CONTROL STATE ---
  const [activeModal, setActiveModal] = useState(null); // 'email', 'password', or null

  // --- NEW: PROFILE PICTURE STATE & REF ---
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Justhine");

  // Profile Data State
  const [profile, setProfile] = useState({
    firstName: "Justhine",
    lastName: "Joy",
    mobile: "+961 203 2402",
    email: "justhine.joy@gmail.com",
    facebook: "",
    address: "Banaong, Mangaldan, Pangasinan",
    directions: ""
  });

  // --- NEW: IMAGE HANDLERS ---
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // --- REUSABLE MODAL COMPONENT ---
  const SecurityModal = ({ title, children, onSave, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-black text-[#0B3B68] text-[13px] uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors">&times;</button>
        </div>
        <div className="p-6 space-y-4 bg-white">
          {children}
        </div>
        <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-bold text-[11px] uppercase tracking-widest hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onSave} 
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#0B3B68] text-white font-bold text-[11px] uppercase tracking-widest shadow-md hover:bg-[#082d50] transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const SectionCard = ({ title, children, onEdit, isEditing, hasEdit = true }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-white">
        <h3 className="font-bold text-[#4A4A4A] text-[13px] tracking-tight">{title}</h3>
        {hasEdit && (
          <button 
            onClick={onEdit}
            className={`text-[10px] px-4 py-1 border rounded-full font-bold uppercase tracking-wider transition-all ${
              isEditing 
              ? "bg-[#0B3B68] text-white border-[#0B3B68]" 
              : "border-gray-200 text-gray-400 hover:bg-gray-50"
            }`}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        )}
      </div>
      <div className="p-6 bg-white">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F6F2] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">My Profile</h1>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-6 shadow-sm mb-8 border border-gray-100">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-pink-400 overflow-hidden border-4 border-white shadow-sm">
              <img 
                src={profilePic} // Updated to use state
                alt="avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Hidden Input added here */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
            <label 
              onClick={triggerFileInput} // Updated to trigger file input
              className="absolute bottom-1 right-1 bg-gray-500 text-white w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-md cursor-pointer hover:bg-gray-600 transition-all"
            >
              ✎
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#2D2D2D] leading-tight">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-gray-500 font-medium">{profile.address}</p>
            <p className="text-[11px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Homeowner</p>
          </div>
        </div>

        {/* Personal Information */}
        <SectionCard 
          title="Personal Information" 
          isEditing={isEditingPersonal} 
          onEdit={() => setIsEditingPersonal(!isEditingPersonal)}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-800 uppercase">First Name</label>
              <input 
                disabled={!isEditingPersonal}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] disabled:bg-gray-50 focus:ring-1 focus:ring-[#00897B] outline-none transition-all"
                value={profile.firstName}
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-800 uppercase">Last Name</label>
              <input 
                disabled={!isEditingPersonal}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] disabled:bg-gray-50 outline-none transition-all"
                value={profile.lastName}
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-800 uppercase">Mobile Number (For SMS & System Alerts)</label>
              <input 
                disabled={!isEditingPersonal}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] disabled:bg-gray-50 outline-none transition-all"
                value={profile.mobile}
                onChange={(e) => setProfile({...profile, mobile: e.target.value})}
              />
            </div>
          </div>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard 
          title="Contact Information (Shared After Approval)" 
          isEditing={isEditingContact}
          onEdit={() => setIsEditingContact(!isEditingContact)}
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-800">Mobile Number (Required)</label>
              <input disabled={!isEditingContact} placeholder="Enter mobile number" className="border border-gray-200 rounded-lg px-4 py-2 text-[13px] outline-none disabled:bg-gray-50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-800">Email Address (Optional)</label>
              <input 
                disabled={!isEditingContact}
                className="border border-gray-200 rounded-lg px-4 py-2 text-[13px] outline-none disabled:bg-gray-50"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-800">Full Address (Optional)</label>
                <input disabled={!isEditingContact} value={profile.address} className="border border-gray-200 rounded-lg px-4 py-2 text-[13px] outline-none disabled:bg-gray-50" />
              </div>
              <input disabled={!isEditingContact} placeholder="Additional Directions" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-[13px] outline-none disabled:bg-gray-50" />
            </div>
            <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
              <span className="text-xs">🔒</span> Your contact details are only shared after a worker approves your request.
            </p>
          </div>
        </SectionCard>

        {/* Account Security */}
        <div className="mb-8">
           <h3 className="text-sm font-bold text-gray-800 mb-4 px-1">Account Security</h3>
           <div className="flex gap-4">
              <button 
                onClick={() => setActiveModal('email')}
                className="flex-1 bg-[#0B3B68] text-white py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md hover:bg-[#082d50] active:scale-95 transition-all"
              >
                Change Email
              </button>
              <button 
                onClick={() => setActiveModal('password')}
                className="flex-1 bg-[#0B3B68] text-white py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md hover:bg-[#082d50] active:scale-95 transition-all"
              >
                Change Password
              </button>
           </div>
        </div>

        {/* Activity Summary */}
        <SectionCard title="Activity Summary" hasEdit={false}>
          <div className="grid grid-cols-3">
            <div className="flex flex-col items-center justify-center gap-2 border-r border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-sm">3</div>
              <span className="text-[9px] font-black text-gray-500 uppercase text-center leading-tight">Total<br/>Requests</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-r border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center justify-center font-black text-sm">3</div>
              <span className="text-[9px] font-black text-gray-500 uppercase text-center leading-tight">Completed<br/>Requests</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-black text-sm">3</div>
              <span className="text-[9px] font-black text-gray-500 uppercase text-center leading-tight">Cancelled<br/>Requests</span>
            </div>
          </div>
        </SectionCard>
      </main>

      {/* --- NEW: RENDERED MODALS --- */}
      {activeModal === 'email' && (
        <SecurityModal 
          title="Change Email Address" 
          onClose={() => setActiveModal(null)}
          onSave={() => {
            alert("Email verification sent!");
            setActiveModal(null);
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">New Email Address</label>
            <input type="email" placeholder="email@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">Confirm Password</label>
            <input type="password" placeholder="Verify your identity" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
          </div>
        </SecurityModal>
      )}

      {activeModal === 'password' && (
        <SecurityModal 
          title="Update Password" 
          onClose={() => setActiveModal(null)}
          onSave={() => {
            alert("Password successfully changed!");
            setActiveModal(null);
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-50 mt-2">
            <label className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">New Password</label>
            <input type="password" placeholder="Min. 8 characters" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">Confirm New Password</label>
            <input type="password" placeholder="Repeat new password" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
          </div>
        </SecurityModal>
      )}

      <footer className="h-40 bg-[#0B3B68] mt-10"></footer>
    </div>
  );
}