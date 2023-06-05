import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './styles/AuthForm.css';
import { withTranslation } from 'react-i18next';

const UserLoginForm = ({ t }) => {
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
      <h2 className='title'>{t('userLoginForm.title')}</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label htmlFor="email">{t('userLoginForm.email')}:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{t('userLoginForm.password')}:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="login-button">{t('userLoginForm.login')}</button>
          <Link to="/register" className="sign-in-link">
            <button className="sign-in-button">{t('userLoginForm.register')}</button>
          </Link>
        </div>
        <div>
          <button className="google-login-button" onClick={handleLoginWithGoogle}>
            <img src="/google_logo.png" alt="Google Logo" className="google-logo" />{t('userLoginForm.loginWithGoogle')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default withTranslation()(UserLoginForm);
