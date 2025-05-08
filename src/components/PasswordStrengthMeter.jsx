import { useEffect, useState } from 'react';
import { getPasswordStrength } from '../utils/authUtils';

const PasswordStrengthMeter = ({ password }) => {
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, strengthText: '', feedback: [] });

  useEffect(() => {
    const strength = getPasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColorClass = (score) => {
    switch (score) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-green-400';
      case 4:
        return 'bg-green-600';
      default:
        return 'bg-surface-300 dark:bg-surface-600';
    }
  };

  const getWidthClass = (score) => {
    return `w-${score}/4`;
  };

  return (
    <div className="mt-1">
      <div className="flex items-center space-x-1 mb-1">
        <div className="flex-1 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getStrengthColorClass(passwordStrength.score)} transition-all duration-300 ${
              password ? (passwordStrength.score === 0 ? 'w-1/4' : `w-${passwordStrength.score}/4`) : 'w-0'
            }`}
          />
        </div>
        <span className="text-xs font-medium min-w-20 text-right">
          {password ? passwordStrength.strengthText : ''}
        </span>
      </div>

      {password && passwordStrength.feedback.length > 0 && (
        <ul className="text-xs text-surface-600 dark:text-surface-400 mt-1 space-y-1">
          {passwordStrength.feedback.map((tip, index) => (
            <li key={index} className="flex items-center"><span className="text-xs">•</span> <span className="ml-1">{tip}</span></li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;