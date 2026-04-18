import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css';
import loginBurger from '../assets/login-burger.png';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword(token, password);
      alert('Password reset successful! Please login with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header-top">
        <h1 className="logo">RecipeBox</h1>
        <span className="subtitle">THE EDITORIAL KITCHEN</span>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-content">
            <div className="login-title">
              <h2>New Password</h2>
              <p>Forge a new key for your digital kitchen.</p>
            </div>

            <form onSubmit={onSubmit} className="login-form">
              <div className="form-group">
                <label>NEW PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>CONFIRM NEW PASSWORD</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                {loading ? 'Updating...' : 'Set New Password →'}
              </button>
            </form>
          </div>

          <div className="floating-card">
            <img src={loginBurger} alt="Gourmet Burger" className="floating-img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
