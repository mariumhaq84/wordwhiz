
import { toast } from 'sonner';

export const useToastNotifications = () => {
  const showCorrectAnswerToast = () => {
    toast.success("Excellent! You spelled it correctly! Moving to the next word.");
  };

  const showIncorrectAnswerToast = () => {
    toast.error("Not quite right. Let's try again. Watch the word carefully.");
  };

  const showCorrectBlanksToast = () => {
    toast.success("Great job! You filled in the blanks correctly! Moving to typing stage.");
  };

  const showIncorrectBlanksToast = () => {
    toast.error("Not quite right. Let's try again with the blanks.");
  };

  const showTimeExpiredToast = () => {
    toast.error("Oopsie! Time's up! Let's try again! You can do it! 🌟");
  };

  return {
    showCorrectAnswerToast,
    showIncorrectAnswerToast,
    showCorrectBlanksToast,
    showIncorrectBlanksToast,
    showTimeExpiredToast
  };
};
