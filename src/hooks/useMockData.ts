import { useState, useEffect } from 'react';

interface MockData {
  user: {
    id: string;
    name: string;
    email: string;
    xp: number;
    level: number;
    xpToNextLevel: number;
    streak: number;
    avatar: string;
  };
  chores: Array<{
    id: string;
    title: string;
    description: string;
    xpReward: number;
    completed: boolean;
    dueDate: string;
    category: string;
  }>;
  bills: Array<{
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    status: string;
    category: string;
  }>;
  lists: Array<{
    id: string;
    name: string;
    items: Array<{
      id: string;
      text: string;
      completed: boolean;
    }>;
  }>;
  feed: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    xp: number;
  }>;
}

export const useMockData = () => {
  const [data, setData] = useState<MockData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/mock.json');
        const mockData = await response.json();
        setData(mockData);
      } catch (error) {
        console.error('Error fetching mock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateChore = (choreId: string, updates: any) => {
    if (!data) return;
    
    setData(prevData => ({
      ...prevData!,
      chores: prevData!.chores.map(chore => 
        chore.id === choreId ? { ...chore, ...updates } : chore
      )
    }));
  };

  const updateUserXP = (xpGain: number) => {
    if (!data) return;
    
    setData(prevData => ({
      ...prevData!,
      user: {
        ...prevData!.user,
        xp: prevData!.user.xp + xpGain
      }
    }));
  };

  return { data, loading, updateChore, updateUserXP };
};