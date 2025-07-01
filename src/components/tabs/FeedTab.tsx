import React from 'react';
import { Trophy, CheckCircle, Flame, Clock } from 'lucide-react';

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
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'chore_complete':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'streak':
        return <Flame className="w-6 h-6 text-orange-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-yellow-50 border-yellow-200';
      case 'chore_complete':
        return 'bg-green-50 border-green-200';
      case 'streak':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Feed</h2>
        <div className="space-y-3">
          {feed.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl shadow-sm border p-4 ${getBackgroundColor(item.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <span className="text-sm text-gray-500">{formatTime(item.timestamp)}</span>
                  </div>
                  <p className="text-gray-700 mt-1">{item.description}</p>
                  {item.xp > 0 && (
                    <div className="mt-2 inline-flex items-center space-x-1 bg-white rounded-full px-2 py-1 text-sm">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-700">+{item.xp} XP</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {feed.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
          <p className="text-gray-600">Complete some chores to see your progress here!</p>
        </div>
      )}
    </div>
  );
};

export default FeedTab;