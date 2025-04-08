// src/pages/CookingGuide.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatContainer from '../features/chat/components/ChatContainer';
import CookingGuideContainer from '../features/cooking/CookingGuideContainer';

function CookingGuide() {
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [isAiChatMode, setIsAiChatMode] = useState(true);
  const navigate = useNavigate();

  const handleStartCooking = (recipe) => {
    setCurrentRecipe(recipe);
    setIsAiChatMode(false);
  };

  const handleReturnToChat = () => {
    setCurrentRecipe(null);
    setIsAiChatMode(true);
  };

  const handleCookingComplete = () => {
    navigate('/favorites', { 
      state: { 
        rateRecipe: currentRecipe 
      } 
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl mx-auto p-4">
      {isAiChatMode ? (
        <ChatContainer 
          showCookingGuide={false}
          onStartCooking={handleStartCooking}
        />
      ) : (
        <CookingGuideContainer 
          recipe={currentRecipe}
          onComplete={handleCookingComplete}
          onClose={handleReturnToChat}
        />
      )}
    </div>
  );
}

export default CookingGuide;