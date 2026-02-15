import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { StepOneProps } from '../../types/Worker.types.ts';

const StepOne: React.FC<StepOneProps> = ({ 
  formData, 
  errors, 
  showPassword, 
  showConfirmPassword, 
  onInputChange, 
  onTogglePassword, 
  onNext 
}) => {
  // Check if form is valid
  const isFormValid = 
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    formData.password &&
    formData.confirmPassword &&
    formData.agreeToTerms &&
    formData.agreeToPrivacy;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Create your Worker Account</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">First Name</label>
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            placeholder="First Name" 
            className={`w-full p-3 bg-gray-100 rounded-lg text-sm outline-none ${errors.firstName ? 'border border-red-500' : ''}`} 
          />
          {errors.firstName && <p className="text-[10px] text-red-500">{errors.firstName}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Last Name</label>
          <input 
            type="text" 
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            placeholder="Last Name" 
            className={`w-full p-3 bg-gray-100 rounded-lg text-sm outline-none ${errors.lastName ? 'border border-red-500' : ''}`} 
          />
          {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName}</p>}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-700">Email Address</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={onInputChange} 
          placeholder="enter email address" 
          className="w-full p-3 bg-gray-100 rounded-lg text-sm outline-none" 
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-700">Mobile Number</label>
        <input 
          type="text" 
          name="phone" 
          maxLength={13}
          value={formData.phone}
          onChange={onInputChange} 
          placeholder="09XXXXXXXXX, 9XXXXXXXXX, or +63XXXXXXXXX" 
          className={`w-full p-3 bg-gray-100 rounded-lg text-sm outline-none ${errors.phone ? 'border border-red-500' : ''}`} 
        />
        {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1 relative">
          <label className="text-xs font-bold text-gray-700">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              value={formData.password}
              onChange={onInputChange}
              placeholder="Enter password" 
              className={`w-full p-3 bg-gray-100 rounded-lg text-sm outline-none pr-10 ${errors.password ? 'border border-red-500' : ''}`} 
            />
            <button 
              type="button"
              onClick={() => onTogglePassword('password')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-[9px] text-red-500 leading-tight">{errors.password}</p>}
        </div>
        <div className="space-y-1 relative">
          <label className="text-xs font-bold text-gray-700">Confirm Password</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onInputChange}
              placeholder="Confirm password" 
              className={`w-full p-3 bg-gray-100 rounded-lg text-sm outline-none pr-10 ${errors.confirmPassword ? 'border border-red-500' : ''}`} 
            />
            <button 
              type="button"
              onClick={() => onTogglePassword('confirmPassword')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-[10px] text-red-500">{errors.confirmPassword}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-y-2 py-2">
        <label className="flex items-center gap-2 text-[10px] font-semibold">
          <input 
            type="checkbox" 
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={onInputChange}
            className="w-4 h-4 rounded border-gray-300 cursor-pointer" 
          /> I agree to the <span className="font-bold">Terms & Conditions</span>
        </label>
        <label className="flex items-center gap-2 text-[10px] font-semibold">
          <input 
            type="checkbox" 
            name="agreeToPrivacy"
            checked={formData.agreeToPrivacy}
            onChange={onInputChange}
            className="w-4 h-4 rounded border-gray-300 cursor-pointer" 
          /> I agree to the <span className="font-bold">Privacy & Policy</span>
        </label>
        {errors.agreements && <p className="text-[10px] text-red-500 font-bold">{errors.agreements}</p>}
      </div>
      <button 
        onClick={onNext}
        disabled={!isFormValid}
        className="w-full bg-[#004A8C] text-white py-3 rounded-lg font-bold mt-4 hover:bg-blue-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
      >
        Continue to Verification
      </button>
      <p className="text-center text-[10px] text-gray-600 mt-4">
        Already have an account? <span className="font-bold text-black cursor-pointer">Sign In</span>
      </p>
    </div>
  );
};

export default StepOne;