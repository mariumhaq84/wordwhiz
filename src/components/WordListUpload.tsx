import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Language, WordList } from '@/types/word';
import { IceCream, Sparkles, Globe } from 'lucide-react';

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

        <Button 
          onClick={handleLoadPredefinedList} 
          className="w-full py-4 text-lg gap-2 transform transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
          disabled={loading}
        >
          <IceCream className="h-5 w-5" />
          {loading ? "جاري التحميل..." : "لنبدأ التدريب!"}
        </Button>
      </div>
    </Card>
  );
};

export default WordListUpload;
