import React, { useState } from 'react';
import { Plus, Check, X, List as ListIcon } from 'lucide-react';

interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

interface List {
  id: string;
  name: string;
  items: ListItem[];
}

interface ListTabProps {
  lists: List[];
}

const ListTab: React.FC<ListTabProps> = ({ lists: initialLists }) => {
  const [lists, setLists] = useState(initialLists);
  const [newItemText, setNewItemText] = useState('');
  const [activeListId, setActiveListId] = useState(initialLists[0]?.id || '');

  const toggleItem = (listId: string, itemId: string) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              )
            }
          : list
      )
    );
  };

  const addItem = (listId: string) => {
    if (!newItemText.trim()) return;

    const newItem: ListItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false
    };

    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? { ...list, items: [...list.items, newItem] }
          : list
      )
    );

    setNewItemText('');
  };

  const removeItem = (listId: string, itemId: string) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? { ...list, items: list.items.filter(item => item.id !== itemId) }
          : list
      )
    );
  };

  const activeList = lists.find(list => list.id === activeListId);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <ListIcon className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Smart Lists</h2>
      </div>

      {/* List Selector */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 shadow-sm ${
                activeListId === list.id
                  ? 'bg-pink-500 text-white scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {list.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active List */}
      {activeList && (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{activeList.name}</h3>
          
          {/* Add Item */}
          <div className="flex space-x-3 mb-6">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem(activeList.id)}
              placeholder="Add new item..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-xl"
            />
            <button
              onClick={() => addItem(activeList.id)}
              className="bg-pink-500 text-white p-3 rounded-xl hover:bg-pink-600 transition-all duration-300 shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {activeList.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 ${
                  item.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <button
                  onClick={() => toggleItem(activeList.id, item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    item.completed
                      ? 'bg-green-500 border-green-500 scale-110'
                      : 'border-gray-400 hover:border-gray-600'
                  }`}
                >
                  {item.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                <span
                  className={`flex-1 transition-all duration-300 ${
                    item.completed
                      ? 'text-green-700 line-through opacity-75'
                      : 'text-gray-900'
                  }`}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => removeItem(activeList.id, item.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {activeList.items.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg">No items in this list yet.</p>
              <p className="text-sm opacity-75">Add your first item above!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListTab;