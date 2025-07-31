import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx' // 👈 Importer


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="" element={<App />} />
          <Route path="/:orderId/:firstQuestionValue" element={<App />} />
          <Route path="/:orderId/" element={<App />} />
        </Routes>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
