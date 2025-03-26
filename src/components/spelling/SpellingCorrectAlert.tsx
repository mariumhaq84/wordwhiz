
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Check } from 'lucide-react';

interface SpellingCorrectAlertProps {
  word: string;
}

// Component is now empty - it doesn't render anything
const SpellingCorrectAlert = ({ word }: SpellingCorrectAlertProps) => {
  return null; // Return null instead of rendering the alert
};

export default SpellingCorrectAlert;
