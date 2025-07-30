import { BookOpen, Zap, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EnhancedLoading() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: BookOpen, text: "Initializing Learning Platform", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, text: "Loading Assessment Engine", color: "from-purple-500 to-pink-500" },
    { icon: TrendingUp, text: "Preparing Analytics Dashboard", color: "from-green-500 to-emerald-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress > 33 && currentStep === 0) setCurrentStep(1);
    if (progress > 66 && currentStep === 1) setCurrentStep(2);
  }, [progress, currentStep]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r ${steps[currentStep].color} rounded-3xl mb-6 shadow-2xl transform transition-all duration-1000 hover:scale-110`}>
            <CurrentIcon className="w-12 h-12 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Smart Quiz Hub
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg' 
                    : 'bg-white/20'
                }`}></div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 transition-all duration-500 ${
                    index < currentStep ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-white/20'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Progress Text */}
          <div className="text-white/90 text-lg font-semibold mb-2">
            {Math.round(progress)}%
          </div>
          <div className="text-blue-200 text-sm font-medium">
            {steps[currentStep].text}
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        {/* Subtle hint text */}
        <div className="mt-8 text-blue-300/60 text-xs">
          Preparing your personalized learning experience...
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}