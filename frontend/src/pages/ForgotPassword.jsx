import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css'; // Reusing Login styles for consistency
import loginBurger from '../assets/login-burger.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authService.forgotPassword(email);
      setMessage('A reset token has been generated. Check the console for the simulation link!');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
              <h2>Reset Password</h2>
              <p>Enter your meal associated email to receive a recovery link.</p>
            </div>

            <form onSubmit={onSubmit} className="login-form">
              <div className="form-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chef@recipebox.com"
                  className="form-input"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {message && <div className="success-message" style={{ color: '#d67e2c', marginTop: '10px', fontSize: '0.9rem' }}>{message}</div>}

              <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Send Reset Link →'}
              </button>

              <p className="auth-link">
                Remember your keys? <Link to="/login">Back to Login</Link>
              </p>
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

export default ForgotPassword;
