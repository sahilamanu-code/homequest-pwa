import React, { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useFirestoreData } from './hooks/useFirestoreData';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import OnboardingScreen from './components/OnboardingScreen';

function App() {
  const { user, loading } = useAuth();
  const { updateUserProfile, addBill } = useFirestoreData();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Listen for custom chore complete events
    const handleChoreComplete = (event: CustomEvent) => {
      console.log('Chore completed:', event.detail);
      // Here you could add additional logic like showing notifications
    };

    window.addEventListener('chore:complete', handleChoreComplete as EventListener);

    return () => {
      window.removeEventListener('chore:complete', handleChoreComplete as EventListener);
    };
  }, []);

  useEffect(() => {
    // Check if user needs onboarding (new user)
    if (user && !localStorage.getItem('homequest_onboarded')) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = async (data: any) => {
    console.log('Onboarding completed with data:', data);
    localStorage.setItem('homequest_onboarded', 'true');
    
    try {
      // Update user profile with onboarding data
      await updateUserProfile({
        homeName: data.homeName,
        address: data.address,
        roommates: data.roommates
      });

      // Create bills based on onboarding selections
      if (data.bills.rent.enabled && data.bills.rent.amount && data.bills.rent.dueDate) {
        await addBill({
          name: 'Rent/Mortgage',
          amount: parseFloat(data.bills.rent.amount.replace(/[^0-9.]/g, '')),
          dueDate: data.bills.rent.dueDate,
          status: 'pending',
          category: 'housing',
          recurring: true
        });
      }

      if (data.bills.utilities.enabled && data.bills.utilities.amount && data.bills.utilities.lastPaid) {
        // Calculate next utility payment date (assuming monthly)
        const lastPaid = new Date(data.bills.utilities.lastPaid);
        const nextDue = new Date(lastPaid);
        nextDue.setMonth(nextDue.getMonth() + 1);
        
        await addBill({
          name: 'Utilities',
          amount: parseFloat(data.bills.utilities.amount.replace(/[^0-9.]/g, '')),
          dueDate: nextDue.toISOString().split('T')[0],
          status: 'pending',
          category: 'utilities',
          recurring: true
        });
      }

      // Add custom bills
      for (const customBill of data.bills.custom) {
        if (customBill.name && customBill.amount && customBill.dueDate) {
          await addBill({
            name: customBill.name,
            amount: parseFloat(customBill.amount.replace(/[^0-9.]/g, '')),
            dueDate: customBill.dueDate,
            status: 'pending',
            category: 'custom',
            recurring: false
          });
        }
      }

      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard />;
}

export default App;