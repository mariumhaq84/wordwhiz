
import React from 'react';

interface StaticCharacterProps {
  character: string;
  isRTL: boolean;
  colorScheme?: 'green' | 'amber'; // For different color schemes
}

const StaticCharacter = ({ character, isRTL, colorScheme = 'amber' }: StaticCharacterProps) => {
  const bgColor = colorScheme === 'amber' 
    ? 'bg-gradient-to-r from-amber-50 to-orange-50' 
    : 'bg-gradient-to-r from-emerald-50 to-green-50';
  
  const borderColor = colorScheme === 'amber' 
    ? 'border-amber-300' 
    : 'border-emerald-300';
  
  const textColor = colorScheme === 'amber' 
    ? 'text-amber-700' 
    : 'text-emerald-700';
  
  return (
    <div 
      className={`w-14 h-14 border-2 ${borderColor} rounded-lg ${bgColor} 
        flex items-center justify-center text-xl font-bold ${textColor} 
        shadow-inner ${isRTL ? 'font-urdu kid-friendly' : 'kid-friendly'} 
        transform hover:scale-105 transition-transform duration-200`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {character}
    </div>
  );
};

export default StaticCharacter;
