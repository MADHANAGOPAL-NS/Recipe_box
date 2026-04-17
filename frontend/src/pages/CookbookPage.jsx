import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import { useNavigate } from 'react-router-dom';

const CookbookPage = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCookbook();
  }, []);

  const fetchCookbook = async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      if (!user || !user.token) {
        setError('Please login to view your cookbook.');
        return;
      }
      const data = await userService.getSavedRecipes(user.token);
      setSavedRecipes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cookbook:', err);
      setError('Failed to load your cookbook. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRecipe = (recipeId) => {
    setSavedRecipes((prev) => prev.filter((r) => r._id !== recipeId));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 md:py-12 px-4 md:px-6 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
              My <span className="text-[#d67e2c]">Cookbook</span>
            </h1>
            <p className="text-gray-500 text-lg font-medium">Your personal collection of saved recipes.</p>
          </div>
          <div className="bg-[#d67e2c]/10 text-[#d67e2c] px-4 py-2 rounded-xl font-bold">
            {savedRecipes.length} Saved
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full h-96 rounded-3xl bg-gray-100 animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in zoom-in duration-300">
            <div className="bg-red-50 p-6 rounded-full mb-4">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
            <button
              onClick={fetchCookbook}
              className="mt-4 px-6 py-2 bg-[#d67e2c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Try Again
            </button>
          </div>
        ) : savedRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in zoom-in duration-300 bg-white rounded-3xl border border-gray-100/50 shadow-sm">
            <div className="bg-gray-50 p-8 rounded-full mb-6 relative">
              <svg className="w-16 h-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-3">Your cookbook is empty</h2>
            <p className="text-gray-500 max-w-sm text-lg font-medium mx-auto">
              Save recipes you love to build your personal cookbook!
            </p>
            <button
              onClick={() => navigate('/discover')}
              className="mt-8 px-8 py-3.5 bg-[#d67e2c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              Discover Recipes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pb-20">
            {savedRecipes.map((recipe, index) => (
              <div
                key={recipe._id}
                className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Wrap the RecipeCard so that removing a save removes it from the list if we want, but letting the user hit the unsave button handles the backend. To update UI immediately here, we can optionally pass a callback to RecipeCard, or just let them navigate away. For simple optimistic UI, we'll let RecipeCard manage LocalStorage and if they refresh, it disappears. */}
                <RecipeCard recipe={recipe} forceSaved={true} onUnsave={handleRemoveRecipe} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CookbookPage;
