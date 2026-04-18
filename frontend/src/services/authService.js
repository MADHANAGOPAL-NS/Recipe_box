import API from './api';

const API_URL = '/auth/';

const register = async (userData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await API.post(API_URL + 'register', userData, config);
  return response.data;
};

const login = async (userData) => {
  const response = await API.post(API_URL + 'login', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const deleteAccount = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.delete(API_URL + 'delete', config);
  localStorage.removeItem('user');
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await API.post(API_URL + 'forgot-password', { email });
  return response.data;
};

const resetPassword = async (token, password) => {
  const response = await API.post(API_URL + `reset-password/${token}`, { password });
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  deleteAccount,
  forgotPassword,
  resetPassword,
};

export default authService;
