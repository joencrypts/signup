import { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          uid: firebaseUser.uid
        });
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', firebaseUser.email);
        if (firebaseUser.displayName) {
          localStorage.setItem('userName', firebaseUser.displayName);
        }
      } else {
        setUser(null);
        setResult(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, result, setResult, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext; 