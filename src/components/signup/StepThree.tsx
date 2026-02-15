import React from 'react';
import { Upload, CheckCircle, X } from 'lucide-react';
import type { StepThreeProps } from '../../types/Worker.types.ts';
import { professionOptions } from '../../constants/SignUpData.ts';

const StepThree: React.FC<StepThreeProps> = ({ 
  formData, 
  onInputChange,
  onProofOfWorkUpload, 
  onSubmit 
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-gray-800">Work & Location Details</h2>
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Work Information</label>
        <select 
          name="profession"
          value={formData.profession || ''}
          onChange={onInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none appearance-none bg-white"
        >
          <option value="">Select your profession</option>
          {professionOptions.map(profession => (
            <option key={profession} value={profession}>{profession}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Location Information</label>
        <div className="flex bg-gray-100 rounded-lg overflow-hidden">
          <div className="px-4 py-3 text-xs text-gray-500 font-semibold border-r border-gray-200">Province</div>
          <div className="px-4 py-3 text-xs text-gray-500 font-semibold">Pangasinan</div>
        </div>
        <p className="text-[9px] text-gray-400 italic px-1">Currently serving selected areas in Pangasinan.</p>
      </div>
      <div className="space-y-1 pt-1">
        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">City / Municipality</label>
        <select 
          name="city"
          value={formData.city || ''}
          onChange={onInputChange}
          className="w-full p-3 bg-gray-100 rounded-lg text-sm text-gray-500 outline-none"
        >
          <option value="">Select your City / Municipality</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Barangay</label>
        <select 
          name="barangay"
          value={formData.barangay || ''}
          onChange={onInputChange}
          className="w-full p-3 bg-gray-100 rounded-lg text-sm text-gray-500 outline-none"
        >
          <option value="">Select Barangay</option>
        </select>
      </div>
    </div>
    <div className="space-y-2 mt-4">
      <label className="text-[11px] font-bold text-gray-700">Proof of Work (Optional)</label>
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative">
            {formData.proofOfWorkPreviews && formData.proofOfWorkPreviews[i] ? (
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 h-20 group">
                <img 
                  src={formData.proofOfWorkPreviews[i]} 
                  alt={`Proof of work ${i + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    const fakeEvent = { 
                      target: { 
                        files: null,
                        dataset: { index: i.toString() } 
                      } 
                    };
                    onProofOfWorkUpload(fakeEvent as any);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={10} />
                </button>
                <div className="absolute bottom-1 left-1 bg-green-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5">
                  <CheckCircle size={8} />
                  <span>{i + 1}</span>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  data-index={i}
                  onChange={onProofOfWorkUpload} 
                />
                <Upload size={16} className="text-gray-400 mb-1" />
                <span className="text-[8px] text-gray-400 font-bold">{i + 1}</span>
              </label>
            )}
          </div>
        ))}
      </div>
      <p className="text-[9px] text-gray-400 italic leading-tight">
        Upload clear photos of jobs, before and after shots, or in-progress work (up to 4 photos).
      </p>
    </div>
    <button 
      onClick={onSubmit} 
      className="w-full bg-[#004A8C] text-white py-3 rounded-lg font-bold mt-4 hover:bg-[#003d73] transition-colors"
    >
      Submit Application
    </button>
  </div>
);

export default StepThree;