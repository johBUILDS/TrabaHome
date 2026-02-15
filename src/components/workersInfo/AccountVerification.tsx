import React, { useState } from 'react';
import { UserIcon } from 'lucide-react';
import type { AccountVerificationProps, VerificationDocument } from '../../types/Worker.types.ts';

const AccountVerification: React.FC<AccountVerificationProps> = ({ isExpanded = true }) => {
  const [expanded, setExpanded] = useState<boolean>(isExpanded);

  const documents: VerificationDocument[] = [
    { label: "Valid ID", verified: true },
    { label: "Barangay Clearance", verified: true },
    { label: "Proof of Work", verified: true }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-gray-800 mb-4">Account Verification</h3>
      <div className="border border-gray-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#EBF7F3] rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-[#00A651]" />
            </div>
            <span className="text-sm font-bold text-gray-800">Verified</span>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-gray-400"
            aria-label="Toggle verification details"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {expanded && (
          <div className="space-y-4 pl-11">
            {documents.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-4 h-4 bg-[#00A651] rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                    ✓
                  </div>
                  {item.label}
                </div>
                <span className="text-[#00A651] font-bold text-sm">✓</span>
              </div>
            ))}
            <p className="text-[10px] text-gray-400 pt-2 italic">Approved on: Jan 18, 2026</p>
            <p className="text-[10px] text-gray-500 font-medium">
              Need to update a document? <button className="text-[#0085FF] hover:underline">Contact support.</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountVerification;