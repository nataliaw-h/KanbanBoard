import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { auth } from '../../firebase'; // make sure the path is correct
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const UserRegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for required fields
    if (!username || !email || !password) {
      setErrorMessage('Please enter all required fields.');
      return;
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        'Password must contain at least 8 characters, including one uppercase letter, one digit, and one special character.'
      );
      return;
    }

    // Register the new user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Set the display name
        updateProfile(userCredential.user, {
          displayName: username,
        })
          .then(() => {
            // User created and display name set successfully
            setUsername('');
            setEmail('');
            setPassword('');
            setErrorMessage('');
            setIsRegistered(true);
          })
          .catch((error) => {
            console.log('Error setting display name:', error);
          });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  if (isRegistered) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="auth-form-container">
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
          <button type="submit" className="login-button">
            Register
          </button>
          <Link to="/login" className="sign-in-link">
            <button className="sign-in-button">Sign In</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
