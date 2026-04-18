import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css';
import loginBurger from '../assets/login-burger.png';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authService.resetPasswordDirect(formData.email, formData.password);
      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your email.');
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
              <p>Enter your email and forge a new key for your kitchen.</p>
            </div>

            <form onSubmit={onSubmit} className="login-form">
              <div className="form-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  placeholder="chef@recipebox.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>NEW PASSWORD</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>CONFIRM NEW PASSWORD</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {message && <div className="success-message" style={{ color: '#d67e2c', marginTop: '10px', fontSize: '0.9rem' }}>{message}</div>}

              <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password →'}
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
