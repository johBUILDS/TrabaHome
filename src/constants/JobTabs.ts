import type { JobStatus } from '../types/Job.types.ts';

export const jobTabs: (JobStatus | 'All')[] = [
  'All',
  'Pending',
  'In Progress',
  'Completed',
  'Declined',
  'Cancelled'
];