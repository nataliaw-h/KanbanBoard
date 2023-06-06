import { useState } from 'react';
import { auth, googleProvider } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';

const useAuth = () => {
  const [errorMessage, setErrorMessage] = useState('');
  
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      setErrorMessage(error.message);
      return { success: false, error: error.message };
    }
  };
  
  const signUp = async (username, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      return { success: true };
    } catch (error) {
      setErrorMessage(error.message);
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (error) {
      setErrorMessage(error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    signIn,
    signUp,
    signInWithGoogle,
    errorMessage,
  };
};

export default useAuth;
