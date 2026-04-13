import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import authService from '../../services/authService';

const RecipeCard = ({ recipe, variant = 'grid' }) => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const authorId = recipe.author?._id;
  const isMine = currentUser?._id === authorId;

  // Assuming current user's following list is managed by parent or fetched
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.following?.includes(authorId) || false
  );
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async (e) => {
    e.stopPropagation(); // Prevents navigating to detail page
    if (!currentUser) {
      alert('Please login to follow users');
      return;
    }
    
    try {
      setLoading(true);
      const updatedUser = { ...currentUser };
      
      if (isFollowing) {
        await userService.unfollowUser(authorId, currentUser.token);
        setIsFollowing(false);
        updatedUser.following = updatedUser.following.filter(id => id !== authorId);
      } else {
        await userService.followUser(authorId, currentUser.token);
        setIsFollowing(true);
        if (!updatedUser.following.includes(authorId)) {
          updatedUser.following.push(authorId);
        }
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Follow error:', err);
      alert(err.response?.data?.message || 'Error following user');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'feed') {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-8 w-full max-w-[550px] mx-auto">
        {/* INSTAGRAM HEADER */}
        <div className="flex items-center justify-between p-3 px-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#d67e2c] to-[#ec7c27] flex items-center justify-center text-white text-sm font-bold ring-1 ring-gray-100 overflow-hidden">
              {recipe.author?.profilePic ? (
                <img src={recipe.author.profilePic} alt={recipe.author.username} className="w-full h-full object-cover" />
              ) : (
                recipe.author?.username?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 leading-none">{recipe.author?.username || 'User'}</span>
              <span className="text-[10px] text-gray-400 font-medium">{recipe.cookTime || '20'} mins • Recipe</span>
            </div>
          </div>
          {!isMine && currentUser && (
            <button onClick={handleFollowToggle} disabled={loading} className="text-xs font-bold text-[#d67e2c] hover:text-[#ec7c27]">
              {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* IMAGE */}
        <div onClick={() => navigate(`/recipes/${recipe._id}`)} className="relative h-[450px] bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400 text-sm font-medium">No Image Available</div>
          )}
        </div>

        {/* FOOTER CAPTION */}
        <div className="px-4 pb-4 pt-4">
          <div className="flex items-start gap-2">
             <span className="text-sm font-bold text-gray-800">{recipe.author?.username || 'User'}</span>
             <h3 className="text-sm text-gray-800 flex-grow font-medium leading-normal">
               <span className="font-bold text-[#d67e2c] pr-1">{recipe.title}</span>
               {recipe.description}
             </h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {recipe.tags && recipe.tags.map((tag, i) => (
              <span key={i} className="text-[#00376b] text-xs hover:underline cursor-pointer">#{tag.replace(/\s+/g, '')}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ORIGINAL GRID LAYOUT
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
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#d67e2c] to-[#ec7c27] flex items-center justify-center text-white text-sm font-bold ring-2 ring-white overflow-hidden">
              {recipe.author?.profilePic ? (
                <img src={recipe.author.profilePic} alt={recipe.author.username} className="w-full h-full object-cover" />
              ) : (
                recipe.author?.username?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 leading-tight">
                {recipe.author?.username || 'User'}
              </span>
              {!isMine && currentUser && (
                <button 
                  onClick={handleFollowToggle}
                  disabled={loading}
                  className={`text-[11px] font-black uppercase tracking-tighter mt-0.5 hover:underline transition-all ${
                    isFollowing ? 'text-gray-400' : 'text-[#d67e2c]'
                  }`}
                >
                  {loading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
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
