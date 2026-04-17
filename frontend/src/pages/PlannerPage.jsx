import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';
import { useNavigate } from 'react-router-dom';

const PlannerPage = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [addingPlan, setAddingPlan] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      if (!user || !user.token) {
        navigate('/login');
        return;
      }

      // Fetch both saved recipes (for the dropdown) and current meal plans
      const [fetchedPlans, fetchedSaved] = await Promise.all([
        userService.getMealPlans(user.token),
        userService.getSavedRecipes(user.token)
      ]);

      // Sort plans by date ascending
      const sortedPlans = fetchedPlans.sort((a, b) => new Date(a.date) - new Date(b.date));

      setMealPlans(sortedPlans);
      setSavedRecipes(fetchedSaved);
      setError(null);
    } catch (err) {
      console.error('Error fetching planner data:', err);
      setError('Failed to load your planner. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedRecipe) {
      alert('Please select both a date and a recipe.');
      return;
    }

    try {
      setAddingPlan(true);
      const user = authService.getCurrentUser();

      await userService.addMealPlan({
        date: selectedDate,
        recipeId: selectedRecipe
      }, user.token);

      // Reset form and refresh list
      setSelectedDate('');
      setSelectedRecipe('');
      await fetchData();

    } catch (err) {
      console.error('Error adding meal plan:', err);
      alert('Failed to add meal plan. Please try again.');
    } finally {
      setAddingPlan(false);
    }
  };

  // Group meal plans by date for display
  const groupedPlans = mealPlans.reduce((groups, plan) => {
    // Standardize date to a readable string (e.g. "Monday, Oct 25")
    const dateStr = new Date(plan.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(plan);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 md:py-12 px-4 md:px-6 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
              Meal <span className="text-[#d67e2c]">Planner</span>
            </h1>
            <p className="text-gray-500 text-lg font-medium">Organize your perfect cooking schedule.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl border border-red-100 text-center font-bold">
            {error}
          </div>
        )}

        {/* Add Plan Form Card */}
        <div className="bg-white p-8 rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.03)] border border-gray-100/50 animate-in zoom-in duration-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#d67e2c] rounded-full"></span>
            Add to Schedule
          </h2>

          <form onSubmit={handleAddPlan} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Select Date</label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#d67e2c]/30 focus:bg-white transition-colors outline-none font-medium text-gray-700"
              />
            </div>

            <div className="md:col-span-6 flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Choose Saved Recipe</label>
              <select
                required
                value={selectedRecipe}
                onChange={(e) => setSelectedRecipe(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#d67e2c]/30 focus:bg-white transition-colors outline-none font-medium text-gray-700 appearance-none cursor-pointer"
              >
                <option value="" disabled>-- Select a recipe --</option>
                {savedRecipes.map(recipe => (
                  <option key={recipe._id} value={recipe._id}>
                    {recipe.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={addingPlan || savedRecipes.length === 0}
                className="w-full h-[52px] bg-[#d67e2c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {addingPlan ? 'Saving...' : 'Add'}
              </button>
            </div>
          </form>
          {savedRecipes.length === 0 && !loading && (
            <p className="text-sm text-red-400 mt-4 font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              You need to save some recipes to your Cookbook before you can plan them!
            </p>
          )}
        </div>

        {/* Planned Meals Display */}
        <div className="pt-4">
          <h2 className="text-2xl font-black text-gray-800 mb-8 pb-4 border-b border-gray-200">
            Your Schedule
          </h2>

          {loading ? (
            <div className="space-y-4">
              <div className="h-20 bg-white rounded-2xl animate-pulse"></div>
              <div className="h-20 bg-white rounded-2xl animate-pulse"></div>
            </div>
          ) : mealPlans.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100/50 border-dashed">
              <div className="text-4xl mb-4">🗓️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No meals planned yet</h3>
              <p className="text-gray-400 font-medium max-w-sm mx-auto">Use the form above to schedule your favorite saved recipes for the upcoming week.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedPlans).map(([dateLabel, plans]) => (
                <div key={dateLabel} className="animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-[#d67e2c] font-black text-lg mb-4 flex items-center gap-2 bg-[#d67e2c]/10 px-4 py-2 rounded-lg self-start inline-flex">
                    🗓️ {dateLabel}
                  </h3>
                  <div className="space-y-4">
                    {plans.map((plan, idx) => (
                      <div
                        onClick={() => plan.recipe ? navigate(`/recipes/${plan.recipe._id}`) : null}
                        key={`${plan._id}-${idx}`}
                        className={`group flex items-center gap-5 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md ${plan.recipe ? 'cursor-pointer hover:border-[#d67e2c]/30' : 'opacity-70'}`}
                      >
                        <div className="h-16 w-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {plan.recipe?.image ? (
                            <img src={plan.recipe.image} alt={plan.recipe.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">No Img</div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 group-hover:text-[#d67e2c] transition-colors">
                            {plan.recipe?.title || "Deleted Recipe"}
                          </h4>
                          {plan.recipe && (
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-medium">
                              <span className="flex items-center gap-1">⏱️ {plan.recipe.cookTime || 20} mins</span>
                              {plan.recipe.author?.username && (
                                <span className="flex items-center gap-1">👨‍🍳 {plan.recipe.author.username}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PlannerPage;
