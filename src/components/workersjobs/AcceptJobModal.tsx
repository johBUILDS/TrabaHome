import React from 'react';
import  type { Job, AcceptJobModalProps } from '../../types/Job.types.ts';

const AcceptJobModal: React.FC<AcceptJobModalProps> = ({ job, onConfirm, onCancel }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl p-8 text-center border border-gray-100">
        <div className="w-16 h-16 bg-[#F0F9F6] text-[#00A651] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✓
        </div>
        <h2 className="font-bold text-gray-900 text-lg mb-2 tracking-tight">Accept this request?</h2>
        <p className="text-[12px] text-gray-500 mb-8 leading-relaxed font-medium">
          Once you accept, this job will move to your 'In Progress' list and you can begin communicating with the homeowner.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onConfirm} 
            className="flex-1 py-3 bg-[#00A651] text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-green-600 transition-colors"
          >
            Confirm Accept
          </button>
          <button 
            onClick={onCancel} 
            className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptJobModal;