import React from 'react';
import { BrainCircuitIcon } from './icons';

interface HomePageProps {
  userInput: string;
  setUserInput: (input: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

const HomePage: React.FC<HomePageProps> = ({ userInput, setUserInput, handleSubmit, isLoading, error }) => {
  const textAreaClasses = `w-full h-48 p-4 border rounded-lg shadow-sm focus:ring-2 transition duration-150 ease-in-out text-base resize-none bg-gray-800 text-gray-200 placeholder-gray-500 ${
    error 
      ? 'border-red-500 ring-red-500/50' 
      : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
  }`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter, but allow new lines with Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-gray-800 text-blue-400 rounded-full p-3 mb-4">
          <BrainCircuitIcon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100">
          How are you feeling?
        </h1>
        <p className="mt-3 text-lg text-gray-300">
         Describe what's on your mind. The more detail, the better the analysis.
        </p>
      </div>

      <div className="mt-8">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="I've been feeling so tired lately, completely drained of energy and motivation. It's hard to even get out of bed..."
          className={textAreaClasses}
          disabled={isLoading}
          aria-invalid={!!error}
          aria-describedby="input-error"
        />
        {error && <p id="input-error" className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="mt-2 flex justify-end items-center h-6">
            {isLoading ? (
                 <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                </div>
            ) : (
                <p className="text-xs text-gray-500">
                    Press <kbd className="font-sans px-1.5 py-1 border border-gray-600 bg-gray-900 rounded-md">Enter</kbd> to analyze. 
                    (<kbd className="font-sans px-1.5 py-1 border border-gray-600 bg-gray-900 rounded-md">Shift + Enter</kbd> for new line)
                </p>
            )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Your privacy is paramount. Your input is processed anonymously and is not stored.
        </p>
      </div>
    </div>
  );
};

export default HomePage;