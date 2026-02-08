import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BellIcon, MapIcon, ListIcon, HammerIcon, TrowelIcon, 
  DropletIcon, ZapIcon, BrushIcon, SproutIcon, WrenchIcon,
  SearchIcon, MapPinIcon, ChevronDownIcon, StarIcon, PlusIcon, MinusIcon, ShieldCheckIcon
} from "../Icons";

export default function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const urlService = searchParams.get("service") || "";
  const urlLocation = searchParams.get("location") || "";
  const currentParams = location.search;

  const [selectedService, setSelectedService] = useState(urlService);
  const [selectedLocation, setSelectedLocation] = useState(urlLocation);

  // --- ZOOM & DRAG STATE ---
  const [zoom, setZoom] = useState(1); 
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

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
  }, [urlService, urlLocation]);

  // --- MOUSE WHEEL ZOOM HANDLER ---
  useEffect(() => {
    const mapContainer = mapRef.current;
    if (!mapContainer) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      setZoom(prev => {
        const newZoom = Math.min(Math.max(prev + delta, 1), 5);
        if (newZoom === 1) setPosition({ x: 0, y: 0 });
        return newZoom;
      });
    };

    mapContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => mapContainer.removeEventListener("wheel", handleWheel);
  }, []);

  const workers = [
    { id: 1, name: "Mang Berto", role: "Carpenter", location: "Mangaldan", rating: 4.8, image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Mang Kanor", role: "Carpenter", location: "Dagupan City", rating: 4.5, image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Kuya Dante", role: "Mason", location: "San Fabian", rating: 4.9, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Mang Ben", role: "Mason", location: "Lingayen", rating: 4.2, image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&q=80&w=400" },
    { id: 5, name: "Mario Rossi", role: "Plumber", location: "Calasiao", rating: 4.7, image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&q=80&w=400" },
    { id: 6, name: "Kuya Lito", role: "Plumber", location: "Dagupan City", rating: 4.3, image: "https://images.unsplash.com/photo-1581578731117-10d7881367e0?auto=format&fit=crop&q=80&w=400" },
    { id: 7, name: "Sparky Dave", role: "Electrician", location: "Binmaley", rating: 5.0, image: "https://images.unsplash.com/photo-1555861496-0666c8981751?auto=format&fit=crop&q=80&w=400" },
    { id: 8, name: "Mang Romy", role: "Electrician", location: "Mangaldan", rating: 4.6, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400" },
    { id: 9, name: "Ate Rose", role: "Cleaner", location: "Dagupan City", rating: 4.9, image: "https://images.unsplash.com/photo-1554625248-232a5c544d62?auto=format&fit=crop&q=80&w=400" },
    { id: 10, name: "Ate Maria", role: "Cleaner", location: "Calasiao", rating: 4.8, image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=400" },
    { id: 11, name: "Kuya Carding", role: "Gardener", location: "San Fabian", rating: 4.7, image: "https://images.unsplash.com/photo-1599309193755-ca3be9fb32a6?auto=format&fit=crop&q=80&w=400" },
    { id: 13, name: "Kuya Jojo", role: "General Repair", location: "Lingayen", rating: 4.5, image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400" },
  ];

  const uniqueServices = useMemo(() => [...new Set(workers.map(w => w.role))].sort(), [workers]);
  const uniqueLocations = useMemo(() => [...new Set(workers.map(w => w.location))].sort(), [workers]);

  const filteredWorkers = workers.filter((worker) => {
    const matchesService = urlService === "" || worker.role === urlService;
    const matchesLocation = urlLocation === "" || worker.location === urlLocation;
    return matchesService && matchesLocation;
  });

  const handleUpdateSearch = () => {
    navigate(`/search?service=${selectedService}&location=${selectedLocation}`, { replace: true });
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

  // --- UPDATED COORDINATES FOR PANGASINAN SCALE ---
  const cityCoordinates = {
    "Dagupan City": { top: "45%", left: "55%" },
    "Calasiao":     { top: "52%", left: "56%" },
    "Lingayen":     { top: "48%", left: "42%" },
    "Binmaley":     { top: "46%", left: "48%" },
    "San Fabian":   { top: "35%", left: "62%" },
    "Mangaldan":    { top: "43%", left: "61%" },
  };

  const getMapPosition = (locationName, id) => {
    const base = cityCoordinates[locationName] || { top: "50%", left: "50%" };
    const topVal = parseFloat(base.top) + ((id % 5) - 2) * 0.5; 
    const leftVal = parseFloat(base.left) + ((id % 5) - 2) * 0.5;
    return { top: `${topVal}%`, left: `${leftVal}%` };
  };

  // --- ZOOM & DRAG HANDLERS ---
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleIconClick = (locationName, id) => {
    const pos = getMapPosition(locationName, id);
    const container = mapRef.current;
    if (!container) return;
    const { clientWidth, clientHeight } = container;
    const targetX = (clientWidth / 2) - (parseFloat(pos.left) / 100 * clientWidth);
    const targetY = (clientHeight / 2) - (parseFloat(pos.top) / 100 * clientHeight);
    setZoom(3);
    setPosition({ x: targetX * 3, y: targetY * 3 });
  };

  const headerService = urlService ? `${urlService}s` : "All Workers";
  const headerLocation = urlLocation ? `near ${urlLocation}` : "near you";

  return (
    <div className="w-full min-h-screen bg-[#F9F6F2] text-[#0B3B68] font-sans flex flex-col select-none">
      <div className="w-full bg-[#F9F6F2] border-b border-gray-200/50 flex-shrink-0">
        <header className="flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto w-full">
          <h1 className="text-2xl font-bold tracking-tighter text-[#00AF91] cursor-pointer" onClick={() => navigate('/home')}>
            Traba<span className="text-[#0B3B68]">Home</span>
          </h1>
          <div className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer"><BellIcon className="w-6 h-6 text-[#0B3B68]" /></div>
        </header>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 h-full">
        <div className="bg-white p-2 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 mb-8 border border-gray-100 items-center">
          <div className="flex-1 flex items-center px-4 py-2 border border-gray-200 rounded-xl bg-white relative w-full">
            <HammerIcon className="w-5 h-5 text-[#0B3B68] mr-3" />
            <select className="w-full bg-transparent outline-none text-[#0B3B68] font-bold appearance-none cursor-pointer" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
              <option value="">All Services</option>
              {uniqueServices.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
          </div>
          <div className="flex-1 flex items-center px-4 py-2 border border-gray-200 rounded-xl bg-white relative w-full">
            <MapPinIcon className="w-5 h-5 text-[#0B3B68] mr-3" />
            <select className="w-full bg-transparent outline-none text-[#0B3B68] font-bold appearance-none cursor-pointer" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              <option value="">All Locations</option>
              {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
          </div>
          <button onClick={handleUpdateSearch} className="bg-[#0B3B68] text-white px-8 py-2 rounded-xl font-bold hover:bg-[#154875] transition-colors shadow-md min-w-[120px] h-full">Search</button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#0B3B68]">{headerService} <span className="text-[#0B3B68]">near</span> <span className="text-[#00AF91]">{headerLocation.replace('near ', '')}</span></h3>
            <p className="text-sm text-gray-500 mt-1">Showing {filteredWorkers.length} {urlService.toLowerCase() || 'worker'}s</p>
          </div>
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button onClick={() => navigate(`/map${currentParams}`)} className="flex items-center gap-2 px-4 py-1.5 rounded-md text-gray-500 hover:bg-gray-50 transition">
              <MapIcon className="w-4 h-4" /> <span className="text-sm font-bold">Map</span>
            </button>
            <button onClick={() => navigate(`/list${currentParams}`)} className="flex items-center gap-2 px-4 py-1.5 rounded-md text-gray-500 hover:bg-gray-50 transition">
              <ListIcon className="w-4 h-4" /> <span className="text-sm font-bold">List</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 relative items-start h-full">
          {/* DRAGGABLE & ZOOMABLE MAP */}
          <div 
            ref={mapRef}
            className={`lg:col-span-5 h-[600px] sticky top-4 bg-[#D6EFE8] rounded-3xl overflow-hidden border-4 border-white shadow-sm z-0 relative ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="absolute inset-0 transition-all duration-500 ease-out origin-center"
              style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
            >
              <iframe width="100%" height="100%" frameBorder="0" scrolling="no"
                src="https://www.openstreetmap.org/export/embed.html?bbox=119.7821,15.6500,120.9421,16.3000&layer=mapnik"
                className="opacity-70 pointer-events-none absolute inset-0 w-full h-full"
              ></iframe>
              {filteredWorkers.map((worker) => {
                const pos = getMapPosition(worker.location, worker.id);
                return (
                  <div 
                    key={worker.id} 
                    className="absolute group cursor-pointer z-10" 
                    style={{ top: pos.top, left: pos.left, transform: `translate(-50%, -50%) scale(${1/zoom})` }}
                    onClick={(e) => { e.stopPropagation(); handleIconClick(worker.location, worker.id); }}
                  >
                    <div className="bg-white p-2 rounded-full shadow-lg border-2 border-[#0B3B68] text-[#0B3B68] transform hover:scale-110 transition-transform">
                      {getRoleIcon(worker.role)}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Map Mini Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
               <button onClick={() => setZoom(prev => Math.min(prev + 0.5, 5))} className="p-2 border-b hover:bg-gray-50"><PlusIcon className="w-4 h-4"/></button>
               <button onClick={() => { const newZ = Math.max(zoom - 0.5, 1); setZoom(newZ); if(newZ === 1) setPosition({x:0,y:0}) }} className="p-2 hover:bg-gray-50"><MinusIcon className="w-4 h-4"/></button>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map((worker) => (
                <div key={worker.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5">
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-200 rounded-xl overflow-hidden cursor-pointer" onClick={() => navigate(`/profile/${worker.id}`)}>
                    <img src={worker.image} alt={worker.name} className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-[#0B3B68] cursor-pointer hover:text-[#00AF91]" onClick={() => navigate(`/profile/${worker.id}`)}>{worker.name}</h3>
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"><MapPinIcon className="w-3 h-3" /> {worker.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-blue-100 text-[#0B3B68] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">{getRoleIcon(worker.role)} {worker.role}</span>
                      <div className="flex items-center text-yellow-500 text-sm font-bold"><StarIcon className="w-4 h-4 mr-1" /> {worker.rating}</div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => navigate(`/profile/${worker.id}`)} className="flex-1 px-4 py-2 border border-[#0B3B68] text-[#0B3B68] text-sm font-bold rounded-full hover:bg-blue-50 transition-colors">View Profile</button>
                      <button onClick={() => openRequestModal(worker.name)} className="flex-1 px-4 py-2 bg-[#00AF91] text-white text-sm font-bold rounded-full hover:bg-[#009b80] transition-colors shadow-sm">Request Service</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <h3 className="text-xl font-bold text-gray-400">No results found</h3>
                <p className="text-gray-400 mt-2">Try selecting "All Services" or "All Locations".</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- MODALS (Kept exactly as original) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[500px] rounded-xl shadow-xl p-8 border border-blue-400">
            <h2 className="text-xl font-bold text-[#111] mb-6">What do you need help with?</h2>
            <div className="bg-[#EFEFEF] rounded-lg p-4 mb-6">
              <textarea placeholder="describe your problem.." className="w-full h-48 bg-transparent border-none resize-none focus:outline-none text-gray-600 italic" 
                value={requestDescription} onChange={(e) => setRequestDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Preferred date</label>
                <input type="date" className="border rounded-lg px-3 py-2 text-sm outline-none" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Preferred time</label>
                <input type="time" className="border rounded-lg px-3 py-2 text-sm outline-none" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
              </div>
            </div>
            <button className="w-full bg-[#00AF91] text-white py-3.5 rounded-full font-bold shadow-md hover:bg-[#009b80]" onClick={handleSendRequest}>Send Request</button>
          </div>
        </div>
      )}

      {isAlertOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setIsAlertOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[320px] rounded-2xl shadow-2xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Check your date</h3>
            <p className="text-sm text-gray-500 mb-6">{alertMessage}</p>
            <button className="w-full bg-[#0B3B68] text-white py-2.5 rounded-xl font-bold" onClick={() => setIsAlertOpen(false)}>Understand</button>
          </div>
        </div>
      )}

      {isSuccessOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsSuccessOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[340px] rounded-[10px] shadow-2xl p-10 flex flex-col items-center text-center">
            <h2 className="text-[22px] font-bold mb-2">Request Sent!</h2>
            <p className="text-gray-600 text-[12px] mb-8 leading-relaxed">We've notified the worker via SMS. You'll be updated once they accept.</p>
            <button className="w-full bg-[#003C71] text-white py-3 rounded-[30px] font-bold" 
              onClick={() => {
                setIsSuccessOpen(false);
                const worker = workers.find(w => w.name === selectedWorkerName);
                navigate('/my-requests', { state: { workerName: selectedWorkerName, role: worker?.role, description: requestDescription, date: preferredDate, time: preferredTime, image: worker?.image, location: worker?.location, status: "Pending" } });
              }}
            >
              View My Requests
            </button>
          </div>
        </div>
      )}

      <footer className="flex-shrink-0 w-full bg-[#0B3B68] h-32 mt-auto relative overflow-hidden flex items-center justify-center">
        <p className="text-white/60 text-sm relative z-10">© 2026 TrabaHome. All rights reserved.</p>
      </footer>
    </div>
  );
}