import React from 'react';
import { Upload, CheckCircle, Camera, Lock, ChevronDown, X } from 'lucide-react';
import { idTypes } from '../../constants/SignUpData.ts';

const StepTwo = ({ 
  formData, 
  errors, 
  onInputChange, 
  onFileChange, 
  onNext 
}: any) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-gray-800">Identity Verification (AI Powered)</h2>
    <p className="text-[11px] text-gray-500 leading-relaxed">
      We use secure AI technology to quickly verify the authenticity of your government ID.
    </p>
    
    {/* ID Type Selection */}
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-700">Upload Government ID</label>
      <div className="relative">
        <select 
          name="idType"
          value={formData.idType}
          onChange={onInputChange}
          className={`w-full p-3 bg-gray-100 rounded-lg text-sm outline-none appearance-none ${errors.idType ? 'border border-red-500' : ''}`}
        >
          {idTypes.map((type: any) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
      </div>
      {errors.idType && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.idType}</p>}
    </div>

    <div className="space-y-2 mt-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Front ID Upload */}
        <div className="space-y-2">
          {!formData.idFrontPreview ? (
            <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative ${errors.idUpload && !formData.idFront ? 'border-red-500' : 'border-gray-300'}`}>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => onFileChange(e, 'idFront')} 
              />
              <Upload className="text-gray-400 mb-2" size={24} />
              <span className="text-[10px] text-gray-500 font-bold">Front of ID</span>
            </label>
          ) : (
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
              <img 
                src={formData.idFrontPreview} 
                alt="ID Front Preview" 
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md flex items-center gap-1">
                <CheckCircle size={12} />
                <span className="text-[9px] font-bold">Front Uploaded</span>
              </div>
              <button
                type="button"
                onClick={() => onFileChange({ target: { files: [] } }, 'idFront')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Back ID Upload */}
        <div className="space-y-2">
          {!formData.idBackPreview ? (
            <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative ${errors.idUpload && !formData.idBack ? 'border-red-500' : 'border-gray-300'}`}>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => onFileChange(e, 'idBack')} 
              />
              <Upload className="text-gray-400 mb-2" size={24} />
              <span className="text-[10px] text-gray-500 font-bold">Back of ID</span>
            </label>
          ) : (
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
              <img 
                src={formData.idBackPreview} 
                alt="ID Back Preview" 
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md flex items-center gap-1">
                <CheckCircle size={12} />
                <span className="text-[9px] font-bold">Back Uploaded</span>
              </div>
              <button
                type="button"
                onClick={() => onFileChange({ target: { files: [] } }, 'idBack')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-[9px] text-gray-400 italic text-center">
        Accepted IDs: UMID, Driver's License, PhilSys ID, Passport, PRC ID.
      </p>
      {errors.idUpload && <p className="text-[10px] text-red-500 font-bold">{errors.idUpload}</p>}
    </div>

    {/* Auto-Filled Inputs Section */}
    <div className="space-y-3 pt-2">
      <h3 className="text-sm font-bold text-gray-800">Auto-Filled Inputs</h3>
      <p className="text-[10px] text-gray-500 leading-tight">
        Please review the details below. If the AI made a mistake, feel free to correct the information to match your ID.
      </p>
      
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-700">ID Number</label>
          <input 
            name="idNumber" 
            value={formData.idNumber} 
            onChange={onInputChange} 
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
            placeholder="ID Number" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-700">Surname</label>
          <input 
            name="surname" 
            value={formData.surname} 
            onChange={onInputChange} 
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
            placeholder="Surname" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-700">Given Name</label>
          <input 
            name="givenName" 
            value={formData.givenName} 
            onChange={onInputChange} 
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
            placeholder="Given Name" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-700">Middle Name</label>
          <input 
            name="middleName" 
            value={formData.middleName} 
            onChange={onInputChange} 
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
            placeholder="Middle Name" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-700">Date of Birth</label>
          <input 
            type="date"
            name="dateOfBirth" 
            value={formData.dateOfBirth} 
            onChange={onInputChange} 
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-700">Nationality</label>
          {formData.nationality === 'Other' ? (
            <input 
              name="nationalityOther" 
              value={formData.nationalityOther || ''} 
              onChange={onInputChange} 
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
              placeholder="Enter nationality" 
            />
          ) : (
            <div className="relative">
              <select 
                name="nationality" 
                value={formData.nationality} 
                onChange={onInputChange} 
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs appearance-none"
              >
                <option value="">Select Nationality</option>
                <option value="Filipino">Filipino</option>
                <option value="American">American</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Indian">Indian</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-700">Sex</label>
          <div className="relative">
            <select 
              name="sex" 
              value={formData.sex} 
              onChange={onInputChange} 
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs appearance-none"
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
          </div>
        </div>
        <div className="col-span-2 space-y-1">
          <label className="text-[10px] font-bold text-gray-700">Place of Birth</label>
          <input 
            name="placeOfBirth" 
            value={formData.placeOfBirth} 
            onChange={onInputChange} 
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
            placeholder="Place of Birth" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-700">Date of Issue</label>
          <input 
            type="date"
            name="dateOfIssue" 
            value={formData.dateOfIssue} 
            onChange={onInputChange} 
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-700">Valid Until</label>
          <input 
            type="date"
            name="expiryDate" 
            value={formData.expiryDate} 
            onChange={onInputChange} 
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
          />
        </div>
        <div className="col-span-2 space-y-1">
          <label className="text-[10px] font-bold text-gray-700">Issuing Authority</label>
          <input 
            name="issuingAuthority" 
            value={formData.issuingAuthority} 
            onChange={onInputChange} 
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
            placeholder="Issuing Authority" 
          />
        </div>
      </div>
    </div>

    {/* Selfie Upload */}
    <div className="pt-2 space-y-2">
      {!formData.selfiePreview ? (
        <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors w-full">
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => onFileChange(e, 'selfie')} 
          />
          <div className="bg-gray-100 p-2 rounded-lg">
            <Camera className="text-gray-400" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-700">Selfie with ID (Optional)</span>
            <span className="text-[9px] text-gray-500">
              Take a clear photo of yourself holding your ID to speed up verification.
            </span>
          </div>
        </label>
      ) : (
        <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 w-full">
          <img 
            src={formData.selfiePreview} 
            alt="Selfie Preview" 
            className="w-full h-56 object-cover"
          />
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md flex items-center gap-1">
            <Camera size={12} />
            <span className="text-[9px] font-bold">Selfie Captured</span>
          </div>
          <button
            type="button"
            onClick={() => onFileChange({ target: { files: [] } }, 'selfie')}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>

    <div className="flex items-center gap-2 justify-center py-2 text-gray-500">
      <Lock size={12} />
      <span className="text-[9px]">Your verification data is securely processed and used only for identity validation.</span>
    </div>

    <button 
      onClick={onNext} 
      className="w-full bg-[#004A8C] text-white py-3 rounded-lg font-bold mt-2 hover:bg-[#003d73] transition-colors"
    >
      Next: Work Details
    </button>
  </div>
);

export default StepTwo;