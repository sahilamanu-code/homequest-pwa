import React, { useState } from 'react';
import { User, Mail, Trophy, Calendar, LogOut, Settings, Camera, Crown, Star, Flame, ChevronRight, Bell, Shield, Globe, Smartphone, CreditCard, HelpCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  xpToNextLevel: number;
  streak: number;
  avatar: string;
}

interface ProfileTabProps {
  user: User;
  onLogout: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first chore', unlocked: true, icon: '🎯' },
    { id: 2, name: 'Streak Master', description: 'Maintain a 7-day streak', unlocked: true, icon: '🔥' },
    { id: 3, name: 'Level Up', description: 'Reach level 10', unlocked: true, icon: '⭐' },
    { id: 4, name: 'Consistent', description: 'Complete 50 chores', unlocked: false, icon: '💪' },
    { id: 5, name: 'Dedicated', description: 'Maintain a 30-day streak', unlocked: false, icon: '🏆' },
    { id: 6, name: 'Master', description: 'Reach level 25', unlocked: false, icon: '👑' },
  ];

  const settingsOptions = [
    {
      category: 'Account',
      items: [
        { icon: User, label: 'Personal information', description: 'Provide personal details and how we can reach you' },
        { icon: Shield, label: 'Login & security', description: 'Update your password and secure your account' },
        { icon: CreditCard, label: 'Payments & payouts', description: 'Review payments, payouts, coupons, and gift cards' },
        { icon: Bell, label: 'Notifications', description: 'Choose notification preferences and how you want to be contacted' },
        { icon: Globe, label: 'Privacy & sharing', description: 'Manage your personal data, connected services, and data sharing settings' },
      ]
    },
    {
      category: 'Hosting',
      items: [
        { icon: Settings, label: 'Professional hosting tools', description: 'Get professional tools if you manage several properties on HomeQuest' },
        { icon: Smartphone, label: 'HomeQuest your home', description: 'Add your home to HomeQuest and start earning' },
      ]
    },
    {
      category: 'Support',
      items: [
        { icon: HelpCircle, label: 'Get help', description: 'Visit our Help Center or contact us' },
        { icon: Star, label: 'Give us feedback', description: 'Share feedback about your experience' },
      ]
    }
  ];

  if (showSettings) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        </div>

        {/* Settings Categories */}
        <div className="space-y-8">
          {settingsOptions.map((category) => (
            <div key={category.category}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden">
                {category.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className={`w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition-all duration-200 text-left ${
                        index !== category.items.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="bg-gray-100 rounded-xl p-2">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{item.label}</h4>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sign Out */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-4 p-4 hover:bg-red-50 text-red-600 transition-all duration-200 text-left rounded-2xl"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Crown className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
      </div>

      {/* Profile Header - Mobile Responsive */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-pink-200 shadow-lg">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-pink-500 text-white p-2 rounded-xl hover:bg-pink-600 transition-all duration-300 shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
            <p className="text-gray-600 flex items-center justify-center sm:justify-start space-x-2 mb-4">
              <Mail className="w-4 h-4" />
              <span className="break-all">{user.email}</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl shadow-sm">
                <Trophy className="w-4 h-4" />
                <span className="font-bold">Level {user.level}</span>
              </div>
              <div className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-xl shadow-sm">
                <Flame className="w-4 h-4" />
                <span className="font-bold">{user.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats - Mobile Responsive Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {user.xp.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium text-sm sm:text-base">Total XP</div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {user.level}
            </div>
            <div className="text-gray-600 font-medium text-sm sm:text-base">Current Level</div>
          </div>
        </div>
      </div>

      {/* Achievements - Mobile Responsive */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span>Achievements</span>
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                achievement.unlocked
                  ? 'bg-green-50 border-green-200 shadow-sm'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0 ${
                  achievement.unlocked
                    ? 'bg-green-100 shadow-sm'
                    : 'bg-gray-200'
                }`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">{achievement.name}</h4>
                <p className="text-gray-600 text-xs sm:text-sm">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <div className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                  Unlocked
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings - Airbnb Style */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Settings</h3>
        <div className="space-y-1">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-gray-100 transition-all duration-300 text-left"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900 font-medium text-sm sm:text-base">Account settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-300 text-left"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm sm:text-base">Log out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;