import React from 'react';
import { MapPinIcon, HammerIcon, CalendarIcon, LockIcon } from 'lucide-react';
import type { Job } from '../../types/Job.types.ts';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onAccept: (job: Job) => void;
  onDecline: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails, onAccept, onDecline }) => {
  return (
    <div className="bg-white p-7 rounded-2xl border border-gray-100 transition-all shadow-sm relative text-left">
      <button 
        onClick={() => onViewDetails(job)} 
        className="absolute top-6 right-8 text-[#0085FF] text-[10px] font-bold flex items-center gap-1 hover:underline"
      >
        View Details →
      </button>
      
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 bg-pink-100 rounded-full overflow-hidden shrink-0">
          <img src={`https://i.pravatar.cc/150?u=${job.id + 20}`} alt="User" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-gray-900 text-base">{job.name}</h3>
            <span className={`${
              job.status === 'Pending' ? 'bg-[#D4A017] text-white' : 
              job.status === 'Declined' ? 'bg-[#FF9999] text-white' : 
              job.status === 'Cancelled' ? 'bg-[#FF4D4D] text-white' : 
              job.status === 'In Progress' ? 'bg-[#A8E6CF] text-[#00A651]' :
              'bg-[#A8E6CF] text-[#00A651]'
            } text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter`}>
              {job.status}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
            <MapPinIcon className="w-3.5 h-3.5 text-[#0085FF]" /> {job.location}
          </p>
        </div>
      </div>

      {job.status === 'Pending' && (
        <div className="flex items-start gap-2 text-gray-400 mb-4 pl-1">
          <LockIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p className="text-[10px] leading-tight font-medium italic">
            After you accept, both of you will be able to see each other's contact details so you can coordinate directly.
          </p>
        </div>
      )}

      {job.status === 'In Progress' && (
        <div className="flex items-start gap-2 text-gray-700 mb-4 pl-1">
          <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center shrink-0">
            <span className="text-white text-[10px]">✓</span>
          </div>
          <p className="text-[11px] font-medium italic">
            Good news! You can now contact the homeowner. Click <span className="font-bold">'View Details'</span>.
          </p>
        </div>
      )}

      {job.status === 'Cancelled' && (
        <p className="text-[11px] text-gray-700 font-bold mb-4 pl-1">
          Reason: <span className="font-medium text-gray-600">{job.cancelledReason}</span>
        </p>
      )}

      {job.status === 'Declined' && (
        <p className="text-[11px] text-gray-700 font-bold mb-4 pl-1">
          Your reason: <span className="font-medium text-gray-600">{job.declineReason}</span>
        </p>
      )}

      {job.status === 'Completed' && (
        <div className="mb-4 pl-1">
          {job.hasReview ? (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-[11px] font-bold text-gray-700">{job.rating?.toFixed(1)} Ratings</span>
            </div>
          ) : (
            <p className="text-[12px] text-gray-400 font-medium italic">Hasn't left a review yet.</p>
          )}
        </div>
      )}
      
      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Needs:</span>
          <span className="bg-[#DDEBFF] text-[#0057FF] px-3.5 py-1 rounded text-[11px] font-bold italic flex items-center gap-1.5">
            <HammerIcon className="w-3.5 h-3.5" /> {job.needs}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 font-bold uppercase">
            Preferred Schedule: <span className="text-gray-500 font-medium italic lowercase">Not Specified</span>
          </p>
          <p className="text-[11px] text-gray-500 flex items-center gap-1.5 font-medium">
            <CalendarIcon className="w-4 h-4 text-gray-200" /> 
            {job.status === 'Completed' ? `Completed: ${job.completionTime}` : 
             job.status === 'Cancelled' ? `Cancelled: ${job.time}` : 
             job.status === 'In Progress' ? `Accepted: ${job.acceptedTime}` :
             job.status === 'Declined' ? `Declined: ${job.time}` :
             `Request sent: ${job.time}`}
          </p>
        </div>
      </div>

      {job.status === 'Pending' && (
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => onDecline(job)} 
            className="px-10 py-2.5 border border-[#FF4D4D] text-[#FF4D4D] rounded-[8px] text-[11px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all"
          >
            Decline
          </button>
          <button 
            onClick={() => onAccept(job)} 
            className="px-10 py-2.5 bg-[#00A651] text-white rounded-[8px] text-[11px] font-bold uppercase tracking-widest shadow-md hover:bg-green-600 transition-all"
          >
            Accept
          </button>
        </div>
      )}

      {job.status === 'In Progress' && (
        <div className="flex items-center gap-2 text-blue-500 pl-1">
          <span className="text-sm">✉️</span>
          <p className="text-[11px] font-medium italic">Waiting for homeowner to confirm completion.</p>
        </div>
      )}
    </div>
  );
};

export default JobCard;