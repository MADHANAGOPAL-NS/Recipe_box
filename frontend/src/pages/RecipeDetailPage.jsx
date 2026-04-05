import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recipeService from '../services/recipeService';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Recipe not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d67e2c]"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-red-50 p-6 rounded-full mb-4">
          <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || 'Recipe Not Found'}</h2>
        <button 
          onClick={() => navigate('/feed')} 
          className="mt-6 px-8 py-3 bg-[#d67e2c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/feed')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#d67e2c] font-semibold mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Recipes
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100/50 mb-12">
          <div className="md:flex">
            <div className="md:w-1/2 relative h-[400px]">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-6">
                {recipe.tags && recipe.tags.map((tag, i) => (
                  <span key={i} className="px-4 py-1.5 bg-[#d67e2c]/10 text-[#d67e2c] text-xs font-bold uppercase tracking-widest rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                {recipe.title}
              </h1>
              <div className="flex items-center gap-6 text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#d67e2c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{recipe.cookTime || '30'} mins</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-bold border-l border-gray-200 pl-6">
                   <div className="h-8 w-8 rounded-full bg-[#d67e2c] text-white flex items-center justify-center text-xs">
                     {recipe.author?.username?.charAt(0).toUpperCase()}
                   </div>
                   <span>By {recipe.author?.username}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sidebar: Ingredients */}
          <div className="md:col-span-1">
            <div className="bg-[#fcf8f5] rounded-3xl p-8 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-[#d67e2c] rounded-full"></span>
                 Ingredients
              </h3>
              <ul className="space-y-4">
                {recipe.ingredients && recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 leading-relaxed group">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#d67e2c] transition-colors"></span>
                    <span className="flex-1">
                      <span className="font-bold text-[#d67e2c] mr-1">{ing.quantity} {ing.unit}</span>
                      {ing.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Body: Description & Instructions */}
          <div className="md:col-span-2">
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">About this Dish</h3>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line bg-white p-8 rounded-3xl border border-gray-50 shadow-sm">
                {recipe.description}
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Instructions</h3>
              <div className="space-y-8">
                {recipe.instructions && recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-xl font-black text-[#d67e2c] group-hover:border-[#d67e2c]/30 shadow-sm transition-all group-hover:scale-110">
                      {i + 1}
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
