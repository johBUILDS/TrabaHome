import React from 'react';
import { BriefcaseIcon, MapPinIcon, HammerIcon, CalendarIcon, LockIcon } from 'lucide-react';
import type { Job } from '../../types/Job.types.ts';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onAccept: (job: Job) => void;
  onDecline: (job: Job) => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onAccept, onDecline }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[440px] shadow-2xl relative overflow-hidden text-left flex flex-col max-h-[90vh]">
        <header className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-gray-800">
            <BriefcaseIcon className="w-5 h-5 text-gray-400" />
            <h2 className="font-bold text-base">Request Details</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </header>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="flex gap-4 mb-6">
            <div className="w-14 h-14 bg-pink-100 rounded-full overflow-hidden shrink-0">
              <img src={`https://i.pravatar.cc/150?u=${job.id + 20}`} alt="User" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-gray-900 text-lg">{job.name}</h3>
                <span className={`${
                  job.status === 'Pending' ? 'bg-[#D4A017] text-white' : 
                  job.status === 'Cancelled' ? 'bg-[#FF9999] text-white' :
                  job.status === 'In Progress' ? 'bg-[#A8E6CF] text-[#00A651]' :
                  'bg-[#A8E6CF] text-[#00A651]'
                } text-[9px] px-2.5 py-0.5 rounded font-bold uppercase`}>
                  {job.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                <MapPinIcon className="w-3.5 h-3.5 text-[#0085FF]" /> {job.location}
              </p>
            </div>
          </div>

          {job.status === 'Cancelled' && (
            <p className="text-[11px] text-gray-700 font-bold mb-6">
              Reason: <span className="font-medium text-gray-600">{job.cancelledReason}</span>
            </p>
          )}

          <div className="flex items-center gap-2 mb-6">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Needs:</span>
            <span className="bg-[#DDEBFF] text-[#0057FF] px-4 py-1 rounded text-[11px] font-bold italic flex items-center gap-1.5">
              <HammerIcon className="w-3.5 h-3.5" /> {job.needs}
            </span>
          </div>

          {job.status !== 'Pending' && job.status !== 'Cancelled' && job.status !== 'Declined' && (
            <div className="mb-6">
              <label className="text-[11px] font-bold text-gray-900 mb-2 block uppercase tracking-tight">Contact Information:</label>
              <div className="space-y-1.5 pl-1">
                <p className="text-[11px] text-gray-600 flex items-center gap-2 font-medium">
                  <span className="w-4">📧</span> {job.email}
                </p>
                <p className="text-[11px] text-gray-600 flex items-center gap-2 font-medium">
                  <span className="text-blue-600 w-4 font-bold">f</span> {job.facebook}
                </p>
                <p className="text-[11px] text-gray-600 flex items-center gap-2 font-medium">
                  <span className="w-4">📞</span> {job.phone}
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="text-[11px] font-bold text-gray-900 mb-2 block uppercase tracking-tight">Problem Description</label>
            <div className="bg-[#F3F3F3] rounded-xl p-4 min-h-[100px] text-[12px] text-gray-600 font-medium leading-relaxed">
              {job.description || "No description provided."}
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Preferred Schedule: <span className="text-gray-500 font-medium italic">Not Specified</span>
            </p>
            <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 uppercase">
              <CalendarIcon className="w-3.5 h-3.5" /> 
              {job.status === 'Completed' ? `Completed: ${job.completionTime}` : 
               job.status === 'Cancelled' ? `Cancelled: ${job.time}` :
               `Request sent: ${job.time}`}
            </p>
          </div>

          {job.status === 'Completed' && job.hasReview && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <label className="text-[11px] font-bold text-gray-900 mb-4 block uppercase tracking-tighter">Review</label>
              <div className="bg-[#F8F8F8] rounded-2xl p-5 border border-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-pink-100 shrink-0">
                      <img src={`https://i.pravatar.cc/150?u=${job.id + 20}`} alt="User" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-gray-900 leading-none mb-1">{job.name}</h4>
                      <div className="flex text-yellow-400 text-[10px] items-center">
                        {'★'.repeat(Math.floor(job.rating || 0))}
                        <span className="text-gray-400 ml-1.5 font-bold">{job.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">{job.reviewDate}</span>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100">
                  <p className="text-[11px] text-gray-600 leading-relaxed font-medium italic">
                    "{job.reviewText}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {job.status === 'Pending' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <button 
                  onClick={() => { onClose(); onDecline(job); }} 
                  className="flex-1 py-3 border border-[#FF4D4D] text-[#FF4D4D] rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all"
                >
                  Decline
                </button>
                <button 
                  onClick={() => onAccept(job)} 
                  className="flex-1 py-3 bg-[#00A651] text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg transition-all"
                >
                  Accept
                </button>
              </div>
              <div className="flex items-start gap-2 text-gray-400">
                <LockIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <p className="text-[10px] leading-tight font-medium italic">
                  After you accept, both of you will be able to see each other's contact details so you can coordinate directly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;