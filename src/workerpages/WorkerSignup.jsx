import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle, Info, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Added this import

const WorkerSignup = () => {
  const navigate = useNavigate(); // Initialized navigate
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    idFront: null,
    idBack: null,
    selfie: null,
    proofOfWork: [],
    agreedTerms: false,
    agreedPrivacy: false
  });

  const [errors, setErrors] = useState({});

  // Validation Logic
  const validateStep1 = () => {
    let newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

    if (!nameRegex.test(formData.firstName)) newErrors.firstName = "Letters only, no numbers.";
    if (!nameRegex.test(formData.lastName)) newErrors.lastName = "Letters only, no numbers.";
    if (formData.phone.length !== 11) newErrors.phone = "Phone number must be exactly 11 digits.";
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Must have 1 capital letter & 1 special character.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.agreedTerms || !formData.agreedPrivacy) {
      newErrors.agreements = "You must agree to both Terms and Privacy Policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (!formData.idFront || !formData.idBack) {
      newErrors.idUpload = "Please upload both the front and back of your ID to proceed.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((prev) => prev + 1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "phone" && !/^\d*$/.test(value)) return;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      if (field === 'idFront' || field === 'idBack') {
        setErrors(prev => ({ ...prev, idUpload: '' }));
      }
    }
  };

  const handleProofOfWork = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ 
      ...prev, 
      proofOfWork: [...prev.proofOfWork, ...files].slice(0, 4) 
    }));
  };

  // Reusable Stepper Component
  const Stepper = () => (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-10 relative">
      <div className="absolute top-5 left-0 w-full h-[1px] bg-gray-300 -z-0"></div>
      {[1, 2, 3].map((num) => (
        <div key={num} className="relative z-10 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold ${
            step === num ? 'bg-[#004A8C] text-white border-[#004A8C]' : 'bg-white text-gray-400 border-gray-300'
          }`}>
            {num}
          </div>
          <span className={`text-[10px] mt-2 font-semibold ${step === num ? 'text-black' : 'text-gray-400'}`}>
            {num === 1 ? 'Account Details' : num === 2 ? 'Identity Verification' : 'Work Details'}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-[500px] p-8 relative">
        
        {/* Updated Logo Section */}
        <div className="flex justify-center mb-6">
          <img 
            src="/assets/Logo.png" 
            alt="TrabaHome" 
            className="h-10 w-auto object-contain"
          />
        </div>

        <h1 className="text-[#004A8C] text-center font-bold text-xl mb-8">Worker Application</h1>

        <Stepper />

        {/* STEP 1: ACCOUNT DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Create your Worker Account</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  placeholder="Last Name" 
                  className={`w-full p-3 bg-gray-100 rounded-lg text-sm outline-none ${errors.lastName ? 'border border-red-500' : ''}`} 
                />
                {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="enter email address" className="w-full p-3 bg-gray-100 rounded-lg text-sm outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Mobile Number (11 Digits)</label>
              <div className="flex gap-2">
                <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-500">+63</div>
                <input 
                  type="text" 
                  name="phone" 
                  maxLength={11}
                  value={formData.phone}
                  onChange={handleInputChange} 
                  placeholder="09123456789" 
                  className={`flex-1 p-3 bg-gray-100 rounded-lg text-sm outline-none ${errors.phone ? 'border border-red-500' : ''}`} 
                />
              </div>
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
                    onChange={handleInputChange}
                    placeholder="Enter password" 
                    className={`w-full p-3 bg-gray-100 rounded-lg text-sm outline-none pr-10 ${errors.password ? 'border border-red-500' : ''}`} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                    onChange={handleInputChange}
                    placeholder="Confirm password" 
                    className={`w-full p-3 bg-gray-100 rounded-lg text-sm outline-none pr-10 ${errors.confirmPassword ? 'border border-red-500' : ''}`} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  name="agreedTerms" 
                  checked={formData.agreedTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer" 
                /> I agree to the <span className="font-bold">Terms & Conditions</span>
              </label>
              <label className="flex items-center gap-2 text-[10px] font-semibold">
                <input 
                  type="checkbox" 
                  name="agreedPrivacy" 
                  checked={formData.agreedPrivacy}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer" 
                /> I agree to the <span className="font-bold">Privacy & Policy</span>
              </label>
              {errors.agreements && <p className="text-[10px] text-red-500 font-bold">{errors.agreements}</p>}
            </div>
            <button onClick={nextStep} className="w-full bg-[#004A8C] text-white py-3 rounded-lg font-bold mt-4 hover:bg-blue-900 transition-colors">
              Continue to Verification
            </button>
            <p className="text-center text-[10px] text-gray-600 mt-4">
              Already have an account? <span className="font-bold text-black cursor-pointer">Sign In</span>
            </p>
          </div>
        )}

        {/* STEP 2: IDENTITY VERIFICATION */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Identity Verification (AI Powered)</h2>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              We use secure AI technology to quickly verify the authenticity of your government ID.
            </p>
            <div className="space-y-2 mt-4">
              <label className="text-xs font-bold text-gray-700">Upload Government ID</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative ${errors.idUpload && !formData.idFront ? 'border-red-500' : 'border-gray-300'}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'idFront')} />
                  {formData.idFront ? <CheckCircle className="text-green-500 mb-2" size={24} /> : <Upload className="text-gray-400 mb-2" size={24} />}
                  <span className="text-[10px] text-gray-500">{formData.idFront ? 'Front Uploaded' : 'Front of ID'}</span>
                </label>
                <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative ${errors.idUpload && !formData.idBack ? 'border-red-500' : 'border-gray-300'}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'idBack')} />
                  {formData.idBack ? <CheckCircle className="text-green-500 mb-2" size={24} /> : <Upload className="text-gray-400 mb-2" size={24} />}
                  <span className="text-[10px] text-gray-500">{formData.idBack ? 'Back Uploaded' : 'Back of ID'}</span>
                </label>
              </div>
              {errors.idUpload && <p className="text-[10px] text-red-500 font-bold">{errors.idUpload}</p>}
              <p className="text-[9px] text-gray-400 italic">Accepted IDs: UMID, Driver's License, PhilSys ID, Passport, PRC ID.</p>
            </div>
            <div className="pt-4">
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 w-full">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'selfie')} />
                <div className="bg-gray-100 p-2 rounded-lg"><Camera className={formData.selfie ? "text-green-600" : "text-gray-400"} size={20} /></div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-700">Selfie with ID (Optional)</span>
                  <span className="text-[9px] text-gray-500">{formData.selfie ? 'Photo captured successfully' : 'Take a clear photo of yourself holding your ID'}</span>
                </div>
              </label>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <span className="text-[10px] text-gray-400">🔒 Your verification data is securely processed and used only for identity validation.</span>
            </div>
            <button onClick={nextStep} className="w-full bg-[#004A8C] text-white py-3 rounded-lg font-bold mt-4">
              Next: Work Details
            </button>
          </div>
        )}

        {/* STEP 3: WORK DETAILS */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Work & Location Details</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Work Information</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none appearance-none bg-white">
                  <option>Carpenter</option>
                  <option>Electrician</option>
                  <option>Plumber</option>
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
                <select className="w-full p-3 bg-gray-100 rounded-lg text-sm text-gray-500 outline-none">
                  <option>Select your City / Municipality</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">Barangay</label>
                <select className="w-full p-3 bg-gray-100 rounded-lg text-sm text-gray-500 outline-none">
                  <option>Barangay</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <label className="text-[11px] font-bold text-gray-700">Proof of Work (Optional)</label>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <label key={i} className="border-2 border-dashed border-gray-300 rounded-lg h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50 relative overflow-hidden">
                    <input type="file" className="hidden" accept="image/*" onChange={handleProofOfWork} />
                    {formData.proofOfWork[i] ? (
                        <div className="w-full h-full bg-green-50 flex items-center justify-center">
                            <CheckCircle size={16} className="text-green-600" />
                        </div>
                    ) : (
                        <Upload size={16} className="text-gray-400" />
                    )}
                  </label>
                ))}
              </div>
              <p className="text-[9px] text-gray-400 italic leading-tight">
                Upload clear photos of jobs, before and after shots, or in-progress work (up to 4 photos).
              </p>
            </div>
            <button onClick={() => setIsSubmitted(true)} className="w-full bg-[#004A8C] text-white py-3 rounded-lg font-bold mt-4">
              Submit Application
            </button>
          </div>
        )}

        {/* SUCCESS MODAL */}
        {isSubmitted && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-8 relative animate-in fade-in zoom-in duration-300">
              <button onClick={() => setIsSubmitted(false)} className="absolute right-4 top-4 text-gray-400"><X size={20}/></button>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-white" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Application Submitted</h3>
                <p className="text-[11px] text-gray-500 mb-6 px-4">
                  Thank you for applying as a worker on TrabaHome. Your application is now under review.
                </p>
                {/* Updated this button to navigate */}
                <button 
                  className="w-full bg-[#004A8C] text-white py-3 rounded-lg text-xs font-bold hover:bg-blue-900 transition-colors" 
                  onClick={() => navigate('/homeworker')}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerSignup;