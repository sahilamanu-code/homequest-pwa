import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';

function App() {
  const { user, loading } = useAuth();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthScreen />;
}

export default App;