import React, { useState, useRef } from 'react';
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

  // Refs for resubmit inputs
  const idInputRef = useRef(null);
  const clearanceInputRef = useRef(null);

  // Preserved State
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

  // State for resubmitted documents
  const [resubmitDocs, setResubmitDocs] = useState({
    validId: null,
    barangayClearance: null
  });

  // Toggle this to 'rejected' or 'verified' to see different UI states
  const [verificationStatus, setVerificationStatus] = useState('rejected'); 
  const [showResubmitModal, setShowResubmitModal] = useState(false);

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

  // Function to handle uploads in the Resubmit Modal
  const handleResubmitUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResubmitDocs(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans flex flex-col items-center overflow-x-hidden text-left relative">
      
      {/* RESUBMIT MODAL (Triggered by "Resubmit Documents" button) */}
      {showResubmitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[600px] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Resubmit Verification Documents</h2>
              <button onClick={() => setShowResubmitModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <p className="text-xs text-gray-500 font-medium">Some of your submitted documents did not meet the verification requirements. Please update only the documents marked below and resubmit for review.</p>
              
              <div className="bg-[#FFF5F5] border border-[#FFE0E0] rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-700">Current Status: <span className="text-[#E03131]">● Rejected</span></span>
                </div>
                <div className="space-y-1 text-[11px] text-gray-600">
                    <p>Reviewed by: <span className="font-bold">System Administrator</span></p>
                    <p>Date: <span className="font-bold">Jan 20, 2026</span></p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-800 mb-3">Reason for Rejection</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#E03131] font-bold">
                    <div className="w-4 h-4 rounded-full border border-[#E03131] flex items-center justify-center text-[10px]">×</div>
                    Valid ID image is unclear / unreadable
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#E03131] font-bold">
                    <div className="w-4 h-4 rounded-full border border-[#E03131] flex items-center justify-center text-[10px]">×</div>
                    Barangay Clearance is expired
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* VALID ID RESUBMIT */}
                <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full border border-[#E03131] flex items-center justify-center text-[#E03131] text-[10px] font-bold">×</div>
                      <span className="text-xs font-bold text-gray-800">Valid ID</span>
                   </div>
                   {resubmitDocs.validId ? (
                     <img src={resubmitDocs.validId} className="w-full h-20 object-cover rounded-lg mb-3 border border-gray-200" alt="New ID Preview" />
                   ) : (
                     <p className="text-[10px] text-[#E03131] font-bold mb-3">Status: Rejected</p>
                   )}
                   <input 
                     type="file" 
                     className="hidden" 
                     ref={idInputRef} 
                     onChange={(e) => handleResubmitUpload('validId', e)} 
                     accept="image/*"
                   />
                   <button 
                     onClick={() => idInputRef.current.click()}
                     className="w-full py-2 bg-[#1C64F2] text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-2"
                   >
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     {resubmitDocs.validId ? 'Change Image' : 'Upload New Valid ID'}
                   </button>
                </div>

                {/* BARANGAY CLEARANCE RESUBMIT */}
                <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full border border-[#E03131] flex items-center justify-center text-[#E03131] text-[10px] font-bold">×</div>
                      <span className="text-xs font-bold text-gray-800">Barangay Clearance</span>
                   </div>
                   {resubmitDocs.barangayClearance ? (
                     <img src={resubmitDocs.barangayClearance} className="w-full h-20 object-cover rounded-lg mb-3 border border-gray-200" alt="New Clearance Preview" />
                   ) : (
                     <p className="text-[10px] text-[#E03131] font-bold mb-3">Status: Rejected</p>
                   )}
                   <input 
                     type="file" 
                     className="hidden" 
                     ref={clearanceInputRef} 
                     onChange={(e) => handleResubmitUpload('barangayClearance', e)} 
                     accept="image/*"
                   />
                   <button 
                     onClick={() => clearanceInputRef.current.click()}
                     className="w-full py-2 bg-[#1C64F2] text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-2"
                   >
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     {resubmitDocs.barangayClearance ? 'Change Image' : 'Upload Updated Clearance'}
                   </button>
                </div>
              </div>

              <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-4">
                 <h5 className="text-[11px] font-bold text-gray-800 mb-2">AI-Assisted Document Check</h5>
                 <ul className="text-[10px] text-gray-600 space-y-1 ml-4 list-disc font-medium">
                   <li>Name consistency</li>
                   <li>Address validity (Pangasinan residency)</li>
                   <li>Image clarity and completeness</li>
                 </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowResubmitModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold">Cancel</button>
              <button className="flex-1 py-2.5 bg-[#1C64F2] text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200">Submit for Review</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full px-6 py-4 flex justify-between items-center">
          <div className="w-[260px] flex items-center cursor-pointer" onClick={() => navigate('/HomeWorker')}>
            <img src="/assets/Logo.png" alt="TrabaHome" className="h-8 w-auto" />
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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Settings</p>
          </div>
          <nav className="flex-1">
            <NavItem icon={<LayoutDashboardIcon className="w-5 h-5" />} label="Dashboard" active={location.pathname === '/HomeWorker'} onClick={() => navigate('/HomeWorker')} />
            <NavItem icon={<BriefcaseIcon className="w-5 h-5" />} label="Jobs" active={location.pathname === '/worker-jobs'} onClick={() => navigate('/worker-jobs')} />
            <NavItem icon={<UserIcon className="w-5 h-5" />} label="Profile" active={true} />
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
                <span className="text-[8px] bg-[#EBF7F3] text-[#00A651] px-1.5 py-0.5 rounded-full flex items-center gap-1 font-bold w-fit">
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

          {/* ACCOUNT VERIFICATION SECTION */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Account Verification</h3>
            
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              {verificationStatus === 'under_review' ? (
                /* UNDER REVIEW UI */
                <>
                  <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FFF9EB] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#D99B00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      </div>
                      <span className="text-sm font-bold text-gray-800">Under Review</span>
                    </div>
                    <button className="text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>
                  </div>
                  <div className="p-6 space-y-6">
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Your documents have been submitted and are currently being reviewed by the system administrator.</p>
                  </div>
                </>
              ) : verificationStatus === 'rejected' ? (
                /* REJECTED UI */
                <>
                  <div className="flex items-center justify-between p-4 border-b border-[#FEE2E2] bg-[#FEF2F2]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#E03131] rounded-full flex items-center justify-center">
                         <span className="text-white font-bold text-sm">!</span>
                      </div>
                      <span className="text-sm font-bold text-[#E03131]">Rejected</span>
                    </div>
                    <button className="text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>
                  </div>

                  <div className="p-6 space-y-5">
                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed">Your application has been rejected by the administrator. Please review the issue below and resubmit your documents.</p>
                    
                    <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm">
                      <h4 className="text-xs font-bold text-gray-800 mb-3">Reason for Rejection</h4>
                      <div className="space-y-3">
                        <p className="text-[11px] text-gray-500 font-medium">ID is not clear or readable.</p>
                        <p className="text-[11px] text-gray-500 font-medium">Please upload a clearer photo of your valid ID.</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowResubmitModal(true)}
                      className="w-full py-3 bg-[#1C64F2] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200"
                    >
                      Resubmit Documents
                    </button>
                  </div>
                </>
              ) : (
                /* VERIFIED UI */
                <>
                  <div className="flex items-center justify-between p-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#EBF7F3] rounded-full flex items-center justify-center"><UserIcon className="w-4 h-4 text-[#00A651]" /></div>
                      <span className="text-sm font-bold text-gray-800">Verified</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    {["Valid ID", "Proof of Work"].map((label, i) => (
                      <div key={i} className="flex items-center justify-between text-xs font-medium font-bold">
                        <div className="flex items-center gap-3 text-gray-600 font-bold">
                          <div className="w-4 h-4 bg-[#00A651] rounded-full flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                          {label}
                        </div>
                        <span className="text-[#00A651] font-bold text-sm">✓</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* BASIC INFO SECTION */}
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
                <input name="fullName" disabled={!isEditing} value={profile.fullName} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-200 rounded-lg h-11 text-sm focus:outline-none focus:border-[#00A651] disabled:bg-white" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerOwnProfile;