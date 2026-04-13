import axios from 'axios';

const API_URL = 'http://localhost:5000/api/recipes/';

const createRecipe = async (recipeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axios.post(API_URL, recipeData, config);
  return response.data;
};

const getRecipes = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_URL}?${query}` : API_URL;
  const response = await axios.get(url);
  return response.data;
};

const getRecipeById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

const getFeed = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'feed', config);
  return response.data;
};

const getComments = async (id) => {
  const response = await axios.get(`${API_URL}${id}/comments`);
  return response.data;
};

const addComment = async (id, commentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}${id}/comments`, commentData, config);
  return response.data;
};

const rateRecipe = async (id, ratingData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}${id}/rate`, ratingData, config);
  return response.data;
};

const recipeService = {
  createRecipe,
  getRecipes,
  getRecipeById,
  getFeed,
  getComments,
  addComment,
  rateRecipe,
};

export default recipeService;
