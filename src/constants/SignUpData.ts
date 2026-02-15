import type { WorkerSignupFormData, IDType } from '../types/Worker.types.ts';

// Initial form data
export const initialFormData: WorkerSignupFormData = {
  // Step 1
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  agreeToPrivacy: false,
  
  // Step 2
  idType: '',
  idFront: null,
  idFrontPreview: null,
  idBack: null,
  idBackPreview: null,
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
  selfie: null,
  selfiePreview: null,
  
  // Step 3
  profession: '',
  province: 'Pangasinan',
  city: '',
  barangay: '',
  proofOfWork: [],
  proofOfWorkPreviews: []
};

// Step labels for stepper
export const stepLabels: string[] = [
  'Account Info',
  'Identity Verification',
  'Work Details'
];

// ID types for selection
export const idTypes: IDType[] = [
  { value: '', label: 'Select type of Valid ID' },
  { value: 'umid', label: 'UMID' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'philsys', label: 'PhilSys ID' },
  { value: 'passport', label: 'Passport' },
  { value: 'prc', label: 'PRC ID' }
];

// Profession options for Step 3
export const professionOptions: string[] = [
  'Select Profession',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Mason',
  'Painter',
  'Welder',
  'HVAC Technician',
  'Roofer',
  'Landscaper',
  'Cleaner/Housekeeper',
  'Appliance Repair',
  'General Handyman',
  'Other'
];

// Cities in Pangasinan
export const pangasinanCities: string[] = [
  'Select your City / Municipality',
  'Alaminos City',
  'Dagupan City',
  'San Carlos City',
  'Urdaneta City',
  'Agno',
  'Aguilar',
  'Alcala',
  'Anda',
  'Asingan',
  'Balungao',
  'Bani',
  'Basista',
  'Bautista',
  'Bayambang',
  'Binalonan',
  'Binmaley',
  'Bolinao',
  'Bugallon',
  'Burgos',
  'Calasiao',
  'Dasol',
  'Infanta',
  'Labrador',
  'Laoac',
  'Lingayen',
  'Mabini',
  'Malasiqui',
  'Manaoag',
  'Mangaldan',
  'Mangatarem',
  'Mapandan',
  'Natividad',
  'Pozzorubio',
  'Rosales',
  'San Fabian',
  'San Jacinto',
  'San Manuel',
  'San Nicolas',
  'San Quintin',
  'Santa Barbara',
  'Santa Maria',
  'Santo Tomas',
  'Sison',
  'Sual',
  'Tayug',
  'Umingan',
  'Urbiztondo',
  'Villasis'
];