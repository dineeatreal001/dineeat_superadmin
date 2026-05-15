// components/ProtectedRoute.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingPage from './Loading/LoadingPage';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const loginTime = localStorage.getItem('loginTime');
      
      // Optional: Check if session is expired (e.g., after 24 hours)
      if (isLoggedIn === 'true' && loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        // Session expires after 24 hours
        if (hoursDiff > 24) {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('adminEmail');
          localStorage.removeItem('loginTime');
          setIsAuthenticated(false);
          router.push('/');
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        router.push('/');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;