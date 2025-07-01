import React, { useState } from 'react';
import { Home, Users, Calendar, Sparkles, ArrowRight, Check } from 'lucide-react';

interface OnboardingData {
  homeName: string;
  roommates: number;
  needsLaundrySchedule: boolean;
  rentAmount: string;
  lastUtilityPayment: string;
}

interface OnboardingScreenProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    homeName: '',
    roommates: 1,
    needsLaundrySchedule: false,
    rentAmount: '',
    lastUtilityPayment: ''
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to HomeQuest! 🎉</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Let's set up your home and create a personalized experience that makes managing your space fun and rewarding!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 rounded-full p-2">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-blue-900">What we'll set up:</h3>
                  <p className="text-blue-700 text-sm">Home details, schedules, and smart reminders</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your home called?</h2>
              <p className="text-gray-600">Give your space a fun name!</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={data.homeName}
                onChange={(e) => setData({ ...data, homeName: e.target.value })}
                placeholder="e.g., The Cozy Corner, Casa Awesome..."
                className="w-full px-6 py-4 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-lg"
              />
              <div className="grid grid-cols-2 gap-3">
                {['The Nest', 'Casa Bonita', 'Home Base', 'The Sanctuary'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setData({ ...data, homeName: suggestion })}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-all duration-200 hover:scale-105"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How many people live here?</h2>
              <p className="text-gray-600">Including yourself</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setData({ ...data, roommates: num })}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                      data.roommates === num
                        ? 'border-pink-500 bg-pink-50 text-pink-700 scale-105'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl font-bold">{num}</div>
                    <div className="text-sm">{num === 1 ? 'Just me' : `${num} people`}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setData({ ...data, roommates: 5 })}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
                  data.roommates === 5
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                5+ people
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Need a laundry schedule?</h2>
              <p className="text-gray-600">We can help organize laundry days for everyone</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setData({ ...data, needsLaundrySchedule: true })}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  data.needsLaundrySchedule
                    ? 'border-green-500 bg-green-50 text-green-700 scale-105'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-4xl mb-2">✅</div>
                <div className="font-semibold">Yes, please!</div>
                <div className="text-sm opacity-75">Set up laundry rotation</div>
              </button>
              <button
                onClick={() => setData({ ...data, needsLaundrySchedule: false })}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  !data.needsLaundrySchedule
                    ? 'border-gray-500 bg-gray-50 text-gray-700 scale-105'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-4xl mb-2">🚫</div>
                <div className="font-semibold">No thanks</div>
                <div className="text-sm opacity-75">We'll handle it ourselves</div>
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's set up bill reminders</h2>
              <p className="text-gray-600">We'll calculate when your next payments are due</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly rent amount (optional)
                </label>
                <input
                  type="text"
                  value={data.rentAmount}
                  onChange={(e) => setData({ ...data, rentAmount: e.target.value })}
                  placeholder="e.g., $1200"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When did you last pay utilities?
                </label>
                <input
                  type="date"
                  value={data.lastUtilityPayment}
                  onChange={(e) => setData({ ...data, lastUtilityPayment: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-700 text-sm">
                  💡 We'll automatically calculate your next payment dates and send you friendly reminders!
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return data.homeName.trim().length > 0;
      case 3:
        return data.roommates > 0;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              step === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              canProceed()
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{step === totalSteps ? 'Complete Setup' : 'Next'}</span>
            {step === totalSteps ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;