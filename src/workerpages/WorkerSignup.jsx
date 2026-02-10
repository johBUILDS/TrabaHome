import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle, Info, X, Eye, EyeOff, ChevronDown, Lock, ClipboardCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkerSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form State - Added fields from the screenshot
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    idType: '', // Added
    idFront: null,
    idBack: null,
    selfie: null,
    // AI Extracted Fields
    surname: '',
    givenName: '',
    middleName: '',
    sex: '',
    nationality: 'Filipino', // Default from screenshot
    idNumber: '',
    dateOfBirth: '',
    placeOfBirth: 'Mangaldan', // Default from screenshot
    dateOfIssue: '',
    expiryDate: '',
    issuingAuthority: '',
    proofOfWork: [],
    agreedTerms: false,
    agreedPrivacy: false
  });

  const [errors, setErrors] = useState({});

  const normalizePhilippineMobile = (value) => {
    if (value === undefined || value === null) return null;
    let raw = String(value).trim();
    if (!raw) return null;
    raw = raw.replace(/[()\-\s]/g, '');
    if (raw.startsWith('+')) {
      if (!raw.startsWith('+63')) return null;
      raw = `0${raw.slice(3)}`;
    } else if (raw.startsWith('63')) {
      raw = `0${raw.slice(2)}`;
    } else if (raw.startsWith('9')) {
      raw = `0${raw}`;
    }
    if (!/^09\d{9}$/.test(raw)) return null;
    return raw;
  };

  const validateStep1 = () => {
    let newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    const normalizedPhone = normalizePhilippineMobile(formData.phone);

    if (!nameRegex.test(formData.firstName)) newErrors.firstName = "Letters only, no numbers.";
    if (!nameRegex.test(formData.lastName)) newErrors.lastName = "Letters only, no numbers.";
    if (!normalizedPhone) {
      newErrors.phone = "Enter a valid PH mobile (09XXXXXXXXX, 9XXXXXXXXX, or +63XXXXXXXXX).";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Must have 1 capital letter & 1 special character.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.agreedTerms || !formData.agreedPrivacy) {
      newErrors.agreements = "You must agree to both Terms and Privacy Policy.";
    }

    if (Object.keys(newErrors).length === 0 && normalizedPhone && normalizedPhone !== formData.phone) {
      setFormData(prev => ({ ...prev, phone: normalizedPhone }));
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (!formData.idFront || !formData.idBack) {
      newErrors.idUpload = "Please upload both the front and back of your ID to proceed.";
    }
    if (!formData.idType) {
      newErrors.idType = "Please select an ID type.";
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
    if (name === "phone" && !/^[+\d]*$/.test(value)) return;
    
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
        
        <div className="flex justify-center mb-6">
          <img 
            src="/assets/Logo.png" 
            alt="TrabaHome" 
            className="h-10 w-auto object-contain"
          />
        </div>

        <h1 className="text-[#004A8C] text-center font-bold text-xl mb-8">Worker Application</h1>

        <Stepper />

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
              <label className="text-xs font-bold text-gray-700">Mobile Number</label>
              <input 
                type="text" 
                name="phone" 
                maxLength={13}
                value={formData.phone}
                onChange={handleInputChange} 
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

        {step === 2 && (
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
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-100 rounded-lg text-sm outline-none appearance-none ${errors.idType ? 'border border-red-500' : ''}`}
                >
                  <option value="">Select type of Valid ID</option>
                  <option value="UMID">UMID</option>
                  <option value="DriversLicense">Driver's License</option>
                  <option value="PhilSys">PhilSys ID</option>
                  <option value="Passport">Passport</option>
                  <option value="PRC">PRC ID</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative ${errors.idUpload && !formData.idFront ? 'border-red-500' : 'border-gray-300'}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'idFront')} />
                  {formData.idFront ? <CheckCircle className="text-green-500 mb-2" size={24} /> : <Upload className="text-gray-400 mb-2" size={24} />}
                  <span className="text-[10px] text-gray-500 font-bold">{formData.idFront ? 'Front Uploaded' : 'Front of ID'}</span>
                </label>
                <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative ${errors.idUpload && !formData.idBack ? 'border-red-500' : 'border-gray-300'}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'idBack')} />
                  {formData.idBack ? <CheckCircle className="text-green-500 mb-2" size={24} /> : <Upload className="text-gray-400 mb-2" size={24} />}
                  <span className="text-[10px] text-gray-500 font-bold">{formData.idBack ? 'Back Uploaded' : 'Back of ID'}</span>
                </label>
              </div>
              <p className="text-[9px] text-gray-400 italic text-center">Accepted IDs: UMID, Driver's License, PhilSys ID, Passport, PRC ID.</p>
              {errors.idUpload && <p className="text-[10px] text-red-500 font-bold">{errors.idUpload}</p>}
            </div>

            {/* Review Extracted Information Section (From Screenshot) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-gray-800">Auto-Filled Inputs</h3>
              <p className="text-[10px] text-gray-500 leading-tight">Please review the details below. If the AI made a mistake, feel free to correct the information to match your ID.</p>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">ID Number</label>
                  <input name="idNumber" value={formData.idNumber} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="ID Number" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">Surname</label>
                  <input name="surname" value={formData.surname} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="Surname" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">Given Name</label>
                  <input name="givenName" value={formData.givenName} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="Given Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">Middle Name</label>
                  <input name="middleName" value={formData.middleName} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="Middle Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">Date of Birth</label>
                  <input name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="YYYY-MM-DD" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">Nationality</label>
                  <input name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="Nationality" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">Sex</label>
                  <input name="sex" value={formData.sex} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="Sex" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">Place of Birth</label>
                  <input name="placeOfBirth" value={formData.placeOfBirth} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="Place of Birth" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">Date of Issue</label>
                  <input name="dateOfIssue" value={formData.dateOfIssue} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="YYYY-MM-DD" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">Valid Until</label>
                  <input name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="YYYY-MM-DD" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-700">Issuing Authority</label>
                  <input name="issuingAuthority" value={formData.issuingAuthority} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="Issuing Authority" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 w-full">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'selfie')} />
                <div className="bg-gray-100 p-2 rounded-lg"><Camera className={formData.selfie ? "text-green-600" : "text-gray-400"} size={20} /></div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-700">Selfie with ID (Optional)</span>
                  <span className="text-[9px] text-gray-500">{formData.selfie ? 'Photo captured successfully' : 'Take a clear photo of yourself holding your ID to speed up verification.'}</span>
                </div>
              </label>
            </div>

            <div className="flex items-center gap-2 justify-center py-2 text-gray-500">
               <Lock size={12} />
               <span className="text-[9px]">Your verification data is securely processed and used only for identity validation.</span>
            </div>

            <button onClick={nextStep} className="w-full bg-[#004A8C] text-white py-3 rounded-lg font-bold mt-2">
              Next: Work Details
            </button>
          </div>
        )}

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

        {/* --- ENHANCED SUBMITTED MODAL --- */}
        {isSubmitted && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl w-full max-w-[420px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              
              {/* Decorative Header Area */}
              <div className="bg-[#004A8C]/5 h-32 flex items-center justify-center relative">
                <div className="absolute top-4 right-4">
                   <button onClick={() => setIsSubmitted(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
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
                  Thank you for applying, <span className="text-gray-900 font-bold">{formData.firstName}</span>! 
                  Our team is currently verifying your identity and work details. This usually takes <span className="text-[#004A8C] font-semibold">24-48 hours</span>.
                </p>

                <div className="w-full space-y-3">
                  <button 
                    className="w-full bg-[#004A8C] text-white py-4 rounded-xl text-sm font-bold hover:bg-[#003a6e] active:scale-[0.98] transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2" 
                    onClick={() => navigate('/homeworker')}
                  >
                    Go to Dashboard
                  </button>
                  
                  <button 
                    className="w-full bg-white text-gray-500 py-3 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors"
                    onClick={() => setIsSubmitted(false)}
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
        )}
      </div>
    </div>
  );
};

export default WorkerSignup;
