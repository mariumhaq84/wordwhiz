export const useToastNotifications = () => {
  // Empty functions that can be called without causing errors
  const showCorrectAnswerToast = () => {
    // Toast notification removed
  };

  const showIncorrectAnswerToast = () => {
    // Toast notification removed
  };

  const showCorrectBlanksToast = () => {
    // Toast notification removed
  };

  const showIncorrectBlanksToast = () => {
    // Toast notification removed
  };

  const showTimeExpiredToast = () => {
    // Toast notification removed
  };

  return {
    showCorrectAnswerToast,
    showIncorrectAnswerToast,
    showCorrectBlanksToast,
    showIncorrectBlanksToast,
    showTimeExpiredToast
  };
};
