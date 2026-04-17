import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recipeService from '../services/recipeService';
import authService from '../services/authService';
import userService from '../services/userService';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  const [isSaved, setIsSaved] = useState(
    currentUser?.savedRecipes?.includes(id) || false
  );
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setLoading(true);
        const recipeData = await recipeService.getRecipeById(id);
        const commentsData = await recipeService.getComments(id);

        setRecipe(recipeData);
        setComments(commentsData);

        // Calculate initial rating stats
        if (recipeData.ratings && recipeData.ratings.length > 0) {
          const sum = recipeData.ratings.reduce((acc, r) => acc + r.value, 0);
          setAvgRating((sum / recipeData.ratings.length).toFixed(1));
          setTotalRatings(recipeData.ratings.length);

          // Check if current user has already rated
          if (currentUser) {
            const existingRating = recipeData.ratings.find(r => r.user === currentUser._id);
            if (existingRating) setUserRating(existingRating.value);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching recipe data:', err);
        setError('Recipe not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSaveToggle = async (e) => {
    if (e) e.stopPropagation();
    if (!currentUser) {
      alert('Please login to save recipes');
      return;
    }

    try {
      setSaveLoading(true);
      const updatedUser = { ...currentUser };
      if (!updatedUser.savedRecipes) updatedUser.savedRecipes = [];

      if (isSaved) {
        await userService.unsaveRecipe(id, currentUser.token);
        setIsSaved(false);
        updatedUser.savedRecipes = updatedUser.savedRecipes.filter(recipeId => recipeId !== id);
      } else {
        await userService.saveRecipe(id, currentUser.token);
        setIsSaved(true);
        if (!updatedUser.savedRecipes.includes(id)) {
          updatedUser.savedRecipes.push(id);
        }
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please login to comment');
      return;
    }

    const { token } = JSON.parse(userStr);
    try {
      await recipeService.addComment(id, { text: commentText }, token);
      setCommentText('');
      // Refresh comments
      const freshComments = await recipeService.getComments(id);
      setComments(freshComments);
    } catch (err) {
      console.error('Comment error:', err);
      alert('Failed to post comment');
    }
  };

  const handleRatingSubmit = async (value) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please login to rate');
      return;
    }

    const { token } = JSON.parse(userStr);
    try {
      setSubmittingRating(true);
      const res = await recipeService.rateRecipe(id, { value }, token);
      setUserRating(value);
      setAvgRating(res.averageRating);
      setTotalRatings(res.totalRatings);
    } catch (err) {
      console.error('Rating error:', err);
      alert('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

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
    <div className="min-h-screen bg-[#fafafa] py-8 md:py-12 px-4 md:px-6 lg:px-24">
      <div className="max-w-5xl mx-auto">
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
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100/50 mb-8 md:mb-12">
          <div className="md:flex">
            <div className="md:w-1/2 relative h-64 sm:h-80 md:h-[450px]">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              {currentUser && (
                <button
                  onClick={handleSaveToggle}
                  disabled={saveLoading}
                  className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-transform hover:scale-110 active:scale-95 z-10"
                >
                  <svg className={`w-6 h-6 ${isSaved ? 'text-[#d67e2c] fill-current' : 'text-gray-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              )}
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags && recipe.tags.map((tag, i) => (
                  <span key={i} className="px-4 py-1 bg-[#d67e2c]/10 text-[#d67e2c] text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                {recipe.title}
              </h1>

              {/* Ratings Display */}
              <div className="flex items-center gap-4 mb-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 self-start">
                <div className="flex items-center gap-1 text-xl font-black text-gray-900">
                  <span className="text-[#d67e2c]">★</span>
                  {avgRating || '0.0'}
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  {totalRatings} {totalRatings === 1 ? 'Rating' : 'Ratings'}
                </div>
                <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      disabled={submittingRating}
                      onClick={() => handleRatingSubmit(star)}
                      className={`text-2xl transition-all hover:scale-125 focus:outline-none ${star <= (userRating || 0) ? 'text-[#d67e2c]' : 'text-gray-200 hover:text-[#d67e2c]/40'
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#d67e2c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{recipe.cookTime || '30'} mins</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-bold border-l border-gray-200 pl-6">
                  <div className="h-8 w-8 rounded-full bg-[#d67e2c] text-white flex items-center justify-center text-xs ring-2 ring-white">
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
            <div className="bg-white rounded-3xl p-8 sticky top-8 border border-gray-100 shadow-sm">
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
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                {recipe.description}
              </p>
            </section>

            <section className="mb-16">
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

            {/* Comments Section */}
            <section id="comments" className="pt-12 border-t border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                Comments
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-400 font-bold">{comments.length}</span>
              </h3>

              {/* Comment Input */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-10">
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts on this recipe..."
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#d67e2c]/20 min-h-[100px] resize-none text-gray-700"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="px-8 py-3 bg-[#d67e2c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 font-medium bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    No comments yet. Be the first to share!
                  </div>
                ) : (
                  [...comments].reverse().map((comment, index) => (
                    <div key={index} className="flex gap-4 p-6 bg-white rounded-3xl border border-gray-50 shadow-sm transition-all hover:shadow-md">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#d67e2c] to-[#ec7c27] flex items-center justify-center text-white text-sm font-bold shadow-sm overflow-hidden">
                        {comment.user?.profilePic ? (
                          <img src={comment.user.profilePic} alt={comment.user.username} className="w-full h-full object-cover" />
                        ) : (
                          comment.user?.username?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-800">{comment.user?.username}</span>
                          <span className="text-xs text-gray-400 font-medium">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
