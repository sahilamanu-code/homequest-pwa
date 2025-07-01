import React from 'react';
import { User, Mail, Trophy, Calendar, LogOut, Settings, Camera } from 'lucide-react';

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
    { id: 1, name: 'First Steps', description: 'Complete your first chore', unlocked: true },
    { id: 2, name: 'Streak Master', description: 'Maintain a 7-day streak', unlocked: true },
    { id: 3, name: 'Level Up', description: 'Reach level 10', unlocked: true },
    { id: 4, name: 'Consistent', description: 'Complete 50 chores', unlocked: false },
    { id: 5, name: 'Dedicated', description: 'Maintain a 30-day streak', unlocked: false },
    { id: 6, name: 'Master', description: 'Reach level 25', unlocked: false },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600 flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Level {user.level}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">{user.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{user.xp.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total XP</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{user.level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
        <div className="grid grid-cols-1 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                achievement.unlocked
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.unlocked
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                <Trophy className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <div className="text-green-600 font-medium text-sm">Unlocked</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900">App Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;