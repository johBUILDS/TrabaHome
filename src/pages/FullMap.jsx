import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { 
  BellIcon, MapIcon, ListIcon, HammerIcon, TrowelIcon, 
  DropletIcon, ZapIcon, BrushIcon, SproutIcon, WrenchIcon,
  SearchIcon, MapPinIcon, ChevronDownIcon, PlusIcon, MinusIcon
} from "../Icons";

const cityCoords = {
  "Dagupan City": { lat: 16.0433, lng: 120.3333 },
  "Calasiao":     { lat: 16.0125, lng: 120.3608 },
  "Lingayen":     { lat: 16.0204, lng: 120.2323 },
  "Binmaley":     { lat: 16.0303, lng: 120.2686 },
  "San Fabian":   { lat: 16.1245, lng: 120.4042 },
  "Mangaldan":    { lat: 16.0691, lng: 120.4019 },
};

export default function FullMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const urlService = searchParams.get("service") || "";
  const urlLocation = searchParams.get("location") || "";
  const currentParams = location.search;

  const [selectedService, setSelectedService] = useState(urlService);
  const [selectedLocation, setSelectedLocation] = useState(urlLocation);
  const [zoom, setZoom] = useState(13); 
  const mapRef = useRef(null);

  useEffect(() => {
    setSelectedService(urlService);
    setSelectedLocation(urlLocation);
  }, [urlService, urlLocation]);

  const workers = [
    { id: 1, name: "Mang Berto", role: "Carpenter", location: "Mangaldan", rating: 4.8 },
    { id: 2, name: "Mang Kanor", role: "Carpenter", location: "Dagupan City", rating: 4.5 },
    { id: 3, name: "Kuya Dante", role: "Mason", location: "San Fabian", rating: 4.9 },
    { id: 4, name: "Mang Ben", role: "Mason", location: "Lingayen", rating: 4.2 },
    { id: 5, name: "Mario Rossi", role: "Plumber", location: "Calasiao", rating: 4.7 },
    { id: 6, name: "Kuya Lito", role: "Plumber", location: "Dagupan City", rating: 4.3 },
    { id: 7, name: "Sparky Dave", role: "Electrician", location: "Binmaley", rating: 5.0 },
    { id: 8, name: "Mang Romy", role: "Electrician", location: "Mangaldan", rating: 4.6 },
    { id: 9, name: "Ate Rose", role: "Cleaner", location: "Dagupan City", rating: 4.9 },
    { id: 10, name: "Ate Maria", role: "Cleaner", location: "Calasiao", rating: 4.8 },
    { id: 11, name: "Kuya Carding", role: "Gardener", location: "San Fabian", rating: 4.7 },
    { id: 13, name: "Kuya Jojo", role: "General Repair", location: "Lingayen", rating: 4.5 },
  ];

  const uniqueServices = useMemo(() => [...new Set(workers.map(w => w.role))].sort(), [workers]);
  const uniqueLocations = useMemo(() => [...new Set(workers.map(w => w.location))].sort(), [workers]);

  const filteredWorkers = workers.filter((worker) => {
    const matchesService = urlService === "" || worker.role === urlService;
    const matchesLocation = urlLocation === "" || worker.location === urlLocation;
    return matchesService && matchesLocation;
  });

  const handleUpdateSearch = () => {
    navigate(`/map?service=${selectedService}&location=${selectedLocation}`, { replace: true });
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case "Mason": return <TrowelIcon className="w-4 h-4" />;
      case "Plumber": return <DropletIcon className="w-4 h-4" />;
      case "Electrician": return <ZapIcon className="w-4 h-4" />;
      case "Cleaner": return <BrushIcon className="w-4 h-4" />;
      case "Gardener": return <SproutIcon className="w-4 h-4" />;
      case "General Repair": return <WrenchIcon className="w-4 h-4" />;
      default: return <HammerIcon className="w-4 h-4" />;
    }
  };

  const headerService = urlService ? `${urlService}s` : "All Workers";
  const headerLocation = urlLocation ? `near ${urlLocation}` : "near you";

  // --- UPDATED MAP OVERLAY WITH CLICK TO ZOOM ---
  const MapOverlay = () => {
    const map = useMap();
    const [, setUpdate] = useState(0);

    useEffect(() => {
        map.on("move", () => setUpdate(prev => prev + 1));
    }, [map]);

    const handlePinClick = (lat, lng) => {
      // Zoom in to level 17 with a smooth animation
      map.flyTo([lat, lng], 17, {
        duration: 1.5
      });
    };

    return (
      <>
        {filteredWorkers.map((worker) => {
          const base = cityCoords[worker.location] || cityCoords["Dagupan City"];
          const lat = base.lat + ((worker.id % 5) - 2) * 0.003;
          const lng = base.lng + ((worker.id % 5) - 2) * 0.003;
          const point = map.latLngToContainerPoint([lat, lng]);
          const pinColor = "#0B3B68";

          return (
            <div 
              key={worker.id} 
              className="absolute z-[1000] pointer-events-auto" 
              style={{ 
                top: point.y, 
                left: point.x,
                transform: `translate(-50%, -100%)` 
              }}
              onClick={() => handlePinClick(lat, lng)} // Trigger zoom on click
            >
              <div className="group relative cursor-pointer flex flex-col items-center">
                  <div className="absolute inset-0 w-10 h-10 bg-[#0B3B68] rounded-full animate-ping opacity-20 group-hover:hidden"></div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-2 border-white text-white z-10 transition-transform group-hover:scale-125" style={{ backgroundColor: pinColor }}>
                    {getRoleIcon(worker.role)}
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-[1px] transition-transform group-hover:scale-110" style={{ borderTopColor: pinColor }}></div>
                  <div className="absolute bottom-full mb-3 bg-[#0B3B68] text-white px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-30 transform translate-y-2 group-hover:translate-y-0">
                      <p className="text-xs font-bold leading-none">{worker.name}</p>
                      <p className="text-[10px] opacity-70 mt-1">{worker.role} • {worker.rating}★</p>
                  </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="w-full h-screen bg-[#F9F6F2] text-[#0B3B68] font-sans flex flex-col overflow-hidden select-none">
      <div className="w-full bg-[#F9F6F2] border-b border-gray-200/50 flex-shrink-0">
        <header className="flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto w-full">
          <img src="/assets/Logo.png" alt="TrabaHome" className="h-8 w-auto cursor-pointer" onClick={() => navigate('/home')} />
          <div className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer"><BellIcon className="w-6 h-6 text-[#0B3B68]" /></div>
        </header>
      </div>

      <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-6 py-6 h-full min-h-0">
        <div className="flex-shrink-0">
            <h2 className="text-3xl font-bold mb-4 text-[#0B3B68]">Search Results</h2>
            <div className="bg-white p-2 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 border border-gray-100 items-center">
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

            <div className="flex flex-col md:flex-row justify-between items-end mt-4 mb-4 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-[#0B3B68]">{headerService} <span className="text-[#0B3B68]">near</span> <span className="text-[#00AF91]">{headerLocation.replace('near ', '')}</span></h3>
                    <p className="text-sm text-gray-500 mt-1">Showing {filteredWorkers.length} {urlService.toLowerCase() || 'worker'}s</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                    <button onClick={() => navigate(`/search${currentParams}`)} className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#0B3B68] text-white shadow-sm"><MapIcon className="w-4 h-4" /> <span className="text-sm font-bold">Map</span></button>
                    <button onClick={() => navigate(`/list${currentParams}`)} className="flex items-center gap-2 px-4 py-1.5 rounded-md text-gray-500 hover:bg-gray-50 transition"><ListIcon className="w-4 h-4" /> <span className="text-sm font-bold">List</span></button>
                </div>
            </div>
        </div>

        <div className="flex-grow w-full bg-[#D6EFE8] rounded-3xl relative overflow-hidden border-4 border-white shadow-md mb-6 min-h-[420px] isolate">
          <MapContainer 
            center={[16.0433, 120.3333]} 
            zoom={zoom} 
            zoomControl={false}
            className="h-full w-full z-0"
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            <MapOverlay />
          </MapContainer>

          <div className="absolute bottom-6 right-6 flex flex-col shadow-lg rounded-lg overflow-hidden bg-white z-[2000]">
              <button onClick={() => setZoom(z => Math.min(z + 1, 18))} className="p-3 border-b border-gray-100 text-[#0B3B68] hover:bg-gray-50"><PlusIcon className="w-5 h-5" /></button>
              <button onClick={() => setZoom(z => Math.max(z - 1, 10))} className="p-3 text-[#0B3B68] hover:bg-gray-50"><MinusIcon className="w-5 h-5" /></button>
          </div>
        </div>
      </main>

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