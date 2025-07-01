import React from 'react';
import { CheckCircle, Clock, Star } from 'lucide-react';

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
      cleaning: 'bg-blue-100 text-blue-800',
      kitchen: 'bg-green-100 text-green-800',
      plants: 'bg-emerald-100 text-emerald-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const pendingChores = chores.filter(chore => !chore.completed);
  const completedChores = chores.filter(chore => chore.completed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Chores</h2>
        <div className="space-y-3">
          {pendingChores.map((chore) => (
            <div key={chore.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{chore.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(chore.category)}`}>
                      {chore.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{chore.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Due {formatDate(chore.dueDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{chore.xpReward} XP</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onChoreComplete(chore.id, chore.xpReward)}
                  className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Mark Done
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {completedChores.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Completed</h3>
          <div className="space-y-3">
            {completedChores.map((chore) => (
              <div key={chore.id} className="bg-gray-50 rounded-xl p-4 opacity-75">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-700 line-through">{chore.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">+{chore.xpReward} XP earned</span>
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