import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './styles/AuthForm.css';
import { withTranslation } from 'react-i18next';

const UserRegistrationForm = ({ t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(t('userRegistrationForm.passwordError'));
      return;
    }

    const { success, error } = await signUp(email, password);
    if (success) {
      setIsRegistered(true);
    } else if (error) {
      setErrorMessage(error);
    }
  };

  if (isRegistered) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="auth-form-container">
      <h2 className='title'>{t('userRegistrationForm.title')}</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label htmlFor="email">{t('userRegistrationForm.email')}:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{t('userRegistrationForm.password')}:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="login-button">
            {t('userRegistrationForm.register')}
          </button>
          <Link to="/login" className="sign-in-link">
            <button className="sign-in-button">{t('userRegistrationForm.signIn')}</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default withTranslation()(UserRegistrationForm);
