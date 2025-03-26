
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Language } from '@/types/word';
import { 
  Rabbit, Cat, Stars, Sparkles, IceCream, Rocket, 
  Gift, PartyPopper, Rainbow, Dog, Gamepad2,
  ArrowRight, Cloud, PawPrint
} from 'lucide-react';

interface MainMenuProps {
  onSelectLanguage: (language: Language) => void;
}

const MainMenu = ({ onSelectLanguage }: MainMenuProps) => {
  const [hoveredLanguage, setHoveredLanguage] = useState<Language | null>(null);
  
  const languages: { 
    value: Language; 
    label: string; 
    icon: React.ReactNode; 
    color: string;
    hoverColor: string;
    mascot: React.ReactNode;
  }[] = [
    { 
      value: 'english', 
      label: 'English', 
      icon: <Rabbit className="h-8 w-8" />, 
      color: 'from-cyan-500 to-blue-600',
      hoverColor: 'from-cyan-600 to-blue-700',
      mascot: <Dog className="h-16 w-16 text-blue-500 animate-jump" />
    },
    { 
      value: 'urdu', 
      label: 'Urdu', 
      icon: <Cat className="h-8 w-8" />, 
      color: 'from-emerald-500 to-green-600',
      hoverColor: 'from-emerald-600 to-green-700',
      mascot: <PawPrint className="h-16 w-16 text-emerald-500 animate-float" />
    },
    { 
      value: 'arabic', 
      label: 'Arabic', 
      icon: <Stars className="h-8 w-8" />, 
      color: 'from-fuchsia-500 to-purple-600',
      hoverColor: 'from-fuchsia-600 to-purple-700',
      mascot: <Rainbow className="h-16 w-16 text-fuchsia-500 animate-wiggle" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-purple-200 to-pink-200 py-4">
      <div className="absolute top-20 left-10 opacity-50">
        <Cloud className="h-20 w-20 text-blue-400 animate-float" style={{animationDelay: '0.2s'}} />
      </div>
      <div className="absolute top-40 right-20 opacity-50">
        <Cloud className="h-16 w-16 text-purple-400 animate-float" style={{animationDelay: '1.3s'}} />
      </div>
      <div className="absolute bottom-20 left-20 opacity-50">
        <Sparkles className="h-12 w-12 text-pink-400 animate-float" style={{animationDelay: '0.7s'}} />
      </div>
      
      <Card className="p-6 max-w-md mx-auto bg-white/80 backdrop-blur shadow-xl rounded-3xl border-4 border-amber-400 relative overflow-hidden">
        <div className="absolute -top-6 -left-6 rotate-[-15deg]">
          <Stars className="h-16 w-16 text-fuchsia-500 animate-float" />
        </div>
        
        <div className="absolute -top-6 -right-6 rotate-[15deg]">
          <Rainbow className="h-16 w-16 text-blue-500 animate-float" style={{animationDelay: '0.5s'}} />
        </div>
        
        <div className="absolute -bottom-3 -left-3 rotate-[15deg]">
          <Cloud className="h-16 w-16 text-amber-500 animate-wiggle" style={{animationDelay: '0.3s'}} />
        </div>
        
        <div className="text-center mb-6 relative">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute -top-6 -left-8">
                <Sparkles className="h-10 w-10 text-amber-500 animate-float" style={{ animationDelay: '0.2s' }} />
              </div>
              <div className="p-5 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full animate-float shadow-lg">
                <Gift className="h-20 w-20 text-white" />
              </div>
              <div className="absolute -bottom-4 -right-6">
                <PartyPopper className="h-10 w-10 text-fuchsia-500 animate-float" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 bg-clip-text text-transparent font-comic">
            Spelling Wizard!
          </h2>
          <p className="text-xl kid-friendly text-fuchsia-700 animate-pulse">
            Choose your magical language!
          </p>
        </div>
        
        <div className="grid gap-4 relative">
          {hoveredLanguage && (
            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 transition-all duration-300 hidden md:block">
              {languages.find(l => l.value === hoveredLanguage)?.mascot}
            </div>
          )}
          
          {languages.map((lang) => (
            <Button 
              key={lang.value} 
              onClick={() => onSelectLanguage(lang.value)}
              onMouseEnter={() => setHoveredLanguage(lang.value)}
              onMouseLeave={() => setHoveredLanguage(null)}
              className={`py-6 text-xl rounded-2xl transform transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-4 bg-gradient-to-r ${lang.color} hover:${lang.hoverColor} text-white border-b-4 border-r-4 ${
                lang.value === 'english' 
                  ? 'border-blue-700' 
                  : lang.value === 'urdu' 
                    ? 'border-green-700' 
                    : 'border-purple-700'
              } active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 kid-friendly`}
            >
              <div className={`p-2 bg-white/30 rounded-full ${lang.value === hoveredLanguage ? 'animate-spin-slow' : ''}`}>
                {lang.icon}
              </div>
              {lang.label}
              <Gamepad2 className="h-6 w-6 ml-2 text-white/70" />
            </Button>
          ))}
        </div>
        
        <div className="mt-6 py-2 px-4 bg-gradient-to-r from-amber-100 to-orange-200 rounded-xl shadow-inner">
          <p className="text-amber-800 text-sm font-medium text-center kid-friendly">
            Learn spelling with fun! Choose a language to begin your adventure! ✨
          </p>
        </div>
        
        <div className="absolute -bottom-4 -right-4">
          <IceCream className="h-16 w-16 text-pink-400 animate-wiggle" />
        </div>
      </Card>
    </div>
  );
};

export default MainMenu;
