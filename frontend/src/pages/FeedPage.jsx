import React, { useState, useEffect } from 'react';
import recipeService from '../services/recipeService';
import authService from '../services/authService';
import RecipeCard from '../components/RecipeCard/RecipeCard';

const FeedPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const user = authService.getCurrentUser();
        if (!user || !user.token) {
           setError('Please login to view your feed.');
           return;
        }
        const data = await recipeService.getFeed(user.token);
        setRecipes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6 lg:px-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-normal">
            Your Personal <span className="text-[#d67e2c] border-b-4 border-[#d67e2c]/20">Feed</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Stay updated with recipes from the chefs you follow.
          </p>
        </div>

        {/* Grid/Feed Section */}
        {loading ? (
          <div className="flex flex-col items-center gap-8 max-w-[600px] mx-auto">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full h-[600px] rounded-2xl bg-gray-100 animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
            <div className="bg-red-50 p-6 rounded-full mb-4">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#d67e2c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Try Again
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in zoom-in duration-300">
            <div className="bg-gray-50 p-10 rounded-full mb-6">
              <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-3">Your feed is empty</h2>
            <p className="text-gray-500 max-w-sm text-lg font-medium">
              Follow some chefs to see their recipes here!
            </p>
            <button
              onClick={() => window.location.href = '/discover'}
              className="mt-8 px-6 py-3 bg-[#d67e2c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Explore Recipes
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 pb-20 max-w-[600px] mx-auto">
            {recipes.map((recipe, index) => (
              <div
                key={recipe._id}
                className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <RecipeCard recipe={recipe} variant="feed" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
