import React from 'react';
import { Trophy, CheckCircle, Flame, Clock, Activity, Star, Plus, Sparkles } from 'lucide-react';

interface FeedItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  xp: number;
}

interface Chore {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  dueDate: string;
  category: string;
}

interface HomeTabProps {
  feed: FeedItem[];
  chores: Chore[];
  onChoreComplete: (choreId: string, xpReward: number) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ feed, chores, onChoreComplete }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'chore_complete':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'streak':
        return <Flame className="w-6 h-6 text-orange-500" />;
      default:
        return <Clock className="w-6 h-6 text-blue-500" />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 'chore_complete':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'streak':
        return 'from-orange-50 to-red-50 border-orange-200';
      default:
        return 'from-blue-50 to-purple-50 border-blue-200';
    }
  };

  const pendingChores = chores.filter(chore => !chore.completed).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
            <p className="text-gray-600">You have {pendingChores.length} tasks waiting for you</p>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-center">
            <div className="bg-blue-100 rounded-xl p-3 w-fit mx-auto mb-3">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Add Chore</h3>
            <p className="text-sm text-gray-600 mt-1">Create new task</p>
          </div>
        </button>
        <button className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-center">
            <div className="bg-green-100 rounded-xl p-3 w-fit mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">View Stats</h3>
            <p className="text-sm text-gray-600 mt-1">Check progress</p>
          </div>
        </button>
      </div>

      {/* Today's Tasks Preview */}
      {pendingChores.length > 0 && (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Today's Tasks</h3>
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
              {pendingChores.length} pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingChores.map((chore) => (
              <div key={chore.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{chore.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">{chore.category}</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-yellow-600 font-medium">+{chore.xpReward} XP</span>
                  </div>
                </div>
                <button
                  onClick={() => onChoreComplete(chore.id, chore.xpReward)}
                  className="bg-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        </div>

        <div className="space-y-4">
          {feed.map((item) => (
            <div
              key={item.id}
              className={`bg-gradient-to-r backdrop-blur-xl border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${getGradient(item.type)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1 bg-white/80 rounded-xl p-2 shadow-sm">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <span className="text-sm text-gray-500 bg-white/60 px-2 py-1 rounded-full">
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                  {item.xp > 0 && (
                    <div className="mt-3 inline-flex items-center space-x-2 bg-yellow-100 rounded-full px-3 py-1 text-sm">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-700">+{item.xp} XP</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {feed.length === 0 && (
          <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h4>
            <p className="text-gray-600">Complete some tasks to see your progress here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeTab;