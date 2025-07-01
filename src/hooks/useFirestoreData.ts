import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  xpToNextLevel: number;
  streak: number;
  avatar: string;
  address?: string;
  homeName?: string;
  roommates?: number;
}

interface Chore {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  dueDate: string;
  category: string;
  userId: string;
  createdAt: Timestamp;
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: string;
  category: string;
  userId: string;
  recurring: boolean;
  createdAt: Timestamp;
}

interface List {
  id: string;
  name: string;
  items: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  userId: string;
  createdAt: Timestamp;
}

interface FeedItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  xp: number;
  userId: string;
  createdAt: Timestamp;
}

interface FirestoreData {
  user: User | null;
  chores: Chore[];
  bills: Bill[];
  lists: List[];
  feed: FeedItem[];
}

export const useFirestoreData = () => {
  const [data, setData] = useState<FirestoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (!authUser) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchUserData = async () => {
      try {
        setError(null);
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        let userData: User;

        if (!userDoc.exists()) {
          // Create new user document
          userData = {
            id: authUser.uid,
            name: authUser.displayName || 'User',
            email: authUser.email || '',
            xp: 0,
            level: 1,
            xpToNextLevel: 100,
            streak: 0,
            avatar: authUser.photoURL || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
          };
          await setDoc(doc(db, 'users', authUser.uid), userData);
        } else {
          const existingData = userDoc.data();
          // Ensure all numeric properties have default values if missing or undefined
          userData = {
            id: authUser.uid,
            name: existingData.name || authUser.displayName || 'User',
            email: existingData.email || authUser.email || '',
            xp: typeof existingData.xp === 'number' ? existingData.xp : 0,
            level: typeof existingData.level === 'number' ? existingData.level : 1,
            xpToNextLevel: typeof existingData.xpToNextLevel === 'number' ? existingData.xpToNextLevel : 100,
            streak: typeof existingData.streak === 'number' ? existingData.streak : 0,
            avatar: existingData.avatar || authUser.photoURL || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            address: existingData.address,
            homeName: existingData.homeName,
            roommates: existingData.roommates
          };
          
          // Update the document with default values if any were missing
          if (typeof existingData.xp !== 'number' || 
              typeof existingData.level !== 'number' || 
              typeof existingData.xpToNextLevel !== 'number' || 
              typeof existingData.streak !== 'number') {
            await updateDoc(doc(db, 'users', authUser.uid), {
              xp: userData.xp,
              level: userData.level,
              xpToNextLevel: userData.xpToNextLevel,
              streak: userData.streak
            });
          }
        }

        setData(prevData => ({
          ...prevData!,
          user: userData
        }));
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        if (error.code === 'permission-denied') {
          setError('Permission denied. Please check your Firebase security rules.');
        } else {
          setError('Failed to load user data. Please try again.');
        }
      }
    };

    const setupRealtimeListeners = () => {
      const unsubscribers: (() => void)[] = [];

      // Helper function to create listener with fallback
      const createListenerWithFallback = async (
        collectionName: string,
        dataKey: keyof FirestoreData,
        retryCount = 0
      ) => {
        try {
          const q = query(
            collection(db, collectionName),
            where('userId', '==', authUser.uid),
            orderBy('createdAt', 'desc')
          );
          
          const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setData(prevData => ({
                ...prevData!,
                [dataKey]: items
              }));
            },
            (error) => {
              console.error(`Error in ${collectionName} listener:`, error);
              
              // If it's an index error and we haven't retried too many times
              if (error.message.includes('index') && retryCount < 3) {
                console.log(`Retrying ${collectionName} listener in 5 seconds...`);
                setTimeout(() => {
                  createListenerWithFallback(collectionName, dataKey, retryCount + 1);
                }, 5000);
              } else if (error.code === 'permission-denied') {
                setError(`Permission denied accessing ${collectionName}. Please check your Firebase security rules.`);
              } else if (error.message.includes('index')) {
                // For index errors, try a simpler query without ordering
                console.log(`Falling back to simple query for ${collectionName}`);
                const simpleQuery = query(
                  collection(db, collectionName),
                  where('userId', '==', authUser.uid)
                );
                
                const fallbackUnsubscribe = onSnapshot(
                  simpleQuery,
                  (snapshot) => {
                    const items = snapshot.docs.map(doc => ({
                      id: doc.id,
                      ...doc.data()
                    }));
                    // Sort manually by createdAt
                    items.sort((a: any, b: any) => {
                      const aTime = a.createdAt?.toMillis() || 0;
                      const bTime = b.createdAt?.toMillis() || 0;
                      return bTime - aTime;
                    });
                    setData(prevData => ({
                      ...prevData!,
                      [dataKey]: items
                    }));
                  },
                  (fallbackError) => {
                    console.error(`Fallback error for ${collectionName}:`, fallbackError);
                    setError(`Failed to load ${collectionName}. Please refresh the page.`);
                  }
                );
                unsubscribers.push(fallbackUnsubscribe);
              }
            }
          );
          
          unsubscribers.push(unsubscribe);
        } catch (error: any) {
          console.error(`Error setting up ${collectionName} listener:`, error);
          setError(`Failed to set up ${collectionName} listener. Please refresh the page.`);
        }
      };

      // Set up listeners for each collection
      createListenerWithFallback('chores', 'chores');
      createListenerWithFallback('bills', 'bills');
      createListenerWithFallback('lists', 'lists');
      createListenerWithFallback('feed', 'feed');

      return () => {
        unsubscribers.forEach(unsub => unsub());
      };
    };

    const initializeData = async () => {
      setLoading(true);
      setError(null);
      
      // Initialize data structure
      setData({
        user: null,
        chores: [],
        bills: [],
        lists: [],
        feed: []
      });

      await fetchUserData();
      const cleanup = setupRealtimeListeners();
      setLoading(false);

      return cleanup;
    };

    const cleanup = initializeData();

    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, [authUser]);

  const updateChore = async (choreId: string, updates: Partial<Chore>) => {
    if (!authUser) return;
    
    try {
      await updateDoc(doc(db, 'chores', choreId), updates);
    } catch (error: any) {
      console.error('Error updating chore:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied updating chore. Please check your Firebase security rules.');
      }
    }
  };

  const addChore = async (choreData: Omit<Chore, 'id' | 'userId' | 'createdAt'>) => {
    if (!authUser) return;
    
    try {
      await addDoc(collection(db, 'chores'), {
        ...choreData,
        userId: authUser.uid,
        createdAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Error adding chore:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied adding chore. Please check your Firebase security rules.');
      }
    }
  };

  const updateUserXP = async (xpGain: number) => {
    if (!authUser || !data?.user) return;
    
    try {
      const newXP = data.user.xp + xpGain;
      const newLevel = Math.floor(newXP / 100) + 1;
      const xpToNextLevel = (newLevel * 100) - newXP;

      await updateDoc(doc(db, 'users', authUser.uid), {
        xp: newXP,
        level: newLevel,
        xpToNextLevel
      });

      // Add feed item for XP gain
      await addDoc(collection(db, 'feed'), {
        type: 'chore_complete',
        title: 'XP Earned!',
        description: `You earned ${xpGain} XP!`,
        timestamp: new Date().toISOString(),
        xp: xpGain,
        userId: authUser.uid,
        createdAt: Timestamp.now()
      });

      // Check for level up
      if (newLevel > data.user.level) {
        await addDoc(collection(db, 'feed'), {
          type: 'achievement',
          title: 'Level Up!',
          description: `You reached level ${newLevel}! Keep up the great work!`,
          timestamp: new Date().toISOString(),
          xp: 100,
          userId: authUser.uid,
          createdAt: Timestamp.now()
        });
      }
    } catch (error: any) {
      console.error('Error updating user XP:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied updating XP. Please check your Firebase security rules.');
      }
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!authUser) return;
    
    try {
      await updateDoc(doc(db, 'users', authUser.uid), updates);
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied updating profile. Please check your Firebase security rules.');
      }
    }
  };

  const addBill = async (billData: Omit<Bill, 'id' | 'userId' | 'createdAt'>) => {
    if (!authUser) return;
    
    try {
      await addDoc(collection(db, 'bills'), {
        ...billData,
        userId: authUser.uid,
        createdAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Error adding bill:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied adding bill. Please check your Firebase security rules.');
      }
    }
  };

  const updateBill = async (billId: string, updates: Partial<Bill>) => {
    if (!authUser) return;
    
    try {
      await updateDoc(doc(db, 'bills', billId), updates);
    } catch (error: any) {
      console.error('Error updating bill:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied updating bill. Please check your Firebase security rules.');
      }
    }
  };

  const addList = async (listData: Omit<List, 'id' | 'userId' | 'createdAt'>) => {
    if (!authUser) return;
    
    try {
      await addDoc(collection(db, 'lists'), {
        ...listData,
        userId: authUser.uid,
        createdAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Error adding list:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied adding list. Please check your Firebase security rules.');
      }
    }
  };

  const updateList = async (listId: string, updates: Partial<List>) => {
    if (!authUser) return;
    
    try {
      await updateDoc(doc(db, 'lists', listId), updates);
    } catch (error: any) {
      console.error('Error updating list:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied updating list. Please check your Firebase security rules.');
      }
    }
  };

  const createInitialData = async () => {
    if (!authUser) return;

    try {
      setError(null);
      
      // Create sample grocery list
      await addList({
        name: 'Grocery List',
        items: [
          { id: '1', text: 'Milk', completed: false },
          { id: '2', text: 'Bread', completed: false },
          { id: '3', text: 'Eggs', completed: false }
        ]
      });

      // Create sample chores
      await addChore({
        title: 'Take out trash',
        description: 'Empty all bins and take to curb',
        xpReward: 25,
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        category: 'cleaning'
      });

      await addChore({
        title: 'Load dishwasher',
        description: 'Load dirty dishes and start cycle',
        xpReward: 15,
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        category: 'kitchen'
      });

      // Add welcome feed item
      await addDoc(collection(db, 'feed'), {
        type: 'achievement',
        title: 'Welcome to HomeQuest!',
        description: 'Your journey begins now. Complete tasks to earn XP and level up!',
        timestamp: new Date().toISOString(),
        xp: 0,
        userId: authUser.uid,
        createdAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Error creating initial data:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied creating initial data. Please check your Firebase security rules.');
      } else {
        setError('Failed to create initial data. Please try again.');
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { 
    data, 
    loading, 
    error,
    clearError,
    updateChore, 
    addChore,
    updateUserXP, 
    updateUserProfile,
    addBill,
    updateBill,
    addList,
    updateList,
    createInitialData
  };
};