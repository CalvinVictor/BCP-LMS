import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ✔ This line is very important
import App from './App.jsx';
import { ParallaxProvider } from 'react-scroll-parallax'; // ✅ Import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ✅ Wrap your App */}
    <ParallaxProvider>
      <App />
    </ParallaxProvider>
  </React.StrictMode>,
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
