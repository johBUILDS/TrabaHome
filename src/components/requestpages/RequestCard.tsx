import React from 'react';
import { MapPin, Hammer, Calendar } from 'lucide-react';
import type { RequestCardProps } from '../../types/Worker.types.ts';

const RequestCard: React.FC<RequestCardProps> = ({ request, onViewDetails }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
    <button 
      onClick={() => onViewDetails(request)}
      className="absolute top-5 right-6 text-[#0085FF] text-[10px] font-bold hover:underline"
    >
      View Details →
    </button>
    
    <div className="flex gap-3 mb-4">
      <div className="w-12 h-12 bg-pink-100 rounded-full overflow-hidden shrink-0">
        <img src={request.avatar} alt="User" className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-bold text-gray-900 text-sm">Homeowner</h3>
          <span className="bg-[#FFB800] text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Pending</span>
        </div>
        <p className="text-[10px] text-gray-500 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#0085FF]" /> {request.location}
        </p>
      </div>
    </div>

    <div className="space-y-2 mb-6 text-[10px]">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-400 uppercase">Needs:</span>
        <span className="bg-[#DDEBFF] text-[#0057FF] px-3 py-1 rounded text-[10px] font-bold italic flex items-center gap-1">
          <Hammer className="w-3 h-3" /> {request.needs}
        </span>
      </div>
      <div className="text-gray-400 space-y-1">
        <p>Preferred Schedule: <span className="italic text-gray-500 font-bold">{request.schedule}</span></p>
        <p className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> Request sent: {request.time}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <button className="py-2 border border-[#FF4D4D] text-[#FF4D4D] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">
        Decline
      </button>
      <button className="py-2 bg-[#00A651] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 shadow-md transition-colors">
        Accept
      </button>
    </div>
  </div>
);

export default RequestCard;