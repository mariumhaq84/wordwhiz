import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book, Trophy, Languages, Trash2 } from 'lucide-react';
import { Language, WordList } from '@/types/word';
import WordListUpload from '@/components/WordListUpload';
import { ArrowLeft, BarChart, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface WordListSelectorProps {
  wordLists: WordList[];
  sessionResults: any[];
  selectedLanguage: Language;
  onBackToLanguageSelection: () => void;
  onStartPractice: (list: WordList) => void;
  onClearWordLists: () => void;
  onShowDashboard: () => void;
}

const WordListSelector = ({
  wordLists,
  sessionResults,
  selectedLanguage,
  onBackToLanguageSelection,
  onStartPractice,
  onClearWordLists,
  onShowDashboard,
}: WordListSelectorProps) => {
  // Helper function to get language-specific styling
  const getLanguageIcon = (language: Language) => {
    switch(language) {
      case 'arabic':
        return <span className="text-lg font-arabic">ع</span>;
      case 'urdu':
        return <span>اردو</span>;
      default:
        return <span>A</span>;
    }
  };

  const handleClearAllRecordings = () => {
    if (confirm("Are you sure you want to delete ALL voice recordings? This cannot be undone.")) {
      localStorage.removeItem('wordRecordings');
      toast.success("All recordings have been deleted");
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'wordRecordings'
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBackToLanguageSelection}
          className="bg-white hover:bg-blue-50 shadow-sm"
        >
          <ArrowLeft className="mr-1" size={16} />
          Language
        </Button>
        <div className="text-lg font-medium flex items-center gap-2">
          Selected Language: 
          <span className={`capitalize px-2 py-1 rounded-full ${
            selectedLanguage === 'urdu' 
              ? 'bg-green-100 text-green-800' 
              : selectedLanguage === 'arabic' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
          }`}>
            <Languages className="inline mr-1 h-4 w-4" />
            {selectedLanguage}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {wordLists.length === 0 ? (
          <div className="md:col-span-2">
            <WordListUpload 
              onUpload={(list) => wordLists.length === 0 && onStartPractice(list)} 
              defaultLanguage={selectedLanguage}
            />
          </div>
        ) : (
          <>
            <div id="word-lists" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-purple-700 flex items-center">
                  <Book className="mr-2" size={24} />
                  Your Word List
                </h2>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllRecordings}
                  className="text-red-500 hover:bg-red-50"
                  title="Reset all recorded pronunciations"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Reset All Recordings
                </Button>
              </div>
              <div className="grid gap-4">
                {wordLists.map(list => (
                  <Card key={list.id} className={`p-6 bg-white/90 backdrop-blur shadow-lg rounded-xl hover:shadow-xl transition-all border-2 ${
                    list.language === 'urdu' 
                      ? 'border-green-100' 
                      : list.language === 'arabic' 
                        ? 'border-purple-100' 
                        : 'border-blue-100'
                  }`}>
                    <h3 className={`text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${
                      list.language === 'urdu'
                        ? 'from-green-600 to-teal-600'
                        : list.language === 'arabic'
                          ? 'from-purple-600 to-indigo-600'
                          : 'from-blue-600 to-violet-600'
                    }`}>
                      {list.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {list.language.charAt(0).toUpperCase() + list.language.slice(1)} • {list.words.length} words
                      {list.language === 'urdu' && list.words.length === 50 && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                          Complete Set
                        </span>
                      )}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => onStartPractice(list)} 
                        className={`flex-1 py-6 bg-gradient-to-r shadow-md ${
                          list.language === 'urdu'
                            ? 'from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
                            : list.language === 'arabic'
                              ? 'from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
                              : 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                        }`}
                      >
                        <Trophy size={18} className="mr-2" /> Start Practice
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={onClearWordLists}
                        className="bg-white hover:bg-red-50"
                      >
                        Reset
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <Card className="p-6 bg-white/90 backdrop-blur shadow-lg rounded-xl border-2 border-blue-100">
              <h2 className="text-2xl font-semibold text-blue-700 flex items-center mb-4">
                <BarChart className="mr-2" size={24} />
                Your Performance
              </h2>
              
              {sessionResults.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    You've completed {sessionResults.length} practice session{sessionResults.length !== 1 ? 's' : ''}!
                  </p>
                  <Button onClick={onShowDashboard} className="w-full py-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md">
                    <Brain size={18} className="mr-2" /> View Dashboard
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Complete a practice session to see your performance!</p>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default WordListSelector;
