import React, { useState, useEffect } from 'react';
import recipeService from '../services/recipeService';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import SearchBar from '../components/SearchBar/SearchBar';

const FeedPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await recipeService.getRecipes({ search: searchQuery });
        setRecipes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // DEBOUNCE: Wait 500ms before searching
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 500);

    // Cleanup: Clear the timer if the user types again immediately
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6 lg:px-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-normal">
            Discover <span className="text-[#d67e2c] border-b-4 border-[#d67e2c]/20">Delicious</span> Recipes
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Find and share the best recipes from our community of food lovers.
          </p>
        </div>

        {/* Search Section */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Info Box */}
        {!loading && recipes.length > 0 && searchQuery && (
           <div className="text-center mb-8 animate-in fade-in duration-500">
              <span className="bg-white shadow-sm rounded-full px-5 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-100">
                Found {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} for "<span className="text-[#d67e2c]">{searchQuery}</span>"
              </span>
           </div>
        )}

        {/* Grid/Feed Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-gray-100 animate-pulse"></div>
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
            <h2 className="text-3xl font-black text-gray-800 mb-3">No recipes found</h2>
            <p className="text-gray-500 max-w-sm text-lg font-medium">
              We couldn't find anything matching your search. Try different keywords!
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-8 text-[#d67e2c] font-bold hover:underline py-2 px-4"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pb-20">
            {recipes.map((recipe, index) => (
              <div
                key={recipe._id}
                className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
