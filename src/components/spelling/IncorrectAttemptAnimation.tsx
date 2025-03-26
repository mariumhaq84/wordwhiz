
import React, { useEffect, useState } from 'react';
import { Frown, Repeat, Gamepad2, ArrowDown } from 'lucide-react';

interface IncorrectAttemptAnimationProps {
  isRTL?: boolean;
}

const IncorrectAttemptAnimation: React.FC<IncorrectAttemptAnimationProps> = ({ isRTL }) => {
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-4 border-amber-300 rounded-2xl p-5 shadow-lg animate-bounce-once kid-friendly">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
            {isRTL ? (
              <Repeat className="h-10 w-10 text-amber-500 animate-wiggle" />
            ) : (
              <Gamepad2 className="h-10 w-10 text-amber-500 animate-wiggle" />
            )}
          </div>
          <div className="text-center">
            {isRTL ? (
              <p className="font-urdu text-xl text-amber-700 font-bold">
                صحیح نہیں ہے۔ دوبارہ کوشش کریں
              </p>
            ) : (
              <p className="text-amber-700 font-bold font-comic text-2xl">
                Oops! Try again!
              </p>
            )}
            <p className={`text-amber-600 text-sm mt-1 ${isRTL ? 'font-urdu' : 'font-comic'}`}>
              {isRTL ? "آپ کر سکتے ہیں!" : "You can do it!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncorrectAttemptAnimation;
