// utils/auth.js
export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('adminEmail');
  localStorage.removeItem('loginTime');
  window.location.href = '/';
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const loginTime = localStorage.getItem('loginTime');
  
  if (isLoggedIn !== 'true') return false;
  
  if (loginTime) {
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
    
    // Session expires after 24 hours
    if (hoursDiff > 24) {
      logout();
      return false;
    }
  }
  
  return true;
};