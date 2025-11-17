import React, { useState } from 'react';
import type { AnalysisResult, AnalysisStep } from '../types';
import { CheckCircleIcon, ThumbsUpIcon, ThumbsDownIcon } from './icons';
import BreathingExercise from './BreathingExercise';

interface ResultsPageProps {
  result: AnalysisResult;
  onReset: () => void;
}

const StepCard: React.FC<{ step: AnalysisStep }> = ({ step }) => (
  <li className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-700 text-blue-400 rounded-full font-bold text-xl">
        {step.step}
      </div>
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-100">{step.title}</h3>
      <p className="mt-1 text-gray-300">{step.description}</p>
      {step.type === 'breathing' && (
        <div className="mt-4">
          <BreathingExercise />
        </div>
      )}
    </div>
  </li>
);

const ResultsPage: React.FC<ResultsPageProps> = ({ result, onReset }) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(() => {
    try {
      return localStorage.getItem('neuraCareFeedback') as 'up' | 'down' | null;
    } catch {
      return null;
    }
  });

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    try {
      localStorage.setItem('neuraCareFeedback', type);
    } catch (error) {
      console.error("Could not save feedback to localStorage", error);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto px-4 animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-green-900/50 text-green-400 rounded-full p-3 mb-4">
            <CheckCircleIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100">
            {result.analysis.sentiment}
          </h2>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
            {result.analysis.summary}
          </p>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-bold text-center text-gray-100 mb-6">
            Your Personalized Path to Recovery
          </h3>
          <ul className="space-y-6">
            {result.plan.map((step) => (
              <StepCard key={step.step} step={step} />
            ))}
          </ul>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          {!feedback ? (
            <>
              <h4 className="text-md font-semibold text-gray-300">Was this analysis helpful?</h4>
              <div className="flex justify-center space-x-4 mt-3">
                <button
                  onClick={() => handleFeedback('up')}
                  className="p-2 rounded-full text-gray-400 hover:bg-green-900/50 hover:text-green-400 transition-colors"
                  aria-label="Helpful"
                >
                  <ThumbsUpIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleFeedback('down')}
                  className="p-2 rounded-full text-gray-400 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                  aria-label="Not helpful"
                >
                  <ThumbsDownIcon className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-md text-green-400 font-semibold animate-fade-in">
              Thank you for your feedback!
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors duration-200"
        >
          Start Over
        </button>
      </div>

       <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Disclaimer: NeuraCare provides suggestions and is not a substitute for professional medical advice. If you are in crisis, please contact a healthcare provider.
        </p>
      </div>
    </div>
  );
};

export default ResultsPage;