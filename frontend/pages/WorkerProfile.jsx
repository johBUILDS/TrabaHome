import React, { useEffect, useState, useRef } from "react"; 
import { useNavigate, useParams } from "react-router-dom";
import { 
  BellIcon, HammerIcon, MapPinIcon, ChevronDownIcon, 
  StarIcon, ShieldCheckIcon, TrowelIcon, DropletIcon, 
  ZapIcon, BrushIcon, SproutIcon, WrenchIcon 
} from "../Icons";

export default function WorkerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const searchRef = useRef(null); 

  // --- STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false); // New Success State
  const [isAlertOpen, setIsAlertOpen] = useState(false); // New Alert Modal State
  const [alertMessage, setAlertMessage] = useState(""); // New Alert Message State
  const [requestDescription, setRequestDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const workers = [
    { 
      id: 1, name: "Mang Berto", role: "Carpenter", location: "Mangaldan", rating: 4.8, reviews: 20, 
      bio: "10 yrs na karpintero. Ayos pinto, cabinet, shelves. Malinis gumawa at on-time. Basta kahoy, kaya ko 'yan. PM lang, legit at maaasahan.", 
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600",
      proofOfWork: [
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400"
      ]
    },
    { id: 2, name: "Mang Kanor", role: "Carpenter", location: "Dagupan City", rating: 4.5, reviews: 15, bio: "Expert in custom cabinets and wooden fixtures. Quality guaranteed.", image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1629904853716-f0bc549482b8?auto=format&fit=crop&q=80&w=400"]},
    { id: 3, name: "Kuya Dante", role: "Mason", location: "San Fabian", rating: 4.9, reviews: 32, bio: "Expert in concrete, tiling, and structural repairs.", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1590384538943-29410c3f283a?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400"]},
    { id: 4, name: "Mang Ben", role: "Mason", location: "Lingayen", rating: 4.2, reviews: 10, bio: "Masonry and heavy construction specialist.", image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1517646272486-a28f669f452d?auto=format&fit=crop&q=80&w=400"]},
    { id: 5, name: "Mario Rossi", role: "Plumber", location: "Calasiao", rating: 4.7, reviews: 25, bio: "Plumbing and pipe repairs expert.", image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1504148455328-4adc7f820df2?auto=format&fit=crop&q=80&w=400"]},
    { id: 6, name: "Kuya Lito", role: "Plumber", location: "Dagupan City", rating: 4.3, reviews: 10, bio: "Expert in leak detection and bathroom fixes.", image: "https://images.unsplash.com/photo-1581578731117-10d7881367e0?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=400"]},
    { id: 7, name: "Sparky Dave", role: "Electrician", location: "Binmaley", rating: 5.0, reviews: 40, bio: "Certified house wiring and electrical repairs.", image: "https://images.unsplash.com/photo-1555861496-0666c8981751?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1454165833467-13a6823c6f05?auto=format&fit=crop&q=80&w=400"]},
    { id: 8, name: "Mang Romy", role: "Electrician", location: "Mangaldan", rating: 4.6, reviews: 18, bio: "Reliable electrical maintenance and troubleshooting.", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1558489580-faa74691fdc5?auto=format&fit=crop&q=80&w=400"]},
    { id: 9, name: "Ate Rose", role: "Cleaner", location: "Dagupan City", rating: 4.9, reviews: 50, bio: "Deep cleaning expert for homes and offices.", image: "https://images.unsplash.com/photo-1554625248-232a5c544d62?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=400"] },
    { id: 10, name: "Ate Maria", role: "Cleaner", location: "Calasiao", rating: 4.8, reviews: 28, bio: "Efficient and trustworthy home cleaning services.", image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=400"] },
    { id: 11, name: "Kuya Carding", role: "Gardener", location: "San Fabian", rating: 4.7, reviews: 15, bio: "Landscape maintenance and plant care.", image: "https://images.unsplash.com/photo-1599309193755-ca3be9fb32a6?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1558905619-17254261be64?auto=format&fit=crop&q=80&w=400"] },
    { id: 13, name: "Kuya Jojo", role: "General Repair", location: "Lingayen", rating: 4.5, reviews: 22, bio: "All-around handyman for home repairs.", image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400", proofOfWork: ["https://images.unsplash.com/photo-1544724569-5f546fa6629d?auto=format&fit=crop&q=80&w=400"] },
  ];

  const worker = workers.find(w => w.id === parseInt(id));

  // --- DROPDOWN STATES ---
  const [selectedRole, setSelectedRole] = useState(worker?.role || "");
  const [selectedLocation, setSelectedLocation] = useState(worker?.location || "");
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const roles = ["Carpenter", "Mason", "Plumber", "Electrician", "Cleaner", "Gardener", "General Repair"];
  const locations = ["Binmaley", "Calasiao", "Dagupan City", "Lingayen", "Mangaldan", "San Fabian"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsRoleOpen(false);
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    navigate(`/search?service=${selectedRole}&location=${selectedLocation}`);
  };

  // --- NEW VALIDATION LOGIC ---
  const handleSendRequest = () => {
    if (!preferredDate) {
      setAlertMessage("Please select a date for the service.");
      setIsAlertOpen(true);
      return;
    }

    const selected = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight

    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(today.getFullYear() + 1);

    // Exact date (today) or following days
    if (selected < today) {
      setAlertMessage("Invalid Date: You cannot select a date in the past.");
      setIsAlertOpen(true);
      return;
    }
    
    if (selected > oneYearFromNow) {
      setAlertMessage("Invalid Date: You cannot schedule more than 1 year in advance.");
      setIsAlertOpen(true);
      return;
    }

    setIsModalOpen(false);
    setIsSuccessOpen(true);
  };

  if (!worker) {
    return <div className="p-20 text-center font-bold">Worker not found. <button onClick={() => navigate(-1)}>Go Back</button></div>;
  }

  const nearbyWorkers = workers
    .filter(w => w.role === worker.role && w.id !== worker.id)
    .slice(0, 3);

  const getRoleIcon = (role) => {
    switch(role) {
      case "Mason": return <TrowelIcon className="w-5 h-5" />;
      case "Plumber": return <DropletIcon className="w-5 h-5" />;
      case "Electrician": return <ZapIcon className="w-5 h-5" />;
      case "Cleaner": return <BrushIcon className="w-5 h-5" />;
      case "Gardener": return <SproutIcon className="w-5 h-5" />;
      case "General Repair": return <WrenchIcon className="w-5 h-5" />;
      default: return <HammerIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className={`w-full min-h-screen bg-[#F9F6F2] text-[#0B3B68] font-sans flex flex-col relative ${isModalOpen || isSuccessOpen || isAlertOpen ? 'overflow-hidden' : ''}`}>
      {/* HEADER */}
      <div className="w-full bg-[#F9F6F2] border-b border-gray-200/50 flex-shrink-0">
        <header className="flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto w-full">
          <h1 className="text-2xl font-bold tracking-tighter text-[#00AF91] cursor-pointer" onClick={() => navigate('/home')}>
            Traba<span className="text-[#0B3B68]">Home</span>
          </h1>
          <div className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer"><BellIcon className="w-6 h-6 text-[#0B3B68]" /></div>
        </header>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Search Results</h2>
        
        {/* DYNAMIC SEARCH BAR */}
        <div ref={searchRef} className="bg-white p-2 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 mb-10 border border-gray-100 items-center relative z-50">
          <div className="flex-1 relative w-full">
            <div onClick={() => { setIsRoleOpen(!isRoleOpen); setIsLocationOpen(false); }} className="flex items-center px-4 py-2 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-[#00AF91] transition-all">
              <span className="text-[#0B3B68] mr-3">{getRoleIcon(selectedRole)}</span>
              <div className="flex-grow text-[#0B3B68] font-bold">{selectedRole}</div>
              <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
            </div>
            {isRoleOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-[60]">
                {roles.map((r) => (
                  <div key={r} onClick={() => { setSelectedRole(r); setIsRoleOpen(false); }} className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm font-semibold border-b border-gray-50 last:border-0">{r}</div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 relative w-full">
            <div onClick={() => { setIsLocationOpen(!isLocationOpen); setIsRoleOpen(false); }} className="flex items-center px-4 py-2 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-[#00AF91] transition-all">
              <MapPinIcon className="w-5 h-5 text-[#0B3B68] mr-3" />
              <div className="flex-grow text-[#0B3B68] font-bold">{selectedLocation}, Pangasinan</div>
              <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
            </div>
            {isLocationOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-[60]">
                {locations.map((l) => (
                  <div key={l} onClick={() => { setSelectedLocation(l); setIsLocationOpen(false); }} className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm font-semibold border-b border-gray-50 last:border-0">{l}</div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleSearch} className="bg-[#0B3B68] text-white px-8 py-2 rounded-xl font-bold hover:bg-[#154875] min-w-[120px] transition-colors">Search</button>
        </div>

        <h3 className="text-xl font-bold mb-8">{worker.role}s near <span className="text-[#00AF91]">{worker.location}, Pangasinan</span></h3>

        {/* MAIN WORKER CARD */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col mb-12">
          <div className="flex flex-col md:flex-row gap-10 mb-8">
            <div className="w-full md:w-[350px] h-[350px] flex-shrink-0">
              <img src={worker.image} alt={worker.name} className="w-full h-full object-cover rounded-2xl shadow-inner" />
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold text-[#0B3B68]">{worker.name}</h1>
                <ShieldCheckIcon className="w-6 h-6 text-blue-500 mt-1" />
              </div>
              <div className="mb-4 flex items-center gap-2">
                <span className="bg-blue-50 text-[#0B3B68] px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 flex items-center gap-2">
                  {getRoleIcon(worker.role)} {worker.role}
                </span>
              </div>
              <div className="mb-3">
                <span className="bg-[#D6EFE8] text-[#00AF91] px-4 py-1 rounded-full text-xs font-bold border border-[#BDE5DB]">{worker.location} area</span>
              </div>
              <div className="flex items-center text-[#0B3B68] text-sm font-bold mb-6">
                <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
                {worker.rating} | {worker.reviews} Ratings <span className="text-[#00AF91] ml-2 cursor-pointer hover:underline">(See Reviews)</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-10 max-w-md italic">"{worker.bio}"</p>
              <button onClick={() => setIsModalOpen(true)} className="bg-[#00AF91] text-white py-3.5 rounded-full font-bold text-lg hover:bg-[#009b80] shadow-md w-full md:w-[400px]">Request Service</button>
            </div>
          </div>

          <div className="mt-4 pt-8 border-t border-gray-100">
            <h4 className="text-lg font-bold mb-6 uppercase tracking-wider text-[#0B3B68]/70">Proof of Work</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {worker.proofOfWork.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-gray-200 shadow-sm border border-gray-100">
                  <img src={img} alt="work example" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ALSO AVAILABLE NEARBY */}
        <section className="mb-20">
          <h4 className="text-lg font-bold mb-6 uppercase tracking-wider text-[#0B3B68]/70">Also Available {worker.role}s Nearby</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearbyWorkers.length > 0 ? nearbyWorkers.map((nearby) => (
              <div key={nearby.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <img src={nearby.image} alt={nearby.name} className="w-full aspect-square rounded-2xl object-cover mb-4 shadow-sm" />
                <h5 className="text-lg font-bold">{nearby.name}</h5>
                <p className="text-sm text-[#00AF91] font-bold mb-4">{nearby.location}</p>
                <button onClick={() => navigate(`/profile/${nearby.id}`)} className="w-full border border-gray-200 py-2.5 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">View Profile</button>
              </div>
            )) : <div className="col-span-3 text-center py-10 text-gray-400">No other {worker.role}s found.</div>}
          </div>
        </section>
      </main>

      {/* --- INPUT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[500px] rounded-xl shadow-xl p-8 border border-blue-400">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h2 className="text-xl font-bold text-[#111] mb-6">What do you need help with?</h2>
            <div className="bg-[#EFEFEF] rounded-lg p-4 mb-6">
              <textarea placeholder="describe your problem.." className="w-full h-48 bg-transparent border-none resize-none focus:outline-none text-gray-600 placeholder-gray-400 italic" value={requestDescription} onChange={(e) => setRequestDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#111]">Preferred date <span className="text-gray-400 font-normal">(required)</span></label>
                <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#111]">Preferred time <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="time" className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
              </div>
            </div>
            <button className="w-full bg-[#00AF91] text-white py-3.5 rounded-full font-bold text-lg" onClick={handleSendRequest}>Send Request</button>
            <div className="flex gap-2 items-start text-[11px] text-gray-500 mt-4 italic">🔒 contact details shared after acceptance.</div>
          </div>
        </div>
      )}

      {/* --- CUSTOM ALERT MODAL --- */}
      {isAlertOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setIsAlertOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[320px] rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Wait a moment</h3>
            <p className="text-sm text-gray-500 mb-6">{alertMessage}</p>
            <button 
              className="w-full bg-[#0B3B68] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#154875]"
              onClick={() => setIsAlertOpen(false)}
            >
              Okay, I'll check
            </button>
          </div>
        </div>
      )}

      {/* --- SUCCESS MODAL --- */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsSuccessOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[340px] rounded-[10px] shadow-2xl p-10 flex flex-col items-center text-center">
            <button onClick={() => setIsSuccessOpen(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
            <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center mb-4"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg></div>
            <h2 className="text-[22px] font-bold text-[#111] mb-2">Request Sent!</h2>
            <p className="text-gray-600 text-[12px] mb-8 leading-relaxed">We've notified the worker via SMS. You'll be updated once they accept.</p>
            <button 
              className="w-full bg-[#003C71] text-white py-3 rounded-[30px] font-bold text-sm hover:bg-[#002a50]" 
              onClick={() => {
                setIsSuccessOpen(false);
                navigate('/my-requests', { 
                  state: { 
                    workerName: worker.name,
                    role: worker.role,
                    description: requestDescription,
                    date: preferredDate,
                    time: preferredTime,
                    image: worker.image
                  } 
                });
              }}
            >
              View My Requests
            </button>
          </div>
        </div>
      )}

      <footer className="w-full bg-[#0B3B68] h-32 mt-auto flex items-center justify-center">
        <p className="text-white/60 text-sm">© 2026 TrabaHome. All rights reserved.</p>
      </footer>
    </div>
  );
}