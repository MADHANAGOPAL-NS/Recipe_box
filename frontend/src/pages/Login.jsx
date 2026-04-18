import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css';
import loginBurger from '../assets/login-burger.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(formData);
      navigate('/create');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
              <h2>Welcome Back</h2>
              <p>Savor the moment. Sign in to access your curated cookbooks and meal plans.</p>
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
                <div className="label-flex">
                  <label>PASSWORD</label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="forgot-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    FORGOT?
                  </button>
                </div>
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
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a22.79 22.79 0 0 1 2.18-3.18m2.03-5.06A10.07 10.07 0 0 1 12 4c7 0 10 7 10 7a22.79 22.79 0 0 1-4.24 6.06"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                {loading ? 'Entering...' : 'Sign In to Kitchen →'}
              </button>

              <p className="auth-link">
                New to the table? <Link to="/register">Create Account</Link>
              </p>
            </form>
          </div>

          <div className="floating-card">
            <img src={loginBurger} alt="Gourmet Burger" className="floating-img" />
            <div className="floating-caption">
              <p>"Cooking is at once child's play and adult joy."</p>
              <span>— CRAIG CLAIBORNE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-footer">
        © 2026 RECIPEBOX EDITORIAL KITCHEN • ALL RIGHTS RESERVED
      </div>
    </div>
  );
};

export default Login;
