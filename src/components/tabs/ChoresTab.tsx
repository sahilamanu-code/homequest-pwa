import React from 'react';
import { CheckCircle, Clock, Star, Sparkles } from 'lucide-react';

interface Chore {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  dueDate: string;
  category: string;
}

interface ChoresTabProps {
  chores: Chore[];
  onChoreComplete: (choreId: string, xpReward: number) => void;
}

const ChoresTab: React.FC<ChoresTabProps> = ({ chores, onChoreComplete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      cleaning: 'from-blue-500 to-cyan-500',
      kitchen: 'from-green-500 to-emerald-500',
      plants: 'from-emerald-500 to-teal-500',
      default: 'from-gray-500 to-slate-500'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleaning':
        return '🧹';
      case 'kitchen':
        return '🍽️';
      case 'plants':
        return '🌱';
      default:
        return '📋';
    }
  };

  const pendingChores = chores.filter(chore => !chore.completed);
  const completedChores = chores.filter(chore => chore.completed);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Today's Quests</h2>
        </div>
        
        <div className="space-y-4">
          {pendingChores.map((chore) => (
            <div key={chore.id} className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getCategoryIcon(chore.category)}</span>
                    <div>
                      <h3 className="font-bold text-white text-lg">{chore.title}</h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(chore.category)} shadow-lg`}>
                        {chore.category}
                      </div>
                    </div>
                  </div>
                  <p className="text-purple-200 mb-4 leading-relaxed">{chore.description}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2 text-purple-300">
                      <Clock className="w-4 h-4" />
                      <span>Due {formatDate(chore.dueDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-lg">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{chore.xpReward} XP</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onChoreComplete(chore.id, chore.xpReward)}
                  className="ml-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:scale-110"
                >
                  Complete Quest
                </button>
              </div>
            </div>
          ))}
        </div>

        {pendingChores.length === 0 && (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">All quests completed!</h3>
            <p className="text-purple-200">You're on fire today! Check back tomorrow for new challenges.</p>
          </div>
        )}
      </div>

      {completedChores.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Completed Quests</span>
          </h3>
          <div className="space-y-3">
            {completedChores.map((chore) => (
              <div key={chore.id} className="bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-green-100 line-through">{chore.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-green-300">+{chore.xpReward} XP earned</span>
                      <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-green-400">Quest completed!</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoresTab;