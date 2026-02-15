import React from 'react';
import type { BasicInfoSectionProps } from '../../types/Worker.types.ts';

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
  profile, 
  isEditing, 
  onToggleEdit, 
  onInputChange, 
  onImageUpload 
}) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-sm font-bold text-gray-800">Basic Info</h3>
      <button 
        onClick={onToggleEdit} 
        className="text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-md hover:bg-gray-50 uppercase tracking-tighter"
      >
        {isEditing ? 'save' : 'edit'}
      </button>
    </div>
    <div className="space-y-5">
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
          Full name
        </label>
        <input 
          name="fullName" 
          disabled={!isEditing} 
          value={profile.fullName} 
          onChange={onInputChange} 
          className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg h-11 text-sm focus:outline-none focus:border-[#00A651] disabled:cursor-default" 
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
          Profession
        </label>
        <div className="relative">
          <input 
            name="profession" 
            disabled={!isEditing} 
            value={profile.profession} 
            onChange={onInputChange} 
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg h-11 text-sm focus:outline-none focus:border-[#00A651] disabled:cursor-default" 
          />
          <svg 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
          Location
        </label>
        <input 
          name="location" 
          disabled={!isEditing} 
          value={profile.location} 
          onChange={onInputChange} 
          className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg h-11 text-sm focus:outline-none focus:border-[#00A651]" 
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
          Bio
        </label>
        <textarea 
          name="bio" 
          disabled={!isEditing} 
          value={profile.bio} 
          onChange={onInputChange} 
          className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg h-24 text-sm resize-none focus:outline-none focus:border-[#00A651]" 
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">
          Proof of Work
        </label>
        <div className="flex gap-4">
          {profile.images.map((img, idx) => (
            <label 
              key={idx} 
              className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {img ? (
                <img src={img} className="w-full h-full object-cover" alt={`Proof ${idx + 1}`} />
              ) : (
                <span className="text-gray-300 text-2xl">+</span>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => onImageUpload(idx, e)} 
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default BasicInfoSection;