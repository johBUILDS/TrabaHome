import React, { useState } from 'react';
import StepOne from '../components/signup/StepOne.tsx';
import StepTwo from '../components/signup/StepTwo.tsx';
import StepThree from '../components/signup/StepThree.tsx';
import SubmittedModal from '../components/signup/SubmittedModal.tsx';
import type { WorkerSignupFormData, SignupErrors } from '../types/Worker.types.ts';
import { useNavigate } from 'react-router-dom';
import { workerAPI } from '../services/WorkerApi.ts';

const WorkerSignup: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<WorkerSignupFormData>({
    // Step 1 Fields
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: false,

    // Step 2 Fields
    idType: '',
    idFront: null,
    idFrontPreview: null,
    idBack: null,
    idBackPreview: null,
    selfie: null,
    selfiePreview: null,
    idNumber: '',
    surname: '',
    givenName: '',
    middleName: '',
    dateOfBirth: '',
    nationality: '',
    nationalityOther: '',
    sex: '',
    placeOfBirth: '',
    dateOfIssue: '',
    expiryDate: '',
    issuingAuthority: '',

    // Step 3 Fields
    profession: '',
    province: 'Pangasinan',
    city: '',
    barangay: '',
    proofOfWork: [],
    proofOfWorkPreviews: [],
  });

  const [errors, setErrors] = useState<SignupErrors>({});

  // Handle input changes for text fields and selects
  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, type } = e.target as HTMLInputElement;
  
  const value = type === 'checkbox'
    ? (e.target as HTMLInputElement).checked
    : e.target.value;

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  if (errors[name]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }
};

  // Handle file changes for ID uploads
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof WorkerSignupFormData
  ) => {
    const file = e.target?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: file,
          [`${field}Preview`]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);

      if (errors[field as string]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: null,
        [`${field}Preview`]: null
      }));
    }
  };

  // Handle proof of work uploads (multiple files for Step 3)
  const handleProofOfWorkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;

    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const newPreviews: string[] = [];

      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);

          if (newPreviews.length === fileArray.length) {
            setFormData(prev => ({
              ...prev,
              proofOfWork: [...prev.proofOfWork, ...fileArray],
              proofOfWorkPreviews: [...prev.proofOfWorkPreviews, ...newPreviews]
            }));
          }
        };
        reader.readAsDataURL(file);
      });

      if (errors.proofOfWork) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.proofOfWork;
          return newErrors;
        });
      }
    }
  };

  // Handle password toggle
  const handleTogglePassword = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(prev => !prev);
    } else {
      setShowConfirmPassword(prev => !prev);
    }
  };

  // Navigate to next step after validating Step 1
  const handleStep1Next = () => {
    const newErrors: SignupErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) newErrors.phone = 'Phone number is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      newErrors.agreements = 'You must agree to the terms and privacy policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  // Navigate to next step after validating Step 2
  const handleStep2Next = () => {
    const newErrors: SignupErrors = {};

    if (!formData.idType) newErrors.idType = 'Please select an ID type';
    if (!formData.idFront || !formData.idBack) newErrors.idUpload = 'Please upload both front and back of your ID';
    if (!formData.selfie) newErrors.selfie = 'Selfie is required for verification';
    if (!formData.idNumber) newErrors.idNumber = 'ID number is required';
    if (!formData.surname) newErrors.surname = 'Surname is required';
    if (!formData.givenName) newErrors.givenName = 'Given name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    if (!formData.nationality) {
      newErrors.nationality = 'Nationality is required';
    }

    if (formData.nationality === 'Other' && !formData.nationalityOther) {
      newErrors.nationalityOther = 'Please specify your nationality';
    }

    if (!formData.sex) newErrors.sex = 'Sex is required';
    if (!formData.placeOfBirth) newErrors.placeOfBirth = 'Place of birth is required';
    if (!formData.dateOfIssue) newErrors.dateOfIssue = 'Date of issue is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.issuingAuthority) newErrors.issuingAuthority = 'Issuing authority is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(3);
  };

  // ── Handle final submission ────────────────────────────────────
  const handleSubmit = async () => {
    const newErrors: SignupErrors = {};

    if (!formData.profession) newErrors.profession = 'Profession is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.barangay) newErrors.barangay = 'Barangay is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    setSubmitError(null);

    try {
      const payload = new FormData();

      // ── Step 1 fields ────────────────────────────────────────
      payload.append('firstName',      formData.firstName);
      payload.append('lastName',       formData.lastName);
      payload.append('email',          formData.email);
      payload.append('phone',          formData.phone);
      payload.append('password',       formData.password);
      payload.append('agreeToTerms',   String(formData.agreeToTerms));
      payload.append('agreeToPrivacy', String(formData.agreeToPrivacy));

      // ── Step 2 fields ────────────────────────────────────────
      payload.append('idType',           formData.idType);
      payload.append('idNumber',         formData.idNumber);
      payload.append('surname',          formData.surname);
      payload.append('givenName',        formData.givenName);
      payload.append('middleName',       formData.middleName || '');
      payload.append('dateOfBirth',      formData.dateOfBirth);
      payload.append('nationality',      formData.nationality);
      payload.append('nationalityOther', formData.nationalityOther || '');
      payload.append('sex',              formData.sex);
      payload.append('placeOfBirth',     formData.placeOfBirth);
      payload.append('dateOfIssue',      formData.dateOfIssue);
      payload.append('expiryDate',       formData.expiryDate);
      payload.append('issuingAuthority', formData.issuingAuthority);

      // ── Step 2 files ─────────────────────────────────────────
      // FIX: file fields were missing entirely in the original code
      if (formData.idFront) payload.append('idFront', formData.idFront);
      if (formData.idBack)  payload.append('idBack',  formData.idBack);
      if (formData.selfie)  payload.append('selfie',  formData.selfie);

      // ── Step 3 fields ────────────────────────────────────────
      payload.append('profession', formData.profession);
      payload.append('province',   formData.province);
      payload.append('city',       formData.city);
      payload.append('barangay',   formData.barangay);

      // ── Step 3 files ─────────────────────────────────────────
      // FIX: proof of work files were missing entirely in the original code
      formData.proofOfWork.forEach((file) => {
        payload.append('proofOfWork', file);
      });

      await workerAPI.register(payload);

      setIsSubmitted(true);
    } catch (error: any) {
      // Show all Mongoose validation errors if present, otherwise fallback message
      const message =
        error?.response?.data?.errors?.join(', ') ||
        error?.response?.data?.message ||
        'Something went wrong. Please try again.';
      setSubmitError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span className="text-sm font-semibold">Account</span>
          </div>

          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />

          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="text-sm font-semibold">ID Verification</span>
          </div>

          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />

          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              3
            </div>
            <span className="text-sm font-semibold">Work Details</span>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <StepOne
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onTogglePassword={handleTogglePassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
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
            errors={errors}
            onInputChange={handleInputChange}
            onProofOfWorkUpload={handleProofOfWorkUpload}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}

        {/* API Error Message */}
        {submitError && (
          <p className="text-center text-sm text-red-500 mt-4 font-semibold">
            {submitError}
          </p>
        )}
      </div>

      {/* Success Modal */}
      <SubmittedModal
        isOpen={isSubmitted}
        firstName={formData.firstName}
        onClose={() => setIsSubmitted(false)}
        onGoToDashboard={() => navigate('/worker-login')}
      />
    </div>
  );
};

export default WorkerSignup;
