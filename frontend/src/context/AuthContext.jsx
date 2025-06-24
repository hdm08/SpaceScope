// for managing user authentication state using Firebase Authentication.
// It leverages React's Context API and Hooks (useState, useEffect, useContext) 
// to provide the current authenticated user's information to any component in your
// application without prop drilling.

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import axios from 'axios';

// Context object is created, it has  component provider and consumer
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userAllergens, setUserAllergens] = useState([]); // Store allergenPreferences

  // It's an observer that listens for changes in the user's sign-in state. 
  // onAuthStateChanged expects a function as the second argument, 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // to clean up the listener when the component unmounts.
    return () => unsubscribe();
  }, []);

  // all the consumer inside AuthContext will have access to user information
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
