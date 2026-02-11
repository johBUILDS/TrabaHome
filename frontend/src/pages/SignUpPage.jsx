import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import Icons

export default function SignUp() {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  const validate = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address";

    const normalizedPhone = normalizePhilippineMobile(formData.mobileNumber);
    if (!normalizedPhone) {
      newErrors.mobileNumber = "Enter a valid PH mobile (09XXXXXXXXX, 9XXXXXXXXX, or +63XXXXXXXXX)";
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/homeowner/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: normalizePhilippineMobile(formData.mobileNumber),
          address: {
            city: formData.city,
            state: formData.barangay
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Registration failed");
      }

      navigate(`/verify-email/homeowner?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setServerError(err.message || "Registration failed");
    } finally {
      setLoading(false);
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
              <input name="mobileNumber" type="tel" placeholder="09XXXXXXXXX, 9XXXXXXXXX, or +63XXXXXXXXX" onChange={handleChange} className="w-full bg-transparent px-3 py-2.5 text-[13px] outline-none" />
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

          {serverError && <p className="text-[10px] text-red-500 font-bold text-center">{serverError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004A8C] text-white py-3 rounded-full font-bold text-[15px] hover:bg-[#003666] transition-all mt-4 active:scale-95 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
