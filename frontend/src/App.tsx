import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import notificationService from './services/notificationService.ts';

function App() {
  useEffect(() => {
    // Initialize notifications on app load
    notificationService.init();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Smart Medicine Refill System</h1>
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
