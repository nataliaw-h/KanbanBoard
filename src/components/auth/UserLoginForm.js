import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/AuthForm.css';
import { auth, googleProvider } from '../../firebase'; // make sure the path is correct
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Navigate } from 'react-router-dom';


const UserLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form fields
    if (!email || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    // Log in the user
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // User logged in successfully
        setEmail('');
        setPassword('');
        setErrorMessage('');
        setIsAuthenticated(true);
      })
      .catch((e) => setErrorMessage(e.message));
  };

  const handleLoginWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        // User logged in successfully
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.log('Error logging in with Google:', error);
      });
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }


  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="login-button">Login</button>
          <Link to="/register" className="sign-in-link">
            <button className="sign-in-button">Sign In</button>
          </Link>
        </div>
        <div>
          <button className="google-login-button" onClick={handleLoginWithGoogle}>
          <img src="/google_logo.png" alt="Google Logo" className="google-logo" />Login with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserLoginForm;
