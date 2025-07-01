import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';

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
      {/* List Selector */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Lists</h2>
        <div className="flex space-x-2 overflow-x-auto">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeListId === list.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {list.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active List */}
      {activeList && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{activeList.name}</h3>
          
          {/* Add Item */}
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem(activeList.id)}
              placeholder="Add new item..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={() => addItem(activeList.id)}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {activeList.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  item.completed
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                <button
                  onClick={() => toggleItem(activeList.id, item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {item.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                <span
                  className={`flex-1 ${
                    item.completed
                      ? 'text-gray-500 line-through'
                      : 'text-gray-900'
                  }`}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => removeItem(activeList.id, item.id)}
                  className="text-red-500 hover:text-red-700 p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {activeList.items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No items in this list yet.</p>
              <p className="text-sm">Add your first item above!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListTab;