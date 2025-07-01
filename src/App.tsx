import React, { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import OnboardingScreen from './components/OnboardingScreen';

function App() {
  const { user, loading } = useAuth();
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

  const handleOnboardingComplete = (data: any) => {
    console.log('Onboarding completed with data:', data);
    localStorage.setItem('homequest_onboarded', 'true');
    setShowOnboarding(false);
    
    // TODO: Save onboarding data to Firebase
    // This would include creating schedules, setting up bills, etc.
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