import React from 'react';
import { Users, CheckSquare, CheckCircle, Star } from 'lucide-react';
import type { Stat, Request } from '../types/Worker.types.ts';

export const statsData: Stat[] = [
  { label: 'Pending Request', value: 4, icon: <Users className="w-7 h-7 text-[#FFB800]" /> },
  { label: 'Accepted Jobs', value: 3, icon: <CheckSquare className="w-7 h-7 text-[#0085FF]" /> },
  { label: 'Completed Jobs', value: 10, icon: <CheckCircle className="w-7 h-7 text-[#00A651]" /> },
  { label: 'Average Rating', value: 4.9, icon: <Star className="w-7 h-7 text-[#FFB800]" /> },
];

export const mockRequests: Request[] = [
  {
    id: 1,
    name: 'Homeowner',
    location: 'Mangaldan, Pangasinan',
    needs: 'Carpenter',
    schedule: 'Not Specified',
    time: 'Jan 14, 3:00 PM',
    description: 'Sira pinto koooooo',
    avatar: 'https://i.pravatar.cc/150?u=10'
  },
  {
    id: 2,
    name: 'Homeowner',
    location: 'Mangaldan, Pangasinan',
    needs: 'Carpenter',
    schedule: 'Not Specified',
    time: 'Jan 14, 3:00 PM',
    description: 'Sira pinto koooooo',
    avatar: 'https://i.pravatar.cc/150?u=11'
  },
  {
    id: 3,
    name: 'Homeowner',
    location: 'Mangaldan, Pangasinan',
    needs: 'Carpenter',
    schedule: 'Not Specified',
    time: 'Jan 14, 3:00 PM',
    description: 'Sira pinto koooooo',
    avatar: 'https://i.pravatar.cc/150?u=12'
  },
  {
    id: 4,
    name: 'Homeowner',
    location: 'Mangaldan, Pangasinan',
    needs: 'Carpenter',
    schedule: 'Not Specified',
    time: 'Jan 14, 3:00 PM',
    description: 'Sira pinto koooooo',
    avatar: 'https://i.pravatar.cc/150?u=13'
  }
];