import type { Job } from '../types/Job.types.ts';

export const initialJobs: Job[] = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    location: 'Quezon City, Metro Manila',
    status: 'Pending',
    needs: 'Plumbing',
    time: '2 hours ago',
    description: 'Kitchen sink is leaking badly. Need immediate repair.',
    email: 'juan.delacruz@email.com',
    phone: '+63 912 345 6789',
    facebook: 'juan.delacruz'
  },
  {
    id: '2',
    name: 'Maria Santos',
    location: 'Makati City, Metro Manila',
    status: 'In Progress',
    needs: 'Electrical',
    time: '5 hours ago',
    acceptedTime: '3 hours ago',
    description: 'Power outlet not working in the living room.',
    email: 'maria.santos@email.com',
    phone: '+63 917 234 5678',
    facebook: 'maria.santos'
  },
  {
    id: '3',
    name: 'Pedro Garcia',
    location: 'Pasig City, Metro Manila',
    status: 'Completed',
    needs: 'Carpentry',
    time: '2 days ago',
    completionTime: '1 day ago',
    description: 'Need custom shelves installed in bedroom.',
    email: 'pedro.garcia@email.com',
    phone: '+63 919 876 5432',
    facebook: 'pedro.garcia',
    hasReview: true,
    rating: 4.5,
    reviewDate: '1 day ago',
    reviewText: 'Great work! Very professional and finished on time.'
  },
  {
    id: '4',
    name: 'Ana Reyes',
    location: 'Mandaluyong City, Metro Manila',
    status: 'Declined',
    needs: 'Painting',
    time: '1 day ago',
    description: 'Need entire house painted.',
    declineReason: 'Too busy with current jobs'
  },
  {
    id: '5',
    name: 'Carlos Lopez',
    location: 'Taguig City, Metro Manila',
    status: 'Cancelled',
    needs: 'Plumbing',
    time: '3 days ago',
    description: 'Toilet repair needed urgently.',
    cancelledReason: 'Homeowner found another worker'
  }
];