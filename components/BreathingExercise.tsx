import React, { useState, useEffect, useRef } from 'react';

type Phase = 'idle' | 'in' | 'hold' | 'out';

const phaseConfig = {
  in: { duration: 4000, label: 'Breathe In...' },
  hold: { duration: 4000, label: 'Hold' },
  out: { duration: 6000, label: 'Breathe Out...' },
};

const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      setPhase('in');
    } else {
      setPhase('idle');
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || phase === 'idle') return;

    let nextPhase: Phase;
    let duration: number;

    switch (phase) {
      case 'in':
        nextPhase = 'hold';
        duration = phaseConfig.in.duration;
        break;
      case 'hold':
        nextPhase = 'out';
        duration = phaseConfig.hold.duration;
        break;
      case 'out':
        nextPhase = 'in';
        duration = phaseConfig.out.duration;
        break;
      default:
        return;
    }
    
    timerRef.current = window.setTimeout(() => {
      setPhase(nextPhase);
    }, duration);

  }, [phase, isActive]);
  
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900/50 p-6 rounded-lg border border-gray-700">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div
          className="absolute bg-blue-500/30 rounded-full w-full h-full transform transition-transform ease-in-out"
          style={{
            transform: `scale(${phase === 'in' || phase === 'hold' ? 1 : 0.5})`,
            transitionDuration: `${phase === 'in' ? phaseConfig.in.duration : phase === 'out' ? phaseConfig.out.duration : 500}ms`
          }}
        />
        <div className="z-10 text-center">
          <p className="font-semibold text-blue-300 text-lg">
            {isActive && phase !== 'idle' ? phaseConfig[phase]?.label : 'Ready?'}
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsActive(!isActive)}
        className="mt-6 px-5 py-2 bg-gray-800 border-2 border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors duration-200"
      >
        {isActive ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default BreathingExercise;