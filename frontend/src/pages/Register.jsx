import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import authService from '../services/authService';
import { getCroppedImg } from '../utils/cropImage';
import './Register.css';
import registerDish from '../assets/register-dish.png';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // States for Image Cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const [profilePicBlob, setProfilePicBlob] = useState(null);
  const navigate = useNavigate();



  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setTempImage(reader.result);
        setIsCropping(true);
      };
    }
  };

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(croppedImage);
      setProfileImage(previewUrl);
      setProfilePicBlob(croppedImage); // Save the blob for upload
      setIsCropping(false);
    } catch (e) {
      console.error(e);
      setError('Could not crop image. Please try again.');
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setTempImage(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (profilePicBlob) {
        formDataToSend.append('image', profilePicBlob);
      }

      await authService.register(formDataToSend);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-visual">
        <div className="brand">
          <h1 className="logo">RecipeBox</h1>
          <span className="subtitle">THE DIGITAL ALCHEMIST</span>
        </div>
        <div className="visual-content">
          <div className="dish-container">
            <img src={registerDish} alt="Culinary Fusion" className="dish-img" />
          </div>
          <div className="quote-card">
            <div className="quote-icon">🍴</div>
            <h3>Master the art of culinary fusion.</h3>
            <p>Join 50,000+ creators sharing secret techniques and sustainable flavors.</p>
          </div>
        </div>
      </div>

      <div className="register-form-container">
        <div className="register-header">
          <h1>Create your kitchen.</h1>
          <p>Start your journey as a modern culinary alchemist.</p>
        </div>

        <form onSubmit={onSubmit} className="register-form">
          <div className="profile-upload" onClick={handleAvatarClick}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            <div className="avatar-placeholder">
              {profileImage ? (
                <img src={profileImage} alt="Avatar Preview" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <span className="camera-icon">📸</span>
              )}
            </div>
            <div className="upload-info">
              <h4>Profile Picture</h4>
              <p>Tap to upload or drag your best chef portrait here.</p>
            </div>
          </div>

          <div className="form-group">
            <label>FULL NAME</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onChange}
              placeholder="Julian Alchemist"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="julian@recipebox.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>PASSWORD</label>
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



          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
            {loading ? 'Joining...' : 'Join the Alchemists'}
          </button>

          <p className="auth-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>

      {isCropping && (
        <div className="crop-modal">
          <div className="crop-container">
            <div className="cropper-box">
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="crop-controls">
              <div className="zoom-control">
                <label>Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(e.target.value)}
                />
              </div>
              <div className="crop-actions">
                <button type="button" onClick={handleCropCancel} className="btn-cancel">Cancel</button>
                <button type="button" onClick={handleCropSave} className="btn btn-primary">Save Preview</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
