import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Language, WordList } from '@/types/word';
import { useToast } from "@/components/ui/use-toast";
import { IceCream, Sparkles } from 'lucide-react';

interface WordListUploadProps {
  onUpload: (list: WordList) => void;
  defaultLanguage?: Language;
}

const WordListUpload = ({ onUpload, defaultLanguage = 'english' }: WordListUploadProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Predefined English spelling words from the Spellathon 2024-2025 Class 3 image
  const predefinedEnglishWords = [
    "contemplative", "patient", "remember", "arrogant",
    "gigantic", "perfume", "competition", "February",
    "children", "grateful", "brave", "world",
    "hardworking", "calm", "furniture", "valley",
    "academy", "delicious", "sneeze", "etiquette",
    "benefit", "practice", "cupboard", "cricket",
    "hobbies", "someone", "lanky", "vacation",
    "flight", "companion"
  ];

  const handleLoadPredefinedList = () => {
    setLoading(true);
    
    try {
      // Create word list with predefined words and shuffle them
      const shuffledWords = [...predefinedEnglishWords].sort(() => Math.random() - 0.5);
      
      const words = shuffledWords.map((word, index) => ({
        id: `${index}`,
        text: word,
        pronunciation: word,
        language: 'english' as Language,
      }));

      const wordList: WordList = {
        id: Date.now().toString(),
        name: "Spellathon 2024-2025 Class 3",
        language: 'english' as Language,
        words,
      };

      onUpload(wordList);
      
      toast({
        title: "Success",
        description: `English word list loaded successfully with ${words.length} words!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load predefined English word list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a colorful array for kid-friendly cell backgrounds
  const kidFriendlyColors = [
    'bg-pink-50', 'bg-blue-50', 'bg-purple-50', 'bg-yellow-50',
    'bg-green-50', 'bg-orange-50', 'bg-indigo-50', 'bg-red-50'
  ];

  return (
    <Card className="p-3 max-w-md mx-auto bg-white/90 backdrop-blur shadow-xl rounded-2xl">
      <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent text-center">
        Start Spelling Practice!
      </h2>

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="mb-3">
          <h3 className="text-center text-blue-700 font-semibold mb-2 flex items-center justify-center gap-1">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Spellathon 2024-2025 Class 3
            </span>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </h3>
          
          <div className="rounded-lg border-2 border-blue-300 overflow-hidden shadow-md">
            <div className="grid grid-cols-4 gap-[2px] bg-blue-200 p-[2px] rounded-md">
              {predefinedEnglishWords.map((word, index) => (
                <div 
                  key={index} 
                  className={`p-2 ${kidFriendlyColors[index % kidFriendlyColors.length]} 
                    flex items-center justify-center text-center rounded-md 
                    border border-blue-100 hover:scale-105 transition-transform duration-200`}
                >
                  <span className="text-blue-900 text-sm font-medium kid-friendly">{word}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleLoadPredefinedList} 
          className="w-full py-4 text-lg gap-2 transform transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
          disabled={loading}
        >
          <IceCream className="h-5 w-5" />
          {loading ? "Loading..." : "Let's Start Practicing English!"}
        </Button>
      </div>
    </Card>
  );
};

export default WordListUpload;
