import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // make sure the path is correct
import './styles/AuthForm.css'

const UserLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { signIn, signInWithGoogle, errorMessage } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success } = await signIn(email, password);
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLoginWithGoogle = async () => {
    const { success } = await signInWithGoogle();
    if (success) {
      setIsAuthenticated(true);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }


  return (
    <div className="auth-form-container">
      <h2 className='title'>Login</h2>
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
            <button className="sign-in-button">Register</button>
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
