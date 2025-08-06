import React, { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // In a real app, this would involve a call to a server
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const value = { isLoggedIn, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create a custom hook to use the auth context easily
export function useAuth() {
  return useContext(AuthContext);
}