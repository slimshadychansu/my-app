import React from 'react';

const TagFilter = React.memo(({ popularTags, selectedTag, onTagClick }) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        인기 태그
      </h3>
      <div className="flex flex-wrap gap-2">
        {popularTags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTag === tag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
});

export default TagFilter;