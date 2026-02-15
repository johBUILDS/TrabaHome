import React, { useState } from 'react';
import type { Job } from '../../types/Job.types.ts';

interface DeclineJobModalProps {
  job: Job | null;
  declineReasons: string[];
  onDecline: (jobId: string, reason: string) => void;
  onCancel: () => void;
}

const DeclineJobModal: React.FC<DeclineJobModalProps> = ({ 
  job, 
  declineReasons, 
  onDecline, 
  onCancel 
}) => {
  const [declineReason, setDeclineReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");

  if (!job) return null;

  const handleSubmit = () => {
    const finalReason = declineReason === "Other (state reason)" && otherReason 
      ? otherReason 
      : declineReason;
    onDecline(job.id, finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl relative overflow-hidden text-left border border-gray-100">
        <header className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="text-yellow-500 font-bold text-xl">⚠️</div>
            <h2 className="font-bold text-gray-900 text-lg">Decline this request?</h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </header>
        
        <div className="p-8">
          <p className="text-[11px] text-gray-500 leading-relaxed mb-6 font-medium">
            This will notify the homeowner and remove their request from your list. You won't be able to undo this.
          </p>

          <div className="mb-8">
            <h4 className="text-[12px] font-bold text-gray-800 mb-4">Why are you declining?</h4>
            <div className="space-y-3">
              {declineReasons.map((reason, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="declineReason" 
                    value={reason}
                    checked={declineReason === reason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="w-4 h-4 accent-[#D93F3F]"
                  />
                  <span className="text-[12px] text-gray-600 font-medium group-hover:text-gray-900">
                    {reason}
                  </span>
                </label>
              ))}
              {declineReason === "Other (state reason)" && (
                <input 
                  type="text" 
                  placeholder="Please specify..." 
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-red-400"
                />
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleSubmit} 
              disabled={!declineReason || (declineReason === "Other (state reason)" && !otherReason)}
              className={`flex-1 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                (declineReason && (declineReason !== "Other (state reason)" || otherReason))
                  ? 'bg-[#D93F3F] text-white shadow-lg hover:bg-red-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Decline
            </button>
            <button 
              onClick={onCancel} 
              className="flex-1 py-3.5 border border-[#00A651] text-[#00A651] rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-green-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclineJobModal;