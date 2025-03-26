import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import * as htmlToImage from 'html-to-image';

interface ScreenshotButtonProps {
  elementId: string;
  filename?: string;
}

const ScreenshotButton = ({ elementId, filename = 'word-list' }: ScreenshotButtonProps) => {
  const takeScreenshot = async () => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      const dataUrl = await htmlToImage.toPng(element);
      
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
      
      // Success message removed
    } catch (error) {
      console.error("Failed to capture screenshot", error);
      // Error toast removed
    }
  };

  return (
    <Button 
      onClick={takeScreenshot}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Camera className="h-4 w-4" />
      Screenshot
    </Button>
  );
};

export default ScreenshotButton;
