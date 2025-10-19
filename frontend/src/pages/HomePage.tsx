import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService.ts';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthed = authService.isAuthenticated();

  return (
    <div className="page">
      <h2>Welcome to Smart Medicine Refill System</h2>
      <p>Never miss your medication refills again!</p>
      <div className="actions">
        {!isAuthed ? (
          <button onClick={() => navigate('/login')}>Login</button>
        ) : (
          <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        )}
        <p style={{ marginTop: 12 }}>
          <Link to="https://www.1mg.com/search/all?name=" target="_blank" rel="noreferrer">
            Find medicines online
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
