import React, { useState, useEffect } from 'react';
import { CheckSquare, CreditCard, List, Activity, User, LogOut, Menu, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMockData } from '../hooks/useMockData';
import XPBar from './XPBar';
import ChoresTab from './tabs/ChoresTab';
import BillsTab from './tabs/BillsTab';
import ListTab from './tabs/ListTab';
import FeedTab from './tabs/FeedTab';
import ProfileTab from './tabs/ProfileTab';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chores');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { logout } = useAuth();
  const { data, loading, updateChore, updateUserXP } = useMockData();

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
    { id: 'chores', label: 'Chores', icon: CheckSquare },
    { id: 'bills', label: 'Bills', icon: CreditCard },
    { id: 'list', label: 'List', icon: List },
    { id: 'feed', label: 'Feed', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chores':
        return <ChoresTab chores={data.chores} onChoreComplete={handleChoreComplete} />;
      case 'bills':
        return <BillsTab bills={data.bills} />;
      case 'list':
        return <ListTab lists={data.lists} />;
      case 'feed':
        return <FeedTab feed={data.feed} />;
      case 'profile':
        return <ProfileTab user={data.user} onLogout={logout} />;
      default:
        return <ChoresTab chores={data.chores} onChoreComplete={handleChoreComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 shadow-lg">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Install HomeQuest for better experience</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleInstallClick}
                className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-white/80 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl"></div>
        <div className="relative px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                HomeQuest
              </h1>
              <p className="text-purple-200 text-sm mt-1">Level up your daily life</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
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

      {/* Tab Content */}
      <div className="px-6 pb-24 pt-4">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation - Redesigned to be much smaller and sleeker */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-4 mb-4">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
            <div className="flex justify-around items-center">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">{tab.label}</span>
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