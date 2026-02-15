import React from 'react';
import { LockIcon } from 'lucide-react';
import type { ContactInfoSectionProps } from '../../types/Worker.types.ts';

interface ContactField {
  name: 'phone' | 'email' | 'facebook';
  label: string;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ 
  profile, 
  isEditing, 
  onToggleEdit, 
  onInputChange 
}) => {
  const fields: ContactField[] = [
    { name: "phone", label: "Phone Number" },
    { name: "email", label: "Email" },
    { name: "facebook", label: "Facebook" }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-800">Contact Information</h3>
        <button 
          onClick={onToggleEdit} 
          className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-md hover:bg-gray-50 uppercase tracking-tighter"
        >
          {isEditing ? 'save' : 'edit'}
        </button>
      </div>
      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              {field.label}
            </label>
            <div className="relative">
              <input 
                name={field.name} 
                disabled={!isEditing} 
                value={profile[field.name]} 
                onChange={onInputChange} 
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg h-11 text-sm focus:outline-none" 
              />
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 text-gray-400 pt-2">
          <LockIcon className="w-3.5 h-3.5" />
          <p className="text-[10px] font-medium italic">
            Your contact details are only shared after you accept a request.
          </p>
        </div>
      </div> 
    </div>
  );
};

export default ContactInfoSection;