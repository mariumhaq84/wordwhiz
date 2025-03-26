import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, Check, X, Circle } from 'lucide-react';
import { toast } from 'sonner';

interface PlaybackButtonProps {
  audioURL: string | null;
  playingAudio: boolean;
  onPlayAudio: () => void;
  onReset?: () => void;
  onKeep?: () => void;
  onDiscard?: () => void;
  showDiscardOptions?: boolean;
  compactMode?: boolean;
  flashEmpty?: boolean;
  wordId?: string;
}

const PlaybackButton: React.FC<PlaybackButtonProps> = ({ 
  audioURL, 
  playingAudio,
  onPlayAudio,
  onReset,
  onKeep,
  onDiscard,
  showDiscardOptions = false,
  compactMode = false,
  flashEmpty = false,
  wordId
}) => {
  // Debug information to help track recording issues
  const debugInfo = wordId ? `(Word ID: ${wordId})` : '';
  
  // For compact mode (used in the word list view)
  if (compactMode) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayAudio}
          disabled={playingAudio}
          className={`h-7 w-7 ${flashEmpty ? 'animate-pulse bg-amber-50' : ''}`}
          title={`Play recording ${debugInfo}`}
        >
          {audioURL ? (
            <Play className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4 text-gray-400" />
          )}
        </Button>
        
        {showDiscardOptions ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onKeep}
              className="text-green-600 hover:text-green-800 hover:bg-green-50 h-7 w-7 animate-in slide-in-from-right duration-300"
              title="Keep recording"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDiscard}
              className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-200 transition-colors animate-in slide-in-from-right duration-300"
              title="Discard recording"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          onReset && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onReset}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-7 w-7"
              title="Reset recording"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )
        )}
      </div>
    );
  }

  // For non-compact mode, we'll still use the same design but with icons only
  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        onClick={onPlayAudio}
        disabled={playingAudio}
        className="h-10 w-10 animate-in fade-in duration-300"
        title={`Play recording ${debugInfo}`}
      >
        <Play className="h-5 w-5" />
      </Button>
      
      {showDiscardOptions ? (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button 
            variant="outline"
            size="icon"
            onClick={onKeep}
            className="text-green-600 border-green-200 hover:bg-green-50 h-10 w-10 animate-in slide-in-from-right duration-300"
            title="Keep recording"
          >
            <Check className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline"
            size="icon"
            onClick={onDiscard}
            className="h-10 w-10 rounded-full bg-red-100 shadow-md flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-200 transition-colors animate-in slide-in-from-right duration-300"
            title="Discard recording"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        onReset && (
          <div className="text-center mt-4">
            <Button 
              variant="ghost"
              size="icon"
              onClick={onReset}
              className="h-10 w-10"
              title="Reset recording"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        )
      )}
    </>
  );
};

export default PlaybackButton;
