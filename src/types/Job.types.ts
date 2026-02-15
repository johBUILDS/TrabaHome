// types/job.ts
export type JobStatus = 'Pending' | 'In Progress' | 'Completed' | 'Declined' | 'Cancelled';

export interface Job {
  id: string;
  name: string;
  location: string;
  status: JobStatus;
  needs: string;
  time: string;
  acceptedTime?: string;
  completionTime?: string;
  cancelledReason?: string;
  declineReason?: string;
  hasReview?: boolean;
  rating?: number;
  description?: string;
  
  // Contact information (visible after acceptance)
  email?: string;
  facebook?: string;
  phone?: string;
  
  // Review data
  reviewDate?: string;
  reviewText?: string;
  
  // Additional fields
  homeownerId?: string;
  homeownerAvatar?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  price?: number;
  currency?: string;
  scheduledDate?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  images?: string[];
  urgency?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onAccept: (job: Job) => void;
  onDecline: (job: Job) => void;
}

export interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onAccept: (job: Job) => void;
  onDecline: (job: Job) => void;
}

export interface HeaderProps {
  onLogoClick: () => void;
}

export interface AcceptJobModalProps {
  job: Job | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface DeclineJobModalProps {
  job: Job | null;
  declineReasons: string[];
  onDecline: (jobId: string, reason: string) => void;
  onCancel: () => void;
}

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export interface SidebarProps {
  location: {
    pathname: string;
  };
  navigate: (path: string) => void;
}