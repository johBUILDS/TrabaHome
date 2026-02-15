import type { ReactNode } from 'react';

export interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export interface Stat {
  label: string;
  value: number;
  icon: ReactNode;
}

export interface Request {
  id: number;
  name: string;
  location: string;
  needs: string;
  schedule: string;
  time: string;
  description: string;
  avatar: string;
}

export interface RequestCardProps {
  request: Request;
  onViewDetails: (request: Request) => void;
}

export interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
}

// NEW TYPES FOR WORKER PROFILE
export interface WorkerProfile {
  fullName: string;
  profession: string;
  location: string;
  bio: string;
  phone: string;
  email: string;
  facebook: string;
  images: (string | null)[];
  rating: number;
  ratingsCount: number;
}

export interface ProfileHeaderProps {
  profile: WorkerProfile;
}

export interface AccountVerificationProps {
  isExpanded?: boolean;
}

export interface VerificationDocument {
  label: string;
  verified: boolean;
}

export interface BasicInfoSectionProps {
  profile: WorkerProfile;
  isEditing: boolean;
  onToggleEdit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ContactInfoSectionProps {
  profile: WorkerProfile;
  isEditing: boolean;
  onToggleEdit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

//TYPES FOR WORKER SIGNUP
export interface WorkerSignupFormData {
  // Step 1 Fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;

  // Step 2 Fields
  idType: string;
  idFront: File | null;
  idFrontPreview: string | null;
  idBack: File | null;
  idBackPreview: string | null;
  selfie: File | null;
  selfiePreview: string | null;
  idNumber: string;
  surname: string;
  givenName: string;
  middleName: string;
  dateOfBirth: string;
  nationality: string;
  nationalityOther: string; 
  sex: string;
  placeOfBirth: string;
  dateOfIssue: string;
  expiryDate: string;
  issuingAuthority: string;

  // Step 3 Fields
  profession: string;
  province: string;
  city: string;
  barangay: string;
  proofOfWork: File[];
  proofOfWorkPreviews: string[];
}

export interface SignupErrors {
  firstName?: string;
  lastName?: string;
  email?: string; 
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agreements?: string;
  idUpload?: string;
  idType?: string;
  [key: string]: string | undefined; 
}

export interface StepperProps {
  currentStep: number;
}

export interface StepOneProps {
  formData: WorkerSignupFormData;
  errors: SignupErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: (field: 'password' | 'confirmPassword') => void;
  onNext: () => void;
}

export interface StepTwoProps {
  formData: WorkerSignupFormData;
  errors: SignupErrors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof WorkerSignupFormData) => void;
  onNext: () => void;
}

export interface StepThreeProps {
  formData: WorkerSignupFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onProofOfWorkUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export interface SubmittedModalProps {
  isOpen: boolean;
  firstName: string;
  onClose: () => void;
  onGoToDashboard: () => void;
}

export interface IDType {
  value: string;
  label: string;
}