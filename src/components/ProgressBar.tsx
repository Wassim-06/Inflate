// src/components/ProgressBar.tsx

import React from 'react';

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ totalSteps, currentStep }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    // ✅ CORRECTION : 'bg-muted' s'adapte au fond du thème.
    <div className="w-full bg-muted rounded-full h-2.5">
      <div
        // ✅ CORRECTION : 'bg-primary' utilise la couleur principale du thème.
        className="bg-primary h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;