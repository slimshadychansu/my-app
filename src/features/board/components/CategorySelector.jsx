// src/features/board/components/CategorySelector.jsx
import React from 'react';
import PropTypes from 'prop-types';

function CategorySelector({ selectedCategory = 'recipe', onCategoryChange = () => {} }) {
  const categories = [
    { id: 'recipe', name: '레시피' },
    { id: 'daily', name: '일상' },
    { id: 'question', name: '질문' },
    { id: 'tip', name: '꿀팁' }
  ];

  return (
    <div className="mb-6">
      <label className="block mb-2 font-semibold dark:text-white">카테고리</label>
      <div className="flex flex-wrap gap-3">
        {categories.map(category => (
          <label
            key={category.id}
            className={`px-4 py-2 rounded-full cursor-pointer transition-colors
              ${selectedCategory === category.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            <input 
              type="radio" 
              name="category" 
              value={category.id} 
              checked={selectedCategory === category.id} 
              onChange={(e) => onCategoryChange(e.target.value)}
              className="sr-only"
            />
            {category.name}
          </label>
        ))}
      </div>
    </div>
  );
}

CategorySelector.propTypes = {
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func
};

export default CategorySelector;