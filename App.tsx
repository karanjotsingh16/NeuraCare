import React, { useState, useCallback, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import HomePage from './components/HomePage';
import ResultsPage from './components/ResultsPage';
import Loader from './components/Loader';
import LoginPage from './components/LoginPage';
import type { AnalysisResult } from './types';
import { getBurnoutAnalysis } from './services/geminiService';
import { BrainCircuitIcon } from './components/icons';

type View = 'home' | 'results';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<View>('home');
  const [userInput, setUserInput] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      handleReset();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleReset = useCallback(() => {
    setUserInput('');
    setAnalysisResult(null);
    setInputError(null);
    setView('home');
    setIsLoading(false);
  }, []);

  const validateInput = useCallback((text: string): boolean => {
    const trimmedText = text.trim();
    if (trimmedText.length > 0 && trimmedText.length < 10) {
      setInputError('Please describe your feelings in a bit more detail (at least 10 characters).');
      return false;
    }
    if (trimmedText.length > 2000) {
      setInputError('Please keep your entry under 2000 characters.');
      return false;
    }
    setInputError(null);
    return true;
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isLoadingRef.current || !validateInput(userInput)) return;
    
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const result = await getBurnoutAnalysis(userInput);
      setAnalysisResult(result);
      setView('results');
    } catch (error) {
      console.error("Analysis API error:", error);
      setInputError("Sorry, we couldn't complete the analysis. Please try again.");
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [userInput, validateInput]);

  const handleUserInputChange = (text: string) => {
    setUserInput(text);
    if (inputError) {
      validateInput(text);
    }
  };

  const renderAppContent = () => {
    switch (view) {
      case 'home':
        return (
          <HomePage
            userInput={userInput}
            setUserInput={handleUserInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={inputError}
          />
        );
      case 'results':
        return analysisResult ? (
          <ResultsPage result={analysisResult} onReset={handleReset} />
        ) : (
          <HomePage
            userInput={userInput}
            setUserInput={handleUserInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={inputError}
          />
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center justify-center py-8 px-4">
      {!user ? (
        <LoginPage />
      ) : (
        <>
        <header className="w-full max-w-3xl mx-auto flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2 text-gray-400">
               <BrainCircuitIcon className="w-6 h-6 text-blue-400" />
                <span className="font-semibold">NeuraCare</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300 hidden sm:block">Welcome, {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}</span>
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-gray-700 text-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </header>
          <main className="w-full flex-grow flex items-center justify-center">
            {renderAppContent()}
          </main>
        </>
      )}
    </div>
  );
};

export default App;