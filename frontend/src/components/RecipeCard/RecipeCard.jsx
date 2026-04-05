import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/recipes/${recipe._id}`)}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full border border-gray-100/50 cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden">
        {recipe.image ? (
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
        <div className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-[#d67e2c] hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          {recipe.tags && recipe.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-[#d67e2c]/10 text-[#d67e2c] text-[10px] font-bold uppercase tracking-wider rounded-lg">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#d67e2c] transition-colors leading-tight">
          {recipe.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#d67e2c] to-[#ec7c27] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
              {recipe.author?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-semibold text-gray-700 mr-2">
              {recipe.author?.username || 'User'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#d67e2c]">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <span className="text-xs font-bold">{recipe.cookTime || '20m'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
