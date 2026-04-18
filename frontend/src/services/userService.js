import API from './api';

const API_URL = '/users/';

const followUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.post(`${API_URL}${userId}/follow`, {}, config);
  return response.data;
};

const unfollowUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.post(`${API_URL}${userId}/unfollow`, {}, config);
  return response.data;
};

const saveRecipe = async (recipeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.post(`${API_URL}${recipeId}/save`, {}, config);
  return response.data;
};

const unsaveRecipe = async (recipeId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.post(`${API_URL}${recipeId}/unsave`, {}, config);
  return response.data;
};

const getSavedRecipes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.get(`${API_URL}saved`, config);
  return response.data;
};

// Meal Planner Methods

const addMealPlan = async (planData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.post(`${API_URL}plan`, planData, config);
  return response.data;
};

const getMealPlans = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.get(`${API_URL}plan`, config);
  return response.data;
};

const userService = {
  followUser,
  unfollowUser,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
  addMealPlan,
  getMealPlans,
};

export default userService;
