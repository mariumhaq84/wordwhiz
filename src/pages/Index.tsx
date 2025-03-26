
import React from 'react';
import MainMenu from '@/components/MainMenu';
import { WordList } from '@/types/word';
import PageHeader from './index/PageHeader';
import WordNavigator from './index/WordNavigator';
import WordListSelector from './index/WordListSelector';
import DashboardView from './index/DashboardView';
import PracticeView from './index/PracticeView';
import { useSpellingSession } from '@/hooks/useSpellingSession';

const Index = () => {
  const {
    selectedLanguage,
    wordLists,
    currentList,
    currentWordIndex,
    sessionResults,
    currentScore,
    showDashboard,
    
    handleLanguageSelect,
    handleUpload,
    handleStartPractice,
    handleWordComplete,
    handleEndSession,
    handleNavigateWord,
    handleBackToLanguageSelection,
    handleClearHistory,
    setShowDashboard,
    setWordLists,
    setCurrentList
  } = useSpellingSession();

  return (
    <div className="container mx-auto px-1 py-1 space-y-1 min-h-screen bg-gradient-to-br from-sky-100 via-fuchsia-100 to-amber-100">
      <PageHeader />
        
      {currentList && (
        <WordNavigator 
          currentWordIndex={currentWordIndex}
          totalWordCount={currentList.words.length}
          currentScore={currentScore}
          onNavigateWord={handleNavigateWord}
        />
      )}

      {!selectedLanguage ? (
        <MainMenu onSelectLanguage={handleLanguageSelect} />
      ) : !currentList && !showDashboard ? (
        <WordListSelector 
          wordLists={wordLists}
          sessionResults={sessionResults}
          selectedLanguage={selectedLanguage}
          onBackToLanguageSelection={handleBackToLanguageSelection}
          onStartPractice={handleStartPractice}
          onClearWordLists={() => setWordLists([])}
          onShowDashboard={() => setShowDashboard(true)}
        />
      ) : showDashboard ? (
        <DashboardView 
          sessionResults={sessionResults}
          onBackToWordLists={() => setShowDashboard(false)}
          onClearHistory={handleClearHistory}
        />
      ) : (
        <PracticeView 
          currentList={currentList}
          currentWordIndex={currentWordIndex}
          currentScore={currentScore}
          onBackToWordList={() => setCurrentList(null)}
          onEndSession={handleEndSession}
          onWordComplete={handleWordComplete}
          onNavigateWord={handleNavigateWord}
        />
      )}
    </div>
  );
};

export default Index;
