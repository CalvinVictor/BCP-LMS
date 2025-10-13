import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ParallaxProvider } from 'react-scroll-parallax';
import { GoogleOAuthProvider } from '@react-oauth/google';

// This line correctly reads the Client ID from your frontend/.env file
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the entire app with the Google Provider, passing your Client ID */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* The Parallax Provider goes inside */}
      <ParallaxProvider>
        <App />
      </ParallaxProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
