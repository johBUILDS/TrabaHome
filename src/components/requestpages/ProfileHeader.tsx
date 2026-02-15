import React from 'react';
import { HammerIcon } from 'lucide-react';
import type { ProfileHeaderProps } from '../../types/Worker.types.ts';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex items-center gap-5">
    <div className="w-16 h-16 bg-blue-100 rounded-full overflow-hidden shrink-0 ring-4 ring-[#F0F9F6]">
      <img src="https://i.pravatar.cc/150?u=berto" alt={profile.fullName} className="w-full h-full object-cover" />
    </div>
    <div>
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
        <div className="w-4 h-4 bg-[#0085FF] rounded-full flex items-center justify-center">
          <span className="text-[8px] text-white font-bold">✓</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <span className="bg-[#EBF7F3] text-[#00A651] px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
          <HammerIcon className="w-3 h-3" /> {profile.profession}
        </span>
        <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
          <span className="text-yellow-400 text-sm">★</span> 
          <span className="font-bold text-gray-700">{profile.rating}</span> | {profile.ratingsCount} Ratings 
          <button className="text-[#0085FF] hover:underline ml-1"> (See Reviews)</button>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;