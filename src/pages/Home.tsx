// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/requestpages/Navbar";
import Footer from "../components/heropages/Footer";
import { 
  MapPinIcon, SearchIcon, HammerIcon, BrushIcon, 
  WrenchIcon, SproutIcon, TrowelIcon, ZapIcon, DropletIcon,
  ShieldCheckIcon, StarIcon, ArrowRightIcon, PhoneIcon, ChevronDownIcon
} from "../Icons";

export default function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Carpenter');
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");

  const availableServices = ["Carpenter", "Mason", "Plumber", "Electrician", "Cleaner", "Gardener", "General Repair"];
  const availableLocations = ["Dagupan City", "Mangaldan", "San Fabian", "Lingayen", "Calasiao", "Binmaley"];

  const handleSearch = () => {
    navigate(`/search?service=${service}&location=${location}`);
  };

  const categoryDetails = {
    'Carpenter': {
      title: 'Carpenter',
      description: 'Fix doors, build shelves, install cabinets, and handle small wood repairs around your home.',
      points: ['Door & cabinet repair', 'Shelves & fixtures', 'Minor renovations'],
      image: 'https://images.unsplash.com/photo-1590080877777-6c3f3b1f5f4b?auto=format&fit=crop&q=80&w=1000',
      label: 'Woodwork & small home improvements'
    },
    'Cleaner': {
      title: 'Home Cleaner',
      description: 'Professional deep cleaning for your home, apartment, or office space. We scrub so you don\'t have to.',
      points: ['Deep house cleaning', 'Laundry & ironing', 'Move-in/Move-out clean'],
      image: 'https://images.unsplash.com/photo-1581579181913-7f4e3f3c5b2b?auto=format&fit=crop&q=80&w=1000',
      label: 'Sparkling clean homes'
    },
    'General Repair': {
      title: 'General Repair / Handyman',
      description: 'The jack-of-all-trades for mounting TVs, fixing loose handles, and general home maintenance.',
      points: ['TV Mounting & hanging', 'Furniture assembly', 'General maintenance'],
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=1000',
      label: 'Quick fixes & assembly'
    },
    'Gardener': {
      title: 'Gardener',
      description: 'Keep your lawn green and your plants healthy with professional gardening and landscaping services.',
      points: ['Lawn mowing', 'Tree trimming', 'Planting & watering'],
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=1000',
      label: 'Lawn care & landscaping'
    },
    'Mason': {
      title: 'Mason',
      description: 'Expert concrete, brick, and stone work for walls, driveways, and structural repairs.',
      points: ['Concrete & cement', 'Tiling & flooring', 'Wall repairs'],
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1000',
      label: 'Concrete & stone work'
    },
    'Electrician': {
      title: 'Electrician',
      description: 'Licensed professionals for wiring, lighting installation, and electrical safety inspections.',
      points: ['Wiring & outlets', 'Lighting installation', 'Circuit breaker repair'],
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000',
      label: 'Electrical safety & install'
    },
    'Plumber': {
      title: 'Plumber',
      description: 'Fix leaks, unclog drains, and install bathroom fixtures quickly and safely.',
      points: ['Leak repairs', 'Toilet & sink install', 'Pipe maintenance'],
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=1000',
      label: 'Leaks, pipes & drains'
    }
  };

  const categories = [
    { name: 'Carpenter', icon: HammerIcon }, { name: 'Cleaner', icon: BrushIcon },
    { name: 'General Repair', icon: WrenchIcon }, { name: 'Gardener', icon: SproutIcon },
    { name: 'Mason', icon: TrowelIcon }, { name: 'Electrician', icon: ZapIcon },
    { name: 'Plumber', icon: DropletIcon },
  ];

  const activeContent = categoryDetails[activeCategory];

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-[#0B3B68] overflow-x-hidden font-sans relative">
      
      {/* --- REAL PNG BACKGROUND LAYER --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img 
          src="/assets/Group 4.png"
          className="absolute top-10 left-[-50px] h-[500px] w-auto object-contain opacity-80" 
          alt="" 
        />
        <img 
          src="/assets/Group 20.png" 
          className="absolute top-10 right-[-50px] h-[550px] w-auto object-contain opacity-80" 
          alt="" 
        />
        
        {/* --- GROUP 18: MOVED TO MIDDLE OF PAGE --- */}
        <img 
          src="/assets/Group 18.png" 
          className="absolute top-1/2 left-[-30px] transform -translate-y-1/2 h-[350px] w-auto object-contain z-0" 
          alt="" 
        />

        {/* --- ASSETS IN THE CARDS SECTION --- */}
        <div className="absolute top-[1200px] w-full h-[600px]">
           <img 
             src="/assets/Ellipse 7.png" 
             className="absolute top-0 right-[-30px] h-[400px] w-auto object-contain" 
             alt="" 
           />
           <img 
             src="/assets/shopee 1.png" 
             className="absolute bottom-10 right-5 w-[180px] opacity-30" 
             alt="" 
           />
        </div>
      </div>

      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 px-6 pt-16 pb-10 text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl font-bold leading-[1.1] text-[#0B3B68] tracking-tight">
          Trusted workers, right at <br /> your doorstep.
        </h2>
        <p className="mt-6 text-gray-500 font-medium max-w-xl">
          Find reliable local plumbers, electricians, carpenters, and cleaners you can trust.
        </p>
        
        <div className="mt-10 w-full max-w-3xl bg-white rounded-full p-1.5 flex flex-col md:flex-row items-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 transition-transform duration-500 hover:scale-[1.01]">
          <div className="flex-1 flex items-center px-6 py-2 w-full md:w-auto relative">
            <div className="flex flex-col items-start w-full">
               <select 
                 className="w-full bg-transparent outline-none text-[#0B3B68] font-semibold appearance-none cursor-pointer py-1"
                 value={service}
                 onChange={(e) => setService(e.target.value)}
               >
                 <option value="">Select Service...</option>
                 {availableServices.map((s) => (
                   <option key={s} value={s}>{s}</option>
                 ))}
               </select>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
          </div>

          <div className="flex-1 flex items-center px-6 py-2 w-full md:w-auto relative border-t md:border-t-0 md:border-l border-gray-100">
            <MapPinIcon className="w-5 h-5 text-blue-500 mr-2" />
            <div className="flex flex-col items-start w-full">
               <select 
                 className="w-full bg-transparent outline-none text-[#0B3B68] font-semibold appearance-none cursor-pointer py-1"
                 value={location}
                 onChange={(e) => setLocation(e.target.value)}
               >
                 <option value="">Select Location...</option>
                 {availableLocations.map((l) => (
                   <option key={l} value={l}>{l}</option>
                 ))}
               </select>
            </div>
          </div>

          <button onClick={handleSearch} className="bg-[#0B3B68] text-white px-10 py-3.5 rounded-full hover:bg-[#1a4a7a] transition-all w-full md:w-auto mt-2 md:mt-0 font-bold shadow-lg active:scale-95">
            Search
          </button>
        </div>
      </section>

      {/* --- CATEGORY TABS --- */}
      <section className="px-6 py-4 max-w-5xl mx-auto relative z-10">
        <div className="flex justify-between items-center overflow-x-auto pb-4 gap-6 [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button 
                key={cat.name} 
                onClick={() => setActiveCategory(cat.name)} 
                className="flex flex-col items-center gap-2 min-w-[90px] transition-all relative pb-3 cursor-pointer group"
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-50 text-[#0B3B68] scale-110 shadow-sm' : 'text-gray-400 group-hover:text-gray-600 group-hover:scale-105'}`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-[#0B3B68]' : 'text-gray-400'}`}>{cat.name}</span>
                {isActive && <div className="absolute bottom-0 w-10 h-[3px] bg-[#0B3B68] rounded-full animate-pulse" />}
              </button>
            )
          })}
        </div>
      </section>
      
      {/* --- CATEGORY DETAILS CARD --- */}
      <section className="px-6 py-6 max-w-5xl mx-auto relative z-10">
          <div className="mb-6 ml-2">
              <span className="inline-block px-5 py-1.5 rounded-full border border-gray-300 text-[13px] font-semibold text-gray-600 bg-white/50">
                  {activeContent.label}
              </span>
          </div>
          
          <div className="bg-[#BCCDD9] rounded-[2.5rem] p-4 md:p-10 relative overflow-hidden min-h-[450px] flex items-center shadow-inner group transition-all duration-700 hover:shadow-2xl">
            <div className="absolute inset-0 w-full h-full">
                <img 
                    src={activeContent.image} 
                    alt={activeContent.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
            </div>

            <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-sm w-full ml-4 border border-white/50 transform transition-all duration-500 hover:-translate-y-1 hover:bg-white">
                <h3 className="text-2xl font-black mb-4 text-[#0B3B68]">{activeContent.title}</h3>
                <p className="text-[14px] text-gray-600 mb-6 leading-relaxed font-medium">{activeContent.description}</p>
                <ul className="text-[14px] text-gray-700 mb-8 space-y-3">
                    {activeContent.points.map((point, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> {point}
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={() => navigate(`/search?service=${activeCategory}`)}
                    className="inline-flex items-center text-sm font-bold text-[#0B3B68] hover:gap-3 transition-all cursor-pointer border-b-2 border-[#0B3B68] pb-1"
                >
                    Find {activeCategory}s Near Me <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
            </div>
          </div>
      </section>

      {/* --- UPDATED GRADIENT DIVISION (BIG & PROFESSIONAL) --- */}
      <div className="w-full h-48 relative my-16 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E1F2F7] to-transparent opacity-70"></div>
        {/* Decorative horizontal lines */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent absolute top-0"></div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent absolute bottom-0"></div>
        {/* Professional Glow Blur */}
        <div className="w-[80%] h-32 bg-blue-100/40 blur-[100px] rounded-full"></div>
      </div>

      {/* --- WHY TRABAHOME SECTION --- */}
      <section className="py-16 px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
           <h2 className="text-4xl md:text-5xl font-black text-[#0B3B68] mb-4">Why TrabaHome is Safe</h2>
           <p className="text-gray-500 font-medium max-w-2xl mx-auto">We built TrabaHome to protect both homeowners and workersâ€”so every job feels safe, fair, and reliable.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {[
            { icon: ShieldCheckIcon, title: "Verified Workers", desc: "Every worker is reviewed and approved before joining." },
            { icon: StarIcon, title: "Real Ratings & Reviews", desc: "See feedback from real homeowners in your area." },
            { icon: MapPinIcon, title: "Local & Nearby", desc: "Find help from people who actually work near you." },
            { icon: PhoneIcon, title: "Instant SMS Alerts", desc: "Workers get your request even without internet." }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] p-8 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-default group">
              <div className="bg-blue-50 p-5 rounded-2xl text-[#0B3B68] transition-colors duration-300 group-hover:bg-[#0B3B68] group-hover:text-white"><item.icon className="w-10 h-10" /></div>
              <div className="text-left">
                <h3 className="font-black text-[#0B3B68] text-xl">{item.title}</h3>
                <p className="text-[14px] text-gray-500 mt-2 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS (MATCHING IMAGE UI) --- */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative">
        <h2 className="text-4xl md:text-5xl font-black text-[#0B3B68] text-center mb-20 relative z-10">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24 relative z-10">
          
          {/* Left Side: Featured Image with Blue Backdrop */}
          <div className="w-full md:w-1/2 relative">
            <div className="absolute top-10 -left-8 w-full h-full bg-[#0B3B68] rounded-[3.5rem] -z-10 shadow-xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" 
              alt="How it works" 
              className="w-full h-[550px] object-cover rounded-[3.5rem] border-[14px] border-white shadow-2xl transition-transform duration-700 hover:scale-[1.02]" 
            />
          </div>
          
          {/* Right Side: Step-by-Step UI Cards */}
          <div className="w-full md:w-1/2 relative">
            {/* Dashed Line and Green Overlay as seen in image */}
            <div className="absolute left-[2.2rem] top-10 bottom-32 w-px border-l-2 border-dashed border-gray-300 -z-0"></div>
            <div className="absolute left-[2.2rem] top-12 bottom-32 w-16 bg-gradient-to-r from-green-100/40 to-transparent -z-10 blur-sm rounded-r-full"></div>
            
            <div className="space-y-12">
              {[
                { step: 1, icon: SearchIcon, title: "Search", desc: "Choose a service and your location", color: "#FFDBC2", text: "#E65F2A" },
                { step: 2, icon: MapPinIcon, title: "Choose", desc: "Browse nearby workers with ratings", color: "#C2E0FF", text: "#0066CC" },
                { step: 3, icon: PhoneIcon, title: "Hire and Review", desc: "A worker accepts your request and fixes the problem. Share feedback if you'd like.", color: "#EBC2FF", text: "#9900CC" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-8 group relative z-10">
                  {/* Circle Badge Section */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-18 h-18 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ width: '4.5rem', height: '4.5rem' }}>
                      <item.icon className="w-8 h-8" style={{ color: item.text }} />
                    </div>
                    {/* The Numbered Badge as seen in UI image */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-md" style={{ backgroundColor: item.color, color: item.text }}>
                      {item.step}
                    </div>
                  </div>
                  
                  {/* Content Card */}
                  <div className="bg-white p-6 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 flex-1 transition-all duration-300 hover:shadow-xl hover:bg-[#fafafa]">
                    <h3 className="font-black text-xl text-[#0B3B68]">{item.title}</h3>
                    <p className="text-[14px] text-gray-500 mt-1 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-16 ml-28">
               <button onClick={handleSearch} className="bg-[#0B3B68] text-white px-10 py-4 rounded-full font-black text-lg shadow-2xl hover:bg-[#154575] transition-all hover:-translate-y-1 active:scale-95">
                 Find Workers Near Me
               </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
