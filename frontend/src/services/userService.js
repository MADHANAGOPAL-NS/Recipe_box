import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

const followUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}${userId}/follow`, {}, config);
  return response.data;
};

const unfollowUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}${userId}/unfollow`, {}, config);
  return response.data;
};

const saveRecipe = async (recipeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}${recipeId}/save`, {}, config);
  return response.data;
};

const unsaveRecipe = async (recipeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}${recipeId}/unsave`, {}, config);
  return response.data;
};

const getSavedRecipes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}saved`, config);
  return response.data;
};

const userService = {
  followUser,
  unfollowUser,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
};

export default userService;
