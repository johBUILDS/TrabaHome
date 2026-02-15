import React from 'react';
import { X, CheckCircle, ClipboardCheck, Clock } from 'lucide-react';
import type { SubmittedModalProps } from '../../types/Worker.types.ts';

const SubmittedModal: React.FC<SubmittedModalProps> = ({ 
  isOpen, 
  firstName, 
  onClose, 
  onGoToDashboard 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl w-full max-w-[420px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Decorative Header Area */}
        <div className="bg-[#004A8C]/5 h-32 flex items-center justify-center relative">
          <div className="absolute top-4 right-4">
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X size={20}/>
            </button>
          </div>
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center">
            <ClipboardCheck className="text-[#004A8C]" size={40} />
          </div>
        </div>

        <div className="p-8 pt-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
            <CheckCircle size={12} />
            Submission Received
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Application Under Review</h3>
          <p className="text-[12px] text-gray-500 leading-relaxed mb-8 px-2">
            Thank you for applying, <span className="text-gray-900 font-bold">{firstName}</span>! 
            Our team is currently verifying your identity and work details. This usually takes <span className="text-[#004A8C] font-semibold">24-48 hours</span>.
          </p>

          <div className="w-full space-y-3">
            <button 
              className="w-full bg-[#004A8C] text-white py-4 rounded-xl text-sm font-bold hover:bg-[#003a6e] active:scale-[0.98] transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2" 
              onClick={onGoToDashboard}
            >
              Go to Dashboard
            </button>
            
            <button 
              className="w-full bg-white text-gray-500 py-3 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Back to Form
            </button>
          </div>

          <div className="mt-8 flex items-center gap-2 text-gray-400">
            <Clock size={14} />
            <span className="text-[10px]">Estimated review time: 1-2 business days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedModal;