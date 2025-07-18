import React, { useState, useEffect } from 'react';
import { CheckSquare, CreditCard, List, User, LogOut, Menu, Download, Home, Plus, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFirestoreData } from '../hooks/useFirestoreData';
import XPBar from './XPBar';
import ChoresTab from './tabs/ChoresTab';
import BillsTab from './tabs/BillsTab';
import ListTab from './tabs/ListTab';
import ProfileTab from './tabs/ProfileTab';
import HomeTab from './tabs/HomeTab';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { logout } = useAuth();
  const { data, loading, error, clearError, updateChore, updateUserXP, createInitialData } = useFirestoreData();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    // Create initial data if user has no data
    if (data && data.chores.length === 0 && data.lists.length === 0 && data.feed.length === 0) {
      createInitialData();
    }
  }, [data, createInitialData]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleChoreComplete = (choreId: string, xpReward: number) => {
    updateChore(choreId, { completed: true });
    updateUserXP(xpReward);
    
    // Emit custom event
    const event = new CustomEvent('chore:complete', {
      detail: { choreId, xpReward }
    });
    window.dispatchEvent(event);
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chores', label: 'Chores', icon: CheckSquare },
    { id: 'bills', label: 'Bills', icon: CreditCard },
    { id: 'list', label: 'List', icon: List },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (loading || !data || !data.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab feed={data.feed} chores={data.chores} onChoreComplete={handleChoreComplete} user={data.user} />;
      case 'chores':
        return <ChoresTab chores={data.chores} onChoreComplete={handleChoreComplete} />;
      case 'bills':
        return <BillsTab bills={data.bills} />;
      case 'list':
        return <ListTab lists={data.lists} />;
      case 'profile':
        return <ProfileTab user={data.user} onLogout={logout} />;
      default:
        return <HomeTab feed={data.feed} chores={data.chores} onChoreComplete={handleChoreComplete} user={data.user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-800 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base">Firebase Permission Error</p>
                <p className="text-xs sm:text-sm text-red-600 mt-1 break-words">{error}</p>
                <p className="text-xs text-red-500 mt-2">
                  Please ensure your Firebase Security Rules allow authenticated users to read/write their own data.
                </p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 text-gray-800 p-3 shadow-lg">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center space-x-2 min-w-0">
              <Download className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <span className="text-sm font-medium truncate">Install HomeQuest for better experience</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={handleInstallClick}
                className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-pink-600 transition-all shadow-lg"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-gray-500 hover:text-gray-700 text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header - Mobile Responsive */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"></div>
        <div className="relative px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                HomeQuest
              </h1>
              <p className="text-gray-600 text-sm mt-1">Level up your daily life</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 backdrop-blur-sm flex-shrink-0"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <XPBar
            currentXP={data.user.xp}
            level={data.user.level}
            xpToNextLevel={data.user.xpToNextLevel}
            streak={data.user.streak}
          />
        </div>
      </div>

      {/* Tab Content - Mobile Responsive Padding */}
      <div className="px-4 sm:px-6 pb-24 pt-4">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation - Mobile Responsive */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-2 sm:mx-4 mb-2 sm:mb-4">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-2 shadow-xl">
            <div className="flex justify-around items-center">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all duration-300 min-w-0 ${
                      isActive
                        ? 'bg-pink-500 text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                    <span className="text-xs font-medium truncate">{tab.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;