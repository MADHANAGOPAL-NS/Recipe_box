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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a22.79 22.79 0 0 1 2.18-3.18m2.03-5.06A10.07 10.07 0 0 1 12 4c7 0 10 7 10 7a22.79 22.79 0 0 1-4.24 6.06"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>CONFIRM NEW PASSWORD</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a22.79 22.79 0 0 1 2.18-3.18m2.03-5.06A10.07 10.07 0 0 1 12 4c7 0 10 7 10 7a22.79 22.79 0 0 1-4.24 6.06"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
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
