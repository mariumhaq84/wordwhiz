import React from 'react';
import { Gift, Stars, Sparkles, Rainbow, PartyPopper, IceCream, Rocket, Cloud } from 'lucide-react';

const PageHeader = () => {
  return (
    <div className="flex justify-center items-center mb-4 relative py-0">
      {/* Background decorations */}
      <div className="absolute top-0 left-10">
        <Cloud className="h-5 w-5 text-fuchsia-500 animate-float" style={{animationDelay: '0.3s'}} />
      </div>
      <div className="absolute bottom-0 right-12">
        <Rocket className="h-5 w-5 text-cyan-500 animate-float" style={{animationDelay: '0.8s'}} />
      </div>
      
      <div className="relative">
        {/* Add some decorative elements that are appealing to children */}
        <div className="absolute -top-2 -left-6">
          <Sparkles className="h-5 w-5 text-amber-400 animate-pop" />
        </div>
        <div className="absolute -top-2 right-0">
          <Rainbow className="h-5 w-5 text-fuchsia-500 animate-wiggle" />
        </div>
        
        {/* Main title with brighter gradient and fun icons */}
        <div className="bg-white/40 backdrop-blur-sm px-4 py-0.5 pb-4 rounded-xl shadow-lg border-2 border-amber-300">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 py-0 flex items-center font-comic">
            <Gift className="h-6 w-6 mr-1 text-fuchsia-500 animate-bounce-slow" />
            Spelling Wizard
            <Stars className="h-6 w-6 ml-1 text-amber-400 animate-spin-slow" />
          </h1>
          
          <div className="absolute -bottom-2 right-0">
            <PartyPopper className="h-5 w-5 text-emerald-500 animate-pop" style={{animationDelay: '0.2s'}} />
          </div>
          
          {/* Subtitle with fun font */}
          <div className="mt-0 text-center">
            <p className="text-xs font-comic text-fuchsia-600 animate-pulse">Learn spelling with fun!</p>
          </div>
        </div>
        
        <div className="absolute -bottom-2 -left-4">
          <IceCream className="h-6 w-6 text-pink-500 animate-bubble" />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
