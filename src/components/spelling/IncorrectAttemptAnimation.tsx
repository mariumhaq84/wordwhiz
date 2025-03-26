import React, { useEffect, useState } from 'react';
import { Frown, Repeat, Gamepad2, ArrowDown } from 'lucide-react';

interface IncorrectAttemptAnimationProps {
  isRTL?: boolean;
  language?: string; 
}

const IncorrectAttemptAnimation: React.FC<IncorrectAttemptAnimationProps> = ({ isRTL, language = 'english' }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const handleIncorrectAttempt = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    };
    
    window.addEventListener('incorrect-blanks-attempt', handleIncorrectAttempt);
    
    return () => {
      window.removeEventListener('incorrect-blanks-attempt', handleIncorrectAttempt);
    };
  }, []);

  if (!visible) return null;

  const getText = () => {
    switch (language) {
      case 'urdu':
        return {
          main: "صحیح نہیں ہے۔ دوبارہ کوشش کریں",
          encouragement: "آپ کر سکتے ہیں!",
          fontClass: "font-urdu"
        };
      case 'arabic':
        return {
          main: "غير صحيح. حاول مرة أخرى",
          encouragement: "أنت تستطيع ذلك!",
          fontClass: "font-arabic"
        };
      default:
        return {
          main: "Oops! Try again!",
          encouragement: "You can do it!",
          fontClass: "font-comic"
        };
    }
  };

  const textContent = getText();
  const icon = isRTL ? <Repeat className="h-10 w-10 text-amber-500 animate-wiggle" /> : <Gamepad2 className="h-10 w-10 text-amber-500 animate-wiggle" />;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-4 border-amber-300 rounded-2xl p-5 shadow-lg animate-bounce-once kid-friendly">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
            {icon}
          </div>
          <div className="text-center">
            <p className={`text-xl text-amber-700 font-bold ${textContent.fontClass}`}>
              {textContent.main}
            </p>
            <p className={`text-amber-600 text-sm mt-1 ${textContent.fontClass}`}>
              {textContent.encouragement}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncorrectAttemptAnimation;
