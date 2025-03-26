
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import * as htmlToImage from 'html-to-image';
import { useToast } from "@/components/ui/use-toast";

interface ScreenshotButtonProps {
  elementId: string;
  filename?: string;
}

const ScreenshotButton = ({ elementId, filename = 'word-list' }: ScreenshotButtonProps) => {
  const { toast } = useToast();

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

      toast({
        title: "Screenshot saved!",
        description: "Your word list has been captured and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Screenshot failed",
        description: "Failed to capture screenshot. Please try again.",
        variant: "destructive",
      });
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
