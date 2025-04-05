import React from 'react';

const CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'recipe', name: '레시피' },
  { id: 'daily', name: '일상' },
  { id: 'question', name: '질문' },
  { id: 'tip', name: '꿀팁' }
];

const CategoryFilter = React.memo(({ activeCategory, onCategoryChange }) => {
  const getCategoryClass = (categoryId) => {
    return activeCategory === categoryId
      ? 'bg-blue-500 text-white'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200';
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {CATEGORIES.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full transition-colors ${getCategoryClass(category.id)}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
});

export default CategoryFilter;