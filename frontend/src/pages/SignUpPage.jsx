import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import Icons

export default function SignUp() {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    city: "",
    barangay: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address";

    const mobileRegex = /^9\d{9}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit number (e.g., 9123456789)";
    }

    if (!formData.city) newErrors.city = "Please select a city";
    if (!formData.barangay) newErrors.barangay = "Please select a barangay";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Must include 1 capital letter, 1 number, and 1 special character (@$!%*?&)";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      newErrors.checkboxes = "You must agree to both Terms and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted Successfully", formData);
      navigate("/search");
    }
  };

  const inputStyle = (fieldName) => `
    w-full bg-[#EBEBEB] border-2 rounded-lg px-4 py-2.5 text-[13px] outline-none transition-all
    ${errors[fieldName] ? "border-red-400" : "border-transparent focus:border-[#004A8C]"}
  `;

  return (
    <div className="min-h-screen w-full bg-[#F9F6F2] flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-[450px] rounded-[30px] shadow-sm p-10 flex flex-col items-center">
        
        <div className="flex flex-col items-center mb-4">
          <Link to="/" className="transition-opacity hover:opacity-80 active:scale-95">
            <img src="/assets/Logo.png" alt="TrabaHome" className="h-12 w-auto" />
          </Link>
        </div>

        <h2 className="text-[20px] font-bold text-[#004A8C] text-center mb-2">Get Reliable Help</h2>
        
        <form onSubmit={handleSignUp} className="w-full space-y-3">
          
          <div className="space-y-1">
            <label className="block text-[12px] font-bold text-gray-800 ml-1">Full Name</label>
            <div className="grid grid-cols-2 gap-3">
              <input name="firstName" placeholder="First Name" onChange={handleChange} className={inputStyle("firstName")} />
              <input name="lastName" placeholder="Last Name" onChange={handleChange} className={inputStyle("lastName")} />
            </div>
            {(errors.firstName || errors.lastName) && <p className="text-[10px] text-red-500 ml-1">Name is required</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[12px] font-bold text-gray-800 ml-1">Email Address</label>
            <input name="email" type="email" placeholder="example@gmail.com" onChange={handleChange} className={inputStyle("email")} />
            {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[12px] font-bold text-gray-800 ml-1">Mobile Number</label>
            <div className={`flex bg-[#EBEBEB] rounded-lg overflow-hidden border-2 ${errors.mobileNumber ? "border-red-400" : "border-transparent"}`}>
              <span className="px-3 py-2.5 text-[13px] text-gray-500 border-r border-gray-300">+63</span>
              <input name="mobileNumber" type="tel" placeholder="9123456789" onChange={handleChange} className="w-full bg-transparent px-3 py-2.5 text-[13px] outline-none" />
            </div>
            {errors.mobileNumber && <p className="text-[10px] text-red-500 ml-1">{errors.mobileNumber}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-[12px] font-bold text-gray-800 ml-1">City & Barangay</label>
            <select name="city" onChange={handleChange} className={inputStyle("city")}>
              <option value="">Select City</option>
              <option value="dagupan">Dagupan City</option>
              <option value="lingayen">Lingayen</option>
            </select>
            <select name="barangay" onChange={handleChange} className={inputStyle("barangay")}>
              <option value="">Select Barangay</option>
              <option value="b1">Barangay 1</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[12px] font-bold text-gray-800 ml-1">Password</label>
            
            {/* Password Field */}
            <div className="relative">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                onChange={handleChange} 
                className={inputStyle("password")} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004A8C] transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 ml-1 leading-tight">{errors.password}</p>}
            
            {/* Confirm Password Field */}
            <div className="relative">
              <input 
                name="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                onChange={handleChange} 
                className={inputStyle("confirmPassword")} 
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004A8C] transition-colors p-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-red-500 ml-1">{errors.confirmPassword}</p>}
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="agreeTerms" type="checkbox" onChange={handleChange} className="w-4 h-4 rounded" />
                <span className="text-[10px]">Terms & Conditions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="agreePrivacy" type="checkbox" onChange={handleChange} className="w-4 h-4 rounded" />
                <span className="text-[10px]">Privacy Policy</span>
              </label>
            </div>
            {errors.checkboxes && <p className="text-[10px] text-red-500">{errors.checkboxes}</p>}
          </div>

          <button type="submit" className="w-full bg-[#004A8C] text-white py-3 rounded-full font-bold text-[15px] hover:bg-[#003666] transition-all mt-4 active:scale-95">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}