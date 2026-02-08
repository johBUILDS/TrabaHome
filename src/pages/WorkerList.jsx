import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BellIcon, MapIcon, ListIcon, HammerIcon, TrowelIcon, 
  DropletIcon, ZapIcon, BrushIcon, SproutIcon, WrenchIcon,
  SearchIcon, MapPinIcon, ChevronDownIcon, StarIcon, ShieldCheckIcon,
  XIcon, LockIcon, CalendarIcon, ClockIcon // Added icons for better UI
} from "../Icons";

export default function WorkerList() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const urlService = searchParams.get("service") || "";
  const urlLocation = searchParams.get("location") || "";
  const currentParams = location.search;

  const [selectedService, setSelectedService] = useState(urlService);
  const [selectedLocation, setSelectedLocation] = useState(urlLocation);

  // --- LOADING STATE FOR SKELETON EFFECT ---
  const [isLoading, setIsLoading] = useState(true);

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(""); 
  
  const [selectedWorkerName, setSelectedWorkerName] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  useEffect(() => {
    setSelectedService(urlService);
    setSelectedLocation(urlLocation);
    
    // Simulate loading effect
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [urlService, urlLocation]);

  const workers = [
    { id: 1, name: "Mang Berto", role: "Carpenter", location: "Mangaldan", rating: 4.8, image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400", exp: "10 years of experience in home repairs and furniture making." },
    { id: 2, name: "Mang Kanor", role: "Carpenter", location: "Dagupan City", rating: 4.5, image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400", exp: "Specialist in custom cabinets and wooden fixtures." },
    { id: 3, name: "Kuya Dante", role: "Mason", location: "San Fabian", rating: 4.9, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400", exp: "Expert in concrete, tiling, and structural repairs." },
    { id: 4, name: "Mang Ben", role: "Mason", location: "Lingayen", rating: 4.2, image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&q=80&w=400", exp: "Reliable mason for wall repairs and finishing." },
    { id: 5, name: "Mario Rossi", role: "Plumber", location: "Calasiao", rating: 4.7, image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&q=80&w=400", exp: "Licensed plumber for leak detection and pipe installation." },
    { id: 6, name: "Kuya Lito", role: "Plumber", location: "Dagupan City", rating: 4.3, image: "https://images.unsplash.com/photo-1581578731117-10d7881367e0?auto=format&fit=crop&q=80&w=400", exp: "Fast and affordable plumbing services." },
    { id: 7, name: "Sparky Dave", role: "Electrician", location: "Binmaley", rating: 5.0, image: "https://images.unsplash.com/photo-1555861496-0666c8981751?auto=format&fit=crop&q=80&w=400", exp: "Certified electrician for safe home wiring." },
    { id: 8, name: "Mang Romy", role: "Electrician", location: "Mangaldan", rating: 4.6, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400", exp: "General electrical repairs and installation." },
    { id: 9, name: "Ate Rose", role: "Cleaner", location: "Dagupan City", rating: 4.9, image: "https://images.unsplash.com/photo-1554625248-232a5c544d62?auto=format&fit=crop&q=80&w=400", exp: "Meticulous cleaning for homes and offices." },
    { id: 10, name: "Ate Maria", role: "Cleaner", location: "Calasiao", rating: 4.8, image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=400", exp: "Trustworthy cleaner available for weekly service." },
    { id: 13, name: "Kuya Jojo", role: "General Repair", location: "Lingayen", rating: 4.5, image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400", exp: "All-around handyman for quick home fixes." },
  ];

  const uniqueServices = useMemo(() => [...new Set(workers.map(w => w.role))].sort(), [workers]);
  const uniqueLocations = useMemo(() => [...new Set(workers.map(w => w.location))].sort(), [workers]);

  const filteredWorkers = workers.filter((worker) => {
    const matchesService = urlService === "" || worker.role === urlService;
    const matchesLocation = urlLocation === "" || worker.location === urlLocation;
    return matchesService && matchesLocation;
  });

  const handleUpdateSearch = () => {
    navigate(`/list?service=${selectedService}&location=${selectedLocation}`, { replace: true });
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case "Mason": return <TrowelIcon className="w-3 h-3" />;
      case "Plumber": return <DropletIcon className="w-3 h-3" />;
      case "Electrician": return <ZapIcon className="w-3 h-3" />;
      case "Cleaner": return <BrushIcon className="w-3 h-3" />;
      case "Gardener": return <SproutIcon className="w-3 h-3" />;
      case "General Repair": return <WrenchIcon className="w-3 h-3" />;
      default: return <HammerIcon className="w-3 h-3" />;
    }
  };

  const openRequestModal = (workerName) => {
    setSelectedWorkerName(workerName);
    setIsModalOpen(true);
  };

  const handleSendRequest = () => {
    if (!preferredDate) {
      setAlertMessage("Please select a date for the service.");
      setIsAlertOpen(true);
      return;
    }

    const selected = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(today.getFullYear() + 1);

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

  const headerService = urlService ? `${urlService}s` : "All Workers";
  const headerLocation = urlLocation ? `near ${urlLocation}` : "near you";

  return (
    <div className={`w-full min-h-screen bg-[#F9F6F2] text-[#0B3B68] font-sans flex flex-col relative animate-in fade-in duration-1000 ${isModalOpen || isSuccessOpen || isAlertOpen ? 'overflow-hidden' : ''}`}>
      <div className="w-full bg-[#F9F6F2] border-b border-gray-200/50 flex-shrink-0 sticky top-0 z-40 backdrop-blur-md">
        <header className="flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto w-full">
          <img 
            src="/assets/Logo.png"
            alt="TrabaHome"
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-all active:scale-95"
            onClick={() => navigate('/home')}
          />
          <div className="p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer active:scale-90 group">
            <BellIcon className="w-6 h-6 text-[#0B3B68] group-hover:rotate-12 transition-transform" />
          </div>
        </header>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 h-full">
      
        <div className="bg-white p-2 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 mb-8 border border-gray-100 items-center transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
          <div className="flex-1 flex items-center px-4 py-2 border border-gray-200 rounded-xl bg-white relative w-full focus-within:border-[#00AF91] focus-within:ring-4 focus-within:ring-[#00AF91]/10 transition-all">
            <HammerIcon className="w-5 h-5 text-[#0B3B68] mr-3" />
            <select className="w-full bg-transparent outline-none text-[#0B3B68] font-bold appearance-none cursor-pointer" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
              <option value="">All Services</option>
              {uniqueServices.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
          </div>
          <div className="flex-1 flex items-center px-4 py-2 border border-gray-200 rounded-xl bg-white relative w-full focus-within:border-[#00AF91] focus-within:ring-4 focus-within:ring-[#00AF91]/10 transition-all">
            <MapPinIcon className="w-5 h-5 text-[#0B3B68] mr-3" />
            <select className="w-full bg-transparent outline-none text-[#0B3B68] font-bold appearance-none cursor-pointer" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              <option value="">All Locations</option>
              {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
          </div>
          <button onClick={handleUpdateSearch} className="bg-[#0B3B68] text-white px-8 py-2 rounded-xl font-bold hover:bg-[#154875] transition-all shadow-md min-w-[120px] h-full active:scale-95 transform">Search</button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div className="animate-in slide-in-from-left duration-700">
            <h3 className="text-xl font-bold text-[#0B3B68]">{headerService} <span className="text-[#0B3B68]">near</span> <span className="text-[#00AF91]">{headerLocation.replace('near ', '')}</span></h3>
            <p className="text-sm text-gray-500 mt-1">Showing {filteredWorkers.length} workers</p>
          </div>

          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200 transition-all hover:shadow-md">
            <button onClick={() => navigate(`/map${currentParams}`)} className="flex items-center gap-2 px-4 py-1.5 rounded-md text-gray-500 hover:bg-gray-50 transition-all active:scale-95">
                <MapIcon className="w-4 h-4" /> <span className="text-sm font-bold">Map</span>
            </button>
            <button onClick={() => navigate(`/search${currentParams}`)} className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#0B3B68] text-white shadow-sm transition-all active:scale-95">
                <ListIcon className="w-4 h-4" /> <span className="text-sm font-bold">List</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            // --- SKELETON LOADING VIEW ---
            [1,2,3,4].map(n => (
              <div key={n} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-5 animate-pulse">
                <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="flex gap-2 pt-2"><div className="h-8 bg-gray-100 rounded-full w-full"></div><div className="h-8 bg-gray-100 rounded-full w-full"></div></div>
                </div>
              </div>
            ))
          ) : filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker, idx) => (
              <div 
                key={worker.id} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:scale-[1.02] hover:border-[#00AF91]/40 transition-all duration-500 flex flex-col sm:flex-row gap-5 group animate-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${idx * 75}ms`, animationFillMode: 'both' }}
              >
                <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 cursor-pointer relative" onClick={() => navigate(`/profile/${worker.id}`)}>
                  <img src={worker.image} alt={worker.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B3B68] flex items-center gap-1 cursor-pointer hover:text-[#00AF91] transition-colors duration-300" onClick={() => navigate(`/profile/${worker.id}`)}>
                        {worker.name} <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="bg-blue-50 text-[#0B3B68] text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-blue-100 group-hover:bg-[#0B3B68] group-hover:text-white transition-all duration-500">{getRoleIcon(worker.role)} {worker.role}</span>
                        <div className="flex items-center text-yellow-500 text-xs font-bold"><StarIcon className="w-3 h-3 mr-1 animate-pulse" /> {worker.rating}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wide">Available near you</p>
                  <div className="mt-1"><span className="inline-block bg-[#D6EFE8] text-[#00AF91] text-xs font-bold px-2 py-0.5 rounded-full border border-[#BDE5DB]">{worker.location} area</span></div>
                  <p className="text-xs text-gray-500 mt-3 italic line-clamp-1">"{worker.exp}"</p>
                  
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => navigate(`/profile/${worker.id}`)} className="flex-1 px-3 py-1.5 border border-[#0B3B68] text-[#0B3B68] text-xs font-bold rounded-xl hover:bg-[#0B3B68] hover:text-white transition-all duration-300 active:scale-95">View Profile</button>
                    <button onClick={() => openRequestModal(worker.name)} className="flex-1 px-3 py-1.5 bg-[#00AF91] text-white text-xs font-bold rounded-xl hover:bg-[#009b80] hover:shadow-lg hover:shadow-[#00AF91]/30 transition-all duration-300 shadow-sm active:scale-95">Request Service</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 animate-pulse">
              <h3 className="text-xl font-bold text-gray-400">No results found</h3>
              <p className="text-gray-400 mt-2">Try selecting "All Services" or "All Locations".</p>
            </div>
          )}
        </div>
      </main>

      {/* --- INPUT MODAL (Enhanced UI) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[500px] rounded-2xl shadow-2xl p-8 border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors active:scale-90">
                <XIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-[#111] mb-2">Request Service</h2>
            <p className="text-gray-500 mb-6 text-sm">Fill in details for <span className="text-[#00AF91] font-bold">{selectedWorkerName}</span></p>
            
            <div className="bg-[#F3F4F6] rounded-xl p-4 mb-6 ring-1 ring-gray-100 focus-within:ring-[#00AF91] transition-all">
              <textarea 
                placeholder="Describe your project or the problem you're facing..." 
                className="w-full h-40 bg-transparent border-none resize-none focus:outline-none text-gray-600 placeholder-gray-400 italic text-sm leading-relaxed" 
                value={requestDescription} 
                onChange={(e) => setRequestDescription(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#111]">Preferred date <span className="text-gray-400 font-normal">(required)</span></label>
                <div className="relative flex items-center">
                    <CalendarIcon className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
                    <input type="date" className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-500 focus:border-[#00AF91] outline-none transition-colors bg-white shadow-sm" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#111]">Preferred time <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="relative flex items-center">
                    <ClockIcon className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
                    <input type="time" className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-500 focus:border-[#00AF91] outline-none transition-colors bg-white shadow-sm" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
                </div>
              </div>
            </div>

            <button className="w-full bg-[#00AF91] text-white py-3.5 rounded-full font-bold text-lg hover:bg-[#009b80] transition-all active:scale-[0.98] shadow-md shadow-[#00AF91]/20 flex items-center justify-center gap-2 group" onClick={handleSendRequest}>
              Send Request <SearchIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex gap-2 items-start text-[11px] text-gray-500 mt-4 italic">
                <LockIcon className="w-3 h-3 mt-0.5" /> Security Tip: Contact details shared after worker confirms availability.
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM ALERT MODAL (Enhanced UI) --- */}
      {isAlertOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200" onClick={() => setIsAlertOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[320px] rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-90 duration-300">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <LockIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Wait a moment</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{alertMessage}</p>
            <button 
              className="w-full bg-[#0B3B68] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#154875] transition-all active:scale-95 shadow-lg shadow-blue-900/10"
              onClick={() => setIsAlertOpen(false)}
            >
              Okay, I'll check
            </button>
          </div>
        </div>
      )}

      {/* --- SUCCESS MODAL (Enhanced UI) --- */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] animate-in fade-in duration-500" onClick={() => setIsSuccessOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[340px] rounded-2xl shadow-2xl p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <button onClick={() => setIsSuccessOpen(false)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors active:scale-90">
              <XIcon className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in slide-in-from-bottom-2 duration-700">
              <ShieldCheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-[22px] font-bold text-[#111] mb-2">Request Sent!</h2>
            <p className="text-gray-600 text-[12px] mb-8 leading-relaxed">
              We've notified the worker via SMS. You'll be updated once they accept.
            </p>
            <button 
              className="w-full bg-[#003C71] text-white py-3 rounded-[30px] font-bold text-sm hover:bg-[#002a50] transition-all active:scale-95 shadow-lg shadow-blue-900/10" 
              onClick={() => {
                setIsSuccessOpen(false);
                const worker = workers.find(w => w.name === selectedWorkerName);
                navigate('/my-requests', { 
                  state: { 
                    workerName: selectedWorkerName,
                    role: worker?.role || "Specialist",
                    description: requestDescription,
                    schedule: `${preferredDate} at ${preferredTime || "Anytime"}`,
                    image: worker?.image,
                    location: worker?.location,
                    status: "Pending",
                    dateSent: new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  } 
                });
              }}
            >
              View My Requests
            </button>
          </div>
        </div>
      )}

      <footer className="flex-shrink-0 w-full bg-[#0B3B68] h-40 mt-auto relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse duration-[4000ms]"></div>
        <div className="flex flex-col items-center gap-2 relative z-10">
            <h2 className="text-white/40 font-black tracking-[0.2em] text-xs uppercase">TrabaHome</h2>
            <p className="text-white/60 text-sm">© 2026 TrabaHome. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}