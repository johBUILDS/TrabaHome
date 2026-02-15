import React from 'react';
import type { StepperProps } from '../../types/Worker.types.ts';
import { stepLabels } from '../../constants/SignUpData.ts';

const Stepper: React.FC<StepperProps> = ({ currentStep }) => (
  <div className="flex items-center justify-between w-full max-w-md mx-auto mb-10 relative">
    <div className="absolute top-5 left-0 w-full h-[1px] bg-gray-300 -z-0"></div>
    {[1, 2, 3].map((num) => (
      <div key={num} className="relative z-10 flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold ${
          currentStep === num ? 'bg-[#004A8C] text-white border-[#004A8C]' : 'bg-white text-gray-400 border-gray-300'
        }`}>
          {num}
        </div>
        <span className={`text-[10px] mt-2 font-semibold ${currentStep === num ? 'text-black' : 'text-gray-400'}`}>
          {stepLabels[num - 1]}
        </span>
      </div>
    ))}
  </div>
);

export default Stepper;