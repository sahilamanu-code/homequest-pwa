import React, { useState, useEffect } from 'react';
import { CheckSquare, CreditCard, List, Activity, User, LogOut, Menu } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="bg-indigo-600 text-white p-4 text-center">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <span className="text-sm">Install HomeQuest for a better experience</span>
            <div className="space-x-2">
              <button
                onClick={handleInstallClick}
                className="bg-white text-indigo-600 px-3 py-1 rounded text-sm font-medium"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-indigo-200 hover:text-white text-sm"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">HomeQuest</h1>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-6 h-6" />
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
      <div className="px-4 pb-20">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;