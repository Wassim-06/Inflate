import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="" element={<App />} />
        <Route path="/:orderId/:firstQuestionValue" element={<App />} />
        <Route path="/:orderId/" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
