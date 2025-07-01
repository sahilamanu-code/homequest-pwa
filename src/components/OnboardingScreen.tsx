import React, { useState } from 'react';
import { Home, Users, Calendar, Sparkles, ArrowRight, Check, DollarSign, CreditCard } from 'lucide-react';

interface OnboardingData {
  homeName: string;
  roommates: number;
  needsLaundrySchedule: boolean;
  address: string;
  bills: {
    rent: { enabled: boolean; amount: string; dueDate: string };
    utilities: { enabled: boolean; amount: string; lastPaid: string };
    custom: Array<{ name: string; amount: string; dueDate: string }>;
  };
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
    address: '',
    bills: {
      rent: { enabled: false, amount: '', dueDate: '' },
      utilities: { enabled: false, amount: '', lastPaid: '' },
      custom: []
    }
  });

  const totalSteps = 7;

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

  const addCustomBill = () => {
    setData(prev => ({
      ...prev,
      bills: {
        ...prev.bills,
        custom: [...prev.bills.custom, { name: '', amount: '', dueDate: '' }]
      }
    }));
  };

  const updateCustomBill = (index: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      bills: {
        ...prev.bills,
        custom: prev.bills.custom.map((bill, i) => 
          i === index ? { ...bill, [field]: value } : bill
        )
      }
    }));
  };

  const removeCustomBill = (index: number) => {
    setData(prev => ({
      ...prev,
      bills: {
        ...prev.bills,
        custom: prev.bills.custom.filter((_, i) => i !== index)
      }
    }));
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
                  <p className="text-blue-700 text-sm">Home details, schedules, bills, and smart reminders</p>
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
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Where is your home?</h2>
              <p className="text-gray-600">We'll use this for weather and local features</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                placeholder="e.g., New York, NY or London, UK"
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-700 text-sm">
                  🌤️ We'll show you local weather and can suggest seasonal tasks!
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Which bills should we track?</h2>
              <p className="text-gray-600">Select the bills you want reminders for</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setData(prev => ({
                    ...prev,
                    bills: { ...prev.bills, rent: { ...prev.bills.rent, enabled: !prev.bills.rent.enabled } }
                  }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-3 ${
                    data.bills.rent.enabled
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl">🏠</div>
                  <div className="text-left">
                    <div className="font-semibold">Rent/Mortgage</div>
                    <div className="text-sm opacity-75">Monthly housing payment</div>
                  </div>
                  {data.bills.rent.enabled && <Check className="w-5 h-5 ml-auto" />}
                </button>

                <button
                  onClick={() => setData(prev => ({
                    ...prev,
                    bills: { ...prev.bills, utilities: { ...prev.bills.utilities, enabled: !prev.bills.utilities.enabled } }
                  }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-3 ${
                    data.bills.utilities.enabled
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl">⚡</div>
                  <div className="text-left">
                    <div className="font-semibold">Utilities</div>
                    <div className="text-sm opacity-75">Electric, water, gas, internet</div>
                  </div>
                  {data.bills.utilities.enabled && <Check className="w-5 h-5 ml-auto" />}
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={addCustomBill}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-300"
                >
                  + Add Custom Bill
                </button>
                
                {data.bills.custom.map((bill, index) => (
                  <div key={index} className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                      type="text"
                      placeholder="Bill name (e.g., Phone, Insurance)"
                      value={bill.name}
                      onChange={(e) => updateCustomBill(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm mb-2"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Amount"
                        value={bill.amount}
                        onChange={(e) => updateCustomBill(index, 'amount', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                      />
                      <input
                        type="date"
                        value={bill.dueDate}
                        onChange={(e) => updateCustomBill(index, 'dueDate', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => removeCustomBill(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bill details</h2>
              <p className="text-gray-600">Let's set up your selected bills</p>
            </div>
            <div className="space-y-4">
              {data.bills.rent.enabled && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-3">🏠 Rent/Mortgage</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Monthly amount (e.g., $1200)"
                      value={data.bills.rent.amount}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        bills: { ...prev.bills, rent: { ...prev.bills.rent, amount: e.target.value } }
                      }))}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg"
                    />
                    <input
                      type="date"
                      value={data.bills.rent.dueDate}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        bills: { ...prev.bills, rent: { ...prev.bills.rent, dueDate: e.target.value } }
                      }))}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {data.bills.utilities.enabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <h3 className="font-semibold text-green-900 mb-3">⚡ Utilities</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Average monthly amount (e.g., $150)"
                      value={data.bills.utilities.amount}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        bills: { ...prev.bills, utilities: { ...prev.bills.utilities, amount: e.target.value } }
                      }))}
                      className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg"
                    />
                    <input
                      type="date"
                      value={data.bills.utilities.lastPaid}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        bills: { ...prev.bills, utilities: { ...prev.bills.utilities, lastPaid: e.target.value } }
                      }))}
                      className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg"
                    />
                    <p className="text-green-700 text-sm">
                      💡 We'll calculate your next payment date automatically!
                    </p>
                  </div>
                </div>
              )}
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
        return data.address.trim().length > 0;
      case 6:
        return true;
      case 7:
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