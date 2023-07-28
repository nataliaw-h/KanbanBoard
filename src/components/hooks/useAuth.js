import { useState } from 'react';
import { auth, googleProvider } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

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

  const signUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
