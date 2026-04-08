import React, { useState, useEffect, useCallback } from 'react';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import recipeService from '../services/recipeService';

/* ─── Cook-time options ─────────────────────────────────────── */
const COOK_TIME_OPTIONS = [
  { label: '< 15 min', value: 15 },
  { label: '< 30 min', value: 30 },
  { label: '< 60 min', value: 60 },
  { label: 'Any time',  value: null },
];

/* ─── Skeleton card ──────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="h-52 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-1/3 bg-gray-200 rounded-full" />
      <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
      <div className="h-3 w-full  bg-gray-200 rounded-full" />
      <div className="h-3 w-2/3  bg-gray-200 rounded-full" />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   DISCOVER PAGE
═══════════════════════════════════════════════════════════════ */
const DiscoverPage = () => {
  /* ── state ── */
  const [search,      setSearch]      = useState('');
  const [cookTime,    setCookTime]    = useState(null);   // number | null
  const [includeIngs, setIncludeIngs] = useState([]);     // string[]
  const [excludeIngs, setExcludeIngs] = useState([]);     // string[]
  const [includeInput, setIncludeInput] = useState('');
  const [excludeInput, setExcludeInput] = useState('');
  const [recipes,     setRecipes]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  /* ── fetch (debounced 500 ms) ── */
  const fetchRecipes = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeService.getRecipes(params);
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = {};
    if (search.trim())          params.search      = search.trim();
    if (cookTime !== null)      params.time        = cookTime;
    if (includeIngs.length > 0) params.ingredients = includeIngs.join(',');
    if (excludeIngs.length > 0) params.exclude     = excludeIngs.join(',');

    const timer = setTimeout(() => fetchRecipes(params), 500);
    return () => clearTimeout(timer);
  }, [search, cookTime, includeIngs, excludeIngs, fetchRecipes]);

  /* ── helpers: add / remove ingredient tags ── */
  const addTag = (value, setter, inputSetter) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setter(prev => prev.includes(trimmed) ? prev : [...prev, trimmed]);
    inputSetter('');
  };

  const removeTag = (tag, setter) =>
    setter(prev => prev.filter(t => t !== tag));

  const clearAllFilters = () => {
    setSearch('');
    setCookTime(null);
    setIncludeIngs([]);
    setExcludeIngs([]);
    setIncludeInput('');
    setExcludeInput('');
  };

  const hasActiveFilters =
    search || cookTime !== null || includeIngs.length > 0 || excludeIngs.length > 0;

  /* ── render ── */
  return (
    <div className="min-h-screen bg-[#f7f6f3] font-[Outfit]">

      {/* ══ TOP HERO ══════════════════════════════════════════ */}
      <div className="px-6 lg:px-10 pt-10 pb-6 max-w-[1400px] mx-auto">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          Explore Your{' '}
          <span className="italic text-[#d67e2c] font-extrabold">Cuisine</span>
        </h1>

        {/* Search bar */}
        <div className="relative max-w-3xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="discover-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for recipes, ingredients, or chefs..."
            className="w-full pl-12 pr-5 py-4 bg-white rounded-2xl shadow-sm border border-gray-200
                       text-gray-700 placeholder-gray-400 text-[15px] focus:outline-none
                       focus:ring-2 focus:ring-[#d67e2c]/40 focus:border-[#d67e2c] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Active-filter pill strip */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {search && (
              <span className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200
                               rounded-full text-sm font-medium text-gray-700 shadow-xs">
                {search}
                <button onClick={() => setSearch('')} className="ml-1 text-gray-400 hover:text-gray-600">×</button>
              </span>
            )}
            {includeIngs.map(t => (
              <span key={t} className="flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200
                                       rounded-full text-sm font-medium text-green-700">
                +{t}
                <button onClick={() => removeTag(t, setIncludeIngs)} className="ml-1 text-green-400 hover:text-green-600">×</button>
              </span>
            ))}
            {excludeIngs.map(t => (
              <span key={t} className="flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200
                                       rounded-full text-sm font-medium text-red-700">
                {t}
                <button onClick={() => removeTag(t, setExcludeIngs)} className="ml-1 text-red-400 hover:text-red-600">×</button>
              </span>
            ))}
            {cookTime !== null && (
              <span className="flex items-center gap-1 px-3 py-1 bg-[#d67e2c]/10 border border-[#d67e2c]/30
                               rounded-full text-sm font-medium text-[#d67e2c]">
                ⏱ &lt;{cookTime} min
                <button onClick={() => setCookTime(null)} className="ml-1 text-[#d67e2c]/70 hover:text-[#d67e2c]">×</button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-sm font-semibold text-[#d67e2c] hover:underline ml-1"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ══ BODY: LEFT PANEL + RIGHT RESULTS ═════════════════ */}
      <div className="flex gap-6 px-6 lg:px-10 pb-16 max-w-[1400px] mx-auto">

        {/* ── LEFT FILTER PANEL ──────────────────────────────── */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-6">

            {/* Panel header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-gray-800">Filters</h2>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>

            {/* ── INCLUDE INGREDIENTS ── */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#d67e2c] mb-3">
                Include Ingredients
              </p>
              <div className="relative">
                <input
                  id="include-ing-input"
                  type="text"
                  value={includeInput}
                  onChange={e => setIncludeInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addTag(includeInput, setIncludeIngs, setIncludeInput);
                    }
                  }}
                  placeholder="Add ingredient..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm
                             text-gray-700 placeholder-gray-400 focus:outline-none
                             focus:ring-2 focus:ring-[#d67e2c]/30 focus:border-[#d67e2c] transition-all"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Press Enter or comma to add</p>
              {includeIngs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {includeIngs.map(tag => (
                    <span key={tag}
                      className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800
                                 text-xs font-semibold rounded-lg cursor-pointer
                                 hover:bg-green-200 transition-colors"
                      onClick={() => removeTag(tag, setIncludeIngs)}
                    >
                      {tag} ×
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── EXCLUDE INGREDIENTS ── */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">
                Exclude Ingredients
              </p>
              <div className="relative">
                <input
                  id="exclude-ing-input"
                  type="text"
                  value={excludeInput}
                  onChange={e => setExcludeInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addTag(excludeInput, setExcludeIngs, setExcludeInput);
                    }
                  }}
                  placeholder="Exclude ingredient..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm
                             text-gray-700 placeholder-gray-400 focus:outline-none
                             focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Press Enter or comma to add</p>
              {excludeIngs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {excludeIngs.map(tag => (
                    <span key={tag}
                      className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700
                                 text-xs font-semibold rounded-lg cursor-pointer
                                 hover:bg-red-200 transition-colors"
                      onClick={() => removeTag(tag, setExcludeIngs)}
                    >
                      {tag} ×
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-5" />

            {/* ── COOK TIME ── */}
            <div className="mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#d67e2c] mb-3">
                Cook Time
              </p>
              <div className="grid grid-cols-2 gap-2">
                {COOK_TIME_OPTIONS.map(opt => {
                  const active = cookTime === opt.value;
                  return (
                    <button
                      key={opt.label}
                      id={`cook-time-${opt.value ?? 'any'}`}
                      onClick={() => setCookTime(active ? null : opt.value)}
                      className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-all
                        ${active
                          ? 'bg-[#d67e2c] text-white border-[#d67e2c] shadow-md shadow-[#d67e2c]/20'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#d67e2c]/40 hover:text-[#d67e2c]'
                        }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear filters button */}
            {hasActiveFilters && (
              <>
                <div className="border-t border-gray-100 my-5" />
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-500
                             border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </>
            )}
          </div>
        </aside>

        {/* ── RIGHT: RESULTS ──────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Results count bar */}
          {!loading && !error && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold text-gray-600">
                Showing{' '}
                <span className="text-gray-900 font-bold">{recipes.length}</span>{' '}
                {recipes.length === 1 ? 'recipe' : 'recipes'}
                {search && (
                  <> for "<span className="text-[#d67e2c]">{search}</span>"</>
                )}
              </p>
            </div>
          )}

          {/* ── Loading skeletons ── */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
            </div>
          )}

          {/* ── Error state ── */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">{error}</h2>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2.5 bg-[#d67e2c] text-white font-bold rounded-xl
                           shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && !error && recipes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">Didn't find what you're looking for?</h2>
              <p className="text-gray-500 max-w-sm text-sm font-medium">
                Try adjusting your filters or clearing your search to explore more recipes.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 bg-[#d67e2c] text-white font-bold rounded-xl
                             shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* ── Recipe grid ── */}
          {!loading && !error && recipes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {recipes.map((recipe, i) => (
                <div
                  key={recipe._id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ MOBILE: Bottom sheet filter toggle ═══════════════ */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <MobileFilterSheet
          cookTime={cookTime}
          setCookTime={setCookTime}
          includeIngs={includeIngs}
          setIncludeIngs={setIncludeIngs}
          excludeIngs={excludeIngs}
          setExcludeIngs={setExcludeIngs}
          clearAllFilters={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </div>
  );
};

/* ─── Mobile filter bottom sheet ─────────────────────────────── */
const MobileFilterSheet = ({
  cookTime, setCookTime,
  includeIngs, setIncludeIngs,
  excludeIngs, setExcludeIngs,
  clearAllFilters, hasActiveFilters,
}) => {
  const [open, setOpen] = useState(false);
  const [incInput, setIncInput] = useState('');
  const [excInput, setExcInput] = useState('');

  const addTag = (value, setter, inputSetter) => {
    const t = value.trim();
    if (!t) return;
    setter(prev => prev.includes(t) ? prev : [...prev, t]);
    inputSetter('');
  };
  const removeTag = (tag, setter) => setter(prev => prev.filter(t => t !== tag));

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-3 bg-[#d67e2c] text-white font-bold
                   rounded-2xl shadow-lg shadow-[#d67e2c]/30 hover:shadow-xl transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        Filters {hasActiveFilters && <span className="bg-white text-[#d67e2c] text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">{[cookTime !== null, includeIngs.length > 0, excludeIngs.length > 0].filter(Boolean).length}</span>}
      </button>

      {/* Sheet overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setOpen(false)}>
          <div
            className="w-full bg-white rounded-t-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-gray-800">Filters</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Include */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#d67e2c] mb-2">Include Ingredients</p>
            <input
              type="text"
              value={incInput}
              onChange={e => setIncInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(incInput, setIncludeIngs, setIncInput); }}}
              placeholder="Add ingredient & press Enter"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#d67e2c]/30"
            />
            <div className="flex flex-wrap gap-1.5 mb-4">
              {includeIngs.map(t => (
                <span key={t} onClick={() => removeTag(t, setIncludeIngs)}
                  className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-lg cursor-pointer">{t} ×</span>
              ))}
            </div>

            {/* Exclude */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2">Exclude Ingredients</p>
            <input
              type="text"
              value={excInput}
              onChange={e => setExcInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(excInput, setExcludeIngs, setExcInput); }}}
              placeholder="Exclude ingredient & press Enter"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <div className="flex flex-wrap gap-1.5 mb-4">
              {excludeIngs.map(t => (
                <span key={t} onClick={() => removeTag(t, setExcludeIngs)}
                  className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg cursor-pointer">{t} ×</span>
              ))}
            </div>

            {/* Cook time */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#d67e2c] mb-2">Cook Time</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {COOK_TIME_OPTIONS.map(opt => {
                const active = cookTime === opt.value;
                return (
                  <button key={opt.label} onClick={() => setCookTime(active ? null : opt.value)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all
                      ${active ? 'bg-[#d67e2c] text-white border-[#d67e2c]' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              {hasActiveFilters && (
                <button onClick={() => { clearAllFilters(); setOpen(false); }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-red-500 border border-red-200 hover:bg-red-50 transition-colors">
                  Clear All
                </button>
              )}
              <button onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#d67e2c] shadow-md hover:shadow-lg transition-all">
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscoverPage;
