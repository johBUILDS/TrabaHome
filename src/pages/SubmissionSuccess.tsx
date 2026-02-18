import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubmittedModal from '../components/signup/SubmittedModal.tsx';

const SubmissionSuccess: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate('/signup'); // or wherever "Back to Form" should go
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard'); // change to your dashboard route
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SubmittedModal
        isOpen={isOpen}
        firstName="User" // replace with actual name from state/context/location
        onClose={handleClose}
        onGoToDashboard={handleGoToDashboard}
      />
    </div>
  );
};

export default SubmissionSuccess;
