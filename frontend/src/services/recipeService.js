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

const recipeService = {
  createRecipe,
  getRecipes,
  getRecipeById,
};

export default recipeService;
