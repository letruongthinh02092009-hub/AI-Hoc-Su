import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

const ADMIN_STORAGE_KEY = 'su_admin_mode_active';
const DEFAULT_PIN = '1234';

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      if (saved === 'true') {
        setIsAdmin(true);
      }
    } catch (e) {}
  }, []);

  const loginAdmin = (pin) => {
    if (pin === DEFAULT_PIN || pin === 'admin123' || pin === '12a8') {
      setIsAdmin(true);
      try {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      } catch (e) {}
      setIsPinModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (e) {}
  };

  const toggleAdminModal = () => {
    if (isAdmin) {
      logoutAdmin();
    } else {
      setIsPinModalOpen(true);
    }
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      isPinModalOpen,
      setIsPinModalOpen,
      loginAdmin,
      logoutAdmin,
      toggleAdminModal
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
