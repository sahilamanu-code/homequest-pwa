import React, { useState } from 'react';
import { Plus, Check, X, List as ListIcon } from 'lucide-react';
import { useFirestoreData } from '../../hooks/useFirestoreData';

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
  const [newListName, setNewListName] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);
  const { addList, updateList } = useFirestoreData();

  // Update local state when props change
  React.useEffect(() => {
    setLists(initialLists);
    if (initialLists.length > 0 && !activeListId) {
      setActiveListId(initialLists[0].id);
    }
  }, [initialLists, activeListId]);

  const toggleItem = (listId: string, itemId: string) => {
    const updatedLists = lists.map(list =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        : list
    );
    setLists(updatedLists);
    
    // Update in Firebase
    const updatedList = updatedLists.find(list => list.id === listId);
    if (updatedList) {
      updateList(listId, { items: updatedList.items });
    }
  };

  const addItem = (listId: string) => {
    if (!newItemText.trim()) return;

    const newItem: ListItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false
    };

    const updatedLists = lists.map(list =>
      list.id === listId
        ? { ...list, items: [...list.items, newItem] }
        : list
    );
    setLists(updatedLists);
    
    // Update in Firebase
    const updatedList = updatedLists.find(list => list.id === listId);
    if (updatedList) {
      updateList(listId, { items: updatedList.items });
    }

    setNewItemText('');
  };

  const removeItem = (listId: string, itemId: string) => {
    const updatedLists = lists.map(list =>
      list.id === listId
        ? { ...list, items: list.items.filter(item => item.id !== itemId) }
        : list
    );
    setLists(updatedLists);
    
    // Update in Firebase
    const updatedList = updatedLists.find(list => list.id === listId);
    if (updatedList) {
      updateList(listId, { items: updatedList.items });
    }
  };

  const createNewList = async () => {
    if (!newListName.trim()) return;

    await addList({
      name: newListName.trim(),
      items: []
    });

    setNewListName('');
    setShowNewListForm(false);
  };

  const activeList = lists.find(list => list.id === activeListId);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <ListIcon className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Smart Lists</h2>
      </div>

      {/* List Selector */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Your Lists</h3>
          <button
            onClick={() => setShowNewListForm(!showNewListForm)}
            className="bg-pink-500 text-white p-2 rounded-xl hover:bg-pink-600 transition-all duration-300 shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* New List Form */}
        {showNewListForm && (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createNewList()}
                placeholder="List name..."
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              />
              <button
                onClick={createNewList}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all text-sm font-medium"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewListForm(false)}
                className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* List Tabs - Mobile Responsive */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 shadow-sm text-sm ${
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
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{activeList.name}</h3>
          
          {/* Add Item - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-6">
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
              className="bg-pink-500 text-white p-3 rounded-xl hover:bg-pink-600 transition-all duration-300 shadow-lg sm:w-auto w-full"
            >
              <Plus className="w-5 h-5 mx-auto" />
            </button>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {activeList.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center space-x-3 p-3 rounded-xl border transition-all duration-300 ${
                  item.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <button
                  onClick={() => toggleItem(activeList.id, item.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    item.completed
                      ? 'bg-green-500 border-green-500 scale-110'
                      : 'border-gray-400 hover:border-gray-600'
                  }`}
                >
                  {item.completed && <Check className="w-3 h-3 text-white" />}
                </button>
                <span
                  className={`flex-1 transition-all duration-300 break-words ${
                    item.completed
                      ? 'text-green-700 line-through opacity-75'
                      : 'text-gray-900'
                  }`}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => removeItem(activeList.id, item.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-all duration-300 flex-shrink-0"
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

      {lists.length === 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No lists yet</h3>
          <p className="text-gray-600 mb-4">Create your first list to get started!</p>
          <button
            onClick={() => setShowNewListForm(true)}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-600 transition-all duration-300 shadow-lg"
          >
            Create List
          </button>
        </div>
      )}
    </div>
  );
};

export default ListTab;