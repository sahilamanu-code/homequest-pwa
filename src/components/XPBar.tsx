import React from 'react';
import { Star, Trophy, Zap } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  level: number;
  xpToNextLevel: number;
  streak: number;
}

const XPBar: React.FC<XPBarProps> = ({ currentXP, level, xpToNextLevel, streak }) => {
  const xpProgress = ((currentXP % 1000) / 1000) * 100;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {level}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Level {level}</h3>
            <p className="text-gray-600 text-sm">{currentXP.toLocaleString()} XP</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-orange-100 rounded-xl px-3 py-2">
          <Zap className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-700">{streak}</span>
          <span className="text-xs text-orange-600">day streak</span>
        </div>
      </div>
      
      <div className="relative">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
            style={{ width: `${xpProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-gray-600 font-medium">{currentXP % 1000} XP</span>
          <span className="text-gray-500">{xpToNextLevel} XP to level {level + 1}</span>
        </div>
      </div>
    </div>
  );
};

export default XPBar;