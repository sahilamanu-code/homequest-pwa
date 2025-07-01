import React from 'react';
import { Star, Trophy } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  level: number;
  xpToNextLevel: number;
  streak: number;
}

const XPBar: React.FC<XPBarProps> = ({ currentXP, level, xpToNextLevel, streak }) => {
  const xpProgress = ((currentXP % 1000) / 1000) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-10 h-10 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Level {level}</h3>
            <p className="text-sm text-gray-600">{currentXP} XP</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">{streak} day streak</span>
        </div>
      </div>
      
      <div className="relative">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>{currentXP % 1000} XP</span>
          <span>{xpToNextLevel} XP to next level</span>
        </div>
      </div>
    </div>
  );
};

export default XPBar;