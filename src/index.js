import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

ReactDOM.render(
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
          <App />
    </I18nextProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
