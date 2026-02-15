import React from 'react';
import { Briefcase, MapPin, Hammer, Calendar, X } from 'lucide-react';
import type { Request } from '../../types/Worker.types.ts';

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200 text-left">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 z-10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <div className="bg-gray-50 p-2 rounded-lg">
            <Briefcase className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Request Details</h2>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-pink-100 rounded-full overflow-hidden shrink-0">
              <img src="https://i.pravatar.cc/150?u=10" alt="Homeowner" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">Homeowner</h3>
                <span className="bg-[#FFB800] text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">Pending</span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#0085FF]" /> {request.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold text-gray-400 uppercase">Needs:</span>
            <span className="bg-[#DDEBFF] text-[#0057FF] px-3 py-1.5 rounded-md text-[11px] font-bold italic flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5" /> {request.needs}
            </span>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-900 mb-2">Problem Description</h4>
            <div className="bg-gray-50 rounded-xl p-4 min-h-[100px]">
              <p className="text-sm text-gray-600 italic">"{request.description}"</p>
            </div>
          </div>

          <div className="space-y-2 mb-8 text-xs text-gray-500">
            <p>Preferred Schedule: <span className="italic font-bold text-gray-700">{request.schedule}</span></p>
            <p className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" /> Request sent: {request.time}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="py-3 border border-[#FF4D4D] text-[#FF4D4D] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">
              Decline
            </button>
            <button className="py-3 bg-[#00A651] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-600 shadow-lg transition-colors">
              Accept
            </button>
          </div>

          <div className="flex items-center gap-2 justify-center py-2 text-center">
            <span className="text-[10px] text-gray-400">🔒 After you accept, both can see contact details.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;