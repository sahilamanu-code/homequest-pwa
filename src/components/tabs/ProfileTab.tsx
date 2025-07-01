import React from 'react';
import { User, Mail, Trophy, Calendar, LogOut, Settings, Camera, Crown, Star } from 'lucide-react';

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
  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first chore', unlocked: true, icon: '🎯' },
    { id: 2, name: 'Streak Master', description: 'Maintain a 7-day streak', unlocked: true, icon: '🔥' },
    { id: 3, name: 'Level Up', description: 'Reach level 10', unlocked: true, icon: '⭐' },
    { id: 4, name: 'Consistent', description: 'Complete 50 chores', unlocked: false, icon: '💪' },
    { id: 5, name: 'Dedicated', description: 'Maintain a 30-day streak', unlocked: false, icon: '🏆' },
    { id: 6, name: 'Master', description: 'Reach level 25', unlocked: false, icon: '👑' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Crown className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Profile</h2>
      </div>

      {/* Profile Header */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-purple-400/50 shadow-2xl">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
            <p className="text-purple-200 flex items-center space-x-2 mb-4">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <Trophy className="w-4 h-4" />
                <span className="font-bold">Level {user.level}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <Flame className="w-4 h-4" />
                <span className="font-bold">{user.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {user.xp.toLocaleString()}
            </div>
            <div className="text-purple-200 font-medium">Total XP</div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {user.level}
            </div>
            <div className="text-purple-200 font-medium">Current Level</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span>Achievements</span>
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 shadow-lg'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg'
                    : 'bg-gray-600'
                }`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">{achievement.name}</h4>
                <p className="text-purple-200 text-sm">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  Unlocked
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Settings</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 text-left">
            <Settings className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">App Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-red-500/10 text-red-400 transition-all duration-300 text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;