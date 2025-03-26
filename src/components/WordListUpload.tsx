import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Language, WordList } from '@/types/word';
import { IceCream, Sparkles, Globe, Loader2, ArrowRight, ArrowDown, Play } from 'lucide-react';

interface WordListUploadProps {
  onUpload: (list: WordList) => void;
  defaultLanguage?: Language;
}

const WordListUpload = ({ onUpload, defaultLanguage = 'arabic' }: WordListUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedLanguage] = useState<Language>(defaultLanguage);

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

  // Predefined Urdu spelling words
  const predefinedUrduWords = [
    "عبادت", "تلاش", "عبادت", "مہمان",
    "استقبال", "عادت", "گھڑی", "دعا",
    "ظاہر", "راستہ", "ایمان", "مزاج",
    "خاموش", "طبیعت", "حیران", "لکڑی",
    "سجدہ", "ڈانٹ", "آسمان", "سورج",
    "طلوع", "بھوک", "صحابہ کرام", "صفت",
    "ناراض", "تکلیف", "حالت", "خرگوش",
    "چیونٹی", "جھوٹ", "تعلق", "کانپنا",
    "ہجری", "جفاکش", "ترقی", "اعداد",
    "فلک", "اعتبار", "جوڑنا", "ارمان",
    "پریشانی", "مسکین", "آہستہ", "گیند",
    "خوشبودار", "کوشش", "مثال", "جاندار",
    "میدان", "درہم", "برداشت"
  ];

  // Predefined Arabic spelling words
  const predefinedArabicWords = [
    "فأر", "رسالة", "نهر", "خشب",
    "بيوت", "أصوات", "بندق", "جوز",
    "الناس", "تسير السيارة", "ينظف", "يكنس",
    "يتعب", "يقفز", "الفلاح", "يضرب",
    "قوي", "أسنان", "نعامة", "يخرج",
    "يزار", "يخفي", "لامعة", "يدفن",
    "يحكم", "السجن", "صحراء", "تسافر",
    "القاضي", "يظهر", "أجزاء", "عجلات",
    "المطاط", "محطة", "علم", "إسعاف",
    "مطافئ", "البضائع", "اخترع", "أسهل",
    "يستريح", "طريق", "النهر", "القطار",
    "كتف", "الخشبة", "بعض", "آخر",
    "لا شيء", "يفهم"
  ];

  const handleLoadPredefinedList = () => {
    setLoading(true);
    
    try {
      // Select the appropriate word list based on language
      let wordList;
      if (selectedLanguage === 'urdu') {
        wordList = predefinedUrduWords;
      } else if (selectedLanguage === 'arabic') {
        wordList = predefinedArabicWords;
      } else {
        wordList = predefinedEnglishWords;
      }
      
      // Create word list with predefined words and shuffle them
      const shuffledWords = [...wordList].sort(() => Math.random() - 0.5);
      
      const words = shuffledWords.map((word, index) => ({
        id: `${index}`,
        text: word,
        pronunciation: word,
        language: selectedLanguage,
      }));

      const wordListObj: WordList = {
        id: Date.now().toString(),
        name: selectedLanguage === 'arabic' 
          ? "تدريب الإملاء العربية" 
          : selectedLanguage === 'urdu' 
            ? "اردو املا کی مشق" 
            : "English Spelling Practice",
        language: selectedLanguage,
        words,
      };

      onUpload(wordListObj);
    } catch (error) {
      console.error(`Failed to load predefined ${selectedLanguage} word list`, error);
    } finally {
      setLoading(false);
    }
  };

  // Create a colorful array for kid-friendly cell backgrounds
  const kidFriendlyColors = [
    'bg-pink-50', 'bg-blue-50', 'bg-purple-50', 'bg-yellow-50',
    'bg-green-50', 'bg-orange-50', 'bg-indigo-50', 'bg-red-50'
  ];

  // Get the current word list based on selected language
  let currentWordList;
  if (selectedLanguage === 'urdu') {
    currentWordList = predefinedUrduWords;
  } else if (selectedLanguage === 'arabic') {
    currentWordList = predefinedArabicWords;
  } else {
    currentWordList = predefinedEnglishWords;
  }

  return (
    <Card className="p-3 max-w-md mx-auto bg-white/90 backdrop-blur shadow-xl rounded-2xl">
      <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent text-center font-arabic">
        تدريب الإملاء العربية
      </h2>

      <div className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="mb-3">
            <div className="rounded-lg border-2 border-blue-300 overflow-hidden shadow-md">
              <div className="grid grid-cols-4 gap-[2px] bg-blue-200 p-[2px] rounded-md">
                {currentWordList.map((word, index) => (
                  <div 
                    key={index} 
                    className={`p-2 ${kidFriendlyColors[index % kidFriendlyColors.length]} 
                      flex items-center justify-center text-center rounded-md 
                      border border-blue-100 hover:scale-105 transition-transform duration-200
                      ${selectedLanguage === 'arabic' ? 'font-arabic-container' : 
                        selectedLanguage === 'urdu' ? 'font-urdu-container' : ''}`}
                  >
                    <span className={`text-blue-900 text-sm font-medium kid-friendly 
                      ${selectedLanguage === 'arabic' ? 'font-arabic' : 
                        selectedLanguage === 'urdu' ? 'font-urdu' : ''}`}>
                      {word}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <div 
            onClick={!loading ? handleLoadPredefinedList : undefined}
            className={`relative cursor-pointer transform transition-all duration-300 ${loading ? 'opacity-70' : 'hover:scale-110'}`}
            aria-label="Start Training"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !loading) {
                handleLoadPredefinedList();
              }
            }}
          >
            {loading ? (
              <div className="relative flex items-center justify-center">
                {/* Loading animation background */}
                <div className="w-24 h-24 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
                
                {/* Loading spinner */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-white animate-spin" />
                </div>
                
                {/* Stars */}
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -left-2">
                  <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Colorful background with 3D effect - smaller with pastel colors */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lavender-300 via-pink-200 to-peach-200 shadow-[0_6px_15px_rgba(236,72,153,0.4)] flex items-center justify-center transform hover:scale-105 transition-all duration-300"
                     style={{ 
                       background: 'linear-gradient(135deg, #D8BFD8, #FADADD, #FFE5B4)'
                     }}>
                  {/* Outer glow effect */}
                  <div className="absolute w-full h-full rounded-full opacity-20 blur-md animate-pulse"
                       style={{ background: '#FADADD' }}></div>
                  
                  {/* Inner circle */}
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-inner"
                       style={{ background: 'linear-gradient(135deg, #E0FFFF, #E6E6FA)' }}>
                    {/* Play icon as main element */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-14 h-14 rounded-full shadow-md flex items-center justify-center animate-pulse"
                           style={{ background: 'linear-gradient(135deg, #B0E0E6, #87CEEB)' }}>
                        <Play className="h-8 w-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sparkle effects - more and varied with pastel colors */}
                <div className="absolute -top-3 -right-1">
                  <Sparkles className="h-6 w-6 animate-pulse" style={{ color: '#B0E0E6' }} />
                </div>
                <div className="absolute -bottom-3 -left-1">
                  <Sparkles className="h-6 w-6 animate-pulse" style={{ color: '#D8BFD8' }} />
                </div>
                <div className="absolute top-1/4 -right-4">
                  <Sparkles className="h-4 w-4 animate-ping" style={{ animationDuration: '2s', color: '#FFE5B4' }} />
                </div>
                <div className="absolute bottom-1/4 -left-4">
                  <Sparkles className="h-4 w-4 animate-ping" style={{ animationDuration: '1.5s', color: '#E0FFFF' }} />
                </div>
                
                {/* Subtle ripple effect - smaller with pastel colors */}
                <div className="absolute rounded-full opacity-0 animate-ping" 
                     style={{ 
                       animationDuration: '2.5s',
                       border: '2px solid #E6E6FA', /* Pastel lavender */
                       width: '75%',
                       height: '75%',
                       top: '12.5%',
                       left: '12.5%'
                     }}>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WordListUpload;
