import React from 'react';
import { Trophy, CheckCircle, Flame, Clock, Activity } from 'lucide-react';

interface FeedItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  xp: number;
}

interface FeedTabProps {
  feed: FeedItem[];
}

const FeedTab: React.FC<FeedTabProps> = ({ feed }) => {
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
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 'chore_complete':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'streak':
        return <Flame className="w-6 h-6 text-orange-400" />;
      default:
        return <Clock className="w-6 h-6 text-purple-400" />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'chore_complete':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'streak':
        return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
      default:
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Activity Feed</h2>
      </div>

      <div className="space-y-4">
        {feed.map((item) => (
          <div
            key={item.id}
            className={`bg-gradient-to-r backdrop-blur-xl border rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition-all duration-300 ${getGradient(item.type)}`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1 bg-white/10 rounded-xl p-2">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-lg">{item.title}</h3>
                  <span className="text-sm text-purple-300 bg-white/10 px-3 py-1 rounded-full">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                <p className="text-purple-100 leading-relaxed">{item.description}</p>
                {item.xp > 0 && (
                  <div className="mt-3 inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-4 py-2 text-sm shadow-lg">
                    <Trophy className="w-4 h-4 text-white" />
                    <span className="font-bold text-white">+{item.xp} XP</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {feed.length === 0 && (
        <div className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">No activity yet</h3>
          <p className="text-purple-200">Complete some quests to see your progress here!</p>
        </div>
      )}
    </div>
  );
};

export default FeedTab;