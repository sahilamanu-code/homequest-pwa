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
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {level}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Level {level}</h3>
            <p className="text-purple-200 text-sm">{currentXP.toLocaleString()} XP</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-white/10 rounded-xl px-3 py-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">{streak}</span>
          <span className="text-xs text-purple-200">day streak</span>
        </div>
      </div>
      
      <div className="relative">
        <div className="bg-white/20 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 h-full rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
            style={{ width: `${xpProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-purple-200 font-medium">{currentXP % 1000} XP</span>
          <span className="text-purple-200">{xpToNextLevel} XP to level {level + 1}</span>
        </div>
      </div>
    </div>
  );
};

export default XPBar;