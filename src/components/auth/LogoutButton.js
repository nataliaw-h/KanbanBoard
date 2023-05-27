import React from 'react';
import './styles/AuthButton.css';

const LogoutButton = () => {
  const handleLogout = () => {
    // Logika obsługi wylogowania użytkownika
    // np. wywołanie API, czyszczenie sesji, itp.
    console.log('Wyloguj użytkownika');
  };

  return (
    <button className="auth-button" onClick={handleLogout}>
      Wyloguj
    </button>
  );
};

export default LogoutButton;
