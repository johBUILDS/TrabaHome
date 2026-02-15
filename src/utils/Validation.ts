import type { WorkerSignupFormData, SignupErrors } from '../types/Worker.types.ts';

export const normalizePhilippineMobile = (value: string | null | undefined): string | null => {
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

export const validateStep1 = (formData: WorkerSignupFormData): SignupErrors => {
  const newErrors: SignupErrors = {};
  const nameRegex = /^[A-Za-z\s]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
  const normalizedPhone = normalizePhilippineMobile(formData.phone);

  if (!nameRegex.test(formData.firstName)) {
    newErrors.firstName = "Letters only, no numbers.";
  }
  if (!nameRegex.test(formData.lastName)) {
    newErrors.lastName = "Letters only, no numbers.";
  }
  if (!normalizedPhone) {
    newErrors.phone = "Enter a valid PH mobile (09XXXXXXXXX, 9XXXXXXXXX, or +63XXXXXXXXX).";
  }
  if (!passwordRegex.test(formData.password)) {
    newErrors.password = "Must have 1 capital letter & 1 special character.";
  }
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
  }
  if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
    newErrors.agreements = "You must agree to both Terms and Privacy Policy.";
  }

  return newErrors;
};

export const validateStep2 = (formData: WorkerSignupFormData): SignupErrors => {
  const newErrors: SignupErrors = {};
  if (!formData.idFront || !formData.idBack) {
    newErrors.idUpload = "Please upload both the front and back of your ID to proceed.";
  }
  if (!formData.idType) {
    newErrors.idType = "Please select an ID type.";
  }
  return newErrors;
};