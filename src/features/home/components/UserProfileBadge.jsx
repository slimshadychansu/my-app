// src/features/home/components/UserProfileBadge.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileBadge = ({ user }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center mb-6">
      <div 
        className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        onClick={() => navigate('/profile')}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
          {user.profileImage ? (
            <img src={user.profileImage} alt="프로필" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          내 프로필
          {user.preferences?.vegetarian && ' • 채식'}
          {user.preferences?.spicyLevel !== '보통' && ` • ${user.preferences?.spicyLevel} 맛`}
        </span>
      </div>
    </div>
  );
};

export default React.memo(UserProfileBadge);