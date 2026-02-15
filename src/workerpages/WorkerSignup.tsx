import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/signup/Stepper.tsx';
import StepOne from '../components/signup/StepOne.tsx';
import StepTwo from '../components/signup/StepTwo.tsx';
import StepThree from '../components/signup/StepThree.tsx';
import SubmittedModal from '../components/signup/SubmittedModal.tsx';
import { initialFormData } from '../constants/SignUpData.ts';
import { validateStep1, validateStep2, normalizePhilippineMobile } from '../utils/Validation.ts';
import type { WorkerSignupFormData, SignupErrors } from '../types/Worker.types.ts';

const WorkerSignup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<WorkerSignupFormData>(initialFormData);
  const [errors, setErrors] = useState<SignupErrors>({});

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.idFrontPreview) URL.revokeObjectURL(formData.idFrontPreview);
      if (formData.idBackPreview) URL.revokeObjectURL(formData.idBackPreview);
      if (formData.selfiePreview) URL.revokeObjectURL(formData.selfiePreview);
      // Cleanup proof of work previews
      formData.proofOfWorkPreviews?.forEach(preview => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, []);

  const handleStep1Next = (): void => {
    const validationErrors = validateStep1(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      const normalizedPhone = normalizePhilippineMobile(formData.phone);
      if (normalizedPhone && normalizedPhone !== formData.phone) {
        setFormData(prev => ({ ...prev, phone: normalizedPhone }));
      }
      setStep(2);
    }
  };

  const handleStep2Next = (): void => {
    const validationErrors = validateStep2(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setStep(3);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === "phone" && !/^[+\d]*$/.test(value)) return;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof WorkerSignupFormData): void => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Revoke old object URL to avoid memory leaks
      const previewField = `${field}Preview` as keyof WorkerSignupFormData;
      if (formData[previewField]) {
        URL.revokeObjectURL(formData[previewField] as string);
      }
      
      // Create new preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({ 
        ...prev, 
        [field]: file,
        [`${field}Preview`]: previewUrl
      }));
      
      // Clear errors for ID uploads
      if (field === 'idFront' || field === 'idBack') {
        setErrors(prev => ({ ...prev, idUpload: '' }));
      }
    } else {
      // Clear both file and preview when no file selected (for delete button)
      const previewField = `${field}Preview` as keyof WorkerSignupFormData;
      if (formData[previewField]) {
        URL.revokeObjectURL(formData[previewField] as string);
      }
      
      setFormData(prev => ({ 
        ...prev, 
        [field]: null,
        [`${field}Preview`]: null
      }));
    }
  };

  const handleProofOfWork = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    const index = parseInt((e.target as HTMLInputElement).dataset.index || '0');
    
    // Initialize arrays if they don't exist
    const currentPreviews = formData.proofOfWorkPreviews || [];
    const currentFiles = formData.proofOfWork || [];
    
    if (!file) {
      // Remove image at index (when X button is clicked)
      const newPreviews = [...currentPreviews];
      const newFiles = [...currentFiles];
      
      // Revoke old URL to prevent memory leak
      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      
      newPreviews[index] = undefined as any;
      newFiles[index] = undefined as any;
      
      setFormData(prev => ({
        ...prev,
        proofOfWorkPreviews: newPreviews,
        proofOfWork: newFiles
      }));
      return;
    }
    
    // Add new image at index
    const newPreviews = [...currentPreviews];
    const newFiles = [...currentFiles];
    
    // Revoke old URL if exists
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    // Create new preview URL
    const previewUrl = URL.createObjectURL(file);
    newPreviews[index] = previewUrl;
    newFiles[index] = file;
    
    setFormData(prev => ({
      ...prev,
      proofOfWorkPreviews: newPreviews,
      proofOfWork: newFiles
    }));
  };

  const handleTogglePassword = (field: 'password' | 'confirmPassword'): void => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = (): void => {
    setIsSubmitted(true);
  };

  const handleCloseModal = (): void => {
    setIsSubmitted(false);
  };

  const handleGoToDashboard = (): void => {
    navigate('/homeworker');
  };

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

        <Stepper currentStep={step} />

        {step === 1 && (
          <StepOne
            formData={formData}
            errors={errors}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onInputChange={handleInputChange}
            onTogglePassword={handleTogglePassword}
            onNext={handleStep1Next}
          />
        )}

        {step === 2 && (
          <StepTwo
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onNext={handleStep2Next}
          />
        )}

        {step === 3 && (
          <StepThree
            formData={formData}
            onInputChange={handleInputChange}
            onProofOfWorkUpload={handleProofOfWork}
            onSubmit={handleSubmit}
          />
        )}

        <SubmittedModal
          isOpen={isSubmitted}
          firstName={formData.firstName}
          onClose={handleCloseModal}
          onGoToDashboard={handleGoToDashboard}
        />
      </div>
    </div>
  );
};

export default WorkerSignup;